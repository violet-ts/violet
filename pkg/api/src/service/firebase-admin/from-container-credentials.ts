// ECS Container metadata から取れる credentials から、Google Auth Library 形式に変換し、
// その後、Firebase Admin Library で使える形にする
// ExternalAccountClient や AwsClient を直接使わないのは、これらが instance metadata にしか対応していないため

import type { CredentialProvider, Credentials } from '@aws-sdk/types'
import type { AwsClientOptions, RefreshOptions } from 'google-auth-library'
import { BaseExternalAccountClient } from 'google-auth-library'
import { AwsRequestSigner } from 'google-auth-library/build/src/auth/awsrequestsigner'

/**
 * AWS external account client. This is used for AWS workloads, where
 * AWS STS GetCallerIdentity serialized signed requests are exchanged for
 * GCP access token.
 */
export class AwsCredentialsClient extends BaseExternalAccountClient {
  private readonly environmentId: string
  private readonly regionalCredVerificationUrl: string
  private awsRequestSigner: AwsRequestSigner | null
  private region: string
  private awsRefreshOptions: RefreshOptions | undefined
  private cachedAwsCreds: Credentials | undefined

  /**
   * Instantiates an AwsClient instance using the provided JSON
   * object loaded from an external account credentials file.
   * An error is thrown if the credential is not a valid AWS credential.
   * @param awsCredentials AWS SDK v3 credentials
   * @param options The external account options object typically loaded
   *   from the external account JSON credential file.
   * @param additionalOptions Optional additional behavior customization
   *   options. These currently customize expiration threshold time and
   *   whether to retry on 401/403 API request errors.
   */
  constructor(
    private awsCredentials: Credentials | CredentialProvider,
    options: AwsClientOptions,
    additionalOptions?: { awsRefreshOptions?: RefreshOptions; refreshOptions?: RefreshOptions }
  ) {
    super(options, additionalOptions?.refreshOptions)
    this.awsRefreshOptions = additionalOptions?.awsRefreshOptions
    this.environmentId = options.credential_source.environment_id
    this.regionalCredVerificationUrl = options.credential_source.regional_cred_verification_url
    const match = this.environmentId.match(/^(aws)(\d+)$/)
    if (!match || !this.regionalCredVerificationUrl) {
      throw new Error('No valid AWS "credential_source" provided')
    } else if (parseInt(match[2], 10) !== 1) {
      throw new Error(`aws version "${match[2]}" is not supported in the current build.`)
    }
    this.awsRequestSigner = null
    this.region = this.getAwsRegion()
  }

  async retrieveSubjectToken(): Promise<string> {
    if (
      !this.awsRequestSigner ||
      !this.cachedAwsCreds ||
      this.isAwsCredExpired(this.cachedAwsCreds)
    ) {
      this.awsRequestSigner = new AwsRequestSigner(async () => {
        this.cachedAwsCreds = await this.getAwsSecurityCredentials()
        return {
          accessKeyId: this.cachedAwsCreds.accessKeyId,
          secretAccessKey: this.cachedAwsCreds.secretAccessKey,
          token: this.cachedAwsCreds.sessionToken,
        }
      }, this.region)
    }

    const options = await this.awsRequestSigner.getRequestOptions({
      url: this.regionalCredVerificationUrl.replace('{region}', this.region),
      method: 'POST',
    })
    const reformattedHeader: { key: string; value: string }[] = []
    const extendedHeaders = Object.assign(
      {
        'x-goog-cloud-target-resource': this.audience,
      },
      options.headers
    )
    // Reformat header to GCP STS expected format.
    for (const key in extendedHeaders) {
      reformattedHeader.push({
        key,
        value: extendedHeaders[key] as string,
      })
    }
    // Serialize the reformatted signed request.
    return encodeURIComponent(
      JSON.stringify({
        url: options.url,
        method: options.method,
        headers: reformattedHeader,
      })
    )
  }

  /**
   * Returns whether the provided AWS credentials are expired or not.
   * If there is no expiry time, assumes the token is not expired or expiring.
   * @param credentials The credentials to check for expiration.
   * @return Whether the credentials are expired or not.
   */
  private isAwsCredExpired({ expiration }: Credentials): boolean {
    if (!expiration) return false
    const now = new Date().getTime()
    return now >= expiration.getTime() - (this.awsRefreshOptions?.eagerRefreshThresholdMillis ?? 0)
  }

  private getAwsRegion(): string {
    // Priority order for region determination:
    // AWS_REGION > AWS_DEFAULT_REGION.
    const { AWS_REGION, AWS_DEFAULT_REGION } = process.env
    if (AWS_REGION) return AWS_REGION
    if (AWS_DEFAULT_REGION) return AWS_DEFAULT_REGION
    throw new Error('neither AWS_REGION nor AWS_DEFAULT_REGION found')
  }

  private async getAwsSecurityCredentials(): Promise<Credentials> {
    if (typeof this.awsCredentials === 'function') {
      return await this.awsCredentials()
    } else {
      return this.awsCredentials
    }
  }
}
