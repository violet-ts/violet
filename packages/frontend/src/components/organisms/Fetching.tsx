import { Loading } from '~/components/atoms/Loading'

export const Fetching = (props: { error: unknown }) =>
  props.error === undefined ? <Loading /> : <div>Error...</div>
