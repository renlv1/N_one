
/**
 * @param {string} str
 * @returns {Boolean}
 */
export function checkEmail(email) {
  const reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
  return reg.test(email)
}

export function checkMinLength(str, min) {
  if (str.length >= min) {
    return true
  } else {
    return false
  }
}
