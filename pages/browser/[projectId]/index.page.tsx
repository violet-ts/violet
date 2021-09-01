import { useBrowserLayout } from '~/components/layouts/useBrowserLayout'
import { Fetching } from '~/components/organisms/Fetching'
import { usePathVal } from '~/hooks/usePathVal'

const ProjectPage = () => {
  const pathVal = usePathVal(['ownerId', 'projectId'])
  const { BrowserLayout, layoutData, layoutError } = useBrowserLayout(pathVal)

  if (!layoutData) return <Fetching error={layoutError} />

  return <BrowserLayout data={layoutData}>sample text</BrowserLayout>
}

export default ProjectPage
