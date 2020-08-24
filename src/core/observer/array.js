// 要拦截的数组变异方法
const mutationMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
// 实现 arrayMethods.__proto__ === Array.prototype
export const arrayMethods = Object.create(Array.prototype)
mutationMethods.forEach(method => {
  Object.defineProperty(arrayMethods, method, {
    enumerable: false,
    writable: true,
    configurable: true,
    value: function mutator (...args) {
      const result = Array.prototype[method].apply(this, args)
      let inserted
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if (inserted) this.__ob__.observeArray(inserted)
      this.__ob__.dep.notify()
      return result
    }
  })
})
