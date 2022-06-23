import React from 'react'
import ReactDOM from 'react-dom'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'typeface-roboto'
import 'typeface-work-sans'
import App from './App'
import './index.css'
import './prototypes'
import * as serviceWorker from './serviceWorker'

toast.configure({
  autoClose: 4000,
})

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
