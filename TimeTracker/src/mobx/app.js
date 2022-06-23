import localForage from 'localforage'
import {action, observable, toJS} from 'mobx'
import {create, persist} from 'mobx-persist'
import {v4 as uuidv4} from 'uuid'

class Timer {
  @persist
  @observable
  id = ''

  @persist
  @observable
  name = ''

  @persist
  @observable
  active = true

  @persist
  @observable
  time = 0

  @persist('object')
  @observable
  timeStart

  @persist('object')
  @observable
  timeEnd
}

class TimerGroup {
  @persist
  @observable
  id = ''

  @persist
  @observable
  name = ''

  @persist('list', Timer)
  @observable
  timers = []
}

class TimerStore {
  @observable hydrated = false

  @persist('list', TimerGroup)
  @observable
  groupList = []

  @action
  addNewGroup() {
    this.groupList.push({
      id: uuidv4(),
      name: '',
      timers: [],
    })
  }

  @action
  removeGroup(id) {
    if (!this.hydrated) return
    this.groupList = this.groupList.filter((e) => e.id !== id)
  }

  @action
  updateGroupName(id, name) {
    if (!this.hydrated) return
    this.groupList = this.groupList.map((e) => {
      if (e.id === id) {
        e.name = name
      }
      return e
    })
  }

  @action
  addNewTimer(id) {
    this.groupList = this.groupList.map((e) => {
      if (e.id === id) {
        console.log(toJS(e))
        e.timers.push({
          id: uuidv4(),
          name: '',
          active: true,
          time: 0,
          timeStart: new Date(),
        })
      }
      return e
    })
  }

  @action
  removeTimer(id, groupId) {
    if (!this.hydrated) return
    this.groupList = this.groupList.map((e) => {
      if (e.id === groupId) {
        e.timers = e.timers.filter((t) => t.id !== id)
      }
      return e
    })
  }

  @action
  updateTimerName(id, groupId, name) {
    if (!this.hydrated) return
    this.groupList = this.groupList.map((e) => {
      if (e.id === groupId) {
        e.timers = e.timers.map((t) => {
          if (t.id === id) {
            t.name = name
          }
          return t
        })
      }
      return e
    })
  }

  @action
  updateTimerValue(id, groupId, newData) {
    if (!this.hydrated) return
    this.groupList = this.groupList.map((e) => {
      if (e.id === groupId) {
        e.timers = e.timers.map((t) => {
          if (t.id === id) {
            t = {...t, ...newData}
          }
          return t
        })
      }
      return e
    })
  }
}

const hydrate = create({
  storage: localForage,
  jsonify: false,
})

// create the state
const timerStore = new TimerStore()

hydrate('timer', timerStore).then(() => {
  timerStore.hydrated = true
})

export default timerStore
