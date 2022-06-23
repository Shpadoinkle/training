import styled from 'styled-components'

const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  &.fill {
    flex-grow: 1;
  }
`

export default Page

export const PageInnerCentered = styled(Page)`
  width: -webkit-fill-available;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex: 1;
`
