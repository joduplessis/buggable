Array.prototype.flatten = function () {
    return this.length == 0 ? null : this[0]
}

String.prototype.toTitleCase = function () {
    return this.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

String.prototype.timeToDecimal = function () {
    const arr = this.split(':')
    const dec = parseInt((arr[1] / 6) * 10, 10)

    return parseFloat(parseInt(arr[0], 10) + '.' + (dec < 10 ? '0' : '') + dec)
}

Number.prototype.numberShorthand = function () {
    const number = parseInt(this)

    if (number < 1000) return number.toString()
    if (number >= 1000 && number < 1000000) return number.toString().substring(0, number.toString().length - 3) + 'k'
    if (number >= 1000000) return number.toString().substring(0, number.toString().length - 6) + 'm'
}

String.prototype.splice = function (idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem))
}

Array.prototype.chunk = function (chunkSize) {
    const arr = this

    return [].concat.apply(
        [],
        arr.map(function (elem, i) {
            return i % chunkSize ? [] : [arr.slice(i, i + chunkSize)]
        })
    )
}

Array.prototype.last = function () {
    return this[this.length - 1]
}

String.prototype.toSentenceCase = function () {
    return this.split(' ')
        .map((s) => s.toLowerCase())
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ')
}
