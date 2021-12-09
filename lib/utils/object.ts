export function deep_copy<T> (target: T): object | Array<any> | T { 
  let copyedObjs = []//此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象 
  
  return _deep_copy(target, copyedObjs)
}

function _deep_copy<T> (target: T, copyedObjs: Array<any>): object | Array<any> | T { 
  if ((typeof target !== 'object') || !target) { return target }
  for (let i= 0 ;i<copyedObjs.length;i++){
    if (copyedObjs[i].target === target) {
      return copyedObjs[i].copyTarget;
    }
  }
  let obj = Array.isArray(target) ? new Array : new Object
  copyedObjs.push({ target: target, copyTarget: obj }) 
  Object.keys(target).forEach( key => { 
    // if (obj[key]) { return }
    obj[key] = _deep_copy(target[key], copyedObjs)
  })
  return obj
}

export default {
  deep_copy
}