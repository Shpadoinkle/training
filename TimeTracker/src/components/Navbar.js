import React, {Component} from 'react'
import styled, {withTheme} from 'styled-components'
import {HEADER_HEIGHT} from '../constants'
import {PageInnerCentered} from './Page'
import Row from './Row'
import Text from './Text'

class Navbar extends Component {
  render() {
    return (
      <NavbarContainer>
        <PageInnerCentered className="innerRow">
          <Row flex={1} jc="space-between" ai="center">
            <Text>Timers</Text>
          </Row>
        </PageInnerCentered>
      </NavbarContainer>
    )
  }
}

export default withTheme(Navbar)

const NavbarContainer = styled.div`
  width: 100%;
  height: ${HEADER_HEIGHT}px;
  border-bottom: 1px solid #e6e6e6;
  background-color: #ffffff;

  .innerRow {
    height: 100%;
    padding: 0px 20px;
  }
`
