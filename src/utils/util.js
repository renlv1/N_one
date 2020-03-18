/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export function debounce(fn, delay, immediate) {
  let timer = null;

  return function () {
    const context = this;
    const args = arguments;

    return new Promise((resolve, reject) => {
      timer && clearTimeout(timer);

      if (immediate) {
        const doNow = !timer;

        timer = setTimeout(() => {
          timer = null;
        }, delay);

        doNow && resolve(fn.apply(context, args));
      }
      else {
        timer = setTimeout(() => {
          resolve(fn.apply(context, args));
        }, delay);
      }
    });
  };
}

/**
 * 函数节流
 * @param fn
 * @param interval
 * @returns {Function}
 * @constructor
 */
export const Throttle = (fn, t) => {
  let last;
  let timer;
  let interval = t || 500;
  return function () {
    let args = arguments;
    let now = +new Date();
    if (last && now - last < interval) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = now;
        fn.apply(this, args);
      }, interval);
    } else {
      last = now;
      fn.apply(this, args);
    }
  }
};


// 对字符串进行加密
export function compileStr(code) {
  var c = String.fromCharCode(code.charCodeAt(0) + code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
  }
  return escape(c);
}


//字符串进行解密
export function unCompileStr(code) {
  code = unescape(code);
  var c = String.fromCharCode(code.charCodeAt(0) - code.length);
  for (var i = 1; i < code.length; i++) {
    c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
  }
  return c;
}

// 将'1,2,3,4,5,6,7'转化为星期一, 星期二这种格式
export function changeWeeks(string) {
  const data = {
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六',
    '7': '天'
  }
  let result = ('星期'+ string.split(',').mapOne(v => data[v] || v)).join()
  return result
}
