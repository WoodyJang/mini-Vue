let id = 0

export default class Dep {
  constructor () {
    this.id = ++id
    this.subs = []
  }
}
