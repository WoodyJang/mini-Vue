import { warn } from './debug'
export * from './debug'

export function query (el) {
  if (typeof el === 'string') {
    const selected = document.querySelector(el)
    if (!selected) {
      warn('Cannot find element: ' + el)
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

const _toString = Object.prototype.toString
const hasOwnProperty = Object.prototype.hasOwnProperty
export function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}
export function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function isReserved (str) {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
