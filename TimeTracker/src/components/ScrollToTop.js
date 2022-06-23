import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      scrollToTop()
    }
  }
  render() {
    return <div />
  }
}

function scrollToTop() {
  window.scrollTo(0, 0)
}

export default withRouter(ScrollToTop)
