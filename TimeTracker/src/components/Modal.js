import React, {Component} from 'react'
import {X} from 'react-feather'
import styled from 'styled-components'

const Styles = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;

  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #333333f2;
    z-index: 101;
    animation: fadein 0.2s;
  }

  .modal-body {
    z-index: 102;
    display: flex;
    flex-direction: column;
    height: -webkit-fill-available;
    justify-content: space-around;
    align-items: center;

    animation: fadein 0.2s, slidedown 0.2s;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slidedown {
    from {
      transform: translateY(-30px);
    }
    to {
      transform: translateY(0);
    }
  }
`

class Modal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    const {children, onClose, show = false, scrollable = false} = this.props
    if (!show) return <div></div>
    return (
      <Styles>
        <div className="modal-overlay"></div>
        <X
          style={{
            position: 'fixed',
            top: 25,
            right: 40,
            zIndex: 200,
          }}
          size={30}
          color={'#fff'}
          onClick={onClose}
        />
        <div className={`modal-body`}>{children}</div>
      </Styles>
    )
  }
}

export default Modal
