import styled from 'styled-components'

const Padder = styled.div`
  ${({h, w}) => {
    const property = w ? 'width' : 'height'
    return property + ':' + (h || 24) + 'px;'
  }}
`

export default Padder
