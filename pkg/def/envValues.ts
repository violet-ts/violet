export const extractEnv = (obj: Record<string, string | undefined>) => {
  const API_PORT = +(obj.API_PORT ?? "8080");
  const API_BASE_PATH = obj.API_BASE_PATH ?? "";
  const API_ORIGIN = obj.API_ORIGIN ?? "";
  const AWS_ACCESS_KEY_ID = obj.MINIO_ROOT_USER ?? "";
  const AWS_SECRET_ACCESS_KEY = obj.MINIO_ROOT_PASSWORD ?? "";
  const S3_REGION = obj.S3_REGION ?? "";
  const S3_ENDPOINT = obj.S3_ENDPOINT || undefined;
  const S3_BUCKET = obj.S3_BUCKET ?? "violet-app";

  return {
    API_BASE_PATH,
    API_ORIGIN,
    API_PORT,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    S3_BUCKET,
    S3_ENDPOINT,
    S3_REGION,
  };
};
