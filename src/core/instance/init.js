import { initLifecycle, callHook } from './lifecycle'
import { initEvents } from './events'
import { initRender } from './render'
import { initState } from './state'
let uid = 0
export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm._uid = uid++
    vm.isVue = true
    vm.$options = options
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
    console.log('vm', vm)
  }
}
