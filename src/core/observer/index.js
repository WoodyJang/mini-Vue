import { isObject, hasOwn } from '../util'
import { arrayMethods } from './array'
import Dep from './dep'
export class Observer {
  constructor (value) {
    this.value = value
    this.dep = new Dep()
    // __ob__ 属性以及 __ob__.dep 的主要作用是为了添加、删除属性时有能力触发依赖，而这就是 Vue.set 或 Vue.delete 的原理。
    Object.defineProperty(value, '__ob__', {
      value: this, // value 属性指向 data 数据对象本身，这是一个循环引用
      enumerable: false, // __ob__ 是不可枚举的属性
      writable: true,
      configurable: true
    })
    // 代理数组，重写 push/pop/unshift/shift/reverse/sort 等方法从而可以重新渲染视图
    if (Array.isArray(value)) {
      Object.setPrototypeOf(value, arrayMethods)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk (obj) {
    Object.keys(obj).forEach(key => defineReactive(obj, key))
  }

  // 递归观测数组
  observeArray (items) {
    items.forEach(item => observe(item))
  }
}

export function defineReactive (obj, key, val) {
  // 每个字段的 Dep 对象都被用来收集那些属于对应字段的依赖。
  const dep = new Dep()
  /**
  * 首先通过 Object.getOwnPropertyDescriptor 函数获取该字段可能已有的属性描述对象，并将该对象保存在 property 常量中，接着是一个 if 语句块，判断该字段是否是可配置的，如果不可配置(property.configurable === false)，那么直接 return ，即不会继续执行 defineReactive 函数。这么做也是合理的，因为一个不可配置的属性是不能使用也没必要使用 Object.defineProperty 改变其属性定义的。
  */
  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) return
  // 缓存原有的getter/setter函数，因为下面会重写。再在重写的getter/setter函数中重新调用，从而做到不影响属性的原有读写操作。
  const getter = property && property.get
  const setter = property && property.set
  // childOb === data.a.__ob__
  let childOb = observe(val)
  // 如果val没有传，直接获取obj[key]作为val
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  /**
   * const data = {
      a: {
        b: 1
      }
    }
    const data = {
      // 属性 a 通过 setter/getter 通过闭包引用着 dep 和 childOb
      a: {
        // 属性 b 通过 setter/getter 通过闭包引用着 dep 和 childOb
        b: 1
        __ob__: {a, dep, vmCount}
      }
      __ob__: {data, dep, vmCount}

      要注意的是，属性 a 闭包引用的 childOb 实际上就是 data.a.__ob__。而属性 b 闭包引用的 childOb 是 undefined，因为属性 b 是基本类型值，并不是对象也不是数组。
    }
   */

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // 我们知道依赖的收集时机就是属性被读取的时候，所以 get 函数做了两件事：正确地返回属性值以及收集依赖
    get () {
      const value = getter ? getter.call(obj) : val
      /** 除了要将依赖收集到属性 a 自己的“筐”里之外，还要将同样的依赖收集到 data.a.__ob__.dep 这里”筐“里
         为什么要将同样的依赖分别收集到这两个不同的”筐“里呢？其实答案就在于这两个”筐“里收集的依赖的触发时机是不同的，即作用不同，两个”筐“如下：
          第一个”筐“是 dep
          第二个”筐“是 childOb.dep

          第一个”筐“里收集的依赖的触发时机是当属性值被修改时触发，即在 set 函数中触发：dep.notify()
          而第二个”筐“里收集的依赖的触发时机是在使用 $set 或 Vue.set 给数据对象添加新属性时触发
          Vue.set = function (obj, key, val) {
            defineReactive(obj, key, val)
            obj.__ob__.dep.notify() // 相当于 data.a.__ob__.dep.notify()
          }

          Vue.set(data.a, 'c', 1)
          __ob__ 属性以及 __ob__.dep 的主要作用是为了添加、删除属性时有能力触发依赖，而这就是 Vue.set 或 Vue.delete 的原理。
        */
      // Dep.target 全局保存的要被收集的依赖, 在watch里被初始化
      if (Dep.target) {
        // 依赖收集两次
        dep.depend() // dep 收集
        childOb && childOb.dep.depend() // childOb.dep收集，childOb.dep === data.a.__ob__.dep
      }
      return value
    },
    set (newVal) {
      const value = getter ? getter.call(obj) : val
      /*
       * newVal !== newVal 说明新值与新值自身都不全等，同时旧值与旧值自身也不全等，大家想一下在 js 中什么时候会出现一个值与自身都不全等的？答案就是 NaN
       * NaN === NaN // false
      */
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 为属性设置的新值是一个数组或者纯对象，那么该数组或纯对象是未被观测的，所以需要对新值进行观测
      childOb = observe(newVal)
      dep.notify()
    }
  })
}

export function observe (value, asRootData) {
  return value.__ob__ || new Observer(value)
}

export function set (target, key, val) {
  if (Array.isArray(target)) {
    target.splice(key, 1, val)
    return val
  }
  if ((key in target && !(key in Object.prototype)) || !target.__ob__) {
    target[key] = val
    return val
  }

  defineReactive(target.__ob__.value, key, val)
  target.__ob__.dep.notify()
  return val
}

export function del (target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1)
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  target.__ob__ && target.__ob__.dep.notify()
}

// 处理数组元素是仍是数组的情况
// 如果直接引用数组，会导致数组的子元素收集不到依赖，递归调用，让子元素收集依赖
export function dependArray (value) {}
