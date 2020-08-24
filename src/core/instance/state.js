import { warn, isPlainObject, isReserved, hasOwn } from '../util'
import { observe } from '../observer'
export function initState (vm) {
  vm._watchers = []
  initProps(vm)
  initMethods(vm)
  initData(vm)
  initComputed(vm)
  initWatch(vm)
}
// props优先级 > data优先级 > methods优先级
// 将data上的数据绑定到vue实例上
function proxy (target, sourceKey, key) {
  Object.defineProperty(target, key, {
    get () {
      return this[sourceKey][key]
    },
    set (val) {
      this[sourceKey][key] = val
    }
  })
}
function initProps (vm) {}
function initMethods (vm) {}

// 1、根据 vm.$options.data 选项获取真正想要的数据（注意：此时 vm.$options.data 是函数）
// 2、校验得到的数据是否是一个纯对象
// 3、检查数据对象 data 上的键是否与 props 对象上的键冲突
// 4、检查 methods 对象上的键是否与 data 对象上的键冲突
// 5、在 Vue 实例对象上添加代理访问数据对象的同名属性
// 6、最后调用 observe 函数开启响应式之路
function initData (vm) {
  const { data, methods, props } = vm.$options
  vm._data = typeof data === 'function' ? data.call(vm, vm) : data
  if (!isPlainObject(vm._data)) {
    vm._data = {}
  }
  Object.keys(vm._data).forEach(key => {
    if (methods && hasOwn(methods, key)) { // 判断是否与methods里定义的方法同名
      warn(
        `Method "${key}" has already been defined as a data property.`,
        vm
      )
    }
    if (props && hasOwn(props, key)) { // 判断是否与props里定义的方法同名
      process.env.NODE_ENV !== 'production' && warn(
        `The data property "${key}" is already declared as a prop. ` +
        'Use prop default value instead.',
        vm
      )
    } else if (!isReserved(key)) { // 判断定义在 data 中的 key 是否是保留键
      // isReserved 函数通过判断一个字符串的第一个字符是不是 $ 或 _ 来决定其是否是保留的，Vue 是不会代理那些键名以 $ 或 _ 开头的字段的，因为 Vue 自身的属性和方法都是以 $ 或 _ 开头的，所以这么做是为了避免与 Vue 自身的属性和方法相冲突

      // 执行 proxy 函数，实现实例对象的代理访问：
      // proxy 函数的原理是通过 Object.defineProperty 函数在实例对象 vm 上定义与 data 数据字段同名的访问器属性，并且这些属性代理的值是 vm._data 上对应属性的值。举个例子，比如 data 数据如下
      proxy(vm, '_data', key)
    }
  })
  /**
   * 参数一表示要观测的数据
   * 参数二是一个布尔值，代表将要观测的数据是否是根级数据
   */
  observe(vm._data, true)
}
function initComputed (vm) {}
function initWatch (vm) {}
export function stateMixin (Vue) {}
