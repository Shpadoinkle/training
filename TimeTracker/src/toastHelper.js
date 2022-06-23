import {toast} from 'react-toastify'
import {css} from 'glamor'

import themeStore from './mobx/theme'

const basicStyle = (color) => ({
  className: css({
    backgroundColor: color || '#409a6c',
    paddingLeft: 15,
    borderRadius: 5,
  }),
  bodyClassName: css({
    color: '#fff',
  }),
  // hideProgressBar: true,
})

export const toastSuccess = (text) => {
  toast.error(text, basicStyle())
}

export const toastError = (text) => {
  toast.error(text, basicStyle(themeStore.RED))
}
