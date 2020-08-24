import { defineReactive } from '../observer/index'
import { resolveSlots } from './render-helpers/resolve-slots'
export function initRender (vm) {
  // vm._vnode = null
  // vm.$vnode = vm.$options._parentVnode
  // const parentVnode = vm.$options._parentVnode
  // const renderContext = parentVnode && parentVnode.context
  // const {
  //   data,
  //   componentOptions: {
  //     children,
  //     listeners
  //   }
  // } = parentVnode
  // vm.$slots = resolveSlots(children, renderContext)
  // vm.$scopedSlots = Object.freeze({})
  // defineReactive(vm, '$attrs', data ? data.attrs : {})
  // defineReactive(vm, '$listeners', listeners || {})
}

export function renderMixin (Vue) {

}
