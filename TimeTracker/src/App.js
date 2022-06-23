import {Provider as MobxProvider} from 'mobx-react'
import React from 'react'
import {BrowserRouter, Switch} from 'react-router-dom'
import {ThemeProvider} from 'styled-components'
import './App.css'
import Navbar from './components/Navbar'
import Page from './components/Page'
import ScrollToTop from './components/ScrollToTop'
import timerStore from './mobx/app'
import themeStore from './mobx/theme'
import Timers from './pages/Timers'

function App() {
  return (
    <MobxProvider timerStore={timerStore}>
      <ThemeProvider theme={themeStore}>
        <BrowserRouter>
          <ScrollToTop />
          <Switch>
            <Page>
              <Navbar />
              <Timers />
            </Page>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </MobxProvider>
  )
}

export default App
