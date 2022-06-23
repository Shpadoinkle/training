Number.prototype.toPokedex = function () {
  var s = String(this)
  while (s.length < 3) {
    s = '0' + s
  }
  return s
}
