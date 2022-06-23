import {observer} from 'mobx-react'
import ms from 'pretty-ms'
import React, {Component} from 'react'
import styled from 'styled-components'
import timerStore from '../mobx/app'
import Col from './Col'
import Padder from './Padder'
import Row from './Row'

const _TimerWrapper = styled.div`
  padding: 30px 0px 20px;
  border-top: ${({index}) => (index > 0 ? `1px solid #ccc;` : 'none')};
  border-top: 1px solid #ccc;
  /* box-shadow: 2px 2px 3px 2px #88888888; */
  width: 100%;
`

@observer
class Timer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: this.props.timer.time,
      start: 0,
      active: this.props.timer.active,
    }
    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
  }

  componentDidMount() {
    this.startTimer()
  }

  startTimer() {
    if (this.state.active) {
      this.setState(
        {
          time: this.props.timer.time,
          start: Date.now() - this.state.time,
          active: true,
        },
        () => {
          timerStore.updateTimerValue(this.props.timer, {
            time: this.state.time,
            active: this.state.active,
          })
        }
      )
      this.timer = setInterval(() => {
        this.setState(
          {
            time: Date.now() - this.state.start,
          },
          () => {
            timerStore.updateTimerValue(
              this.props.timer.id,
              this.props.groupId,
              {
                time: this.state.time,
              }
            )
          }
        )
      }, 1000)
    }
  }

  resumeTimer = () => {
    const {timer, groupId} = this.props
    this.setState({active: true}, () => {
      timerStore.updateTimerValue(timer.id, groupId, {active: true})
      this.startTimer()
    })
  }

  stopTimer = () => {
    const {timer, groupId} = this.props
    clearInterval(this.timer)
    this.setState({active: false}, () => {
      timerStore.updateTimerValue(timer.id, groupId, {
        time: this.state.time,
        active: false,
      })
    })
  }

  removeTimer = () => {
    if (confirm('Remove Timer?')) {
      const {timer, groupId} = this.props
      clearInterval(this.timer)
      timerStore.removeTimer(timer.id, groupId)
    }
  }

  render() {
    const {time, start, active} = this.state
    const {timer, groupId, index} = this.props
    return (
      <_TimerWrapper index={index}>
        <Row jc="space-between">
          <Col flex={1}>
            <input
              value={timer.name || ''}
              placeholder="timerName"
              onChange={(e) => {
                timerStore.updateTimerName(timer.id, groupId, e.target.value)
              }}
            />
          </Col>
          <Col ai="flex-end">
            {ms(time, {
              keepDecimalsOnWholeSeconds: false,
              millisecondsDecimalDigits: 0,
              secondsDecimalDigits: 0,
            })}
            <Row jc="space-between">
              {active && (
                <div className="pointer" onClick={this.stopTimer}>
                  Pause
                </div>
              )}
              {!active && (
                <div className="pointer" onClick={this.resumeTimer}>
                  Resume
                </div>
              )}
              <Padder h={20} w />
              <div className="pointer" onClick={this.removeTimer}>
                Delete
              </div>
            </Row>
          </Col>
        </Row>
      </_TimerWrapper>
    )
  }
}

export default Timer
