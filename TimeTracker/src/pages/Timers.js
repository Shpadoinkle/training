import Grid from '@material-ui/core/Grid'
import {inject, observer} from 'mobx-react'
import React, {Component} from 'react'
import styled from 'styled-components'
import Page, {PageInnerCentered} from '../components/Page'
import Row from '../components/Row'
import timerStore from '../mobx/app'
import Groups from './Groups'

const _Button = styled.div`
  padding: 12px 20px;

  background-color: #000;
  color: #fff;
  box-shadow: 2px 2px 5px 2px #88888888;
  width: 200px;
  border-radius: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 800;
`

@inject('timerStore')
@observer
class Timers extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  createGroup = () => {
    timerStore.addNewGroup()
    // toastSuccess('Group Added')
  }

  createTimer = () => {
    timerStore.addNewTimer(timerStore.list.length)
  }

  render() {
    if (!timerStore.hydrated) {
      return null
    }
    return (
      <Page className="fill">
        <Styles>
          <div style={{padding: `40px 20px`}}>
            <PageInnerCentered>
              <Grid container direction="row" spacing={2}>
                <Grid item xs={12} sm={5} md={4}>
                  <div className="section">
                    <Row jc="center">
                      <_Button onClick={this.createGroup}>+ Add Group</_Button>
                    </Row>
                  </div>
                </Grid>
                <Grid item xs={12} sm={7} md={8}>
                  <div className="">
                    {timerStore.groupList.map((e) => (
                      <Groups group={e} key={e.id} className="group_list" />
                    ))}
                  </div>
                </Grid>
              </Grid>
            </PageInnerCentered>
          </div>
        </Styles>
      </Page>
    )
  }
}

const Styles = styled.div`
  flex: 1;

  .section {
    border-radius: 6px;
    background-color: white;
    padding: 24px;
    border: 1px solid #e6e6e6;
  }
`

export default Timers
