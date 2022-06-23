import React from 'react'
import {Link} from 'react-router-dom'
import styled, {withTheme} from 'styled-components'

const _Text = styled.div`
  font-family: Roboto;
  font-style: normal;
  font-weight: ${({bold}) => (bold ? 'bold' : 'normal')};
  font-size: ${({size}) => (size ? `${size}px` : '16px')};
  color: ${({color}) => (color ? color : '#000')};
  line-height: 100%;
`

const Text = ({children, ...props}) => <_Text {...props}>{children}</_Text>

export default withTheme(Text)

const _Link = styled(Link)`
  text-decoration: none !important;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    text-decoration: none !important;
    color: #fff;
  }
`

export const TextLink = ({children, to = '', ...props}) => (
  <_Link to={to}>
    <_Text bold size {...props}>
      {children}
    </_Text>
  </_Link>
)
