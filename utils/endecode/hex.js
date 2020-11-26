export function hexEncode(s) {
  s = unescape(encodeURIComponent(s))
  let chr
  let i = 0
  const l = s.length
  let out = ''
  for (; i < l; i++) {
    chr = s.charCodeAt(i).toString(16)
    out += chr.length % 2 === 0 ? chr : '0' + chr
  }
  return out
}

export function hexDecode(s) {
  return decodeURIComponent(s.replace(/../g, '%$&'))
}
