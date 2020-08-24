import { warn, query } from '../util'

/**
 * activeInstance 保存着当前正在渲染的实例的引用，所以他就是当前实例components下注册的子组件的父实例，即activeInstance就是parent
 * vue实际上就是这样做到自动侦测父级的
 */
export let activeInstance = null

export function initLifecycle (vm) {
  /**
   * options的parent选项，我们并没有手动指定一个组件的父实例，但是子组件依然能够找到它的父实例，这说明vue在寻找父实例的时候是自动检测的
   */
  const { parent } = vm.$options
  // 将当前实例 vm 添加到父级的 $children 属性里
  parent && parent.$children.push(vm)
  vm.$parent = parent
  vm.$root = parent ? parent.$root : vm

  // 初始化一些和生命周期有关的属性
  vm.$children = []
  vm.$refs = {}
  vm._watcher = null
  vm._inactive = null
  vm._directInactive = false
  vm._isMounted = false
  vm._isDestroyed = false
  vm._isBeingDestroyed = false
}

export function lifecycleMixin (Vue) {
  Vue.prototype.$mount = function (el) {
    el = el && query(el)

    if (el === document.body || el === document.documentElement) {
      warn('Do not mount Vue to <html> or <body> - mount to normal elements instead.')
      return this
    }

    let { template, render } = this.$options
    if (!render) {
      if (template) {
        if (typeof template === 'string') {
          if (template.charAt(0) === '#') {
            template = query(template).innerHTML
            !template && warn(`Template element not found or is empty: ${template}`, this)
          }
        } else if (template.nodeType === Node.ELEMENT_NODE) {
          template = template.innerHTML
        } else {
          warn('invalid template option:' + template, this)
          return this
        }
      } else if (el) {
        template = el.outerHTML
      }
    }
    return mountComponent(this, el)
  }
  Vue.prototype._update = function (vnode) {
    const vm = this
    const prevVnode = vm._vnode
    const prevActiveInstance = activeInstance
    activeInstance = vm
    vm._vnode = vnode
    vm.$el = vm.__patch__(prevVnode, vnode)
    activeInstance = prevActiveInstance
  }
  Vue.prototype.$forceUpdate = function () {}
  Vue.prototype.$destroy = function () {}
}
export function mountComponent (vm, el) {
  vm.$el = el
  const { render } = vm.$options
  if (!render) {
    vm.$options.render = null
  }
  // 调用生命周期方法
  callHook(vm, 'beforeMount')
  // const updateComponent = () => {
  //   vm._update(vm._render())
  // }
  // // eslint-disable-next-line
  // new Watcher(vm, updateComponent, noop, {
  //   before () {
  //     if (vm._isMounted && !vm._isDestroyed) {
  //       callHook(vm, 'beforeUpdate')
  //     }
  //   }
  // }, true)

  // vm.$vnode 表示 Vue 实例的父虚拟 Node,所以它为 Null 则表示当前是根 Vue 的实例
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}

export function callHook (vm, hook) {
  const handlers = []
  const handler = vm.$options[hook]
  typeof handler === 'function' && handlers.push(handler)
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      try {
        handlers[i].call(vm)
        console.log(hook)
      } catch (err) {
        warn(`Error in ${hook} hook: "${err.toString()}"`, vm)
      }
    }
  }
}
