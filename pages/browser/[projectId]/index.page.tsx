import { useBrowserLayout } from '~/components/layouts/useBrowserLayout'
import { Fetching } from '~/components/organisms/Fetching'
import { usePathVal } from '~/hooks/usePathVal'

const ProjectPage = () => {
  const pathVal = usePathVal(['projectId'])
  const { BrowserLayout, layoutProps, layoutError } = useBrowserLayout(pathVal)

  if (!layoutProps) return <Fetching error={layoutError} />

  return <BrowserLayout {...layoutProps}>sample text</BrowserLayout>
}

export default ProjectPage
