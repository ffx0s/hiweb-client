export function base64Encode(string) {
  return btoa(unescape(encodeURIComponent(string)))
}

export function base64Decode(string) {
  return decodeURIComponent(escape(atob(string)))
}
