import styled from 'styled-components'
import { colors, fontSizes } from '~/utils/constants'

const Container = styled.span<{ color: string }>`
  display: inline-block;
  width: 20px;
  padding: 2px 0 4px;
  font-size: ${fontSizes.mini};
  color: ${colors.white};
  text-align: center;
  vertical-align: bottom;
  background: ${(props) => props.color};
  border-radius: 4px;
`

const getIconValue = (name: string): { label: string; color: string } =>
  ({
    word: { label: 'wd', color: colors.blue },
    xlsx: { label: 'xl', color: colors.green },
    jpg: { label: 'jg', color: colors.yellow },
    htaccess: { label: 'ht', color: colors.red },
    gitignore: { label: 'gi', color: colors.gray },
  }[name.split('.').pop() ?? ''] ?? { label: 'fi', color: colors.gray })

export const ExtIcon = (props: { name: string }) => {
  const val = getIconValue(props.name)

  return <Container color={val.color}>{val.label}</Container>
}
