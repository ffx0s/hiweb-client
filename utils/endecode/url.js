export function urlEncode(string) {
  // URL-encode some more characters to avoid issues when using permalink URLs in Markdown
  return encodeURIComponent(string).replace(/['()_*]/g, function(character) {
    return '%' + character.charCodeAt().toString(16)
  })
}

export function urlDecode(string) {
  return decodeURIComponent(string.replace(/\+/g, ' '))
}
