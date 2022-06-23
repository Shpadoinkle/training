import React, {Component} from 'react'
import {Plus, X} from 'react-feather'
import styled from 'styled-components'
import Timer from '../components/Timer'
import timerStore from '../mobx/app'

const GroupWrapper = styled.div`
  margin-bottom: 20px;
  border-radius: 6px;
  background-color: white;
  padding: 24px;
  border: 1px solid #e6e6e6;
`

const TitleWrapper = styled.div`
  display: flex;
  padding-left: 20px;
  min-width: 100%;
  background-color: #000;
  border-radius: 4px;
  box-shadow: 2px 2px 2px 1px #88888888;
  width: 400px;
  margin-bottom: 2px;
`

const Input = styled.input`
  width: 100%;
  margin: 0px;
  height: 45px;
  border: none;
  background-color: transparent;
  font-family: Roboto;
  font-style: normal;
  font-weight: ${({bold}) => (bold ? 'bold' : 'normal')};
  font-size: ${({size}) => (size ? `${size}px` : '16px')};
  color: ${({color}) => (color ? color : '#fff')};

  ::placeholder {
    font-family: Roboto;
    font-style: normal;
    font-weight: ${({bold}) => (bold ? 'bold' : 'normal')};
    font-size: ${({size}) => (size ? `${size}px` : '16px')};
    color: ${({color}) => (color ? color : '#fff')};
  }
`

const RemoveX = styled.div`
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;

  height: 45px;
  width: 45px;
  border-radius: 18px;
  text-align: center;
`

const AddPlus = styled.div`
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: #000;
  height: 36px;
  width: 36px;
  border-radius: 18px;
  text-align: center;
`

class Groups extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  addTimer = () => {
    const {group} = this.props
    timerStore.addNewTimer(group.id)
  }

  removeGroup = () => {
    if (confirm('Delete this group?')) {
      const {group} = this.props
      timerStore.removeGroup(group.id)
    }
  }

  render() {
    const {group} = this.props
    return (
      <GroupWrapper>
        <TitleWrapper>
          <Input
            value={group.name || ''}
            placeholder="groupName"
            onChange={(e) =>
              timerStore.updateGroupName(group.id, e.target.value)
            }
          />
          <RemoveX onClick={this.removeGroup}>
            <X />
          </RemoveX>
        </TitleWrapper>
        {group.timers.map((e, index) => (
          <Timer index={index} groupId={group.id} timer={e} key={e.id} />
        ))}
        <AddPlus onClick={this.addTimer}>
          <Plus size={25} />
        </AddPlus>
      </GroupWrapper>
    )
  }
}

export default Groups
