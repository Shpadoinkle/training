import React from 'react'
import styled, {withTheme} from 'styled-components'

const _Row = styled.div`
  display: flex;
  flex: ${({flex}) => flex};
  flex-direction: ${({reverse}) => (reverse ? 'row-reverse' : 'row')};
  justify-content: ${({jc}) => jc || 'flex-start'};
  align-items: ${({ai}) => ai || 'stretch'};
`

const Row = ({children, ...props}) => <_Row {...props}>{children}</_Row>
export default withTheme(Row)
