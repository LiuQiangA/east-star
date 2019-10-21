/**
 * Created by liuqiang on 2019/05/05.
 */

/*
 * localstorage的封装
 */
export default {
  getItem(key) {
    let item = localStorage.getItem(key)
    // 这点要判断是字符串还是对象
    let result = /^[{\[].*[}\]]$/g.test(item)
    if (result) {
      return JSON.parse(item)
    } else {
      return item
    }
  },
  setItem(key, value) {
    // 这点要判断是字符串还是对象
    if (typeof value == "string") {
      localStorage.setItem(key, value)
    } else {
      let item = JSON.stringify(value)
      localStorage.setItem(key, item)
    }
  },
  removeItem(key) {
    localStorage.removeItem(key)
  },
  getAll() {},
  clear() {
    localStorage.clear()
  },
  key(n) {},
  forEach(cb) {},
  has(key) {},
  deleteAllExpires() {},

}