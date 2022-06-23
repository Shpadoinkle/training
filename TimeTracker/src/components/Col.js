import React from 'react'
import styled, {withTheme} from 'styled-components'

const _Row = styled.div`
  display: flex;
  flex: ${({flex}) => flex};
  flex-direction: ${({reverse}) => (reverse ? 'column-reverse' : 'column')};
  justify-content: ${({jc}) => jc || 'flex-start'};
  align-items: ${({ai}) => ai || 'stretch'};
`

const Row = ({children, flex = 1, ...props}) => (
  <_Row flex={flex} {...props}>
    {children}
  </_Row>
)

export default withTheme(Row)
