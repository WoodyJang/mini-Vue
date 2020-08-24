import { warn } from '../util'
import { initMixin } from './init'
import { lifecycleMixin } from './lifecycle'
import { eventsMixin } from './events'
import { renderMixin } from './render'
import { stateMixin } from './state'
export default function Vue (options) {
  if (!(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  } else {
    this._init(options)
    /**
     *  _init 函数方法调用
     *
     *  initLifecycle(vm)
        initEvents(vm)
        initRender(vm)
        callHook(vm, 'beforeCreate')

        initState(vm) {
          initProps(vm)
          initMethods(vm)
          initData(vm)
          initComputed(vm)
          initWatch(vm)
        }

        callHook(vm, 'created')
     */
  }
}
initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
