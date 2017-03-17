var __globals = this;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],4:[function(require,module,exports){
(function (global){
'use strict';

var buffer = require('buffer');
var Buffer = buffer.Buffer;
var SlowBuffer = buffer.SlowBuffer;
var MAX_LEN = buffer.kMaxLength || 2147483647;
exports.alloc = function alloc(size, fill, encoding) {
  if (typeof Buffer.alloc === 'function') {
    return Buffer.alloc(size, fill, encoding);
  }
  if (typeof encoding === 'number') {
    throw new TypeError('encoding must not be number');
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  var enc = encoding;
  var _fill = fill;
  if (_fill === undefined) {
    enc = undefined;
    _fill = 0;
  }
  var buf = new Buffer(size);
  if (typeof _fill === 'string') {
    var fillBuf = new Buffer(_fill, enc);
    var flen = fillBuf.length;
    var i = -1;
    while (++i < size) {
      buf[i] = fillBuf[i % flen];
    }
  } else {
    buf.fill(_fill);
  }
  return buf;
}
exports.allocUnsafe = function allocUnsafe(size) {
  if (typeof Buffer.allocUnsafe === 'function') {
    return Buffer.allocUnsafe(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new Buffer(size);
}
exports.from = function from(value, encodingOrOffset, length) {
  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
    return Buffer.from(value, encodingOrOffset, length);
  }
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof value === 'string') {
    return new Buffer(value, encodingOrOffset);
  }
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    var offset = encodingOrOffset;
    if (arguments.length === 1) {
      return new Buffer(value);
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    var len = length;
    if (typeof len === 'undefined') {
      len = value.byteLength - offset;
    }
    if (offset >= value.byteLength) {
      throw new RangeError('\'offset\' is out of bounds');
    }
    if (len > value.byteLength - offset) {
      throw new RangeError('\'length\' is out of bounds');
    }
    return new Buffer(value.slice(offset, offset + len));
  }
  if (Buffer.isBuffer(value)) {
    var out = new Buffer(value.length);
    value.copy(out, 0, 0, value.length);
    return out;
  }
  if (value) {
    if (Array.isArray(value) || (typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer) || 'length' in value) {
      return new Buffer(value);
    }
    if (value.type === 'Buffer' && Array.isArray(value.data)) {
      return new Buffer(value.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
}
exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
  if (typeof Buffer.allocUnsafeSlow === 'function') {
    return Buffer.allocUnsafeSlow(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size >= MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new SlowBuffer(size);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"buffer":5}],5:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (ArrayBuffer.isView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":1,"ieee754":54}],6:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":56}],7:[function(require,module,exports){
module.exports = function cleanAtrule(node, item, list) {
    if (node.block) {
        // otherwise removed at-rule don't prevent @import for removal
        this.root.firstAtrulesAllowed = false;

        if (node.block.type === 'Block' && node.block.declarations.isEmpty()) {
            list.remove(item);
            return;
        }

        if (node.block.type === 'StyleSheet' && node.block.rules.isEmpty()) {
            list.remove(item);
            return;
        }
    }

    switch (node.name) {
        case 'charset':
            if (node.expression.sequence.isEmpty()) {
                list.remove(item);
                return;
            }

            // if there is any rule before @charset -> remove it
            if (item.prev) {
                list.remove(item);
                return;
            }

            break;

        case 'import':
            if (!this.root.firstAtrulesAllowed) {
                list.remove(item);
                return;
            }

            // if there are some rules that not an @import or @charset before @import
            // remove it
            list.prevUntil(item.prev, function(rule) {
                if (rule.type === 'Atrule') {
                    if (rule.name === 'import' || rule.name === 'charset') {
                        return;
                    }
                }

                this.root.firstAtrulesAllowed = false;
                list.remove(item);
                return true;
            }, this);

            break;
    }
};

},{}],8:[function(require,module,exports){
module.exports = function cleanComment(data, item, list) {
    list.remove(item);
};

},{}],9:[function(require,module,exports){
module.exports = function cleanDeclartion(node, item, list) {
    if (node.value.sequence.isEmpty()) {
        list.remove(item);
    }
};

},{}],10:[function(require,module,exports){
module.exports = function cleanIdentifier(node, item, list) {
    // remove useless universal selector
    if (this.selector !== null && node.name === '*') {
        // remove when universal selector isn't last
        if (item.next && item.next.data.type !== 'Combinator') {
            list.remove(item);
        }
    }
};

},{}],11:[function(require,module,exports){
var hasOwnProperty = Object.prototype.hasOwnProperty;

function cleanUnused(node, usageData) {
    return node.selector.selectors.each(function(selector, item, list) {
        var hasUnused = selector.sequence.some(function(node) {
            switch (node.type) {
                case 'Class':
                    return usageData.classes && !hasOwnProperty.call(usageData.classes, node.name);

                case 'Id':
                    return usageData.ids && !hasOwnProperty.call(usageData.ids, node.name);

                case 'Identifier':
                    // ignore universal selector
                    if (node.name !== '*') {
                        // TODO: remove toLowerCase when type selectors will be normalized
                        return usageData.tags && !hasOwnProperty.call(usageData.tags, node.name.toLowerCase());
                    }

                    break;
            }
        });

        if (hasUnused) {
            list.remove(item);
        }
    });
}

module.exports = function cleanRuleset(node, item, list, usageData) {
    if (usageData) {
        cleanUnused(node, usageData);
    }

    if (node.selector.selectors.isEmpty() ||
        node.block.declarations.isEmpty()) {
        list.remove(item);
    }
};

},{}],12:[function(require,module,exports){
function canCleanWhitespace(node) {
    if (node.type !== 'Operator') {
        return false;
    }

    return node.value !== '+' && node.value !== '-';
}

module.exports = function cleanWhitespace(node, item, list) {
    var prev = item.prev && item.prev.data;
    var next = item.next && item.next.data;

    if (canCleanWhitespace(prev) || canCleanWhitespace(next)) {
        list.remove(item);
    }
};

},{}],13:[function(require,module,exports){
var walk = require('../../utils/walk.js').all;
var handlers = {
    Space: require('./Space.js'),
    Atrule: require('./Atrule.js'),
    Ruleset: require('./Ruleset.js'),
    Declaration: require('./Declaration.js'),
    Identifier: require('./Identifier.js'),
    Comment: require('./Comment.js')
};

module.exports = function(ast, usageData) {
    walk(ast, function(node, item, list) {
        if (handlers.hasOwnProperty(node.type)) {
            handlers[node.type].call(this, node, item, list, usageData);
        }
    });
};

},{"../../utils/walk.js":51,"./Atrule.js":7,"./Comment.js":8,"./Declaration.js":9,"./Identifier.js":10,"./Ruleset.js":11,"./Space.js":12}],14:[function(require,module,exports){
var resolveKeyword = require('../../utils/names.js').keyword;
var compressKeyframes = require('./atrule/keyframes.js');

module.exports = function(node) {
    // compress @keyframe selectors
    if (resolveKeyword(node.name).name === 'keyframes') {
        compressKeyframes(node);
    }
};

},{"../../utils/names.js":48,"./atrule/keyframes.js":21}],15:[function(require,module,exports){
// Can unquote attribute detection
// Adopted implementation of Mathias Bynens
// https://github.com/mathiasbynens/mothereff.in/blob/master/unquoted-attributes/eff.js
var escapesRx = /\\([0-9A-Fa-f]{1,6})[ \t\n\f\r]?|\\./g;
var blockUnquoteRx = /^(-?\d|--)|[\u0000-\u002c\u002e\u002f\u003A-\u0040\u005B-\u005E\u0060\u007B-\u009f]/;

function canUnquote(value) {
    if (value === '' || value === '-') {
        return;
    }

    // Escapes are valid, so replace them with a valid non-empty string
    value = value.replace(escapesRx, 'a');

    return !blockUnquoteRx.test(value);
}

module.exports = function(node) {
    var attrValue = node.value;

    if (!attrValue || attrValue.type !== 'String') {
        return;
    }

    var unquotedValue = attrValue.value.replace(/^(.)(.*)\1$/, '$2');
    if (canUnquote(unquotedValue)) {
        node.value = {
            type: 'Identifier',
            info: attrValue.info,
            name: unquotedValue
        };
    }
};

},{}],16:[function(require,module,exports){
var packNumber = require('./Number.js').pack;
var LENGTH_UNIT = {
    // absolute length units
    'px': true,
    'mm': true,
    'cm': true,
    'in': true,
    'pt': true,
    'pc': true,

    // relative length units
    'em': true,
    'ex': true,
    'ch': true,
    'rem': true,

    // viewport-percentage lengths
    'vh': true,
    'vw': true,
    'vmin': true,
    'vmax': true,
    'vm': true
};

module.exports = function compressDimension(node, item) {
    var value = packNumber(node.value);

    node.value = value;

    if (value === '0' && this.declaration) {
        var unit = node.unit.toLowerCase();

        // only length values can be compressed
        if (!LENGTH_UNIT.hasOwnProperty(unit)) {
            return;
        }

        // issue #200: don't remove units in flex property as it could change value meaning
        if (this.declaration.property.name === 'flex') {
            return;
        }

        // issue #222: don't remove units inside calc
        if (this['function'] && this['function'].name === 'calc') {
            return;
        }

        item.data = {
            type: 'Number',
            info: node.info,
            value: value
        };
    }
};

},{"./Number.js":17}],17:[function(require,module,exports){
function packNumber(value) {
    // 100 -> '100'
    // 00100 -> '100'
    // +100 -> '100'
    // -100 -> '-100'
    // 0.123 -> '.123'
    // 0.12300 -> '.123'
    // 0.0 -> ''
    // 0 -> ''
    value = String(value).replace(/^(?:\+|(-))?0*(\d*)(?:\.0*|(\.\d*?)0*)?$/, '$1$2$3');

    if (value.length === 0 || value === '-') {
        value = '0';
    }

    return value;
};

module.exports = function(node) {
    node.value = packNumber(node.value);
};
module.exports.pack = packNumber;

},{}],18:[function(require,module,exports){
module.exports = function(node) {
    var value = node.value;

    // remove escaped \n, i.e.
    // .a { content: "foo\
    // bar"}
    // ->
    // .a { content: "foobar" }
    value = value.replace(/\\\n/g, '');

    node.value = value;
};

},{}],19:[function(require,module,exports){
var UNICODE = '\\\\[0-9a-f]{1,6}(\\r\\n|[ \\n\\r\\t\\f])?';
var ESCAPE = '(' + UNICODE + '|\\\\[^\\n\\r\\f0-9a-fA-F])';
var NONPRINTABLE = '\u0000\u0008\u000b\u000e-\u001f\u007f';
var SAFE_URL = new RegExp('^(' + ESCAPE + '|[^\"\'\\(\\)\\\\\\s' + NONPRINTABLE + '])*$', 'i');

module.exports = function(node) {
    var value = node.value;

    if (value.type !== 'String') {
        return;
    }

    var quote = value.value[0];
    var url = value.value.substr(1, value.value.length - 2);

    // convert `\\` to `/`
    url = url.replace(/\\\\/g, '/');

    // remove quotes when safe
    // https://www.w3.org/TR/css-syntax-3/#url-unquoted-diagram
    if (SAFE_URL.test(url)) {
        node.value = {
            type: 'Raw',
            info: node.value.info,
            value: url
        };
    } else {
        // use double quotes if string has no double quotes
        // otherwise use original quotes
        // TODO: make better quote type selection
        node.value.value = url.indexOf('"') === -1 ? '"' + url + '"' : quote + url + quote;
    }
};

},{}],20:[function(require,module,exports){
var resolveName = require('../../utils/names.js').property;
var handlers = {
    'font': require('./property/font.js'),
    'font-weight': require('./property/font-weight.js'),
    'background': require('./property/background.js')
};

module.exports = function compressValue(node) {
    if (!this.declaration) {
        return;
    }

    var property = resolveName(this.declaration.property.name);

    if (handlers.hasOwnProperty(property.name)) {
        handlers[property.name](node);
    }
};

},{"../../utils/names.js":48,"./property/background.js":24,"./property/font-weight.js":25,"./property/font.js":26}],21:[function(require,module,exports){
module.exports = function(node) {
    node.block.rules.each(function(ruleset) {
        ruleset.selector.selectors.each(function(simpleselector) {
            simpleselector.sequence.each(function(data, item) {
                if (data.type === 'Percentage' && data.value === '100') {
                    item.data = {
                        type: 'Identifier',
                        info: data.info,
                        name: 'to'
                    };
                } else if (data.type === 'Identifier' && data.name === 'from') {
                    item.data = {
                        type: 'Percentage',
                        info: data.info,
                        value: '0'
                    };
                }
            });
        });
    });
};

},{}],22:[function(require,module,exports){
var List = require('../../utils/list.js');
var packNumber = require('./Number.js').pack;

// http://www.w3.org/TR/css3-color/#svg-color
var NAME_TO_HEX = {
    'aliceblue': 'f0f8ff',
    'antiquewhite': 'faebd7',
    'aqua': '0ff',
    'aquamarine': '7fffd4',
    'azure': 'f0ffff',
    'beige': 'f5f5dc',
    'bisque': 'ffe4c4',
    'black': '000',
    'blanchedalmond': 'ffebcd',
    'blue': '00f',
    'blueviolet': '8a2be2',
    'brown': 'a52a2a',
    'burlywood': 'deb887',
    'cadetblue': '5f9ea0',
    'chartreuse': '7fff00',
    'chocolate': 'd2691e',
    'coral': 'ff7f50',
    'cornflowerblue': '6495ed',
    'cornsilk': 'fff8dc',
    'crimson': 'dc143c',
    'cyan': '0ff',
    'darkblue': '00008b',
    'darkcyan': '008b8b',
    'darkgoldenrod': 'b8860b',
    'darkgray': 'a9a9a9',
    'darkgrey': 'a9a9a9',
    'darkgreen': '006400',
    'darkkhaki': 'bdb76b',
    'darkmagenta': '8b008b',
    'darkolivegreen': '556b2f',
    'darkorange': 'ff8c00',
    'darkorchid': '9932cc',
    'darkred': '8b0000',
    'darksalmon': 'e9967a',
    'darkseagreen': '8fbc8f',
    'darkslateblue': '483d8b',
    'darkslategray': '2f4f4f',
    'darkslategrey': '2f4f4f',
    'darkturquoise': '00ced1',
    'darkviolet': '9400d3',
    'deeppink': 'ff1493',
    'deepskyblue': '00bfff',
    'dimgray': '696969',
    'dimgrey': '696969',
    'dodgerblue': '1e90ff',
    'firebrick': 'b22222',
    'floralwhite': 'fffaf0',
    'forestgreen': '228b22',
    'fuchsia': 'f0f',
    'gainsboro': 'dcdcdc',
    'ghostwhite': 'f8f8ff',
    'gold': 'ffd700',
    'goldenrod': 'daa520',
    'gray': '808080',
    'grey': '808080',
    'green': '008000',
    'greenyellow': 'adff2f',
    'honeydew': 'f0fff0',
    'hotpink': 'ff69b4',
    'indianred': 'cd5c5c',
    'indigo': '4b0082',
    'ivory': 'fffff0',
    'khaki': 'f0e68c',
    'lavender': 'e6e6fa',
    'lavenderblush': 'fff0f5',
    'lawngreen': '7cfc00',
    'lemonchiffon': 'fffacd',
    'lightblue': 'add8e6',
    'lightcoral': 'f08080',
    'lightcyan': 'e0ffff',
    'lightgoldenrodyellow': 'fafad2',
    'lightgray': 'd3d3d3',
    'lightgrey': 'd3d3d3',
    'lightgreen': '90ee90',
    'lightpink': 'ffb6c1',
    'lightsalmon': 'ffa07a',
    'lightseagreen': '20b2aa',
    'lightskyblue': '87cefa',
    'lightslategray': '789',
    'lightslategrey': '789',
    'lightsteelblue': 'b0c4de',
    'lightyellow': 'ffffe0',
    'lime': '0f0',
    'limegreen': '32cd32',
    'linen': 'faf0e6',
    'magenta': 'f0f',
    'maroon': '800000',
    'mediumaquamarine': '66cdaa',
    'mediumblue': '0000cd',
    'mediumorchid': 'ba55d3',
    'mediumpurple': '9370db',
    'mediumseagreen': '3cb371',
    'mediumslateblue': '7b68ee',
    'mediumspringgreen': '00fa9a',
    'mediumturquoise': '48d1cc',
    'mediumvioletred': 'c71585',
    'midnightblue': '191970',
    'mintcream': 'f5fffa',
    'mistyrose': 'ffe4e1',
    'moccasin': 'ffe4b5',
    'navajowhite': 'ffdead',
    'navy': '000080',
    'oldlace': 'fdf5e6',
    'olive': '808000',
    'olivedrab': '6b8e23',
    'orange': 'ffa500',
    'orangered': 'ff4500',
    'orchid': 'da70d6',
    'palegoldenrod': 'eee8aa',
    'palegreen': '98fb98',
    'paleturquoise': 'afeeee',
    'palevioletred': 'db7093',
    'papayawhip': 'ffefd5',
    'peachpuff': 'ffdab9',
    'peru': 'cd853f',
    'pink': 'ffc0cb',
    'plum': 'dda0dd',
    'powderblue': 'b0e0e6',
    'purple': '800080',
    'rebeccapurple': '639',
    'red': 'f00',
    'rosybrown': 'bc8f8f',
    'royalblue': '4169e1',
    'saddlebrown': '8b4513',
    'salmon': 'fa8072',
    'sandybrown': 'f4a460',
    'seagreen': '2e8b57',
    'seashell': 'fff5ee',
    'sienna': 'a0522d',
    'silver': 'c0c0c0',
    'skyblue': '87ceeb',
    'slateblue': '6a5acd',
    'slategray': '708090',
    'slategrey': '708090',
    'snow': 'fffafa',
    'springgreen': '00ff7f',
    'steelblue': '4682b4',
    'tan': 'd2b48c',
    'teal': '008080',
    'thistle': 'd8bfd8',
    'tomato': 'ff6347',
    'turquoise': '40e0d0',
    'violet': 'ee82ee',
    'wheat': 'f5deb3',
    'white': 'fff',
    'whitesmoke': 'f5f5f5',
    'yellow': 'ff0',
    'yellowgreen': '9acd32'
};

var HEX_TO_NAME = {
    '800000': 'maroon',
    '800080': 'purple',
    '808000': 'olive',
    '808080': 'gray',
    '00ffff': 'cyan',
    'f0ffff': 'azure',
    'f5f5dc': 'beige',
    'ffe4c4': 'bisque',
    '000000': 'black',
    '0000ff': 'blue',
    'a52a2a': 'brown',
    'ff7f50': 'coral',
    'ffd700': 'gold',
    '008000': 'green',
    '4b0082': 'indigo',
    'fffff0': 'ivory',
    'f0e68c': 'khaki',
    '00ff00': 'lime',
    'faf0e6': 'linen',
    '000080': 'navy',
    'ffa500': 'orange',
    'da70d6': 'orchid',
    'cd853f': 'peru',
    'ffc0cb': 'pink',
    'dda0dd': 'plum',
    'f00': 'red',
    'ff0000': 'red',
    'fa8072': 'salmon',
    'a0522d': 'sienna',
    'c0c0c0': 'silver',
    'fffafa': 'snow',
    'd2b48c': 'tan',
    '008080': 'teal',
    'ff6347': 'tomato',
    'ee82ee': 'violet',
    'f5deb3': 'wheat',
    'ffffff': 'white',
    'ffff00': 'yellow'
};

function hueToRgb(p, q, t) {
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
}

function hslToRgb(h, s, l, a) {
    var r;
    var g;
    var b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hueToRgb(p, q, h + 1 / 3);
        g = hueToRgb(p, q, h);
        b = hueToRgb(p, q, h - 1 / 3);
    }

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255),
        a
    ];
}

function toHex(value) {
    value = value.toString(16);
    return value.length === 1 ? '0' + value : value;
}

function parseFunctionArgs(functionArgs, count, rgb) {
    var argument = functionArgs.head;
    var args = [];

    while (argument !== null) {
        var argumentPart = argument.data.sequence.head;
        var wasValue = false;

        while (argumentPart !== null) {
            var value = argumentPart.data;
            var type = value.type;

            switch (type) {
                case 'Number':
                case 'Percentage':
                    if (wasValue) {
                        return;
                    }

                    wasValue = true;
                    args.push({
                        type: type,
                        value: Number(value.value)
                    });
                    break;

                case 'Operator':
                    if (wasValue || value.value !== '+') {
                        return;
                    }
                    break;

                default:
                    // something we couldn't understand
                    return;
            }

            argumentPart = argumentPart.next;
        }

        argument = argument.next;
    }

    if (args.length !== count) {
        // invalid arguments count
        // TODO: remove those tokens
        return;
    }

    if (args.length === 4) {
        if (args[3].type !== 'Number') {
            // 4th argument should be a number
            // TODO: remove those tokens
            return;
        }

        args[3].type = 'Alpha';
    }

    if (rgb) {
        if (args[0].type !== args[1].type || args[0].type !== args[2].type) {
            // invalid color, numbers and percentage shouldn't be mixed
            // TODO: remove those tokens
            return;
        }
    } else {
        if (args[0].type !== 'Number' ||
            args[1].type !== 'Percentage' ||
            args[2].type !== 'Percentage') {
            // invalid color, for hsl values should be: number, percentage, percentage
            // TODO: remove those tokens
            return;
        }

        args[0].type = 'Angle';
    }

    return args.map(function(arg) {
        var value = Math.max(0, arg.value);

        switch (arg.type) {
            case 'Number':
                // fit value to [0..255] range
                value = Math.min(value, 255);
                break;

            case 'Percentage':
                // convert 0..100% to value in [0..255] range
                value = Math.min(value, 100) / 100;

                if (!rgb) {
                    return value;
                }

                value = 255 * value;
                break;

            case 'Angle':
                // fit value to (-360..360) range
                return (((value % 360) + 360) % 360) / 360;

            case 'Alpha':
                // fit value to [0..1] range
                return Math.min(value, 1);
        }

        return Math.round(value);
    });
}

function compressFunction(node, item, list) {
    var functionName = node.name;
    var args;

    if (functionName === 'rgba' || functionName === 'hsla') {
        args = parseFunctionArgs(node.arguments, 4, functionName === 'rgba');

        if (!args) {
            // something went wrong
            return;
        }

        if (functionName === 'hsla') {
            args = hslToRgb.apply(null, args);
            node.name = 'rgba';
        }

        if (args[3] !== 1) {
            // replace argument values for normalized/interpolated
            node.arguments.each(function(argument) {
                var item = argument.sequence.head;

                if (item.data.type === 'Operator') {
                    item = item.next;
                }

                argument.sequence = new List([{
                    type: 'Number',
                    info: item.data.info,
                    value: packNumber(args.shift())
                }]);
            });

            return;
        }

        // otherwise convert to rgb, i.e. rgba(255, 0, 0, 1) -> rgb(255, 0, 0)
        functionName = 'rgb';
    }

    if (functionName === 'hsl') {
        args = args || parseFunctionArgs(node.arguments, 3, false);

        if (!args) {
            // something went wrong
            return;
        }

        // convert to rgb
        args = hslToRgb.apply(null, args);
        functionName = 'rgb';
    }

    if (functionName === 'rgb') {
        args = args || parseFunctionArgs(node.arguments, 3, true);

        if (!args) {
            // something went wrong
            return;
        }

        // check if color is not at the end and not followed by space
        var next = item.next;
        if (next && next.data.type !== 'Space') {
            list.insert(list.createItem({
                type: 'Space'
            }), next);
        }

        item.data = {
            type: 'Hash',
            info: node.info,
            value: toHex(args[0]) + toHex(args[1]) + toHex(args[2])
        };

        compressHex(item.data, item);
    }
}

function compressIdent(node, item) {
    if (this.declaration === null) {
        return;
    }

    var color = node.name.toLowerCase();

    if (NAME_TO_HEX.hasOwnProperty(color)) {
        var hex = NAME_TO_HEX[color];

        if (hex.length + 1 <= color.length) {
            // replace for shorter hex value
            item.data = {
                type: 'Hash',
                info: node.info,
                value: hex
            };
        } else {
            // special case for consistent colors
            if (color === 'grey') {
                color = 'gray';
            }

            // just replace value for lower cased name
            node.name = color;
        }
    }
}

function compressHex(node, item) {
    var color = node.value.toLowerCase();

    // #112233 -> #123
    if (color.length === 6 &&
        color[0] === color[1] &&
        color[2] === color[3] &&
        color[4] === color[5]) {
        color = color[0] + color[2] + color[4];
    }

    if (HEX_TO_NAME[color]) {
        item.data = {
            type: 'Identifier',
            info: node.info,
            name: HEX_TO_NAME[color]
        };
    } else {
        node.value = color;
    }
}

module.exports = {
    compressFunction: compressFunction,
    compressIdent: compressIdent,
    compressHex: compressHex
};

},{"../../utils/list.js":47,"./Number.js":17}],23:[function(require,module,exports){
var walk = require('../../utils/walk.js').all;
var handlers = {
    Atrule: require('./Atrule.js'),
    Attribute: require('./Attribute.js'),
    Value: require('./Value.js'),
    Dimension: require('./Dimension.js'),
    Percentage: require('./Number.js'),
    Number: require('./Number.js'),
    String: require('./String.js'),
    Url: require('./Url.js'),
    Hash: require('./color.js').compressHex,
    Identifier: require('./color.js').compressIdent,
    Function: require('./color.js').compressFunction
};

module.exports = function(ast) {
    walk(ast, function(node, item, list) {
        if (handlers.hasOwnProperty(node.type)) {
            handlers[node.type].call(this, node, item, list);
        }
    });
};

},{"../../utils/walk.js":51,"./Atrule.js":14,"./Attribute.js":15,"./Dimension.js":16,"./Number.js":17,"./String.js":18,"./Url.js":19,"./Value.js":20,"./color.js":22}],24:[function(require,module,exports){
var List = require('../../../utils/list.js');

module.exports = function compressBackground(node) {
    function lastType() {
        if (buffer.length) {
            return buffer[buffer.length - 1].type;
        }
    }

    function flush() {
        if (lastType() === 'Space') {
            buffer.pop();
        }

        if (!buffer.length) {
            buffer.unshift(
                {
                    type: 'Number',
                    value: '0'
                },
                {
                    type: 'Space'
                },
                {
                    type: 'Number',
                    value: '0'
                }
            );
        }

        newValue.push.apply(newValue, buffer);

        buffer = [];
    }

    var newValue = [];
    var buffer = [];

    node.sequence.each(function(node) {
        if (node.type === 'Operator' && node.value === ',') {
            flush();
            newValue.push(node);
            return;
        }

        // remove defaults
        if (node.type === 'Identifier') {
            if (node.name === 'transparent' ||
                node.name === 'none' ||
                node.name === 'repeat' ||
                node.name === 'scroll') {
                return;
            }
        }

        // don't add redundant spaces
        if (node.type === 'Space' && (!buffer.length || lastType() === 'Space')) {
            return;
        }

        buffer.push(node);
    });

    flush();
    node.sequence = new List(newValue);
};

},{"../../../utils/list.js":47}],25:[function(require,module,exports){
module.exports = function compressFontWeight(node) {
    var value = node.sequence.head.data;

    if (value.type === 'Identifier') {
        switch (value.name) {
            case 'normal':
                node.sequence.head.data = {
                    type: 'Number',
                    info: value.info,
                    value: '400'
                };
                break;
            case 'bold':
                node.sequence.head.data = {
                    type: 'Number',
                    info: value.info,
                    value: '700'
                };
                break;
        }
    }
};

},{}],26:[function(require,module,exports){
module.exports = function compressFont(node) {
    var list = node.sequence;

    list.eachRight(function(node, item) {
        if (node.type === 'Identifier') {
            if (node.name === 'bold') {
                item.data = {
                    type: 'Number',
                    info: node.info,
                    value: '700'
                };
            } else if (node.name === 'normal') {
                var prev = item.prev;

                if (prev && prev.data.type === 'Operator' && prev.data.value === '/') {
                    this.remove(prev);
                }

                this.remove(item);
            } else if (node.name === 'medium') {
                var next = item.next;

                if (!next || next.data.type !== 'Operator') {
                    this.remove(item);
                }
            }
        }
    });

    // remove redundant spaces
    list.each(function(node, item) {
        if (node.type === 'Space') {
            if (!item.prev || !item.next || item.next.data.type === 'Space') {
                this.remove(item);
            }
        }
    });

    if (list.isEmpty()) {
        list.insert(list.createItem({
            type: 'Identifier',
            name: 'normal'
        }));
    }
};

},{}],27:[function(require,module,exports){
var List = require('../utils/list');
var clone = require('../utils/clone');
var usageUtils = require('./usage');
var clean = require('./clean');
var compress = require('./compress');
var restructureBlock = require('./restructure');
var walkRules = require('../utils/walk').rules;

function readRulesChunk(rules, specialComments) {
    var buffer = new List();
    var nonSpaceTokenInBuffer = false;
    var protectedComment;

    rules.nextUntil(rules.head, function(node, item, list) {
        if (node.type === 'Comment') {
            if (!specialComments || node.value.charAt(0) !== '!') {
                list.remove(item);
                return;
            }

            if (nonSpaceTokenInBuffer || protectedComment) {
                return true;
            }

            list.remove(item);
            protectedComment = node;
            return;
        }

        if (node.type !== 'Space') {
            nonSpaceTokenInBuffer = true;
        }

        buffer.insert(list.remove(item));
    });

    return {
        comment: protectedComment,
        stylesheet: {
            type: 'StyleSheet',
            info: null,
            rules: buffer
        }
    };
}

function compressChunk(ast, firstAtrulesAllowed, usageData, num, logger) {
    logger('Compress block #' + num, null, true);

    var seed = 1;
    walkRules(ast, function markStylesheets() {
        if ('id' in this.stylesheet === false) {
            this.stylesheet.firstAtrulesAllowed = firstAtrulesAllowed;
            this.stylesheet.id = seed++;
        }
    });
    logger('init', ast);

    // remove redundant
    clean(ast, usageData);
    logger('clean', ast);

    // compress nodes
    compress(ast, usageData);
    logger('compress', ast);

    return ast;
}

function getCommentsOption(options) {
    var comments = 'comments' in options ? options.comments : 'exclamation';

    if (typeof comments === 'boolean') {
        comments = comments ? 'exclamation' : false;
    } else if (comments !== 'exclamation' && comments !== 'first-exclamation') {
        comments = false;
    }

    return comments;
}

function getRestructureOption(options) {
    return 'restructure' in options ? options.restructure :
           'restructuring' in options ? options.restructuring :
           true;
}

function wrapBlock(block) {
    return new List([{
        type: 'Ruleset',
        selector: {
            type: 'Selector',
            selectors: new List([{
                type: 'SimpleSelector',
                sequence: new List([{
                    type: 'Identifier',
                    name: 'x'
                }])
            }])
        },
        block: block
    }]);
}

module.exports = function compress(ast, options) {
    ast = ast || { type: 'StyleSheet', info: null, rules: new List() };
    options = options || {};

    var logger = typeof options.logger === 'function' ? options.logger : Function();
    var specialComments = getCommentsOption(options);
    var restructuring = getRestructureOption(options);
    var firstAtrulesAllowed = true;
    var usageData = false;
    var inputRules;
    var outputRules = new List();
    var chunk;
    var chunkNum = 1;
    var chunkRules;

    if (options.clone) {
        ast = clone(ast);
    }

    if (ast.type === 'StyleSheet') {
        inputRules = ast.rules;
        ast.rules = outputRules;
    } else {
        inputRules = wrapBlock(ast);
    }

    if (options.usage) {
        usageData = usageUtils.buildIndex(options.usage);
    }

    do {
        chunk = readRulesChunk(inputRules, Boolean(specialComments));

        compressChunk(chunk.stylesheet, firstAtrulesAllowed, usageData, chunkNum++, logger);

        // structure optimisations
        if (restructuring) {
            restructureBlock(chunk.stylesheet, usageData, logger);
        }

        chunkRules = chunk.stylesheet.rules;

        if (chunk.comment) {
            // add \n before comment if there is another content in outputRules
            if (!outputRules.isEmpty()) {
                outputRules.insert(List.createItem({
                    type: 'Raw',
                    value: '\n'
                }));
            }

            outputRules.insert(List.createItem(chunk.comment));

            // add \n after comment if chunk is not empty
            if (!chunkRules.isEmpty()) {
                outputRules.insert(List.createItem({
                    type: 'Raw',
                    value: '\n'
                }));
            }
        }

        if (firstAtrulesAllowed && !chunkRules.isEmpty()) {
            var lastRule = chunkRules.last();

            if (lastRule.type !== 'Atrule' ||
               (lastRule.name !== 'import' && lastRule.name !== 'charset')) {
                firstAtrulesAllowed = false;
            }
        }

        if (specialComments !== 'exclamation') {
            specialComments = false;
        }

        outputRules.appendList(chunkRules);
    } while (!inputRules.isEmpty());

    return {
        ast: ast
    };
};

},{"../utils/clone":46,"../utils/list":47,"../utils/walk":51,"./clean":13,"./compress":23,"./restructure":35,"./usage":41}],28:[function(require,module,exports){
var utils = require('./utils.js');
var walkRules = require('../../utils/walk.js').rules;

function processRuleset(node, item, list) {
    var selectors = node.selector.selectors;
    var declarations = node.block.declarations;

    list.prevUntil(item.prev, function(prev) {
        // skip non-ruleset node if safe
        if (prev.type !== 'Ruleset') {
            return utils.unsafeToSkipNode.call(selectors, prev);
        }

        var prevSelectors = prev.selector.selectors;
        var prevDeclarations = prev.block.declarations;

        // try to join rulesets with equal pseudo signature
        if (node.pseudoSignature === prev.pseudoSignature) {
            // try to join by selectors
            if (utils.isEqualLists(prevSelectors, selectors)) {
                prevDeclarations.appendList(declarations);
                list.remove(item);
                return true;
            }

            // try to join by declarations
            if (utils.isEqualDeclarations(declarations, prevDeclarations)) {
                utils.addSelectors(prevSelectors, selectors);
                list.remove(item);
                return true;
            }
        }

        // go to prev ruleset if has no selector similarities
        return utils.hasSimilarSelectors(selectors, prevSelectors);
    });
};

// NOTE: direction should be left to right, since rulesets merge to left
// ruleset. When direction right to left unmerged rulesets may prevent lookup
// TODO: remove initial merge
module.exports = function initialMergeRuleset(ast) {
    walkRules(ast, function(node, item, list) {
        if (node.type === 'Ruleset') {
            processRuleset(node, item, list);
        }
    });
};

},{"../../utils/walk.js":51,"./utils.js":40}],29:[function(require,module,exports){
var walkRulesRight = require('../../utils/walk.js').rulesRight;

function isMediaRule(node) {
    return node.type === 'Atrule' && node.name === 'media';
}

function processAtrule(node, item, list) {
    if (!isMediaRule(node)) {
        return;
    }

    var prev = item.prev && item.prev.data;

    if (!prev || !isMediaRule(prev)) {
        return;
    }

    // merge @media with same query
    if (node.expression.id === prev.expression.id) {
        prev.block.rules.appendList(node.block.rules);
        prev.info = {
            primary: prev.info,
            merged: node.info
        };
        list.remove(item);
    }
};

module.exports = function rejoinAtrule(ast) {
    walkRulesRight(ast, function(node, item, list) {
        if (node.type === 'Atrule') {
            processAtrule(node, item, list);
        }
    });
};

},{"../../utils/walk.js":51}],30:[function(require,module,exports){
var List = require('../../utils/list.js');
var walkRulesRight = require('../../utils/walk.js').rulesRight;

function processRuleset(node, item, list) {
    var selectors = node.selector.selectors;

    // generate new rule sets:
    // .a, .b { color: red; }
    // ->
    // .a { color: red; }
    // .b { color: red; }

    // while there are more than 1 simple selector split for rulesets
    while (selectors.head !== selectors.tail) {
        var newSelectors = new List();
        newSelectors.insert(selectors.remove(selectors.head));

        list.insert(list.createItem({
            type: 'Ruleset',
            info: node.info,
            pseudoSignature: node.pseudoSignature,
            selector: {
                type: 'Selector',
                info: node.selector.info,
                selectors: newSelectors
            },
            block: {
                type: 'Block',
                info: node.block.info,
                declarations: node.block.declarations.copy()
            }
        }), item);
    }
};

module.exports = function disjoinRuleset(ast) {
    walkRulesRight(ast, function(node, item, list) {
        if (node.type === 'Ruleset') {
            processRuleset(node, item, list);
        }
    });
};

},{"../../utils/list.js":47,"../../utils/walk.js":51}],31:[function(require,module,exports){
var List = require('../../utils/list.js');
var translate = require('../../utils/translate.js');
var walkRulesRight = require('../../utils/walk.js').rulesRight;

var REPLACE = 1;
var REMOVE = 2;
var TOP = 0;
var RIGHT = 1;
var BOTTOM = 2;
var LEFT = 3;
var SIDES = ['top', 'right', 'bottom', 'left'];
var SIDE = {
    'margin-top': 'top',
    'margin-right': 'right',
    'margin-bottom': 'bottom',
    'margin-left': 'left',

    'padding-top': 'top',
    'padding-right': 'right',
    'padding-bottom': 'bottom',
    'padding-left': 'left',

    'border-top-color': 'top',
    'border-right-color': 'right',
    'border-bottom-color': 'bottom',
    'border-left-color': 'left',
    'border-top-width': 'top',
    'border-right-width': 'right',
    'border-bottom-width': 'bottom',
    'border-left-width': 'left',
    'border-top-style': 'top',
    'border-right-style': 'right',
    'border-bottom-style': 'bottom',
    'border-left-style': 'left'
};
var MAIN_PROPERTY = {
    'margin': 'margin',
    'margin-top': 'margin',
    'margin-right': 'margin',
    'margin-bottom': 'margin',
    'margin-left': 'margin',

    'padding': 'padding',
    'padding-top': 'padding',
    'padding-right': 'padding',
    'padding-bottom': 'padding',
    'padding-left': 'padding',

    'border-color': 'border-color',
    'border-top-color': 'border-color',
    'border-right-color': 'border-color',
    'border-bottom-color': 'border-color',
    'border-left-color': 'border-color',
    'border-width': 'border-width',
    'border-top-width': 'border-width',
    'border-right-width': 'border-width',
    'border-bottom-width': 'border-width',
    'border-left-width': 'border-width',
    'border-style': 'border-style',
    'border-top-style': 'border-style',
    'border-right-style': 'border-style',
    'border-bottom-style': 'border-style',
    'border-left-style': 'border-style'
};

function TRBL(name) {
    this.name = name;
    this.info = null;
    this.iehack = undefined;
    this.sides = {
        'top': null,
        'right': null,
        'bottom': null,
        'left': null
    };
}

TRBL.prototype.getValueSequence = function(value, count) {
    var values = [];
    var iehack = '';
    var hasBadValues = value.sequence.some(function(child) {
        var special = false;

        switch (child.type) {
            case 'Identifier':
                switch (child.name) {
                    case '\\0':
                    case '\\9':
                        iehack = child.name;
                        return;

                    case 'inherit':
                    case 'initial':
                    case 'unset':
                    case 'revert':
                        special = child.name;
                        break;
                }
                break;

            case 'Dimension':
                switch (child.unit) {
                    // is not supported until IE11
                    case 'rem':

                    // v* units is too buggy across browsers and better
                    // don't merge values with those units
                    case 'vw':
                    case 'vh':
                    case 'vmin':
                    case 'vmax':
                    case 'vm': // IE9 supporting "vm" instead of "vmin".
                        special = child.unit;
                        break;
                }
                break;

            case 'Hash': // color
            case 'Number':
            case 'Percentage':
                break;

            case 'Function':
                special = child.name;
                break;

            case 'Space':
                return false; // ignore space

            default:
                return true;  // bad value
        }

        values.push({
            node: child,
            special: special,
            important: value.important
        });
    });

    if (hasBadValues || values.length > count) {
        return false;
    }

    if (typeof this.iehack === 'string' && this.iehack !== iehack) {
        return false;
    }

    this.iehack = iehack; // move outside

    return values;
};

TRBL.prototype.canOverride = function(side, value) {
    var currentValue = this.sides[side];

    return !currentValue || (value.important && !currentValue.important);
};

TRBL.prototype.add = function(name, value, info) {
    function attemptToAdd() {
        var sides = this.sides;
        var side = SIDE[name];

        if (side) {
            if (side in sides === false) {
                return false;
            }

            var values = this.getValueSequence(value, 1);

            if (!values || !values.length) {
                return false;
            }

            // can mix only if specials are equal
            for (var key in sides) {
                if (sides[key] !== null && sides[key].special !== values[0].special) {
                    return false;
                }
            }

            if (!this.canOverride(side, values[0])) {
                return true;
            }

            sides[side] = values[0];
            return true;
        } else if (name === this.name) {
            var values = this.getValueSequence(value, 4);

            if (!values || !values.length) {
                return false;
            }

            switch (values.length) {
                case 1:
                    values[RIGHT] = values[TOP];
                    values[BOTTOM] = values[TOP];
                    values[LEFT] = values[TOP];
                    break;

                case 2:
                    values[BOTTOM] = values[TOP];
                    values[LEFT] = values[RIGHT];
                    break;

                case 3:
                    values[LEFT] = values[RIGHT];
                    break;
            }

            // can mix only if specials are equal
            for (var i = 0; i < 4; i++) {
                for (var key in sides) {
                    if (sides[key] !== null && sides[key].special !== values[i].special) {
                        return false;
                    }
                }
            }

            for (var i = 0; i < 4; i++) {
                if (this.canOverride(SIDES[i], values[i])) {
                    sides[SIDES[i]] = values[i];
                }
            }

            return true;
        }
    }

    if (!attemptToAdd.call(this)) {
        return false;
    }

    if (this.info) {
        this.info = {
            primary: this.info,
            merged: info
        };
    } else {
        this.info = info;
    }

    return true;
};

TRBL.prototype.isOkToMinimize = function() {
    var top = this.sides.top;
    var right = this.sides.right;
    var bottom = this.sides.bottom;
    var left = this.sides.left;

    if (top && right && bottom && left) {
        var important =
            top.important +
            right.important +
            bottom.important +
            left.important;

        return important === 0 || important === 4;
    }

    return false;
};

TRBL.prototype.getValue = function() {
    var result = [];
    var sides = this.sides;
    var values = [
        sides.top,
        sides.right,
        sides.bottom,
        sides.left
    ];
    var stringValues = [
        translate(sides.top.node),
        translate(sides.right.node),
        translate(sides.bottom.node),
        translate(sides.left.node)
    ];

    if (stringValues[LEFT] === stringValues[RIGHT]) {
        values.pop();
        if (stringValues[BOTTOM] === stringValues[TOP]) {
            values.pop();
            if (stringValues[RIGHT] === stringValues[TOP]) {
                values.pop();
            }
        }
    }

    for (var i = 0; i < values.length; i++) {
        if (i) {
            result.push({ type: 'Space' });
        }

        result.push(values[i].node);
    }

    if (this.iehack) {
        result.push({ type: 'Space' }, {
            type: 'Identifier',
            info: {},
            name: this.iehack
        });
    }

    return {
        type: 'Value',
        info: {},
        important: sides.top.important,
        sequence: new List(result)
    };
};

TRBL.prototype.getProperty = function() {
    return {
        type: 'Property',
        info: {},
        name: this.name
    };
};

function processRuleset(ruleset, shorts, shortDeclarations, lastShortSelector) {
    var declarations = ruleset.block.declarations;
    var selector = ruleset.selector.selectors.first().id;

    ruleset.block.declarations.eachRight(function(declaration, item) {
        var property = declaration.property.name;

        if (!MAIN_PROPERTY.hasOwnProperty(property)) {
            return;
        }

        var key = MAIN_PROPERTY[property];
        var shorthand;
        var operation;

        if (!lastShortSelector || selector === lastShortSelector) {
            if (key in shorts) {
                operation = REMOVE;
                shorthand = shorts[key];
            }
        }

        if (!shorthand || !shorthand.add(property, declaration.value, declaration.info)) {
            operation = REPLACE;
            shorthand = new TRBL(key);

            // if can't parse value ignore it and break shorthand sequence
            if (!shorthand.add(property, declaration.value, declaration.info)) {
                lastShortSelector = null;
                return;
            }
        }

        shorts[key] = shorthand;
        shortDeclarations.push({
            operation: operation,
            block: declarations,
            item: item,
            shorthand: shorthand
        });

        lastShortSelector = selector;
    });

    return lastShortSelector;
};

function processShorthands(shortDeclarations, markDeclaration) {
    shortDeclarations.forEach(function(item) {
        var shorthand = item.shorthand;

        if (!shorthand.isOkToMinimize()) {
            return;
        }

        if (item.operation === REPLACE) {
            item.item.data = markDeclaration({
                type: 'Declaration',
                info: shorthand.info,
                property: shorthand.getProperty(),
                value: shorthand.getValue(),
                id: 0,
                length: 0,
                fingerprint: null
            });
        } else {
            item.block.remove(item.item);
        }
    });
};

module.exports = function restructBlock(ast, indexer) {
    var stylesheetMap = {};
    var shortDeclarations = [];

    walkRulesRight(ast, function(node) {
        if (node.type !== 'Ruleset') {
            return;
        }

        var stylesheet = this.stylesheet;
        var rulesetId = (node.pseudoSignature || '') + '|' + node.selector.selectors.first().id;
        var rulesetMap;
        var shorts;

        if (!stylesheetMap.hasOwnProperty(stylesheet.id)) {
            rulesetMap = {
                lastShortSelector: null
            };
            stylesheetMap[stylesheet.id] = rulesetMap;
        } else {
            rulesetMap = stylesheetMap[stylesheet.id];
        }

        if (rulesetMap.hasOwnProperty(rulesetId)) {
            shorts = rulesetMap[rulesetId];
        } else {
            shorts = {};
            rulesetMap[rulesetId] = shorts;
        }

        rulesetMap.lastShortSelector = processRuleset.call(this, node, shorts, shortDeclarations, rulesetMap.lastShortSelector);
    });

    processShorthands(shortDeclarations, indexer.declaration);
};

},{"../../utils/list.js":47,"../../utils/translate.js":49,"../../utils/walk.js":51}],32:[function(require,module,exports){
var resolveProperty = require('../../utils/names.js').property;
var resolveKeyword = require('../../utils/names.js').keyword;
var walkRulesRight = require('../../utils/walk.js').rulesRight;
var translate = require('../../utils/translate.js');
var dontRestructure = {
    'src': 1 // https://github.com/afelix/csso/issues/50
};

var DONT_MIX_VALUE = {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/display#Browser_compatibility
    'display': /table|ruby|flex|-(flex)?box$|grid|contents|run-in/i,
    // https://developer.mozilla.org/en/docs/Web/CSS/text-align
    'text-align': /^(start|end|match-parent|justify-all)$/i
};

var CURSOR_SAFE_VALUE = [
    'auto', 'crosshair', 'default', 'move', 'text', 'wait', 'help',
    'n-resize', 'e-resize', 's-resize', 'w-resize',
    'ne-resize', 'nw-resize', 'se-resize', 'sw-resize',
    'pointer', 'progress', 'not-allowed', 'no-drop', 'vertical-text', 'all-scroll',
    'col-resize', 'row-resize'
];

var NEEDLESS_TABLE = {
    'border-width': ['border'],
    'border-style': ['border'],
    'border-color': ['border'],
    'border-top': ['border'],
    'border-right': ['border'],
    'border-bottom': ['border'],
    'border-left': ['border'],
    'border-top-width': ['border-top', 'border-width', 'border'],
    'border-right-width': ['border-right', 'border-width', 'border'],
    'border-bottom-width': ['border-bottom', 'border-width', 'border'],
    'border-left-width': ['border-left', 'border-width', 'border'],
    'border-top-style': ['border-top', 'border-style', 'border'],
    'border-right-style': ['border-right', 'border-style', 'border'],
    'border-bottom-style': ['border-bottom', 'border-style', 'border'],
    'border-left-style': ['border-left', 'border-style', 'border'],
    'border-top-color': ['border-top', 'border-color', 'border'],
    'border-right-color': ['border-right', 'border-color', 'border'],
    'border-bottom-color': ['border-bottom', 'border-color', 'border'],
    'border-left-color': ['border-left', 'border-color', 'border'],
    'margin-top': ['margin'],
    'margin-right': ['margin'],
    'margin-bottom': ['margin'],
    'margin-left': ['margin'],
    'padding-top': ['padding'],
    'padding-right': ['padding'],
    'padding-bottom': ['padding'],
    'padding-left': ['padding'],
    'font-style': ['font'],
    'font-variant': ['font'],
    'font-weight': ['font'],
    'font-size': ['font'],
    'font-family': ['font'],
    'list-style-type': ['list-style'],
    'list-style-position': ['list-style'],
    'list-style-image': ['list-style']
};

function getPropertyFingerprint(propertyName, declaration, fingerprints) {
    var realName = resolveProperty(propertyName).name;

    if (realName === 'background' ||
       (realName === 'filter' && declaration.value.sequence.first().type === 'Progid')) {
        return propertyName + ':' + translate(declaration.value);
    }

    var declarationId = declaration.id;
    var fingerprint = fingerprints[declarationId];

    if (!fingerprint) {
        var vendorId = '';
        var iehack = '';
        var special = {};

        declaration.value.sequence.each(function walk(node) {
            switch (node.type) {
                case 'Argument':
                case 'Value':
                case 'Braces':
                    node.sequence.each(walk);
                    break;

                case 'Identifier':
                    var name = node.name;

                    if (!vendorId) {
                        vendorId = resolveKeyword(name).vendor;
                    }

                    if (/\\[09]/.test(name)) {
                        iehack = RegExp.lastMatch;
                    }

                    if (realName === 'cursor') {
                        if (CURSOR_SAFE_VALUE.indexOf(name) === -1) {
                            special[name] = true;
                        }
                    } else if (DONT_MIX_VALUE.hasOwnProperty(realName)) {
                        if (DONT_MIX_VALUE[realName].test(name)) {
                            special[name] = true;
                        }
                    }

                    break;

                case 'Function':
                    var name = node.name;

                    if (!vendorId) {
                        vendorId = resolveKeyword(name).vendor;
                    }

                    if (name === 'rect') {
                        // there are 2 forms of rect:
                        //   rect(<top>, <right>, <bottom>, <left>) - standart
                        //   rect(<top> <right> <bottom> <left>) – backwards compatible syntax
                        // only the same form values can be merged
                        if (node.arguments.size < 4) {
                            name = 'rect-backward';
                        }
                    }

                    special[name + '()'] = true;

                    // check nested tokens too
                    node.arguments.each(walk);

                    break;

                case 'Dimension':
                    var unit = node.unit;

                    switch (unit) {
                        // is not supported until IE11
                        case 'rem':

                        // v* units is too buggy across browsers and better
                        // don't merge values with those units
                        case 'vw':
                        case 'vh':
                        case 'vmin':
                        case 'vmax':
                        case 'vm': // IE9 supporting "vm" instead of "vmin".
                            special[unit] = true;
                            break;
                    }
                    break;
            }
        });

        fingerprint = '|' + Object.keys(special).sort() + '|' + iehack + vendorId;

        fingerprints[declarationId] = fingerprint;
    }

    return propertyName + fingerprint;
}

function needless(props, declaration, fingerprints) {
    var property = resolveProperty(declaration.property.name);

    if (NEEDLESS_TABLE.hasOwnProperty(property.name)) {
        var table = NEEDLESS_TABLE[property.name];

        for (var i = 0; i < table.length; i++) {
            var ppre = getPropertyFingerprint(property.prefix + table[i], declaration, fingerprints);
            var prev = props[ppre];

            if (prev && (!declaration.value.important || prev.item.data.value.important)) {
                return prev;
            }
        }
    }
}

function processRuleset(ruleset, item, list, props, fingerprints) {
    var declarations = ruleset.block.declarations;

    declarations.eachRight(function(declaration, declarationItem) {
        var property = declaration.property.name;
        var fingerprint = getPropertyFingerprint(property, declaration, fingerprints);
        var prev = props[fingerprint];

        if (prev && !dontRestructure.hasOwnProperty(property)) {
            if (declaration.value.important && !prev.item.data.value.important) {
                props[fingerprint] = {
                    block: declarations,
                    item: declarationItem
                };

                prev.block.remove(prev.item);
                declaration.info = {
                    primary: declaration.info,
                    merged: prev.item.data.info
                };
            } else {
                declarations.remove(declarationItem);
                prev.item.data.info = {
                    primary: prev.item.data.info,
                    merged: declaration.info
                };
            }
        } else {
            var prev = needless(props, declaration, fingerprints);

            if (prev) {
                declarations.remove(declarationItem);
                prev.item.data.info = {
                    primary: prev.item.data.info,
                    merged: declaration.info
                };
            } else {
                declaration.fingerprint = fingerprint;

                props[fingerprint] = {
                    block: declarations,
                    item: declarationItem
                };
            }
        }
    });

    if (declarations.isEmpty()) {
        list.remove(item);
    }
};

module.exports = function restructBlock(ast) {
    var stylesheetMap = {};
    var fingerprints = Object.create(null);

    walkRulesRight(ast, function(node, item, list) {
        if (node.type !== 'Ruleset') {
            return;
        }

        var stylesheet = this.stylesheet;
        var rulesetId = (node.pseudoSignature || '') + '|' + node.selector.selectors.first().id;
        var rulesetMap;
        var props;

        if (!stylesheetMap.hasOwnProperty(stylesheet.id)) {
            rulesetMap = {};
            stylesheetMap[stylesheet.id] = rulesetMap;
        } else {
            rulesetMap = stylesheetMap[stylesheet.id];
        }

        if (rulesetMap.hasOwnProperty(rulesetId)) {
            props = rulesetMap[rulesetId];
        } else {
            props = {};
            rulesetMap[rulesetId] = props;
        }

        processRuleset.call(this, node, item, list, props, fingerprints);
    });
};

},{"../../utils/names.js":48,"../../utils/translate.js":49,"../../utils/walk.js":51}],33:[function(require,module,exports){
var utils = require('./utils.js');
var walkRules = require('../../utils/walk.js').rules;

/*
    At this step all rules has single simple selector. We try to join by equal
    declaration blocks to first rule, e.g.

    .a { color: red }
    b { ... }
    .b { color: red }
    ->
    .a, .b { color: red }
    b { ... }
*/

function processRuleset(node, item, list) {
    var selectors = node.selector.selectors;
    var declarations = node.block.declarations;
    var nodeCompareMarker = selectors.first().compareMarker;
    var skippedCompareMarkers = {};

    list.nextUntil(item.next, function(next, nextItem) {
        // skip non-ruleset node if safe
        if (next.type !== 'Ruleset') {
            return utils.unsafeToSkipNode.call(selectors, next);
        }

        if (node.pseudoSignature !== next.pseudoSignature) {
            return true;
        }

        var nextFirstSelector = next.selector.selectors.head;
        var nextDeclarations = next.block.declarations;
        var nextCompareMarker = nextFirstSelector.data.compareMarker;

        // if next ruleset has same marked as one of skipped then stop joining
        if (nextCompareMarker in skippedCompareMarkers) {
            return true;
        }

        // try to join by selectors
        if (selectors.head === selectors.tail) {
            if (selectors.first().id === nextFirstSelector.data.id) {
                declarations.appendList(nextDeclarations);
                list.remove(nextItem);
                return;
            }
        }

        // try to join by properties
        if (utils.isEqualDeclarations(declarations, nextDeclarations)) {
            var nextStr = nextFirstSelector.data.id;

            selectors.some(function(data, item) {
                var curStr = data.id;

                if (nextStr < curStr) {
                    selectors.insert(nextFirstSelector, item);
                    return true;
                }

                if (!item.next) {
                    selectors.insert(nextFirstSelector);
                    return true;
                }
            });

            list.remove(nextItem);
            return;
        }

        // go to next ruleset if current one can be skipped (has no equal specificity nor element selector)
        if (nextCompareMarker === nodeCompareMarker) {
            return true;
        }

        skippedCompareMarkers[nextCompareMarker] = true;
    });
};

module.exports = function mergeRuleset(ast) {
    walkRules(ast, function(node, item, list) {
        if (node.type === 'Ruleset') {
            processRuleset(node, item, list);
        }
    });
};

},{"../../utils/walk.js":51,"./utils.js":40}],34:[function(require,module,exports){
var List = require('../../utils/list.js');
var utils = require('./utils.js');
var walkRulesRight = require('../../utils/walk.js').rulesRight;

function calcSelectorLength(list) {
    var length = 0;

    list.each(function(data) {
        length += data.id.length + 1;
    });

    return length - 1;
}

function calcDeclarationsLength(tokens) {
    var length = 0;

    for (var i = 0; i < tokens.length; i++) {
        length += tokens[i].length;
    }

    return (
        length +          // declarations
        tokens.length - 1 // delimeters
    );
}

function processRuleset(node, item, list) {
    var avoidRulesMerge = this.stylesheet.avoidRulesMerge;
    var selectors = node.selector.selectors;
    var block = node.block;
    var disallowDownMarkers = Object.create(null);
    var allowMergeUp = true;
    var allowMergeDown = true;

    list.prevUntil(item.prev, function(prev, prevItem) {
        // skip non-ruleset node if safe
        if (prev.type !== 'Ruleset') {
            return utils.unsafeToSkipNode.call(selectors, prev);
        }

        var prevSelectors = prev.selector.selectors;
        var prevBlock = prev.block;

        if (node.pseudoSignature !== prev.pseudoSignature) {
            return true;
        }

        allowMergeDown = !prevSelectors.some(function(selector) {
            return selector.compareMarker in disallowDownMarkers;
        });

        // try prev ruleset if simpleselectors has no equal specifity and element selector
        if (!allowMergeDown && !allowMergeUp) {
            return true;
        }

        // try to join by selectors
        if (allowMergeUp && utils.isEqualLists(prevSelectors, selectors)) {
            prevBlock.declarations.appendList(block.declarations);
            list.remove(item);
            return true;
        }

        // try to join by properties
        var diff = utils.compareDeclarations(block.declarations, prevBlock.declarations);

        // console.log(diff.eq, diff.ne1, diff.ne2);

        if (diff.eq.length) {
            if (!diff.ne1.length && !diff.ne2.length) {
                // equal blocks
                if (allowMergeDown) {
                    utils.addSelectors(selectors, prevSelectors);
                    list.remove(prevItem);
                }

                return true;
            } else if (!avoidRulesMerge) { /* probably we don't need to prevent those merges for @keyframes
                                              TODO: need to be checked */

                if (diff.ne1.length && !diff.ne2.length) {
                    // prevBlock is subset block
                    var selectorLength = calcSelectorLength(selectors);
                    var blockLength = calcDeclarationsLength(diff.eq); // declarations length

                    if (allowMergeUp && selectorLength < blockLength) {
                        utils.addSelectors(prevSelectors, selectors);
                        block.declarations = new List(diff.ne1);
                    }
                } else if (!diff.ne1.length && diff.ne2.length) {
                    // node is subset of prevBlock
                    var selectorLength = calcSelectorLength(prevSelectors);
                    var blockLength = calcDeclarationsLength(diff.eq); // declarations length

                    if (allowMergeDown && selectorLength < blockLength) {
                        utils.addSelectors(selectors, prevSelectors);
                        prevBlock.declarations = new List(diff.ne2);
                    }
                } else {
                    // diff.ne1.length && diff.ne2.length
                    // extract equal block
                    var newSelector = {
                        type: 'Selector',
                        info: {},
                        selectors: utils.addSelectors(prevSelectors.copy(), selectors)
                    };
                    var newBlockLength = calcSelectorLength(newSelector.selectors) + 2; // selectors length + curly braces length
                    var blockLength = calcDeclarationsLength(diff.eq); // declarations length

                    // create new ruleset if declarations length greater than
                    // ruleset description overhead
                    if (allowMergeDown && blockLength >= newBlockLength) {
                        var newRuleset = {
                            type: 'Ruleset',
                            info: {},
                            pseudoSignature: node.pseudoSignature,
                            selector: newSelector,
                            block: {
                                type: 'Block',
                                info: {},
                                declarations: new List(diff.eq)
                            }
                        };

                        block.declarations = new List(diff.ne1);
                        prevBlock.declarations = new List(diff.ne2.concat(diff.ne2overrided));
                        list.insert(list.createItem(newRuleset), prevItem);
                        return true;
                    }
                }
            }
        }

        if (allowMergeUp) {
            // TODO: disallow up merge only if any property interception only (i.e. diff.ne2overrided.length > 0);
            // await property families to find property interception correctly
            allowMergeUp = !prevSelectors.some(function(prevSelector) {
                return selectors.some(function(selector) {
                    return selector.compareMarker === prevSelector.compareMarker;
                });
            });
        }

        prevSelectors.each(function(data) {
            disallowDownMarkers[data.compareMarker] = true;
        });
    });
};

module.exports = function restructRuleset(ast) {
    walkRulesRight(ast, function(node, item, list) {
        if (node.type === 'Ruleset') {
            processRuleset.call(this, node, item, list);
        }
    });
};

},{"../../utils/list.js":47,"../../utils/walk.js":51,"./utils.js":40}],35:[function(require,module,exports){
var prepare = require('./prepare/index.js');
var initialMergeRuleset = require('./1-initialMergeRuleset.js');
var mergeAtrule = require('./2-mergeAtrule.js');
var disjoinRuleset = require('./3-disjoinRuleset.js');
var restructShorthand = require('./4-restructShorthand.js');
var restructBlock = require('./6-restructBlock.js');
var mergeRuleset = require('./7-mergeRuleset.js');
var restructRuleset = require('./8-restructRuleset.js');

module.exports = function(ast, usageData, debug) {
    // prepare ast for restructing
    var indexer = prepare(ast, usageData);
    debug('prepare', ast);

    initialMergeRuleset(ast);
    debug('initialMergeRuleset', ast);

    mergeAtrule(ast);
    debug('mergeAtrule', ast);

    disjoinRuleset(ast);
    debug('disjoinRuleset', ast);

    restructShorthand(ast, indexer);
    debug('restructShorthand', ast);

    restructBlock(ast);
    debug('restructBlock', ast);

    mergeRuleset(ast);
    debug('mergeRuleset', ast);

    restructRuleset(ast);
    debug('restructRuleset', ast);
};

},{"./1-initialMergeRuleset.js":28,"./2-mergeAtrule.js":29,"./3-disjoinRuleset.js":30,"./4-restructShorthand.js":31,"./6-restructBlock.js":32,"./7-mergeRuleset.js":33,"./8-restructRuleset.js":34,"./prepare/index.js":37}],36:[function(require,module,exports){
var translate = require('../../../utils/translate.js');

function Index() {
    this.seed = 0;
    this.map = Object.create(null);
}

Index.prototype.resolve = function(str) {
    var index = this.map[str];

    if (!index) {
        index = ++this.seed;
        this.map[str] = index;
    }

    return index;
};

module.exports = function createDeclarationIndexer() {
    var names = new Index();
    var values = new Index();

    return function markDeclaration(node) {
        var property = node.property.name;
        var value = translate(node.value);

        node.id = names.resolve(property) + (values.resolve(value) << 12);
        node.length = property.length + 1 + value.length;

        return node;
    };
};

},{"../../../utils/translate.js":49}],37:[function(require,module,exports){
var resolveKeyword = require('../../../utils/names.js').keyword;
var walkRules = require('../../../utils/walk.js').rules;
var translate = require('../../../utils/translate.js');
var createDeclarationIndexer = require('./createDeclarationIndexer.js');
var processSelector = require('./processSelector.js');

function walk(node, markDeclaration, usageData) {
    switch (node.type) {
        case 'Ruleset':
            node.block.declarations.each(markDeclaration);
            processSelector(node, usageData);
            break;

        case 'Atrule':
            if (node.expression) {
                node.expression.id = translate(node.expression);
            }

            // compare keyframe selectors by its values
            // NOTE: still no clarification about problems with keyframes selector grouping (issue #197)
            if (resolveKeyword(node.name).name === 'keyframes') {
                node.block.avoidRulesMerge = true;  /* probably we don't need to prevent those merges for @keyframes
                                                       TODO: need to be checked */
                node.block.rules.each(function(ruleset) {
                    ruleset.selector.selectors.each(function(simpleselector) {
                        simpleselector.compareMarker = simpleselector.id;
                    });
                });
            }
            break;
    }
};

module.exports = function prepare(ast, usageData) {
    var markDeclaration = createDeclarationIndexer();

    walkRules(ast, function(node) {
        walk(node, markDeclaration, usageData);
    });

    return {
        declaration: markDeclaration
    };
};

},{"../../../utils/names.js":48,"../../../utils/translate.js":49,"../../../utils/walk.js":51,"./createDeclarationIndexer.js":36,"./processSelector.js":38}],38:[function(require,module,exports){
var translate = require('../../../utils/translate.js');
var specificity = require('./specificity.js');

var nonFreezePseudoElements = {
    'first-letter': true,
    'first-line': true,
    'after': true,
    'before': true
};
var nonFreezePseudoClasses = {
    'link': true,
    'visited': true,
    'hover': true,
    'active': true,
    'first-letter': true,
    'first-line': true,
    'after': true,
    'before': true
};

module.exports = function freeze(node, usageData) {
    var pseudos = Object.create(null);
    var hasPseudo = false;

    node.selector.selectors.each(function(simpleSelector) {
        var tagName = '*';
        var scope = 0;

        simpleSelector.sequence.some(function(node) {
            switch (node.type) {
                case 'Class':
                    if (usageData && usageData.scopes) {
                        var classScope = usageData.scopes[node.name] || 0;

                        if (scope !== 0 && classScope !== scope) {
                            throw new Error('Selector can\'t has classes from different scopes: ' + translate(simpleSelector));
                        }

                        scope = classScope;
                    }
                    break;

                case 'PseudoClass':
                    if (!nonFreezePseudoClasses.hasOwnProperty(node.name)) {
                        pseudos[node.name] = true;
                        hasPseudo = true;
                    }
                    break;

                case 'PseudoElement':
                    if (!nonFreezePseudoElements.hasOwnProperty(node.name)) {
                        pseudos[node.name] = true;
                        hasPseudo = true;
                    }
                    break;

                case 'FunctionalPseudo':
                    pseudos[node.name] = true;
                    hasPseudo = true;
                    break;

                case 'Negation':
                    pseudos.not = true;
                    hasPseudo = true;
                    break;

                case 'Identifier':
                    tagName = node.name;
                    break;

                case 'Attribute':
                    if (node.flags) {
                        pseudos['[' + node.flags + ']'] = true;
                        hasPseudo = true;
                    }
                    break;

                case 'Combinator':
                    tagName = '*';
                    break;
            }
        });

        simpleSelector.id = translate(simpleSelector);
        simpleSelector.compareMarker = specificity(simpleSelector).toString();

        if (scope) {
            simpleSelector.compareMarker += ':' + scope;
        }

        if (tagName !== '*') {
            simpleSelector.compareMarker += ',' + tagName;
        }
    });

    if (hasPseudo) {
        node.pseudoSignature = Object.keys(pseudos).sort().join(',');
    }
};

},{"../../../utils/translate.js":49,"./specificity.js":39}],39:[function(require,module,exports){
module.exports = function specificity(simpleSelector) {
    var A = 0;
    var B = 0;
    var C = 0;

    simpleSelector.sequence.each(function walk(data) {
        switch (data.type) {
            case 'SimpleSelector':
            case 'Negation':
                data.sequence.each(walk);
                break;

            case 'Id':
                A++;
                break;

            case 'Class':
            case 'Attribute':
            case 'FunctionalPseudo':
                B++;
                break;

            case 'Identifier':
                if (data.name !== '*') {
                    C++;
                }
                break;

            case 'PseudoElement':
                C++;
                break;

            case 'PseudoClass':
                var name = data.name.toLowerCase();
                if (name === 'before' ||
                    name === 'after' ||
                    name === 'first-line' ||
                    name === 'first-letter') {
                    C++;
                } else {
                    B++;
                }
                break;
        }
    });

    return [A, B, C];
};

},{}],40:[function(require,module,exports){
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEqualLists(a, b) {
    var cursor1 = a.head;
    var cursor2 = b.head;

    while (cursor1 !== null && cursor2 !== null && cursor1.data.id === cursor2.data.id) {
        cursor1 = cursor1.next;
        cursor2 = cursor2.next;
    }

    return cursor1 === null && cursor2 === null;
}

function isEqualDeclarations(a, b) {
    var cursor1 = a.head;
    var cursor2 = b.head;

    while (cursor1 !== null && cursor2 !== null && cursor1.data.id === cursor2.data.id) {
        cursor1 = cursor1.next;
        cursor2 = cursor2.next;
    }

    return cursor1 === null && cursor2 === null;
}

function compareDeclarations(declarations1, declarations2) {
    var result = {
        eq: [],
        ne1: [],
        ne2: [],
        ne2overrided: []
    };

    var fingerprints = Object.create(null);
    var declarations2hash = Object.create(null);

    for (var cursor = declarations2.head; cursor; cursor = cursor.next)  {
        declarations2hash[cursor.data.id] = true;
    }

    for (var cursor = declarations1.head; cursor; cursor = cursor.next)  {
        var data = cursor.data;

        if (data.fingerprint) {
            fingerprints[data.fingerprint] = data.value.important;
        }

        if (declarations2hash[data.id]) {
            declarations2hash[data.id] = false;
            result.eq.push(data);
        } else {
            result.ne1.push(data);
        }
    }

    for (var cursor = declarations2.head; cursor; cursor = cursor.next)  {
        var data = cursor.data;

        if (declarations2hash[data.id]) {
            // if declarations1 has overriding declaration, this is not a difference
            // but take in account !important - prev should be equal or greater than follow
            if (hasOwnProperty.call(fingerprints, data.fingerprint) &&
                Number(fingerprints[data.fingerprint]) >= Number(data.value.important)) {
                result.ne2overrided.push(data);
            } else {
                result.ne2.push(data);
            }
        }
    }

    return result;
}

function addSelectors(dest, source) {
    source.each(function(sourceData) {
        var newStr = sourceData.id;
        var cursor = dest.head;

        while (cursor) {
            var nextStr = cursor.data.id;

            if (nextStr === newStr) {
                return;
            }

            if (nextStr > newStr) {
                break;
            }

            cursor = cursor.next;
        }

        dest.insert(dest.createItem(sourceData), cursor);
    });

    return dest;
}

// check if simpleselectors has no equal specificity and element selector
function hasSimilarSelectors(selectors1, selectors2) {
    return selectors1.some(function(a) {
        return selectors2.some(function(b) {
            return a.compareMarker === b.compareMarker;
        });
    });
}

// test node can't to be skipped
function unsafeToSkipNode(node) {
    switch (node.type) {
        case 'Ruleset':
            // unsafe skip ruleset with selector similarities
            return hasSimilarSelectors(node.selector.selectors, this);

        case 'Atrule':
            // can skip at-rules with blocks
            if (node.block) {
                // non-stylesheet blocks are safe to skip since have no selectors
                if (node.block.type !== 'StyleSheet') {
                    return false;
                }

                // unsafe skip at-rule if block contains something unsafe to skip
                return node.block.rules.some(unsafeToSkipNode, this);
            }
            break;
    }

    // unsafe by default
    return true;
}

module.exports = {
    isEqualLists: isEqualLists,
    isEqualDeclarations: isEqualDeclarations,
    compareDeclarations: compareDeclarations,
    addSelectors: addSelectors,
    hasSimilarSelectors: hasSimilarSelectors,
    unsafeToSkipNode: unsafeToSkipNode
};

},{}],41:[function(require,module,exports){
var hasOwnProperty = Object.prototype.hasOwnProperty;

function buildMap(list, caseInsensitive) {
    var map = Object.create(null);

    if (!Array.isArray(list)) {
        return false;
    }

    for (var i = 0; i < list.length; i++) {
        var name = list[i];

        if (caseInsensitive) {
            name = name.toLowerCase();
        }

        map[name] = true;
    }

    return map;
}

function buildIndex(data) {
    var scopes = false;

    if (data.scopes && Array.isArray(data.scopes)) {
        scopes = Object.create(null);

        for (var i = 0; i < data.scopes.length; i++) {
            var list = data.scopes[i];

            if (!list || !Array.isArray(list)) {
                throw new Error('Wrong usage format');
            }

            for (var j = 0; j < list.length; j++) {
                var name = list[j];

                if (hasOwnProperty.call(scopes, name)) {
                    throw new Error('Class can\'t be used for several scopes: ' + name);
                }

                scopes[name] = i + 1;
            }
        }
    }

    return {
        tags: buildMap(data.tags, true),
        ids: buildMap(data.ids),
        classes: buildMap(data.classes),
        scopes: scopes
    };
}

module.exports = {
    buildIndex: buildIndex
};

},{}],42:[function(require,module,exports){
var parse = require('./parser');
var compress = require('./compressor');
var translate = require('./utils/translate');
var translateWithSourceMap = require('./utils/translateWithSourceMap');
var walkers = require('./utils/walk');
var clone = require('./utils/clone');
var List = require('./utils/list');

function debugOutput(name, options, startTime, data) {
    if (options.debug) {
        console.error('## ' + name + ' done in %d ms\n', Date.now() - startTime);
    }

    return data;
}

function createDefaultLogger(level) {
    var lastDebug;

    return function logger(title, ast) {
        var line = title;

        if (ast) {
            line = '[' + ((Date.now() - lastDebug) / 1000).toFixed(3) + 's] ' + line;
        }

        if (level > 1 && ast) {
            var css = translate(ast, true);

            // when level 2, limit css to 256 symbols
            if (level === 2 && css.length > 256) {
                css = css.substr(0, 256) + '...';
            }

            line += '\n  ' + css + '\n';
        }

        console.error(line);
        lastDebug = Date.now();
    };
}

function copy(obj) {
    var result = {};

    for (var key in obj) {
        result[key] = obj[key];
    }

    return result;
}

function buildCompressOptions(options) {
    options = copy(options);

    if (typeof options.logger !== 'function' && options.debug) {
        options.logger = createDefaultLogger(options.debug);
    }

    return options;
}

function runHandler(ast, options, handlers) {
    if (!Array.isArray(handlers)) {
        handlers = [handlers];
    }

    handlers.forEach(function(fn) {
        fn(ast, options);
    });
}

function minify(context, source, options) {
    options = options || {};

    var filename = options.filename || '<unknown>';
    var result;

    // parse
    var ast = debugOutput('parsing', options, Date.now(),
        parse(source, {
            context: context,
            filename: filename,
            positions: Boolean(options.sourceMap)
        })
    );

    // before compress handlers
    if (options.beforeCompress) {
        debugOutput('beforeCompress', options, Date.now(),
            runHandler(ast, options, options.beforeCompress)
        );
    }

    // compress
    var compressResult = debugOutput('compress', options, Date.now(),
        compress(ast, buildCompressOptions(options))
    );

    // after compress handlers
    if (options.afterCompress) {
        debugOutput('afterCompress', options, Date.now(),
            runHandler(compressResult, options, options.afterCompress)
        );
    }

    // translate
    if (options.sourceMap) {
        result = debugOutput('translateWithSourceMap', options, Date.now(), (function() {
            var tmp = translateWithSourceMap(compressResult.ast);
            tmp.map._file = filename; // since other tools can relay on file in source map transform chain
            tmp.map.setSourceContent(filename, source);
            return tmp;
        })());
    } else {
        result = debugOutput('translate', options, Date.now(), {
            css: translate(compressResult.ast),
            map: null
        });
    }

    return result;
}

function minifyStylesheet(source, options) {
    return minify('stylesheet', source, options);
};

function minifyBlock(source, options) {
    return minify('block', source, options);
}

module.exports = {
    version: require('../package.json').version,

    // classes
    List: List,

    // main methods
    minify: minifyStylesheet,
    minifyBlock: minifyBlock,

    // step by step
    parse: parse,
    compress: compress,
    translate: translate,
    translateWithSourceMap: translateWithSourceMap,

    // walkers
    walk: walkers.all,
    walkRules: walkers.rules,
    walkRulesRight: walkers.rulesRight,

    // utils
    clone: clone
};

},{"../package.json":52,"./compressor":27,"./parser":44,"./utils/clone":46,"./utils/list":47,"./utils/translate":49,"./utils/translateWithSourceMap":50,"./utils/walk":51}],43:[function(require,module,exports){
exports.TokenType = {
    String: 'String',
    Comment: 'Comment',
    Unknown: 'Unknown',
    Newline: 'Newline',
    Space: 'Space',
    Tab: 'Tab',
    ExclamationMark: 'ExclamationMark',         // !
    QuotationMark: 'QuotationMark',             // "
    NumberSign: 'NumberSign',                   // #
    DollarSign: 'DollarSign',                   // $
    PercentSign: 'PercentSign',                 // %
    Ampersand: 'Ampersand',                     // &
    Apostrophe: 'Apostrophe',                   // '
    LeftParenthesis: 'LeftParenthesis',         // (
    RightParenthesis: 'RightParenthesis',       // )
    Asterisk: 'Asterisk',                       // *
    PlusSign: 'PlusSign',                       // +
    Comma: 'Comma',                             // ,
    HyphenMinus: 'HyphenMinus',                 // -
    FullStop: 'FullStop',                       // .
    Solidus: 'Solidus',                         // /
    Colon: 'Colon',                             // :
    Semicolon: 'Semicolon',                     // ;
    LessThanSign: 'LessThanSign',               // <
    EqualsSign: 'EqualsSign',                   // =
    GreaterThanSign: 'GreaterThanSign',         // >
    QuestionMark: 'QuestionMark',               // ?
    CommercialAt: 'CommercialAt',               // @
    LeftSquareBracket: 'LeftSquareBracket',     // [
    ReverseSolidus: 'ReverseSolidus',           // \
    RightSquareBracket: 'RightSquareBracket',   // ]
    CircumflexAccent: 'CircumflexAccent',       // ^
    LowLine: 'LowLine',                         // _
    LeftCurlyBracket: 'LeftCurlyBracket',       // {
    VerticalLine: 'VerticalLine',               // |
    RightCurlyBracket: 'RightCurlyBracket',     // }
    Tilde: 'Tilde',                             // ~
    Identifier: 'Identifier',
    DecimalNumber: 'DecimalNumber'
};

// var i = 1;
// for (var key in exports.TokenType) {
//     exports.TokenType[key] = i++;
// }

},{}],44:[function(require,module,exports){
'use strict';

var TokenType = require('./const').TokenType;
var Scanner = require('./scanner');
var List = require('../utils/list');
var needPositions;
var filename;
var scanner;

var SCOPE_ATRULE_EXPRESSION = 1;
var SCOPE_SELECTOR = 2;
var SCOPE_VALUE = 3;

var specialFunctions = {};
specialFunctions[SCOPE_ATRULE_EXPRESSION] = {
    url: getUri
};
specialFunctions[SCOPE_SELECTOR] = {
    url: getUri,
    not: getNotFunction
};
specialFunctions[SCOPE_VALUE] = {
    url: getUri,
    expression: getOldIEExpression,
    var: getVarFunction
};

var initialContext = {
    stylesheet: getStylesheet,
    atrule: getAtrule,
    atruleExpression: getAtruleExpression,
    ruleset: getRuleset,
    selector: getSelector,
    simpleSelector: getSimpleSelector,
    block: getBlock,
    declaration: getDeclaration,
    value: getValue
};

var blockMode = {
    'declaration': true,
    'property': true
};

function parseError(message) {
    var error = new Error(message);
    var offset = 0;
    var line = 1;
    var column = 1;
    var lines;

    if (scanner.token !== null) {
        offset = scanner.token.offset;
        line = scanner.token.line;
        column = scanner.token.column;
    } else if (scanner.prevToken !== null) {
        lines = scanner.prevToken.value.trimRight();
        offset = scanner.prevToken.offset + lines.length;
        lines = lines.split(/\n|\r\n?|\f/);
        line = scanner.prevToken.line + lines.length - 1;
        column = lines.length > 1
            ? lines[lines.length - 1].length + 1
            : scanner.prevToken.column + lines[lines.length - 1].length;
    }

    error.name = 'CssSyntaxError';
    error.parseError = {
        offset: offset,
        line: line,
        column: column
    };

    throw error;
}

function eat(tokenType) {
    if (scanner.token !== null && scanner.token.type === tokenType) {
        scanner.next();
        return true;
    }

    parseError(tokenType + ' is expected');
}

function expectIdentifier(name, eat) {
    if (scanner.token !== null) {
        if (scanner.token.type === TokenType.Identifier &&
            scanner.token.value.toLowerCase() === name) {
            if (eat) {
                scanner.next();
            }

            return true;
        }
    }

    parseError('Identifier `' + name + '` is expected');
}

function expectAny(what) {
    if (scanner.token !== null) {
        for (var i = 1, type = scanner.token.type; i < arguments.length; i++) {
            if (type === arguments[i]) {
                return true;
            }
        }
    }

    parseError(what + ' is expected');
}

function getInfo() {
    if (needPositions && scanner.token) {
        return {
            source: filename,
            offset: scanner.token.offset,
            line: scanner.token.line,
            column: scanner.token.column
        };
    }

    return null;

}

function removeTrailingSpaces(list) {
    while (list.tail) {
        if (list.tail.data.type === 'Space') {
            list.remove(list.tail);
        } else {
            break;
        }
    }
}

function getStylesheet(nested) {
    var child = null;
    var node = {
        type: 'StyleSheet',
        info: getInfo(),
        rules: new List()
    };

    scan:
    while (scanner.token !== null) {
        switch (scanner.token.type) {
            case TokenType.Space:
                scanner.next();
                child = null;
                break;

            case TokenType.Comment:
                // ignore comments except exclamation comments on top level
                if (nested || scanner.token.value.charAt(2) !== '!') {
                    scanner.next();
                    child = null;
                } else {
                    child = getComment();
                }
                break;

            case TokenType.Unknown:
                child = getUnknown();
                break;

            case TokenType.CommercialAt:
                child = getAtrule();
                break;

            case TokenType.RightCurlyBracket:
                if (!nested) {
                    parseError('Unexpected right curly brace');
                }

                break scan;

            default:
                child = getRuleset();
        }

        if (child !== null) {
            node.rules.insert(List.createItem(child));
        }
    }

    return node;
}

// '//' ...
// TODO: remove it as wrong thing
function getUnknown() {
    var info = getInfo();
    var value = scanner.token.value;

    eat(TokenType.Unknown);

    return {
        type: 'Unknown',
        info: info,
        value: value
    };
}

function isBlockAtrule() {
    for (var offset = 1, cursor; cursor = scanner.lookup(offset); offset++) {
        var type = cursor.type;

        if (type === TokenType.RightCurlyBracket) {
            return true;
        }

        if (type === TokenType.LeftCurlyBracket ||
            type === TokenType.CommercialAt) {
            return false;
        }
    }

    return true;
}

function getAtruleExpression() {
    var child = null;
    var node = {
        type: 'AtruleExpression',
        info: getInfo(),
        sequence: new List()
    };

    scan:
    while (scanner.token !== null) {
        switch (scanner.token.type) {
            case TokenType.Semicolon:
                break scan;

            case TokenType.LeftCurlyBracket:
                break scan;

            case TokenType.Space:
                if (node.sequence.isEmpty()) {
                    scanner.next(); // ignore spaces in beginning
                    child = null;
                } else {
                    child = getS();
                }
                break;

            case TokenType.Comment: // ignore comments
                scanner.next();
                child = null;
                break;

            case TokenType.Comma:
                child = getOperator();
                break;

            case TokenType.Colon:
                child = getPseudo();
                break;

            case TokenType.LeftParenthesis:
                child = getBraces(SCOPE_ATRULE_EXPRESSION);
                break;

            default:
                child = getAny(SCOPE_ATRULE_EXPRESSION);
        }

        if (child !== null) {
            node.sequence.insert(List.createItem(child));
        }
    }

    removeTrailingSpaces(node.sequence);

    return node;
}

function getAtrule() {
    eat(TokenType.CommercialAt);

    var node = {
        type: 'Atrule',
        info: getInfo(),
        name: readIdent(false),
        expression: getAtruleExpression(),
        block: null
    };

    if (scanner.token !== null) {
        switch (scanner.token.type) {
            case TokenType.Semicolon:
                scanner.next();  // {
                break;

            case TokenType.LeftCurlyBracket:
                scanner.next();  // {

                if (isBlockAtrule()) {
                    node.block = getBlock();
                } else {
                    node.block = getStylesheet(true);
                }

                eat(TokenType.RightCurlyBracket);
                break;

            default:
                parseError('Unexpected input');
        }
    }

    return node;
}

function getRuleset() {
    return {
        type: 'Ruleset',
        info: getInfo(),
        selector: getSelector(),
        block: getBlockWithBrackets()
    };
}

function getSelector() {
    var isBadSelector = false;
    var lastComma = true;
    var node = {
        type: 'Selector',
        info: getInfo(),
        selectors: new List()
    };

    scan:
    while (scanner.token !== null) {
        switch (scanner.token.type) {
            case TokenType.LeftCurlyBracket:
                break scan;

            case TokenType.Comma:
                if (lastComma) {
                    isBadSelector = true;
                }

                lastComma = true;
                scanner.next();
                break;

            default:
                if (!lastComma) {
                    isBadSelector = true;
                }

                lastComma = false;
                node.selectors.insert(List.createItem(getSimpleSelector()));

                if (node.selectors.tail.data.sequence.isEmpty()) {
                    isBadSelector = true;
                }
        }
    }

    if (lastComma) {
        isBadSelector = true;
        // parseError('Unexpected trailing comma');
    }

    if (isBadSelector) {
        node.selectors = new List();
    }

    return node;
}

function getSimpleSelector(nested) {
    var child = null;
    var combinator = null;
    var node = {
        type: 'SimpleSelector',
        info: getInfo(),
        sequence: new List()
    };

    scan:
    while (scanner.token !== null) {
        switch (scanner.token.type) {
            case TokenType.Comma:
                break scan;

            case TokenType.LeftCurlyBracket:
                if (nested) {
                    parseError('Unexpected input');
                }

                break scan;

            case TokenType.RightParenthesis:
                if (!nested) {
                    parseError('Unexpected input');
                }

                break scan;

            case TokenType.Comment:
                scanner.next();
                child = null;
                break;

            case TokenType.Space:
                child = null;
                if (!combinator && node.sequence.head) {
                    combinator = getCombinator();
                } else {
                    scanner.next();
                }
                break;

            case TokenType.PlusSign:
            case TokenType.GreaterThanSign:
            case TokenType.Tilde:
            case TokenType.Solidus:
                if (combinator && combinator.name !== ' ') {
                    parseError('Unexpected combinator');
                }

                child = null;
                combinator = getCombinator();
                break;

            case TokenType.FullStop:
                child = getClass();
                break;

            case TokenType.LeftSquareBracket:
                child = getAttribute();
                break;

            case TokenType.NumberSign:
                child = getShash();
                break;

            case TokenType.Colon:
                child = getPseudo();
                break;

            case TokenType.LowLine:
            case TokenType.Identifier:
            case TokenType.Asterisk:
                child = getNamespacedIdentifier(false);
                break;

            case TokenType.HyphenMinus:
            case TokenType.DecimalNumber:
                child = tryGetPercentage() || getNamespacedIdentifier(false);
                break;

            default:
                parseError('Unexpected input');
        }

        if (child !== null) {
            if (combinator !== null) {
                node.sequence.insert(List.createItem(combinator));
                combinator = null;
            }

            node.sequence.insert(List.createItem(child));
        }
    }

    if (combinator && combinator.name !== ' ') {
        parseError('Unexpected combinator');
    }

    return node;
}

function getDeclarations() {
    var child = null;
    var declarations = new List();

    scan:
    while (scanner.token !== null) {
        switch (scanner.token.type) {
            case TokenType.RightCurlyBracket:
                break scan;

            case TokenType.Space:
            case TokenType.Comment:
                scanner.next();
                child = null;
                break;

            case TokenType.Semicolon: // ;
                scanner.next();
                child = null;
                break;

            default:
                child = getDeclaration();
        }

        if (child !== null) {
            declarations.insert(List.createItem(child));
        }
    }

    return declarations;
}

function getBlockWithBrackets() {
    var info = getInfo();
    var node;

    eat(TokenType.LeftCurlyBracket);
    node = {
        type: 'Block',
        info: info,
        declarations: getDeclarations()
    };
    eat(TokenType.RightCurlyBracket);

    return node;
}

function getBlock() {
    return {
        type: 'Block',
        info: getInfo(),
        declarations: getDeclarations()
    };
}

function getDeclaration(nested) {
    var info = getInfo();
    var property = getProperty();
    var value;

    eat(TokenType.Colon);

    // check it's a filter
    if (/filter$/.test(property.name.toLowerCase()) && checkProgid()) {
        value = getFilterValue();
    } else {
        value = getValue(nested);
    }

    return {
        type: 'Declaration',
        info: info,
        property: property,
        value: value
    };
}

function getProperty() {
    var name = '';
    var node = {
        type: 'Property',
        info: getInfo(),
        name: null
    };

    for (; scanner.token !== null; scanner.next()) {
        var type = scanner.token.type;

        if (type !== TokenType.Solidus &&
            type !== TokenType.Asterisk &&
            type !== TokenType.DollarSign) {
            break;
        }

        name += scanner.token.value;
    }

    node.name = name + readIdent(true);

    readSC();

    return node;
}

function getValue(nested) {
    var child = null;
    var node = {
        type: 'Value',
        info: getInfo(),
        important: false,
        sequence: new List()
    };

    readSC();

    scan:
    while (scanner.token !== null) {
        switch (scanner.token.type) {
            case TokenType.RightCurlyBracket:
            case TokenType.Semicolon:
                break scan;

            case TokenType.RightParenthesis:
                if (!nested) {
                    parseError('Unexpected input');
                }
                break scan;

            case TokenType.Space:
                child = getS();
                break;

            case TokenType.Comment: // ignore comments
                scanner.next();
                child = null;
                break;

            case TokenType.NumberSign:
                child = getVhash();
                break;

            case TokenType.Solidus:
            case TokenType.Comma:
                child = getOperator();
                break;

            case TokenType.LeftParenthesis:
            case TokenType.LeftSquareBracket:
                child = getBraces(SCOPE_VALUE);
                break;

            case TokenType.ExclamationMark:
                node.important = getImportant();
                child = null;
                break;

            default:
                // check for unicode range: U+0F00, U+0F00-0FFF, u+0F00??
                if (scanner.token.type === TokenType.Identifier) {
                    var prefix = scanner.token.value;
                    if (prefix === 'U' || prefix === 'u') {
                        if (scanner.lookupType(1, TokenType.PlusSign)) {
                            scanner.next(); // U or u
                            scanner.next(); // +

                            child = {
                                type: 'Identifier',
                                info: getInfo(), // FIXME: wrong position
                                name: prefix + '+' + readUnicodeRange(true)
                            };
                        }
                        break;
                    }
                }

                child = getAny(SCOPE_VALUE);
        }

        if (child !== null) {
            node.sequence.insert(List.createItem(child));
        }
    }

    removeTrailingSpaces(node.sequence);

    return node;
}

// any = string | percentage | dimension | number | uri | functionExpression | funktion | unary | operator | ident
function getAny(scope) {
    switch (scanner.token.type) {
        case TokenType.String:
            return getString();

        case TokenType.LowLine:
        case TokenType.Identifier:
            break;

        case TokenType.FullStop:
        case TokenType.DecimalNumber:
        case TokenType.HyphenMinus:
        case TokenType.PlusSign:
            var number = tryGetNumber();

            if (number !== null) {
                if (scanner.token !== null) {
                    if (scanner.token.type === TokenType.PercentSign) {
                        return getPercentage(number);
                    } else if (scanner.token.type === TokenType.Identifier) {
                        return getDimension(number.value);
                    }
                }

                return number;
            }

            if (scanner.token.type === TokenType.HyphenMinus) {
                var next = scanner.lookup(1);
                if (next && (next.type === TokenType.Identifier || next.type === TokenType.HyphenMinus)) {
                    break;
                }
            }

            if (scanner.token.type === TokenType.HyphenMinus ||
                scanner.token.type === TokenType.PlusSign) {
                return getOperator();
            }

            parseError('Unexpected input');

        default:
            parseError('Unexpected input');
    }

    var ident = getIdentifier(false);

    if (scanner.token !== null && scanner.token.type === TokenType.LeftParenthesis) {
        return getFunction(scope, ident);
    }

    return ident;
}

function readAttrselector() {
    expectAny('Attribute selector (=, ~=, ^=, $=, *=, |=)',
        TokenType.EqualsSign,        // =
        TokenType.Tilde,             // ~=
        TokenType.CircumflexAccent,  // ^=
        TokenType.DollarSign,        // $=
        TokenType.Asterisk,          // *=
        TokenType.VerticalLine       // |=
    );

    var name;

    if (scanner.token.type === TokenType.EqualsSign) {
        name = '=';
        scanner.next();
    } else {
        name = scanner.token.value + '=';
        scanner.next();
        eat(TokenType.EqualsSign);
    }

    return name;
}

// '[' S* attrib_name ']'
// '[' S* attrib_name S* attrib_match S* [ IDENT | STRING ] S* attrib_flags? S* ']'
function getAttribute() {
    var node = {
        type: 'Attribute',
        info: getInfo(),
        name: null,
        operator: null,
        value: null,
        flags: null
    };

    eat(TokenType.LeftSquareBracket);

    readSC();

    node.name = getNamespacedIdentifier(true);

    readSC();

    if (scanner.token !== null && scanner.token.type !== TokenType.RightSquareBracket) {
        // avoid case `[name i]`
        if (scanner.token.type !== TokenType.Identifier) {
            node.operator = readAttrselector();

            readSC();

            if (scanner.token !== null && scanner.token.type === TokenType.String) {
                node.value = getString();
            } else {
                node.value = getIdentifier(false);
            }

            readSC();
        }

        // attribute flags
        if (scanner.token !== null && scanner.token.type === TokenType.Identifier) {
            node.flags = scanner.token.value;

            scanner.next();
            readSC();
        }
    }

    eat(TokenType.RightSquareBracket);

    return node;
}

function getBraces(scope) {
    var close;
    var child = null;
    var node = {
        type: 'Braces',
        info: getInfo(),
        open: scanner.token.value,
        close: null,
        sequence: new List()
    };

    if (scanner.token.type === TokenType.LeftParenthesis) {
        close = TokenType.RightParenthesis;
    } else {
        close = TokenType.RightSquareBracket;
    }

    // left brace
    scanner.next();

    readSC();

    scan:
    while (scanner.token !== null) {
        switch (scanner.token.type) {
            case close:
                node.close = scanner.token.value;
                break scan;

            case TokenType.Space:
                child = getS();
                break;

            case TokenType.Comment:
                scanner.next();
                child = null;
                break;

            case TokenType.NumberSign: // ??
                child = getVhash();
                break;

            case TokenType.LeftParenthesis:
            case TokenType.LeftSquareBracket:
                child = getBraces(scope);
                break;

            case TokenType.Solidus:
            case TokenType.Asterisk:
            case TokenType.Comma:
            case TokenType.Colon:
                child = getOperator();
                break;

            default:
                child = getAny(scope);
        }

        if (child !== null) {
            node.sequence.insert(List.createItem(child));
        }
    }

    removeTrailingSpaces(node.sequence);

    // right brace
    eat(close);

    return node;
}

// '.' ident
function getClass() {
    var info = getInfo();

    eat(TokenType.FullStop);

    return {
        type: 'Class',
        info: info,
        name: readIdent(false)
    };
}

// '#' ident
function getShash() {
    var info = getInfo();

    eat(TokenType.NumberSign);

    return {
        type: 'Id',
        info: info,
        name: readIdent(false)
    };
}

// + | > | ~ | /deep/
function getCombinator() {
    var info = getInfo();
    var combinator;

    switch (scanner.token.type) {
        case TokenType.Space:
            combinator = ' ';
            scanner.next();
            break;

        case TokenType.PlusSign:
        case TokenType.GreaterThanSign:
        case TokenType.Tilde:
            combinator = scanner.token.value;
            scanner.next();
            break;

        case TokenType.Solidus:
            combinator = '/deep/';
            scanner.next();

            expectIdentifier('deep', true);

            eat(TokenType.Solidus);
            break;

        default:
            parseError('Combinator (+, >, ~, /deep/) is expected');
    }

    return {
        type: 'Combinator',
        info: info,
        name: combinator
    };
}

// '/*' .* '*/'
function getComment() {
    var info = getInfo();
    var value = scanner.token.value;
    var len = value.length;

    if (len > 4 && value.charAt(len - 2) === '*' && value.charAt(len - 1) === '/') {
        len -= 2;
    }

    scanner.next();

    return {
        type: 'Comment',
        info: info,
        value: value.substring(2, len)
    };
}

// special reader for units to avoid adjoined IE hacks (i.e. '1px\9')
function readUnit() {
    if (scanner.token !== null && scanner.token.type === TokenType.Identifier) {
        var unit = scanner.token.value;
        var backSlashPos = unit.indexOf('\\');

        // no backslash in unit name
        if (backSlashPos === -1) {
            scanner.next();
            return unit;
        }

        // patch token
        scanner.token.value = unit.substr(backSlashPos);
        scanner.token.offset += backSlashPos;
        scanner.token.column += backSlashPos;

        // return unit w/o backslash part
        return unit.substr(0, backSlashPos);
    }

    parseError('Identifier is expected');
}

// number ident
function getDimension(number) {
    return {
        type: 'Dimension',
        info: getInfo(),
        value: number || readNumber(),
        unit: readUnit()
    };
}

// number "%"
function tryGetPercentage() {
    var number = tryGetNumber();

    if (number && scanner.token !== null && scanner.token.type === TokenType.PercentSign) {
        return getPercentage(number);
    }

    return null;
}

function getPercentage(number) {
    var info;

    if (!number) {
        info = getInfo();
        number = readNumber();
    } else {
        info = number.info;
        number = number.value;
    }

    eat(TokenType.PercentSign);

    return {
        type: 'Percentage',
        info: info,
        value: number
    };
}

// ident '(' functionBody ')' |
// not '(' <simpleSelector>* ')'
function getFunction(scope, ident) {
    var defaultArguments = getFunctionArguments;

    if (!ident) {
        ident = getIdentifier(false);
    }

    // parse special functions
    var name = ident.name.toLowerCase();

    if (specialFunctions.hasOwnProperty(scope)) {
        if (specialFunctions[scope].hasOwnProperty(name)) {
            return specialFunctions[scope][name](scope, ident);
        }
    }

    return getFunctionInternal(defaultArguments, scope, ident);
}

function getFunctionInternal(functionArgumentsReader, scope, ident) {
    var args;

    eat(TokenType.LeftParenthesis);
    args = functionArgumentsReader(scope);
    eat(TokenType.RightParenthesis);

    return {
        type: scope === SCOPE_SELECTOR ? 'FunctionalPseudo' : 'Function',
        info: ident.info,
        name: ident.name,
        arguments: args
    };
}

function getFunctionArguments(scope) {
    var args = new List();
    var argument = null;
    var child = null;

    readSC();

    scan:
    while (scanner.token !== null) {
        switch (scanner.token.type) {
            case TokenType.RightParenthesis:
                break scan;

            case TokenType.Space:
                child = getS();
                break;

            case TokenType.Comment: // ignore comments
                scanner.next();
                child = null;
                break;

            case TokenType.NumberSign: // TODO: not sure it should be here
                child = getVhash();
                break;

            case TokenType.LeftParenthesis:
            case TokenType.LeftSquareBracket:
                child = getBraces(scope);
                break;

            case TokenType.Comma:
                if (argument) {
                    removeTrailingSpaces(argument.sequence);
                } else {
                    args.insert(List.createItem({
                        type: 'Argument',
                        sequence: new List()
                    }));
                }
                scanner.next();
                readSC();
                argument = null;
                child = null;
                break;

            case TokenType.Solidus:
            case TokenType.Asterisk:
            case TokenType.Colon:
            case TokenType.EqualsSign:
                child = getOperator();
                break;

            default:
                child = getAny(scope);
        }

        if (argument === null) {
            argument = {
                type: 'Argument',
                sequence: new List()
            };
            args.insert(List.createItem(argument));
        }

        if (child !== null) {
            argument.sequence.insert(List.createItem(child));
        }
    }

    if (argument !== null) {
        removeTrailingSpaces(argument.sequence);
    }

    return args;
}

function getVarFunction(scope, ident) {
    return getFunctionInternal(getVarFunctionArguments, scope, ident);
}

function getNotFunctionArguments() {
    var args = new List();
    var wasSelector = false;

    scan:
    while (scanner.token !== null) {
        switch (scanner.token.type) {
            case TokenType.RightParenthesis:
                if (!wasSelector) {
                    parseError('Simple selector is expected');
                }

                break scan;

            case TokenType.Comma:
                if (!wasSelector) {
                    parseError('Simple selector is expected');
                }

                wasSelector = false;
                scanner.next();
                break;

            default:
                wasSelector = true;
                args.insert(List.createItem(getSimpleSelector(true)));
        }
    }

    return args;
}

function getNotFunction(scope, ident) {
    var args;

    eat(TokenType.LeftParenthesis);
    args = getNotFunctionArguments(scope);
    eat(TokenType.RightParenthesis);

    return {
        type: 'Negation',
        info: ident.info,
        // name: ident.name,  // TODO: add name?
        sequence: args        // FIXME: -> arguments?
    };
}

// var '(' ident (',' <declaration-value>)? ')'
function getVarFunctionArguments() { // TODO: special type Variable?
    var args = new List();

    readSC();

    args.insert(List.createItem({
        type: 'Argument',
        sequence: new List([getIdentifier(true)])
    }));

    readSC();

    if (scanner.token !== null && scanner.token.type === TokenType.Comma) {
        eat(TokenType.Comma);
        readSC();

        args.insert(List.createItem({
            type: 'Argument',
            sequence: new List([getValue(true)])
        }));

        readSC();
    }

    return args;
}

// url '(' ws* (string | raw) ws* ')'
function getUri(scope, ident) {
    var node = {
        type: 'Url',
        info: ident.info,
        // name: ident.name,
        value: null
    };

    eat(TokenType.LeftParenthesis); // (

    readSC();

    if (scanner.token.type === TokenType.String) {
        node.value = getString();
        readSC();
    } else {
        var rawInfo = getInfo();
        var raw = '';

        for (; scanner.token !== null; scanner.next()) {
            var type = scanner.token.type;

            if (type === TokenType.Space ||
                type === TokenType.LeftParenthesis ||
                type === TokenType.RightParenthesis) {
                break;
            }

            raw += scanner.token.value;
        }

        node.value = {
            type: 'Raw',
            info: rawInfo,
            value: raw
        };

        readSC();
    }

    eat(TokenType.RightParenthesis); // )

    return node;
}

// expression '(' raw ')'
function getOldIEExpression(scope, ident) {
    var balance = 0;
    var raw = '';

    eat(TokenType.LeftParenthesis);

    for (; scanner.token !== null; scanner.next()) {
        if (scanner.token.type === TokenType.RightParenthesis) {
            if (balance === 0) {
                break;
            }

            balance--;
        } else if (scanner.token.type === TokenType.LeftParenthesis) {
            balance++;
        }

        raw += scanner.token.value;
    }

    eat(TokenType.RightParenthesis);

    return {
        type: 'Function',
        info: ident.info,
        name: ident.name,
        arguments: new List([{
            type: 'Argument',
            sequence: new List([{
                type: 'Raw',
                value: raw
            }])
        }])
    };
}

function readUnicodeRange(tryNext) {
    var hex = '';

    for (; scanner.token !== null; scanner.next()) {
        if (scanner.token.type !== TokenType.DecimalNumber &&
            scanner.token.type !== TokenType.Identifier) {
            break;
        }

        hex += scanner.token.value;
    }

    if (!/^[0-9a-f]{1,6}$/i.test(hex)) {
        parseError('Unexpected input');
    }

    // U+abc???
    if (tryNext) {
        for (; hex.length < 6 && scanner.token !== null; scanner.next()) {
            if (scanner.token.type !== TokenType.QuestionMark) {
                break;
            }

            hex += scanner.token.value;
            tryNext = false;
        }
    }

    // U+aaa-bbb
    if (tryNext) {
        if (scanner.token !== null && scanner.token.type === TokenType.HyphenMinus) {
            scanner.next();

            var next = readUnicodeRange(false);

            if (!next) {
                parseError('Unexpected input');
            }

            hex += '-' + next;
        }
    }

    return hex;
}

function readIdent(varAllowed) {
    var name = '';

    // optional first -
    if (scanner.token !== null && scanner.token.type === TokenType.HyphenMinus) {
        name = '-';
        scanner.next();

        if (varAllowed && scanner.token !== null && scanner.token.type === TokenType.HyphenMinus) {
            name = '--';
            scanner.next();
        }
    }

    expectAny('Identifier',
        TokenType.LowLine,
        TokenType.Identifier
    );

    if (scanner.token !== null) {
        name += scanner.token.value;
        scanner.next();

        for (; scanner.token !== null; scanner.next()) {
            var type = scanner.token.type;

            if (type !== TokenType.LowLine &&
                type !== TokenType.Identifier &&
                type !== TokenType.DecimalNumber &&
                type !== TokenType.HyphenMinus) {
                break;
            }

            name += scanner.token.value;
        }
    }

    return name;
}

function getNamespacedIdentifier(checkColon) {
    if (scanner.token === null) {
        parseError('Unexpected end of input');
    }

    var info = getInfo();
    var name;

    if (scanner.token.type === TokenType.Asterisk) {
        checkColon = false;
        name = '*';
        scanner.next();
    } else {
        name = readIdent(false);
    }

    if (scanner.token !== null) {
        if (scanner.token.type === TokenType.VerticalLine &&
            scanner.lookupType(1, TokenType.EqualsSign) === false) {
            name += '|';

            if (scanner.next() !== null) {
                if (scanner.token.type === TokenType.HyphenMinus ||
                    scanner.token.type === TokenType.Identifier ||
                    scanner.token.type === TokenType.LowLine) {
                    name += readIdent(false);
                } else if (scanner.token.type === TokenType.Asterisk) {
                    checkColon = false;
                    name += '*';
                    scanner.next();
                }
            }
        }
    }

    if (checkColon && scanner.token !== null && scanner.token.type === TokenType.Colon) {
        scanner.next();
        name += ':' + readIdent(false);
    }

    return {
        type: 'Identifier',
        info: info,
        name: name
    };
}

function getIdentifier(varAllowed) {
    return {
        type: 'Identifier',
        info: getInfo(),
        name: readIdent(varAllowed)
    };
}

// ! ws* important
function getImportant() { // TODO?
    // var info = getInfo();

    eat(TokenType.ExclamationMark);

    readSC();

    // return {
    //     type: 'Identifier',
    //     info: info,
    //     name: readIdent(false)
    // };

    expectIdentifier('important');

    readIdent(false);

    // should return identifier in future for original source restoring as is
    // returns true for now since it's fit to optimizer purposes
    return true;
}

// odd | even | number? n
function getNth() {
    expectAny('Number, odd or even',
        TokenType.Identifier,
        TokenType.DecimalNumber
    );

    var info = getInfo();
    var value = scanner.token.value;
    var cmpValue;

    if (scanner.token.type === TokenType.DecimalNumber) {
        var next = scanner.lookup(1);
        if (next !== null &&
            next.type === TokenType.Identifier &&
            next.value.toLowerCase() === 'n') {
            value += next.value;
            scanner.next();
        }
    } else {
        var cmpValue = value.toLowerCase();
        if (cmpValue !== 'odd' && cmpValue !== 'even' && cmpValue !== 'n') {
            parseError('Unexpected identifier');
        }
    }

    scanner.next();

    return {
        type: 'Nth',
        info: info,
        value: value
    };
}

function getNthSelector() {
    var info = getInfo();
    var sequence = new List();
    var node;
    var child = null;

    eat(TokenType.Colon);
    expectIdentifier('nth', false);

    node = {
        type: 'FunctionalPseudo',
        info: info,
        name: readIdent(false),
        arguments: new List([{
            type: 'Argument',
            sequence: sequence
        }])
    };

    eat(TokenType.LeftParenthesis);

    scan:
    while (scanner.token !== null) {
        switch (scanner.token.type) {
            case TokenType.RightParenthesis:
                break scan;

            case TokenType.Space:
            case TokenType.Comment:
                scanner.next();
                child = null;
                break;

            case TokenType.HyphenMinus:
            case TokenType.PlusSign:
                child = getOperator();
                break;

            default:
                child = getNth();
        }

        if (child !== null) {
            sequence.insert(List.createItem(child));
        }
    }

    eat(TokenType.RightParenthesis);

    return node;
}

function readNumber() {
    var wasDigits = false;
    var number = '';
    var offset = 0;

    if (scanner.lookupType(offset, TokenType.HyphenMinus)) {
        number = '-';
        offset++;
    }

    if (scanner.lookupType(offset, TokenType.DecimalNumber)) {
        wasDigits = true;
        number += scanner.lookup(offset).value;
        offset++;
    }

    if (scanner.lookupType(offset, TokenType.FullStop)) {
        number += '.';
        offset++;
    }

    if (scanner.lookupType(offset, TokenType.DecimalNumber)) {
        wasDigits = true;
        number += scanner.lookup(offset).value;
        offset++;
    }

    if (wasDigits) {
        while (offset--) {
            scanner.next();
        }

        return number;
    }

    return null;
}

function tryGetNumber() {
    var info = getInfo();
    var number = readNumber();

    if (number !== null) {
        return {
            type: 'Number',
            info: info,
            value: number
        };
    }

    return null;
}

// '/' | '*' | ',' | ':' | '=' | '+' | '-'
// TODO: remove '=' since it's wrong operator, but theat as operator
// to make old things like `filter: alpha(opacity=0)` works
function getOperator() {
    var node = {
        type: 'Operator',
        info: getInfo(),
        value: scanner.token.value
    };

    scanner.next();

    return node;
}

function getFilterValue() { // TODO
    var progid;
    var node = {
        type: 'Value',
        info: getInfo(),
        important: false,
        sequence: new List()
    };

    while (progid = checkProgid()) {
        node.sequence.insert(List.createItem(getProgid(progid)));
    }

    readSC(node);

    if (scanner.token !== null && scanner.token.type === TokenType.ExclamationMark) {
        node.important = getImportant();
    }

    return node;
}

// 'progid:' ws* 'DXImageTransform.Microsoft.' ident ws* '(' .* ')'
function checkProgid() {
    function checkSC(offset) {
        for (var cursor; cursor = scanner.lookup(offset); offset++) {
            if (cursor.type !== TokenType.Space &&
                cursor.type !== TokenType.Comment) {
                break;
            }
        }

        return offset;
    }

    var offset = checkSC(0);

    if (scanner.lookup(offset + 1) === null ||
        scanner.lookup(offset + 0).value.toLowerCase() !== 'progid' ||
        scanner.lookup(offset + 1).type !== TokenType.Colon) {
        return false; // fail
    }

    offset += 2;
    offset = checkSC(offset);

    if (scanner.lookup(offset + 5) === null ||
        scanner.lookup(offset + 0).value.toLowerCase() !== 'dximagetransform' ||
        scanner.lookup(offset + 1).type !== TokenType.FullStop ||
        scanner.lookup(offset + 2).value.toLowerCase() !== 'microsoft' ||
        scanner.lookup(offset + 3).type !== TokenType.FullStop ||
        scanner.lookup(offset + 4).type !== TokenType.Identifier) {
        return false; // fail
    }

    offset += 5;
    offset = checkSC(offset);

    if (scanner.lookupType(offset, TokenType.LeftParenthesis) === false) {
        return false; // fail
    }

    for (var cursor; cursor = scanner.lookup(offset); offset++) {
        if (cursor.type === TokenType.RightParenthesis) {
            return cursor;
        }
    }

    return false;
}

function getProgid(progidEnd) {
    var value = '';
    var node = {
        type: 'Progid',
        info: getInfo(),
        value: null
    };

    if (!progidEnd) {
        progidEnd = checkProgid();
    }

    if (!progidEnd) {
        parseError('progid is expected');
    }

    readSC(node);

    var rawInfo = getInfo();
    for (; scanner.token && scanner.token !== progidEnd; scanner.next()) {
        value += scanner.token.value;
    }

    eat(TokenType.RightParenthesis);
    value += ')';

    node.value = {
        type: 'Raw',
        info: rawInfo,
        value: value
    };

    readSC(node);

    return node;
}

// <pseudo-element> | <nth-selector> | <pseudo-class>
function getPseudo() {
    var next = scanner.lookup(1);

    if (next === null) {
        scanner.next();
        parseError('Colon or identifier is expected');
    }

    if (next.type === TokenType.Colon) {
        return getPseudoElement();
    }

    if (next.type === TokenType.Identifier &&
        next.value.toLowerCase() === 'nth') {
        return getNthSelector();
    }

    return getPseudoClass();
}

// :: ident
function getPseudoElement() {
    var info = getInfo();

    eat(TokenType.Colon);
    eat(TokenType.Colon);

    return {
        type: 'PseudoElement',
        info: info,
        name: readIdent(false)
    };
}

// : ( ident | function )
function getPseudoClass() {
    var info = getInfo();
    var ident = eat(TokenType.Colon) && getIdentifier(false);

    if (scanner.token !== null && scanner.token.type === TokenType.LeftParenthesis) {
        return getFunction(SCOPE_SELECTOR, ident);
    }

    return {
        type: 'PseudoClass',
        info: info,
        name: ident.name
    };
}

// ws
function getS() {
    var node = {
        type: 'Space'
        // value: scanner.token.value
    };

    scanner.next();

    return node;
}

function readSC() {
    // var nodes = [];

    scan:
    while (scanner.token !== null) {
        switch (scanner.token.type) {
            case TokenType.Space:
                scanner.next();
                // nodes.push(getS());
                break;

            case TokenType.Comment:
                scanner.next();
                // nodes.push(getComment());
                break;

            default:
                break scan;
        }
    }

    return null;

    // return nodes.length ? new List(nodes) : null;
}

// node: String
function getString() {
    var node = {
        type: 'String',
        info: getInfo(),
        value: scanner.token.value
    };

    scanner.next();

    return node;
}

// # ident
function getVhash() {
    var info = getInfo();
    var value;

    eat(TokenType.NumberSign);

    expectAny('Number or identifier',
        TokenType.DecimalNumber,
        TokenType.Identifier
    );

    value = scanner.token.value;

    if (scanner.token.type === TokenType.DecimalNumber &&
        scanner.lookupType(1, TokenType.Identifier)) {
        scanner.next();
        value += scanner.token.value;
    }

    scanner.next();

    return {
        type: 'Hash',
        info: info,
        value: value
    };
}

module.exports = function parse(source, options) {
    var ast;

    if (!options || typeof options !== 'object') {
        options = {};
    }

    var context = options.context || 'stylesheet';
    needPositions = Boolean(options.positions);
    filename = options.filename || '<unknown>';

    if (!initialContext.hasOwnProperty(context)) {
        throw new Error('Unknown context `' + context + '`');
    }

    scanner = new Scanner(source, blockMode.hasOwnProperty(context), options.line, options.column);
    scanner.next();
    ast = initialContext[context]();

    scanner = null;

    // console.log(JSON.stringify(ast, null, 4));
    return ast;
};

},{"../utils/list":47,"./const":43,"./scanner":45}],45:[function(require,module,exports){
'use strict';

var TokenType = require('./const.js').TokenType;

var TAB = 9;
var N = 10;
var F = 12;
var R = 13;
var SPACE = 32;
var DOUBLE_QUOTE = 34;
var QUOTE = 39;
var RIGHT_PARENTHESIS = 41;
var STAR = 42;
var SLASH = 47;
var BACK_SLASH = 92;
var UNDERSCORE = 95;
var LEFT_CURLY_BRACE = 123;
var RIGHT_CURLY_BRACE = 125;

var WHITESPACE = 1;
var PUNCTUATOR = 2;
var DIGIT = 3;
var STRING = 4;

var PUNCTUATION = {
    9:  TokenType.Tab,                // '\t'
    10: TokenType.Newline,            // '\n'
    13: TokenType.Newline,            // '\r'
    32: TokenType.Space,              // ' '
    33: TokenType.ExclamationMark,    // '!'
    34: TokenType.QuotationMark,      // '"'
    35: TokenType.NumberSign,         // '#'
    36: TokenType.DollarSign,         // '$'
    37: TokenType.PercentSign,        // '%'
    38: TokenType.Ampersand,          // '&'
    39: TokenType.Apostrophe,         // '\''
    40: TokenType.LeftParenthesis,    // '('
    41: TokenType.RightParenthesis,   // ')'
    42: TokenType.Asterisk,           // '*'
    43: TokenType.PlusSign,           // '+'
    44: TokenType.Comma,              // ','
    45: TokenType.HyphenMinus,        // '-'
    46: TokenType.FullStop,           // '.'
    47: TokenType.Solidus,            // '/'
    58: TokenType.Colon,              // ':'
    59: TokenType.Semicolon,          // ';'
    60: TokenType.LessThanSign,       // '<'
    61: TokenType.EqualsSign,         // '='
    62: TokenType.GreaterThanSign,    // '>'
    63: TokenType.QuestionMark,       // '?'
    64: TokenType.CommercialAt,       // '@'
    91: TokenType.LeftSquareBracket,  // '['
    93: TokenType.RightSquareBracket, // ']'
    94: TokenType.CircumflexAccent,   // '^'
    95: TokenType.LowLine,            // '_'
    123: TokenType.LeftCurlyBracket,  // '{'
    124: TokenType.VerticalLine,      // '|'
    125: TokenType.RightCurlyBracket, // '}'
    126: TokenType.Tilde              // '~'
};
var SYMBOL_CATEGORY_LENGTH = Math.max.apply(null, Object.keys(PUNCTUATION)) + 1;
var SYMBOL_CATEGORY = new Uint32Array(SYMBOL_CATEGORY_LENGTH);
var IS_PUNCTUATOR = new Uint32Array(SYMBOL_CATEGORY_LENGTH);

// fill categories
Object.keys(PUNCTUATION).forEach(function(key) {
    SYMBOL_CATEGORY[Number(key)] = PUNCTUATOR;
    IS_PUNCTUATOR[Number(key)] = PUNCTUATOR;
}, SYMBOL_CATEGORY);

// don't treat as punctuator
IS_PUNCTUATOR[UNDERSCORE] = 0;

for (var i = 48; i <= 57; i++) {
    SYMBOL_CATEGORY[i] = DIGIT;
}

SYMBOL_CATEGORY[SPACE] = WHITESPACE;
SYMBOL_CATEGORY[TAB] = WHITESPACE;
SYMBOL_CATEGORY[N] = WHITESPACE;
SYMBOL_CATEGORY[R] = WHITESPACE;
SYMBOL_CATEGORY[F] = WHITESPACE;

SYMBOL_CATEGORY[QUOTE] = STRING;
SYMBOL_CATEGORY[DOUBLE_QUOTE] = STRING;

//
// scanner
//

var Scanner = function(source, initBlockMode, initLine, initColumn) {
    this.source = source;

    this.pos = source.charCodeAt(0) === 0xFEFF ? 1 : 0;
    this.eof = this.pos === this.source.length;
    this.line = typeof initLine === 'undefined' ? 1 : initLine;
    this.lineStartPos = typeof initColumn === 'undefined' ? -1 : -initColumn;

    this.minBlockMode = initBlockMode ? 1 : 0;
    this.blockMode = this.minBlockMode;
    this.urlMode = false;

    this.prevToken = null;
    this.token = null;
    this.buffer = [];
};

Scanner.prototype = {
    lookup: function(offset) {
        if (offset === 0) {
            return this.token;
        }

        for (var i = this.buffer.length; !this.eof && i < offset; i++) {
            this.buffer.push(this.getToken());
        }

        return offset <= this.buffer.length ? this.buffer[offset - 1] : null;
    },
    lookupType: function(offset, type) {
        var token = this.lookup(offset);

        return token !== null && token.type === type;
    },
    next: function() {
        var newToken = null;

        if (this.buffer.length !== 0) {
            newToken = this.buffer.shift();
        } else if (!this.eof) {
            newToken = this.getToken();
        }

        this.prevToken = this.token;
        this.token = newToken;

        return newToken;
    },

    tokenize: function() {
        var tokens = [];

        for (; this.pos < this.source.length; this.pos++) {
            tokens.push(this.getToken());
        }

        return tokens;
    },

    getToken: function() {
        var code = this.source.charCodeAt(this.pos);
        var line = this.line;
        var column = this.pos - this.lineStartPos;
        var offset = this.pos;
        var next;
        var type;
        var value;

        switch (code < SYMBOL_CATEGORY_LENGTH ? SYMBOL_CATEGORY[code] : 0) {
            case DIGIT:
                type = TokenType.DecimalNumber;
                value = this.readDecimalNumber();
                break;

            case STRING:
                type = TokenType.String;
                value = this.readString(code);
                break;

            case WHITESPACE:
                type = TokenType.Space;
                value = this.readSpaces();
                break;

            case PUNCTUATOR:
                if (code === SLASH) {
                    next = this.pos + 1 < this.source.length ? this.source.charCodeAt(this.pos + 1) : 0;

                    if (next === STAR) { // /*
                        type = TokenType.Comment;
                        value = this.readComment();
                        break;
                    } else if (next === SLASH && !this.urlMode) { // //
                        if (this.blockMode > 0) {
                            var skip = 2;

                            while (this.source.charCodeAt(this.pos + 2) === SLASH) {
                                skip++;
                            }

                            type = TokenType.Identifier;
                            value = this.readIdentifier(skip);

                            this.urlMode = this.urlMode || value === 'url';
                        } else {
                            type = TokenType.Unknown;
                            value = this.readUnknown();
                        }
                        break;
                    }
                }

                type = PUNCTUATION[code];
                value = String.fromCharCode(code);
                this.pos++;

                if (code === RIGHT_PARENTHESIS) {
                    this.urlMode = false;
                } else if (code === LEFT_CURLY_BRACE) {
                    this.blockMode++;
                } else if (code === RIGHT_CURLY_BRACE) {
                    if (this.blockMode > this.minBlockMode) {
                        this.blockMode--;
                    }
                }

                break;

            default:
                type = TokenType.Identifier;
                value = this.readIdentifier(0);

                this.urlMode = this.urlMode || value === 'url';
        }

        this.eof = this.pos === this.source.length;

        return {
            type: type,
            value: value,

            offset: offset,
            line: line,
            column: column
        };
    },

    isNewline: function(code) {
        if (code === N || code === F || code === R) {
            if (code === R && this.pos + 1 < this.source.length && this.source.charCodeAt(this.pos + 1) === N) {
                this.pos++;
            }

            this.line++;
            this.lineStartPos = this.pos;
            return true;
        }

        return false;
    },

    readSpaces: function() {
        var start = this.pos;

        for (; this.pos < this.source.length; this.pos++) {
            var code = this.source.charCodeAt(this.pos);

            if (!this.isNewline(code) && code !== SPACE && code !== TAB) {
                break;
            }
        }

        return this.source.substring(start, this.pos);
    },

    readComment: function() {
        var start = this.pos;

        for (this.pos += 2; this.pos < this.source.length; this.pos++) {
            var code = this.source.charCodeAt(this.pos);

            if (code === STAR) { // */
                if (this.source.charCodeAt(this.pos + 1) === SLASH) {
                    this.pos += 2;
                    break;
                }
            } else {
                this.isNewline(code);
            }
        }

        return this.source.substring(start, this.pos);
    },

    readUnknown: function() {
        var start = this.pos;

        for (this.pos += 2; this.pos < this.source.length; this.pos++) {
            if (this.isNewline(this.source.charCodeAt(this.pos), this.source)) {
                break;
            }
        }

        return this.source.substring(start, this.pos);
    },

    readString: function(quote) {
        var start = this.pos;
        var res = '';

        for (this.pos++; this.pos < this.source.length; this.pos++) {
            var code = this.source.charCodeAt(this.pos);

            if (code === BACK_SLASH) {
                var end = this.pos++;

                if (this.isNewline(this.source.charCodeAt(this.pos), this.source)) {
                    res += this.source.substring(start, end);
                    start = this.pos + 1;
                }
            } else if (code === quote) {
                this.pos++;
                break;
            }
        }

        return res + this.source.substring(start, this.pos);
    },

    readDecimalNumber: function() {
        var start = this.pos;
        var code;

        for (this.pos++; this.pos < this.source.length; this.pos++) {
            code = this.source.charCodeAt(this.pos);

            if (code < 48 || code > 57) {  // 0 .. 9
                break;
            }
        }

        return this.source.substring(start, this.pos);
    },

    readIdentifier: function(skip) {
        var start = this.pos;

        for (this.pos += skip; this.pos < this.source.length; this.pos++) {
            var code = this.source.charCodeAt(this.pos);

            if (code === BACK_SLASH) {
                this.pos++;

                // skip escaped unicode sequence that can ends with space
                // [0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?
                for (var i = 0; i < 7 && this.pos + i < this.source.length; i++) {
                    code = this.source.charCodeAt(this.pos + i);

                    if (i !== 6) {
                        if ((code >= 48 && code <= 57) ||  // 0 .. 9
                            (code >= 65 && code <= 70) ||  // A .. F
                            (code >= 97 && code <= 102)) { // a .. f
                            continue;
                        }
                    }

                    if (i > 0) {
                        this.pos += i - 1;
                        if (code === SPACE || code === TAB || this.isNewline(code)) {
                            this.pos++;
                        }
                    }

                    break;
                }
            } else if (code < SYMBOL_CATEGORY_LENGTH &&
                       IS_PUNCTUATOR[code] === PUNCTUATOR) {
                break;
            }
        }

        return this.source.substring(start, this.pos);
    }
};

// warm up tokenizer to elimitate code branches that never execute
// fix soft deoptimizations (insufficient type feedback)
new Scanner('\n\r\r\n\f//""\'\'/**/1a;.{url(a)}').lookup(1e3);

module.exports = Scanner;

},{"./const.js":43}],46:[function(require,module,exports){
var List = require('./list');

module.exports = function clone(node) {
    var result = {};

    for (var key in node) {
        var value = node[key];

        if (value) {
            if (Array.isArray(value)) {
                value = value.slice(0);
            } else if (value instanceof List) {
                value = new List(value.map(clone));
            } else if (value.constructor === Object) {
                value = clone(value);
            }
        }

        result[key] = value;
    }

    return result;
};

},{"./list":47}],47:[function(require,module,exports){
//
//            item        item        item        item
//          /------\    /------\    /------\    /------\
//          | data |    | data |    | data |    | data |
//  null <--+-prev |<---+-prev |<---+-prev |<---+-prev |
//          | next-+--->| next-+--->| next-+--->| next-+--> null
//          \------/    \------/    \------/    \------/
//             ^                                    ^
//             |                list                |
//             |              /------\              |
//             \--------------+-head |              |
//                            | tail-+--------------/
//                            \------/
//

function createItem(data) {
    return {
        data: data,
        next: null,
        prev: null
    };
}

var List = function(values) {
    this.cursor = null;
    this.head = null;
    this.tail = null;

    if (Array.isArray(values)) {
        var cursor = null;

        for (var i = 0; i < values.length; i++) {
            var item = createItem(values[i]);

            if (cursor !== null) {
                cursor.next = item;
            } else {
                this.head = item;
            }

            item.prev = cursor;
            cursor = item;
        }

        this.tail = cursor;
    }
};

Object.defineProperty(List.prototype, 'size', {
    get: function() {
        var size = 0;
        var cursor = this.head;

        while (cursor) {
            size++;
            cursor = cursor.next;
        }

        return size;
    }
});

List.createItem = createItem;
List.prototype.createItem = createItem;

List.prototype.toArray = function() {
    var cursor = this.head;
    var result = [];

    while (cursor) {
        result.push(cursor.data);
        cursor = cursor.next;
    }

    return result;
};
List.prototype.toJSON = function() {
    return this.toArray();
};

List.prototype.isEmpty = function() {
    return this.head === null;
};

List.prototype.first = function() {
    return this.head && this.head.data;
};

List.prototype.last = function() {
    return this.tail && this.tail.data;
};

List.prototype.each = function(fn, context) {
    var item;
    var cursor = {
        prev: null,
        next: this.head,
        cursor: this.cursor
    };

    if (context === undefined) {
        context = this;
    }

    // push cursor
    this.cursor = cursor;

    while (cursor.next !== null) {
        item = cursor.next;
        cursor.next = item.next;

        fn.call(context, item.data, item, this);
    }

    // pop cursor
    this.cursor = this.cursor.cursor;
};

List.prototype.eachRight = function(fn, context) {
    var item;
    var cursor = {
        prev: this.tail,
        next: null,
        cursor: this.cursor
    };

    if (context === undefined) {
        context = this;
    }

    // push cursor
    this.cursor = cursor;

    while (cursor.prev !== null) {
        item = cursor.prev;
        cursor.prev = item.prev;

        fn.call(context, item.data, item, this);
    }

    // pop cursor
    this.cursor = this.cursor.cursor;
};

List.prototype.nextUntil = function(start, fn, context) {
    if (start === null) {
        return;
    }

    var item;
    var cursor = {
        prev: null,
        next: start,
        cursor: this.cursor
    };

    if (context === undefined) {
        context = this;
    }

    // push cursor
    this.cursor = cursor;

    while (cursor.next !== null) {
        item = cursor.next;
        cursor.next = item.next;

        if (fn.call(context, item.data, item, this)) {
            break;
        }
    }

    // pop cursor
    this.cursor = this.cursor.cursor;
};

List.prototype.prevUntil = function(start, fn, context) {
    if (start === null) {
        return;
    }

    var item;
    var cursor = {
        prev: start,
        next: null,
        cursor: this.cursor
    };

    if (context === undefined) {
        context = this;
    }

    // push cursor
    this.cursor = cursor;

    while (cursor.prev !== null) {
        item = cursor.prev;
        cursor.prev = item.prev;

        if (fn.call(context, item.data, item, this)) {
            break;
        }
    }

    // pop cursor
    this.cursor = this.cursor.cursor;
};

List.prototype.some = function(fn, context) {
    var cursor = this.head;

    if (context === undefined) {
        context = this;
    }

    while (cursor !== null) {
        if (fn.call(context, cursor.data, cursor, this)) {
            return true;
        }

        cursor = cursor.next;
    }

    return false;
};

List.prototype.map = function(fn, context) {
    var result = [];
    var cursor = this.head;

    if (context === undefined) {
        context = this;
    }

    while (cursor !== null) {
        result.push(fn.call(context, cursor.data, cursor, this));
        cursor = cursor.next;
    }

    return result;
};

List.prototype.copy = function() {
    var result = new List();
    var cursor = this.head;

    while (cursor !== null) {
        result.insert(createItem(cursor.data));
        cursor = cursor.next;
    }

    return result;
};

List.prototype.updateCursors = function(prevOld, prevNew, nextOld, nextNew) {
    var cursor = this.cursor;

    while (cursor !== null) {
        if (prevNew === true || cursor.prev === prevOld) {
            cursor.prev = prevNew;
        }

        if (nextNew === true || cursor.next === nextOld) {
            cursor.next = nextNew;
        }

        cursor = cursor.cursor;
    }
};

List.prototype.insert = function(item, before) {
    if (before !== undefined && before !== null) {
        // prev   before
        //      ^
        //     item
        this.updateCursors(before.prev, item, before, item);

        if (before.prev === null) {
            // insert to the beginning of list
            if (this.head !== before) {
                throw new Error('before doesn\'t below to list');
            }

            // since head points to before therefore list doesn't empty
            // no need to check tail
            this.head = item;
            before.prev = item;
            item.next = before;

            this.updateCursors(null, item);
        } else {

            // insert between two items
            before.prev.next = item;
            item.prev = before.prev;

            before.prev = item;
            item.next = before;
        }
    } else {
        // tail
        //      ^
        //     item
        this.updateCursors(this.tail, item, null, item);

        // insert to end of the list
        if (this.tail !== null) {
            // if list has a tail, then it also has a head, but head doesn't change

            // last item -> new item
            this.tail.next = item;

            // last item <- new item
            item.prev = this.tail;
        } else {
            // if list has no a tail, then it also has no a head
            // in this case points head to new item
            this.head = item;
        }

        // tail always start point to new item
        this.tail = item;
    }
};

List.prototype.remove = function(item) {
    //      item
    //       ^
    // prev     next
    this.updateCursors(item, item.prev, item, item.next);

    if (item.prev !== null) {
        item.prev.next = item.next;
    } else {
        if (this.head !== item) {
            throw new Error('item doesn\'t below to list');
        }

        this.head = item.next;
    }

    if (item.next !== null) {
        item.next.prev = item.prev;
    } else {
        if (this.tail !== item) {
            throw new Error('item doesn\'t below to list');
        }

        this.tail = item.prev;
    }

    item.prev = null;
    item.next = null;

    return item;
};

List.prototype.appendList = function(list) {
    // ignore empty lists
    if (list.head === null) {
        return;
    }

    this.updateCursors(this.tail, list.tail, null, list.head);

    // insert to end of the list
    if (this.tail !== null) {
        // if destination list has a tail, then it also has a head,
        // but head doesn't change

        // dest tail -> source head
        this.tail.next = list.head;

        // dest tail <- source head
        list.head.prev = this.tail;
    } else {
        // if list has no a tail, then it also has no a head
        // in this case points head to new item
        this.head = list.head;
    }

    // tail always start point to new item
    this.tail = list.tail;

    list.head = null;
    list.tail = null;
};

module.exports = List;

},{}],48:[function(require,module,exports){
var hasOwnProperty = Object.prototype.hasOwnProperty;
var knownKeywords = Object.create(null);
var knownProperties = Object.create(null);

function getVendorPrefix(string) {
    if (string[0] === '-') {
        // skip 2 chars to avoid wrong match with variables names
        var secondDashIndex = string.indexOf('-', 2);

        if (secondDashIndex !== -1) {
            return string.substr(0, secondDashIndex + 1);
        }
    }

    return '';
}

function getKeywordInfo(keyword) {
    if (hasOwnProperty.call(knownKeywords, keyword)) {
        return knownKeywords[keyword];
    }

    var lowerCaseKeyword = keyword.toLowerCase();
    var vendor = getVendorPrefix(lowerCaseKeyword);
    var name = lowerCaseKeyword;

    if (vendor) {
        name = name.substr(vendor.length);
    }

    return knownKeywords[keyword] = Object.freeze({
        vendor: vendor,
        prefix: vendor,
        name: name
    });
}

function getPropertyInfo(property) {
    if (hasOwnProperty.call(knownProperties, property)) {
        return knownProperties[property];
    }

    var lowerCaseProperty = property.toLowerCase();
    var hack = lowerCaseProperty[0];

    if (hack === '*' || hack === '_' || hack === '$') {
        lowerCaseProperty = lowerCaseProperty.substr(1);
    } else if (hack === '/' && property[1] === '/') {
        hack = '//';
        lowerCaseProperty = lowerCaseProperty.substr(2);
    } else {
        hack = '';
    }

    var vendor = getVendorPrefix(lowerCaseProperty);
    var name = lowerCaseProperty;

    if (vendor) {
        name = name.substr(vendor.length);
    }

    return knownProperties[property] = Object.freeze({
        hack: hack,
        vendor: vendor,
        prefix: hack + vendor,
        name: name
    });
}

module.exports = {
    keyword: getKeywordInfo,
    property: getPropertyInfo
};

},{}],49:[function(require,module,exports){
function each(list) {
    if (list.head === null) {
        return '';
    }

    if (list.head === list.tail) {
        return translate(list.head.data);
    }

    return list.map(translate).join('');
}

function eachDelim(list, delimeter) {
    if (list.head === null) {
        return '';
    }

    if (list.head === list.tail) {
        return translate(list.head.data);
    }

    return list.map(translate).join(delimeter);
}

function translate(node) {
    switch (node.type) {
        case 'StyleSheet':
            return each(node.rules);

        case 'Atrule':
            var nodes = ['@', node.name];

            if (node.expression && !node.expression.sequence.isEmpty()) {
                nodes.push(' ', translate(node.expression));
            }

            if (node.block) {
                nodes.push('{', translate(node.block), '}');
            } else {
                nodes.push(';');
            }

            return nodes.join('');

        case 'Ruleset':
            return translate(node.selector) + '{' + translate(node.block) + '}';

        case 'Selector':
            return eachDelim(node.selectors, ',');

        case 'SimpleSelector':
            var nodes = node.sequence.map(function(node) {
                // add extra spaces around /deep/ combinator since comment beginning/ending may to be produced
                if (node.type === 'Combinator' && node.name === '/deep/') {
                    return ' ' + translate(node) + ' ';
                }

                return translate(node);
            });

            return nodes.join('');

        case 'Block':
            return eachDelim(node.declarations, ';');

        case 'Declaration':
            return translate(node.property) + ':' + translate(node.value);

        case 'Property':
            return node.name;

        case 'Value':
            return node.important
                ? each(node.sequence) + '!important'
                : each(node.sequence);

        case 'Attribute':
            var result = translate(node.name);
            var flagsPrefix = ' ';

            if (node.operator !== null) {
                result += node.operator;

                if (node.value !== null) {
                    result += translate(node.value);

                    // space between string and flags is not required
                    if (node.value.type === 'String') {
                        flagsPrefix = '';
                    }
                }
            }

            if (node.flags !== null) {
                result += flagsPrefix + node.flags;
            }

            return '[' + result + ']';

        case 'FunctionalPseudo':
            return ':' + node.name + '(' + eachDelim(node.arguments, ',') + ')';

        case 'Function':
            return node.name + '(' + eachDelim(node.arguments, ',') + ')';

        case 'Negation':
            return ':not(' + eachDelim(node.sequence, ',') + ')';

        case 'Braces':
            return node.open + each(node.sequence) + node.close;

        case 'Argument':
        case 'AtruleExpression':
            return each(node.sequence);

        case 'Url':
            return 'url(' + translate(node.value) + ')';

        case 'Progid':
            return translate(node.value);

        case 'Combinator':
            return node.name;

        case 'Identifier':
            return node.name;

        case 'PseudoClass':
            return ':' + node.name;

        case 'PseudoElement':
            return '::' + node.name;

        case 'Class':
            return '.' + node.name;

        case 'Id':
            return '#' + node.name;

        case 'Hash':
            return '#' + node.value;

        case 'Dimension':
            return node.value + node.unit;

        case 'Nth':
            return node.value;

        case 'Number':
            return node.value;

        case 'String':
            return node.value;

        case 'Operator':
            return node.value;

        case 'Raw':
            return node.value;

        case 'Unknown':
            return node.value;

        case 'Percentage':
            return node.value + '%';

        case 'Space':
            return ' ';

        case 'Comment':
            return '/*' + node.value + '*/';

        default:
            throw new Error('Unknown node type: ' + node.type);
    }
}

module.exports = translate;

},{}],50:[function(require,module,exports){
var SourceMapGenerator = require('source-map').SourceMapGenerator;
var SourceNode = require('source-map').SourceNode;

// Our own implementation of SourceNode#toStringWithSourceMap,
// since SourceNode doesn't allow multiple references to original source.
// Also, as we know structure of result we could be optimize generation
// (currently it's ~40% faster).
function walk(node, fn) {
    for (var chunk, i = 0; i < node.children.length; i++) {
        chunk = node.children[i];

        if (chunk instanceof SourceNode) {
            // this is a hack, because source maps doesn't support for 1(generated):N(original)
            // if (chunk.merged) {
            //     fn('', chunk);
            // }

            walk(chunk, fn);
        } else {
            fn(chunk, node);
        }
    }
}

function generateSourceMap(root) {
    var map = new SourceMapGenerator();
    var css = '';
    var sourceMappingActive = false;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastIndexOfNewline;
    var generated = {
        line: 1,
        column: 0
    };
    var activatedMapping = {
        generated: generated
    };

    walk(root, function(chunk, original) {
        if (original.line !== null &&
            original.column !== null) {
            if (lastOriginalLine !== original.line ||
                lastOriginalColumn !== original.column) {
                map.addMapping({
                    source: original.source,
                    original: original,
                    generated: generated
                });
            }

            lastOriginalLine = original.line;
            lastOriginalColumn = original.column;
            sourceMappingActive = true;
        } else if (sourceMappingActive) {
            map.addMapping(activatedMapping);
            sourceMappingActive = false;
        }

        css += chunk;

        lastIndexOfNewline = chunk.lastIndexOf('\n');
        if (lastIndexOfNewline !== -1) {
            generated.line += chunk.match(/\n/g).length;
            generated.column = chunk.length - lastIndexOfNewline - 1;
        } else {
            generated.column += chunk.length;
        }
    });

    return {
        css: css,
        map: map
    };
}

function createAnonymousSourceNode(children) {
    return new SourceNode(
        null,
        null,
        null,
        children
    );
}

function createSourceNode(info, children) {
    if (info.primary) {
        // special marker node to add several references to original
        // var merged = createSourceNode(info.merged, []);
        // merged.merged = true;
        // children.unshift(merged);

        // use recursion, because primary can also has a primary/merged info
        return createSourceNode(info.primary, children);
    }

    return new SourceNode(
        info.line,
        info.column - 1,
        info.source,
        children
    );
}

function each(list) {
    if (list.head === null) {
        return '';
    }

    if (list.head === list.tail) {
        return translate(list.head.data);
    }

    return list.map(translate).join('');
}

function eachDelim(list, delimeter) {
    if (list.head === null) {
        return '';
    }

    if (list.head === list.tail) {
        return translate(list.head.data);
    }

    return list.map(translate).join(delimeter);
}

function translate(node) {
    switch (node.type) {
        case 'StyleSheet':
            return createAnonymousSourceNode(node.rules.map(translate));

        case 'Atrule':
            var nodes = ['@', node.name];

            if (node.expression && !node.expression.sequence.isEmpty()) {
                nodes.push(' ', translate(node.expression));
            }

            if (node.block) {
                nodes.push('{', translate(node.block), '}');
            } else {
                nodes.push(';');
            }

            return createSourceNode(node.info, nodes);

        case 'Ruleset':
            return createAnonymousSourceNode([
                translate(node.selector), '{', translate(node.block), '}'
            ]);

        case 'Selector':
            return createAnonymousSourceNode(node.selectors.map(translate)).join(',');

        case 'SimpleSelector':
            var nodes = node.sequence.map(function(node) {
                // add extra spaces around /deep/ combinator since comment beginning/ending may to be produced
                if (node.type === 'Combinator' && node.name === '/deep/') {
                    return ' ' + translate(node) + ' ';
                }

                return translate(node);
            });

            return createSourceNode(node.info, nodes);

        case 'Block':
            return createAnonymousSourceNode(node.declarations.map(translate)).join(';');

        case 'Declaration':
            return createSourceNode(
                node.info,
                [translate(node.property), ':', translate(node.value)]
            );

        case 'Property':
            return node.name;

        case 'Value':
            return node.important
                ? each(node.sequence) + '!important'
                : each(node.sequence);

        case 'Attribute':
            var result = translate(node.name);
            var flagsPrefix = ' ';

            if (node.operator !== null) {
                result += node.operator;

                if (node.value !== null) {
                    result += translate(node.value);

                    // space between string and flags is not required
                    if (node.value.type === 'String') {
                        flagsPrefix = '';
                    }
                }
            }

            if (node.flags !== null) {
                result += flagsPrefix + node.flags;
            }

            return '[' + result + ']';

        case 'FunctionalPseudo':
            return ':' + node.name + '(' + eachDelim(node.arguments, ',') + ')';

        case 'Function':
            return node.name + '(' + eachDelim(node.arguments, ',') + ')';

        case 'Negation':
            return ':not(' + eachDelim(node.sequence, ',') + ')';

        case 'Braces':
            return node.open + each(node.sequence) + node.close;

        case 'Argument':
        case 'AtruleExpression':
            return each(node.sequence);

        case 'Url':
            return 'url(' + translate(node.value) + ')';

        case 'Progid':
            return translate(node.value);

        case 'Combinator':
            return node.name;

        case 'Identifier':
            return node.name;

        case 'PseudoClass':
            return ':' + node.name;

        case 'PseudoElement':
            return '::' + node.name;

        case 'Class':
            return '.' + node.name;

        case 'Id':
            return '#' + node.name;

        case 'Hash':
            return '#' + node.value;

        case 'Dimension':
            return node.value + node.unit;

        case 'Nth':
            return node.value;

        case 'Number':
            return node.value;

        case 'String':
            return node.value;

        case 'Operator':
            return node.value;

        case 'Raw':
            return node.value;

        case 'Unknown':
            return node.value;

        case 'Percentage':
            return node.value + '%';

        case 'Space':
            return ' ';

        case 'Comment':
            return '/*' + node.value + '*/';

        default:
            throw new Error('Unknown node type: ' + node.type);
    }
}

module.exports = function(node) {
    return generateSourceMap(
        createAnonymousSourceNode(translate(node))
    );
};

},{"source-map":113}],51:[function(require,module,exports){
function walkRules(node, item, list) {
    switch (node.type) {
        case 'StyleSheet':
            var oldStylesheet = this.stylesheet;
            this.stylesheet = node;

            node.rules.each(walkRules, this);

            this.stylesheet = oldStylesheet;
            break;

        case 'Atrule':
            if (node.block !== null) {
                walkRules.call(this, node.block);
            }

            this.fn(node, item, list);
            break;

        case 'Ruleset':
            this.fn(node, item, list);
            break;
    }

}

function walkRulesRight(node, item, list) {
    switch (node.type) {
        case 'StyleSheet':
            var oldStylesheet = this.stylesheet;
            this.stylesheet = node;

            node.rules.eachRight(walkRulesRight, this);

            this.stylesheet = oldStylesheet;
            break;

        case 'Atrule':
            if (node.block !== null) {
                walkRulesRight.call(this, node.block);
            }

            this.fn(node, item, list);
            break;

        case 'Ruleset':
            this.fn(node, item, list);
            break;
    }
}

function walkAll(node, item, list) {
    switch (node.type) {
        case 'StyleSheet':
            var oldStylesheet = this.stylesheet;
            this.stylesheet = node;

            node.rules.each(walkAll, this);

            this.stylesheet = oldStylesheet;
            break;

        case 'Atrule':
            if (node.expression !== null) {
                walkAll.call(this, node.expression);
            }
            if (node.block !== null) {
                walkAll.call(this, node.block);
            }
            break;

        case 'Ruleset':
            this.ruleset = node;

            if (node.selector !== null) {
                walkAll.call(this, node.selector);
            }
            walkAll.call(this, node.block);

            this.ruleset = null;
            break;

        case 'Selector':
            var oldSelector = this.selector;
            this.selector = node;

            node.selectors.each(walkAll, this);

            this.selector = oldSelector;
            break;

        case 'Block':
            node.declarations.each(walkAll, this);
            break;

        case 'Declaration':
            this.declaration = node;

            walkAll.call(this, node.property);
            walkAll.call(this, node.value);

            this.declaration = null;
            break;

        case 'Attribute':
            walkAll.call(this, node.name);
            if (node.value !== null) {
                walkAll.call(this, node.value);
            }
            break;

        case 'FunctionalPseudo':
        case 'Function':
            this['function'] = node;

            node.arguments.each(walkAll, this);

            this['function'] = null;
            break;

        case 'AtruleExpression':
            this.atruleExpression = node;

            node.sequence.each(walkAll, this);

            this.atruleExpression = null;
            break;

        case 'Value':
        case 'Argument':
        case 'SimpleSelector':
        case 'Braces':
        case 'Negation':
            node.sequence.each(walkAll, this);
            break;

        case 'Url':
        case 'Progid':
            walkAll.call(this, node.value);
            break;

        // nothig to do with
        // case 'Property':
        // case 'Combinator':
        // case 'Dimension':
        // case 'Hash':
        // case 'Identifier':
        // case 'Nth':
        // case 'Class':
        // case 'Id':
        // case 'Percentage':
        // case 'PseudoClass':
        // case 'PseudoElement':
        // case 'Space':
        // case 'Number':
        // case 'String':
        // case 'Operator':
        // case 'Raw':
    }

    this.fn(node, item, list);
}

function createContext(root, fn) {
    var context = {
        fn: fn,
        root: root,
        stylesheet: null,
        atruleExpression: null,
        ruleset: null,
        selector: null,
        declaration: null,
        function: null
    };

    return context;
}

module.exports = {
    all: function(root, fn) {
        walkAll.call(createContext(root, fn), root);
    },
    rules: function(root, fn) {
        walkRules.call(createContext(root, fn), root);
    },
    rulesRight: function(root, fn) {
        walkRulesRight.call(createContext(root, fn), root);
    }
};

},{}],52:[function(require,module,exports){
module.exports={
  "_args": [
    [
      {
        "raw": "csso@~2.3.1",
        "scope": null,
        "escapedName": "csso",
        "name": "csso",
        "rawSpec": "~2.3.1",
        "spec": ">=2.3.1 <2.4.0",
        "type": "range"
      },
      "/Users/ale/Code/svgo-compressor/node_modules/svgo"
    ]
  ],
  "_from": "csso@>=2.3.1 <2.4.0",
  "_id": "csso@2.3.1",
  "_inCache": true,
  "_location": "/csso",
  "_nodeVersion": "6.8.1",
  "_npmOperationalInternal": {
    "host": "packages-12-west.internal.npmjs.com",
    "tmp": "tmp/csso-2.3.1.tgz_1483700134530_0.4373721410520375"
  },
  "_npmUser": {
    "name": "lahmatiy",
    "email": "rdvornov@gmail.com"
  },
  "_npmVersion": "3.10.8",
  "_phantomChildren": {},
  "_requested": {
    "raw": "csso@~2.3.1",
    "scope": null,
    "escapedName": "csso",
    "name": "csso",
    "rawSpec": "~2.3.1",
    "spec": ">=2.3.1 <2.4.0",
    "type": "range"
  },
  "_requiredBy": [
    "/svgo"
  ],
  "_resolved": "https://registry.npmjs.org/csso/-/csso-2.3.1.tgz",
  "_shasum": "4f8d91a156f2f1c2aebb40b8fb1b5eb83d94d3b9",
  "_shrinkwrap": null,
  "_spec": "csso@~2.3.1",
  "_where": "/Users/ale/Code/svgo-compressor/node_modules/svgo",
  "author": {
    "name": "Sergey Kryzhanovsky",
    "email": "skryzhanovsky@ya.ru",
    "url": "https://github.com/afelix"
  },
  "bin": {
    "csso": "./bin/csso"
  },
  "bugs": {
    "url": "https://github.com/css/csso/issues"
  },
  "dependencies": {
    "clap": "^1.0.9",
    "source-map": "^0.5.3"
  },
  "description": "CSSO (CSS Optimizer) is a CSS minifier with structural optimisations",
  "devDependencies": {
    "browserify": "^13.0.0",
    "coveralls": "^2.11.6",
    "eslint": "^2.2.0",
    "istanbul": "^0.4.2",
    "jscs": "~2.10.0",
    "mocha": "~2.4.2",
    "uglify-js": "^2.6.1"
  },
  "directories": {},
  "dist": {
    "shasum": "4f8d91a156f2f1c2aebb40b8fb1b5eb83d94d3b9",
    "tarball": "https://registry.npmjs.org/csso/-/csso-2.3.1.tgz"
  },
  "engines": {
    "node": ">=0.10.0"
  },
  "eslintConfig": {
    "env": {
      "node": true,
      "mocha": true,
      "es6": true
    },
    "rules": {
      "no-duplicate-case": 2,
      "no-undef": 2,
      "no-unused-vars": [
        2,
        {
          "vars": "all",
          "args": "after-used"
        }
      ]
    }
  },
  "files": [
    "bin",
    "dist/csso-browser.js",
    "lib",
    "HISTORY.md",
    "LICENSE",
    "README.md"
  ],
  "gitHead": "f56d62bc1309c6da042e6378988e54b0ab681d6e",
  "homepage": "https://github.com/css/csso",
  "keywords": [
    "css",
    "minifier",
    "minify",
    "compress",
    "optimisation"
  ],
  "license": "MIT",
  "main": "./lib/index",
  "maintainers": [
    {
      "name": "afelix",
      "email": "skryzhanovsky@gmail.com"
    },
    {
      "name": "lahmatiy",
      "email": "rdvornov@gmail.com"
    },
    {
      "name": "tadatuta",
      "email": "i@tadatuta.com"
    }
  ],
  "name": "csso",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/css/csso.git"
  },
  "scripts": {
    "browserify": "browserify --standalone csso lib/index.js | uglifyjs --compress --mangle -o dist/csso-browser.js",
    "codestyle": "jscs lib && eslint lib test",
    "codestyle-and-test": "npm run codestyle && npm test",
    "coverage": "istanbul cover _mocha -- -R dot",
    "coveralls": "istanbul cover _mocha --report lcovonly -- -R dot && cat ./coverage/lcov.info | coveralls",
    "gh-pages": "git clone -b gh-pages https://github.com/css/csso.git .gh-pages && npm run browserify && cp dist/csso-browser.js .gh-pages/ && cd .gh-pages && git commit -am \"update\" && git push && cd .. && rm -rf .gh-pages",
    "hydrogen": "node --trace-hydrogen --trace-phase=Z --trace-deopt --code-comments --hydrogen-track-positions --redirect-code-traces --redirect-code-traces-to=code.asm --trace_hydrogen_file=code.cfg --print-opt-code bin/csso --stat -o /dev/null",
    "prepublish": "npm run browserify",
    "test": "mocha --reporter dot",
    "travis": "npm run codestyle-and-test && npm run coveralls"
  },
  "version": "2.3.1"
}

},{}],53:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],54:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],55:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],56:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],57:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],58:[function(require,module,exports){
'use strict';


var yaml = require('./lib/js-yaml.js');


module.exports = yaml;

},{"./lib/js-yaml.js":59}],59:[function(require,module,exports){
'use strict';


var loader = require('./js-yaml/loader');
var dumper = require('./js-yaml/dumper');


function deprecated(name) {
  return function () {
    throw new Error('Function ' + name + ' is deprecated and cannot be used.');
  };
}


module.exports.Type                = require('./js-yaml/type');
module.exports.Schema              = require('./js-yaml/schema');
module.exports.FAILSAFE_SCHEMA     = require('./js-yaml/schema/failsafe');
module.exports.JSON_SCHEMA         = require('./js-yaml/schema/json');
module.exports.CORE_SCHEMA         = require('./js-yaml/schema/core');
module.exports.DEFAULT_SAFE_SCHEMA = require('./js-yaml/schema/default_safe');
module.exports.DEFAULT_FULL_SCHEMA = require('./js-yaml/schema/default_full');
module.exports.load                = loader.load;
module.exports.loadAll             = loader.loadAll;
module.exports.safeLoad            = loader.safeLoad;
module.exports.safeLoadAll         = loader.safeLoadAll;
module.exports.dump                = dumper.dump;
module.exports.safeDump            = dumper.safeDump;
module.exports.YAMLException       = require('./js-yaml/exception');

// Deprecated schema names from JS-YAML 2.0.x
module.exports.MINIMAL_SCHEMA = require('./js-yaml/schema/failsafe');
module.exports.SAFE_SCHEMA    = require('./js-yaml/schema/default_safe');
module.exports.DEFAULT_SCHEMA = require('./js-yaml/schema/default_full');

// Deprecated functions from JS-YAML 1.x.x
module.exports.scan           = deprecated('scan');
module.exports.parse          = deprecated('parse');
module.exports.compose        = deprecated('compose');
module.exports.addConstructor = deprecated('addConstructor');

},{"./js-yaml/dumper":61,"./js-yaml/exception":62,"./js-yaml/loader":63,"./js-yaml/schema":65,"./js-yaml/schema/core":66,"./js-yaml/schema/default_full":67,"./js-yaml/schema/default_safe":68,"./js-yaml/schema/failsafe":69,"./js-yaml/schema/json":70,"./js-yaml/type":71}],60:[function(require,module,exports){
'use strict';


function isNothing(subject) {
  return (typeof subject === 'undefined') || (subject === null);
}


function isObject(subject) {
  return (typeof subject === 'object') && (subject !== null);
}


function toArray(sequence) {
  if (Array.isArray(sequence)) return sequence;
  else if (isNothing(sequence)) return [];

  return [ sequence ];
}


function extend(target, source) {
  var index, length, key, sourceKeys;

  if (source) {
    sourceKeys = Object.keys(source);

    for (index = 0, length = sourceKeys.length; index < length; index += 1) {
      key = sourceKeys[index];
      target[key] = source[key];
    }
  }

  return target;
}


function repeat(string, count) {
  var result = '', cycle;

  for (cycle = 0; cycle < count; cycle += 1) {
    result += string;
  }

  return result;
}


function isNegativeZero(number) {
  return (number === 0) && (Number.NEGATIVE_INFINITY === 1 / number);
}


module.exports.isNothing      = isNothing;
module.exports.isObject       = isObject;
module.exports.toArray        = toArray;
module.exports.repeat         = repeat;
module.exports.isNegativeZero = isNegativeZero;
module.exports.extend         = extend;

},{}],61:[function(require,module,exports){
'use strict';

/*eslint-disable no-use-before-define*/

var common              = require('./common');
var YAMLException       = require('./exception');
var DEFAULT_FULL_SCHEMA = require('./schema/default_full');
var DEFAULT_SAFE_SCHEMA = require('./schema/default_safe');

var _toString       = Object.prototype.toString;
var _hasOwnProperty = Object.prototype.hasOwnProperty;

var CHAR_TAB                  = 0x09; /* Tab */
var CHAR_LINE_FEED            = 0x0A; /* LF */
var CHAR_SPACE                = 0x20; /* Space */
var CHAR_EXCLAMATION          = 0x21; /* ! */
var CHAR_DOUBLE_QUOTE         = 0x22; /* " */
var CHAR_SHARP                = 0x23; /* # */
var CHAR_PERCENT              = 0x25; /* % */
var CHAR_AMPERSAND            = 0x26; /* & */
var CHAR_SINGLE_QUOTE         = 0x27; /* ' */
var CHAR_ASTERISK             = 0x2A; /* * */
var CHAR_COMMA                = 0x2C; /* , */
var CHAR_MINUS                = 0x2D; /* - */
var CHAR_COLON                = 0x3A; /* : */
var CHAR_GREATER_THAN         = 0x3E; /* > */
var CHAR_QUESTION             = 0x3F; /* ? */
var CHAR_COMMERCIAL_AT        = 0x40; /* @ */
var CHAR_LEFT_SQUARE_BRACKET  = 0x5B; /* [ */
var CHAR_RIGHT_SQUARE_BRACKET = 0x5D; /* ] */
var CHAR_GRAVE_ACCENT         = 0x60; /* ` */
var CHAR_LEFT_CURLY_BRACKET   = 0x7B; /* { */
var CHAR_VERTICAL_LINE        = 0x7C; /* | */
var CHAR_RIGHT_CURLY_BRACKET  = 0x7D; /* } */

var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

var DEPRECATED_BOOLEANS_SYNTAX = [
  'y', 'Y', 'yes', 'Yes', 'YES', 'on', 'On', 'ON',
  'n', 'N', 'no', 'No', 'NO', 'off', 'Off', 'OFF'
];

function compileStyleMap(schema, map) {
  var result, keys, index, length, tag, style, type;

  if (map === null) return {};

  result = {};
  keys = Object.keys(map);

  for (index = 0, length = keys.length; index < length; index += 1) {
    tag = keys[index];
    style = String(map[tag]);

    if (tag.slice(0, 2) === '!!') {
      tag = 'tag:yaml.org,2002:' + tag.slice(2);
    }
    type = schema.compiledTypeMap['fallback'][tag];

    if (type && _hasOwnProperty.call(type.styleAliases, style)) {
      style = type.styleAliases[style];
    }

    result[tag] = style;
  }

  return result;
}

function encodeHex(character) {
  var string, handle, length;

  string = character.toString(16).toUpperCase();

  if (character <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (character <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (character <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');
  }

  return '\\' + handle + common.repeat('0', length - string.length) + string;
}

function State(options) {
  this.schema       = options['schema'] || DEFAULT_FULL_SCHEMA;
  this.indent       = Math.max(1, (options['indent'] || 2));
  this.skipInvalid  = options['skipInvalid'] || false;
  this.flowLevel    = (common.isNothing(options['flowLevel']) ? -1 : options['flowLevel']);
  this.styleMap     = compileStyleMap(this.schema, options['styles'] || null);
  this.sortKeys     = options['sortKeys'] || false;
  this.lineWidth    = options['lineWidth'] || 80;
  this.noRefs       = options['noRefs'] || false;
  this.noCompatMode = options['noCompatMode'] || false;

  this.implicitTypes = this.schema.compiledImplicit;
  this.explicitTypes = this.schema.compiledExplicit;

  this.tag = null;
  this.result = '';

  this.duplicates = [];
  this.usedDuplicates = null;
}

// Indents every line in a string. Empty lines (\n only) are not indented.
function indentString(string, spaces) {
  var ind = common.repeat(' ', spaces),
      position = 0,
      next = -1,
      result = '',
      line,
      length = string.length;

  while (position < length) {
    next = string.indexOf('\n', position);
    if (next === -1) {
      line = string.slice(position);
      position = length;
    } else {
      line = string.slice(position, next + 1);
      position = next + 1;
    }

    if (line.length && line !== '\n') result += ind;

    result += line;
  }

  return result;
}

function generateNextLine(state, level) {
  return '\n' + common.repeat(' ', state.indent * level);
}

function testImplicitResolving(state, str) {
  var index, length, type;

  for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
    type = state.implicitTypes[index];

    if (type.resolve(str)) {
      return true;
    }
  }

  return false;
}

// [33] s-white ::= s-space | s-tab
function isWhitespace(c) {
  return c === CHAR_SPACE || c === CHAR_TAB;
}

// Returns true if the character can be printed without escaping.
// From YAML 1.2: "any allowed characters known to be non-printable
// should also be escaped. [However,] This isn’t mandatory"
// Derived from nb-char - \t - #x85 - #xA0 - #x2028 - #x2029.
function isPrintable(c) {
  return  (0x00020 <= c && c <= 0x00007E)
      || ((0x000A1 <= c && c <= 0x00D7FF) && c !== 0x2028 && c !== 0x2029)
      || ((0x0E000 <= c && c <= 0x00FFFD) && c !== 0xFEFF /* BOM */)
      ||  (0x10000 <= c && c <= 0x10FFFF);
}

// Simplified test for values allowed after the first character in plain style.
function isPlainSafe(c) {
  // Uses a subset of nb-char - c-flow-indicator - ":" - "#"
  // where nb-char ::= c-printable - b-char - c-byte-order-mark.
  return isPrintable(c) && c !== 0xFEFF
    // - c-flow-indicator
    && c !== CHAR_COMMA
    && c !== CHAR_LEFT_SQUARE_BRACKET
    && c !== CHAR_RIGHT_SQUARE_BRACKET
    && c !== CHAR_LEFT_CURLY_BRACKET
    && c !== CHAR_RIGHT_CURLY_BRACKET
    // - ":" - "#"
    && c !== CHAR_COLON
    && c !== CHAR_SHARP;
}

// Simplified test for values allowed as the first character in plain style.
function isPlainSafeFirst(c) {
  // Uses a subset of ns-char - c-indicator
  // where ns-char = nb-char - s-white.
  return isPrintable(c) && c !== 0xFEFF
    && !isWhitespace(c) // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    && c !== CHAR_MINUS
    && c !== CHAR_QUESTION
    && c !== CHAR_COLON
    && c !== CHAR_COMMA
    && c !== CHAR_LEFT_SQUARE_BRACKET
    && c !== CHAR_RIGHT_SQUARE_BRACKET
    && c !== CHAR_LEFT_CURLY_BRACKET
    && c !== CHAR_RIGHT_CURLY_BRACKET
    // | “#” | “&” | “*” | “!” | “|” | “>” | “'” | “"”
    && c !== CHAR_SHARP
    && c !== CHAR_AMPERSAND
    && c !== CHAR_ASTERISK
    && c !== CHAR_EXCLAMATION
    && c !== CHAR_VERTICAL_LINE
    && c !== CHAR_GREATER_THAN
    && c !== CHAR_SINGLE_QUOTE
    && c !== CHAR_DOUBLE_QUOTE
    // | “%” | “@” | “`”)
    && c !== CHAR_PERCENT
    && c !== CHAR_COMMERCIAL_AT
    && c !== CHAR_GRAVE_ACCENT;
}

var STYLE_PLAIN   = 1,
    STYLE_SINGLE  = 2,
    STYLE_LITERAL = 3,
    STYLE_FOLDED  = 4,
    STYLE_DOUBLE  = 5;

// Determines which scalar styles are possible and returns the preferred style.
// lineWidth = -1 => no limit.
// Pre-conditions: str.length > 0.
// Post-conditions:
//    STYLE_PLAIN or STYLE_SINGLE => no \n are in the string.
//    STYLE_LITERAL => no lines are suitable for folding (or lineWidth is -1).
//    STYLE_FOLDED => a line > lineWidth and can be folded (and lineWidth != -1).
function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType) {
  var i;
  var char;
  var hasLineBreak = false;
  var hasFoldableLine = false; // only checked if shouldTrackWidth
  var shouldTrackWidth = lineWidth !== -1;
  var previousLineBreak = -1; // count the first line correctly
  var plain = isPlainSafeFirst(string.charCodeAt(0))
          && !isWhitespace(string.charCodeAt(string.length - 1));

  if (singleLineOnly) {
    // Case: no block styles.
    // Check for disallowed characters to rule out plain and single.
    for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char);
    }
  } else {
    // Case: block styles permitted.
    for (i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      if (char === CHAR_LINE_FEED) {
        hasLineBreak = true;
        // Check if any line can be folded.
        if (shouldTrackWidth) {
          hasFoldableLine = hasFoldableLine ||
            // Foldable line = too long, and not more-indented.
            (i - previousLineBreak - 1 > lineWidth &&
             string[previousLineBreak + 1] !== ' ');
          previousLineBreak = i;
        }
      } else if (!isPrintable(char)) {
        return STYLE_DOUBLE;
      }
      plain = plain && isPlainSafe(char);
    }
    // in case the end is missing a \n
    hasFoldableLine = hasFoldableLine || (shouldTrackWidth &&
      (i - previousLineBreak - 1 > lineWidth &&
       string[previousLineBreak + 1] !== ' '));
  }
  // Although every style can represent \n without escaping, prefer block styles
  // for multiline, since they're more readable and they don't add empty lines.
  // Also prefer folding a super-long line.
  if (!hasLineBreak && !hasFoldableLine) {
    // Strings interpretable as another type have to be quoted;
    // e.g. the string 'true' vs. the boolean true.
    return plain && !testAmbiguousType(string)
      ? STYLE_PLAIN : STYLE_SINGLE;
  }
  // Edge case: block indentation indicator can only have one digit.
  if (string[0] === ' ' && indentPerLevel > 9) {
    return STYLE_DOUBLE;
  }
  // At this point we know block styles are valid.
  // Prefer literal style unless we want to fold.
  return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
}

// Note: line breaking/folding is implemented for only the folded style.
// NB. We drop the last trailing newline (if any) of a returned block scalar
//  since the dumper adds its own newline. This always works:
//    • No ending newline => unaffected; already using strip "-" chomping.
//    • Ending newline    => removed then restored.
//  Importantly, this keeps the "+" chomp indicator from gaining an extra line.
function writeScalar(state, string, level, iskey) {
  state.dump = (function () {
    if (string.length === 0) {
      return "''";
    }
    if (!state.noCompatMode &&
        DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1) {
      return "'" + string + "'";
    }

    var indent = state.indent * Math.max(1, level); // no 0-indent scalars
    // As indentation gets deeper, let the width decrease monotonically
    // to the lower bound min(state.lineWidth, 40).
    // Note that this implies
    //  state.lineWidth ≤ 40 + state.indent: width is fixed at the lower bound.
    //  state.lineWidth > 40 + state.indent: width decreases until the lower bound.
    // This behaves better than a constant minimum width which disallows narrower options,
    // or an indent threshold which causes the width to suddenly increase.
    var lineWidth = state.lineWidth === -1
      ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);

    // Without knowing if keys are implicit/explicit, assume implicit for safety.
    var singleLineOnly = iskey
      // No block styles in flow mode.
      || (state.flowLevel > -1 && level >= state.flowLevel);
    function testAmbiguity(string) {
      return testImplicitResolving(state, string);
    }

    switch (chooseScalarStyle(string, singleLineOnly, state.indent, lineWidth, testAmbiguity)) {
      case STYLE_PLAIN:
        return string;
      case STYLE_SINGLE:
        return "'" + string.replace(/'/g, "''") + "'";
      case STYLE_LITERAL:
        return '|' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(string, indent));
      case STYLE_FOLDED:
        return '>' + blockHeader(string, state.indent)
          + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
      case STYLE_DOUBLE:
        return '"' + escapeString(string, lineWidth) + '"';
      default:
        throw new YAMLException('impossible error: invalid scalar style');
    }
  }());
}

// Pre-conditions: string is valid for a block scalar, 1 <= indentPerLevel <= 9.
function blockHeader(string, indentPerLevel) {
  var indentIndicator = (string[0] === ' ') ? String(indentPerLevel) : '';

  // note the special case: the string '\n' counts as a "trailing" empty line.
  var clip =          string[string.length - 1] === '\n';
  var keep = clip && (string[string.length - 2] === '\n' || string === '\n');
  var chomp = keep ? '+' : (clip ? '' : '-');

  return indentIndicator + chomp + '\n';
}

// (See the note for writeScalar.)
function dropEndingNewline(string) {
  return string[string.length - 1] === '\n' ? string.slice(0, -1) : string;
}

// Note: a long line without a suitable break point will exceed the width limit.
// Pre-conditions: every char in str isPrintable, str.length > 0, width > 0.
function foldString(string, width) {
  // In folded style, $k$ consecutive newlines output as $k+1$ newlines—
  // unless they're before or after a more-indented line, or at the very
  // beginning or end, in which case $k$ maps to $k$.
  // Therefore, parse each chunk as newline(s) followed by a content line.
  var lineRe = /(\n+)([^\n]*)/g;

  // first line (possibly an empty line)
  var result = (function () {
    var nextLF = string.indexOf('\n');
    nextLF = nextLF !== -1 ? nextLF : string.length;
    lineRe.lastIndex = nextLF;
    return foldLine(string.slice(0, nextLF), width);
  }());
  // If we haven't reached the first content line yet, don't add an extra \n.
  var prevMoreIndented = string[0] === '\n' || string[0] === ' ';
  var moreIndented;

  // rest of the lines
  var match;
  while ((match = lineRe.exec(string))) {
    var prefix = match[1], line = match[2];
    moreIndented = (line[0] === ' ');
    result += prefix
      + (!prevMoreIndented && !moreIndented && line !== ''
        ? '\n' : '')
      + foldLine(line, width);
    prevMoreIndented = moreIndented;
  }

  return result;
}

// Greedy line breaking.
// Picks the longest line under the limit each time,
// otherwise settles for the shortest line over the limit.
// NB. More-indented lines *cannot* be folded, as that would add an extra \n.
function foldLine(line, width) {
  if (line === '' || line[0] === ' ') return line;

  // Since a more-indented line adds a \n, breaks can't be followed by a space.
  var breakRe = / [^ ]/g; // note: the match index will always be <= length-2.
  var match;
  // start is an inclusive index. end, curr, and next are exclusive.
  var start = 0, end, curr = 0, next = 0;
  var result = '';

  // Invariants: 0 <= start <= length-1.
  //   0 <= curr <= next <= max(0, length-2). curr - start <= width.
  // Inside the loop:
  //   A match implies length >= 2, so curr and next are <= length-2.
  while ((match = breakRe.exec(line))) {
    next = match.index;
    // maintain invariant: curr - start <= width
    if (next - start > width) {
      end = (curr > start) ? curr : next; // derive end <= length-2
      result += '\n' + line.slice(start, end);
      // skip the space that was output as \n
      start = end + 1;                    // derive start <= length-1
    }
    curr = next;
  }

  // By the invariants, start <= length-1, so there is something left over.
  // It is either the whole string or a part starting from non-whitespace.
  result += '\n';
  // Insert a break if the remainder is too long and there is a break available.
  if (line.length - start > width && curr > start) {
    result += line.slice(start, curr) + '\n' + line.slice(curr + 1);
  } else {
    result += line.slice(start);
  }

  return result.slice(1); // drop extra \n joiner
}

// Escapes a double-quoted string.
function escapeString(string) {
  var result = '';
  var char;
  var escapeSeq;

  for (var i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    escapeSeq = ESCAPE_SEQUENCES[char];
    result += !escapeSeq && isPrintable(char)
      ? string[i]
      : escapeSeq || encodeHex(char);
  }

  return result;
}

function writeFlowSequence(state, level, object) {
  var _result = '',
      _tag    = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level, object[index], false, false)) {
      if (index !== 0) _result += ', ';
      _result += state.dump;
    }
  }

  state.tag = _tag;
  state.dump = '[' + _result + ']';
}

function writeBlockSequence(state, level, object, compact) {
  var _result = '',
      _tag    = state.tag,
      index,
      length;

  for (index = 0, length = object.length; index < length; index += 1) {
    // Write only valid elements.
    if (writeNode(state, level + 1, object[index], true, true)) {
      if (!compact || index !== 0) {
        _result += generateNextLine(state, level);
      }
      _result += '- ' + state.dump;
    }
  }

  state.tag = _tag;
  state.dump = _result || '[]'; // Empty sequence if no valid values.
}

function writeFlowMapping(state, level, object) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      pairBuffer;

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (index !== 0) pairBuffer += ', ';

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level, objectKey, false, false)) {
      continue; // Skip this pair because of invalid key;
    }

    if (state.dump.length > 1024) pairBuffer += '? ';

    pairBuffer += state.dump + ': ';

    if (!writeNode(state, level, objectValue, false, false)) {
      continue; // Skip this pair because of invalid value.
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = '{' + _result + '}';
}

function writeBlockMapping(state, level, object, compact) {
  var _result       = '',
      _tag          = state.tag,
      objectKeyList = Object.keys(object),
      index,
      length,
      objectKey,
      objectValue,
      explicitPair,
      pairBuffer;

  // Allow sorting keys so that the output file is deterministic
  if (state.sortKeys === true) {
    // Default sorting
    objectKeyList.sort();
  } else if (typeof state.sortKeys === 'function') {
    // Custom sort function
    objectKeyList.sort(state.sortKeys);
  } else if (state.sortKeys) {
    // Something is wrong
    throw new YAMLException('sortKeys must be a boolean or a function');
  }

  for (index = 0, length = objectKeyList.length; index < length; index += 1) {
    pairBuffer = '';

    if (!compact || index !== 0) {
      pairBuffer += generateNextLine(state, level);
    }

    objectKey = objectKeyList[index];
    objectValue = object[objectKey];

    if (!writeNode(state, level + 1, objectKey, true, true, true)) {
      continue; // Skip this pair because of invalid key.
    }

    explicitPair = (state.tag !== null && state.tag !== '?') ||
                   (state.dump && state.dump.length > 1024);

    if (explicitPair) {
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += '?';
      } else {
        pairBuffer += '? ';
      }
    }

    pairBuffer += state.dump;

    if (explicitPair) {
      pairBuffer += generateNextLine(state, level);
    }

    if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
      continue; // Skip this pair because of invalid value.
    }

    if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
      pairBuffer += ':';
    } else {
      pairBuffer += ': ';
    }

    pairBuffer += state.dump;

    // Both key and value are valid.
    _result += pairBuffer;
  }

  state.tag = _tag;
  state.dump = _result || '{}'; // Empty mapping if no valid pairs.
}

function detectType(state, object, explicit) {
  var _result, typeList, index, length, type, style;

  typeList = explicit ? state.explicitTypes : state.implicitTypes;

  for (index = 0, length = typeList.length; index < length; index += 1) {
    type = typeList[index];

    if ((type.instanceOf  || type.predicate) &&
        (!type.instanceOf || ((typeof object === 'object') && (object instanceof type.instanceOf))) &&
        (!type.predicate  || type.predicate(object))) {

      state.tag = explicit ? type.tag : '?';

      if (type.represent) {
        style = state.styleMap[type.tag] || type.defaultStyle;

        if (_toString.call(type.represent) === '[object Function]') {
          _result = type.represent(object, style);
        } else if (_hasOwnProperty.call(type.represent, style)) {
          _result = type.represent[style](object, style);
        } else {
          throw new YAMLException('!<' + type.tag + '> tag resolver accepts not "' + style + '" style');
        }

        state.dump = _result;
      }

      return true;
    }
  }

  return false;
}

// Serializes `object` and writes it to global `result`.
// Returns true on success, or false on invalid object.
//
function writeNode(state, level, object, block, compact, iskey) {
  state.tag = null;
  state.dump = object;

  if (!detectType(state, object, false)) {
    detectType(state, object, true);
  }

  var type = _toString.call(state.dump);

  if (block) {
    block = (state.flowLevel < 0 || state.flowLevel > level);
  }

  var objectOrArray = type === '[object Object]' || type === '[object Array]',
      duplicateIndex,
      duplicate;

  if (objectOrArray) {
    duplicateIndex = state.duplicates.indexOf(object);
    duplicate = duplicateIndex !== -1;
  }

  if ((state.tag !== null && state.tag !== '?') || duplicate || (state.indent !== 2 && level > 0)) {
    compact = false;
  }

  if (duplicate && state.usedDuplicates[duplicateIndex]) {
    state.dump = '*ref_' + duplicateIndex;
  } else {
    if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
      state.usedDuplicates[duplicateIndex] = true;
    }
    if (type === '[object Object]') {
      if (block && (Object.keys(state.dump).length !== 0)) {
        writeBlockMapping(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowMapping(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object Array]') {
      if (block && (state.dump.length !== 0)) {
        writeBlockSequence(state, level, state.dump, compact);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + state.dump;
        }
      } else {
        writeFlowSequence(state, level, state.dump);
        if (duplicate) {
          state.dump = '&ref_' + duplicateIndex + ' ' + state.dump;
        }
      }
    } else if (type === '[object String]') {
      if (state.tag !== '?') {
        writeScalar(state, state.dump, level, iskey);
      }
    } else {
      if (state.skipInvalid) return false;
      throw new YAMLException('unacceptable kind of an object to dump ' + type);
    }

    if (state.tag !== null && state.tag !== '?') {
      state.dump = '!<' + state.tag + '> ' + state.dump;
    }
  }

  return true;
}

function getDuplicateReferences(object, state) {
  var objects = [],
      duplicatesIndexes = [],
      index,
      length;

  inspectNode(object, objects, duplicatesIndexes);

  for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
    state.duplicates.push(objects[duplicatesIndexes[index]]);
  }
  state.usedDuplicates = new Array(length);
}

function inspectNode(object, objects, duplicatesIndexes) {
  var objectKeyList,
      index,
      length;

  if (object !== null && typeof object === 'object') {
    index = objects.indexOf(object);
    if (index !== -1) {
      if (duplicatesIndexes.indexOf(index) === -1) {
        duplicatesIndexes.push(index);
      }
    } else {
      objects.push(object);

      if (Array.isArray(object)) {
        for (index = 0, length = object.length; index < length; index += 1) {
          inspectNode(object[index], objects, duplicatesIndexes);
        }
      } else {
        objectKeyList = Object.keys(object);

        for (index = 0, length = objectKeyList.length; index < length; index += 1) {
          inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
        }
      }
    }
  }
}

function dump(input, options) {
  options = options || {};

  var state = new State(options);

  if (!state.noRefs) getDuplicateReferences(input, state);

  if (writeNode(state, 0, input, true, true)) return state.dump + '\n';

  return '';
}

function safeDump(input, options) {
  return dump(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}

module.exports.dump     = dump;
module.exports.safeDump = safeDump;

},{"./common":60,"./exception":62,"./schema/default_full":67,"./schema/default_safe":68}],62:[function(require,module,exports){
// YAML error class. http://stackoverflow.com/questions/8458984
//
'use strict';

function YAMLException(reason, mark) {
  // Super constructor
  Error.call(this);

  // Include stack trace in error object
  if (Error.captureStackTrace) {
    // Chrome and NodeJS
    Error.captureStackTrace(this, this.constructor);
  } else {
    // FF, IE 10+ and Safari 6+. Fallback for others
    this.stack = (new Error()).stack || '';
  }

  this.name = 'YAMLException';
  this.reason = reason;
  this.mark = mark;
  this.message = (this.reason || '(unknown reason)') + (this.mark ? ' ' + this.mark.toString() : '');
}


// Inherit from Error
YAMLException.prototype = Object.create(Error.prototype);
YAMLException.prototype.constructor = YAMLException;


YAMLException.prototype.toString = function toString(compact) {
  var result = this.name + ': ';

  result += this.reason || '(unknown reason)';

  if (!compact && this.mark) {
    result += ' ' + this.mark.toString();
  }

  return result;
};


module.exports = YAMLException;

},{}],63:[function(require,module,exports){
'use strict';

/*eslint-disable max-len,no-use-before-define*/

var common              = require('./common');
var YAMLException       = require('./exception');
var Mark                = require('./mark');
var DEFAULT_SAFE_SCHEMA = require('./schema/default_safe');
var DEFAULT_FULL_SCHEMA = require('./schema/default_full');


var _hasOwnProperty = Object.prototype.hasOwnProperty;


var CONTEXT_FLOW_IN   = 1;
var CONTEXT_FLOW_OUT  = 2;
var CONTEXT_BLOCK_IN  = 3;
var CONTEXT_BLOCK_OUT = 4;


var CHOMPING_CLIP  = 1;
var CHOMPING_STRIP = 2;
var CHOMPING_KEEP  = 3;


var PATTERN_NON_PRINTABLE         = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
var PATTERN_FLOW_INDICATORS       = /[,\[\]\{\}]/;
var PATTERN_TAG_HANDLE            = /^(?:!|!!|![a-z\-]+!)$/i;
var PATTERN_TAG_URI               = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;


function is_EOL(c) {
  return (c === 0x0A/* LF */) || (c === 0x0D/* CR */);
}

function is_WHITE_SPACE(c) {
  return (c === 0x09/* Tab */) || (c === 0x20/* Space */);
}

function is_WS_OR_EOL(c) {
  return (c === 0x09/* Tab */) ||
         (c === 0x20/* Space */) ||
         (c === 0x0A/* LF */) ||
         (c === 0x0D/* CR */);
}

function is_FLOW_INDICATOR(c) {
  return c === 0x2C/* , */ ||
         c === 0x5B/* [ */ ||
         c === 0x5D/* ] */ ||
         c === 0x7B/* { */ ||
         c === 0x7D/* } */;
}

function fromHexCode(c) {
  var lc;

  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  /*eslint-disable no-bitwise*/
  lc = c | 0x20;

  if ((0x61/* a */ <= lc) && (lc <= 0x66/* f */)) {
    return lc - 0x61 + 10;
  }

  return -1;
}

function escapedHexLen(c) {
  if (c === 0x78/* x */) { return 2; }
  if (c === 0x75/* u */) { return 4; }
  if (c === 0x55/* U */) { return 8; }
  return 0;
}

function fromDecimalCode(c) {
  if ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) {
    return c - 0x30;
  }

  return -1;
}

function simpleEscapeSequence(c) {
  return (c === 0x30/* 0 */) ? '\x00' :
        (c === 0x61/* a */) ? '\x07' :
        (c === 0x62/* b */) ? '\x08' :
        (c === 0x74/* t */) ? '\x09' :
        (c === 0x09/* Tab */) ? '\x09' :
        (c === 0x6E/* n */) ? '\x0A' :
        (c === 0x76/* v */) ? '\x0B' :
        (c === 0x66/* f */) ? '\x0C' :
        (c === 0x72/* r */) ? '\x0D' :
        (c === 0x65/* e */) ? '\x1B' :
        (c === 0x20/* Space */) ? ' ' :
        (c === 0x22/* " */) ? '\x22' :
        (c === 0x2F/* / */) ? '/' :
        (c === 0x5C/* \ */) ? '\x5C' :
        (c === 0x4E/* N */) ? '\x85' :
        (c === 0x5F/* _ */) ? '\xA0' :
        (c === 0x4C/* L */) ? '\u2028' :
        (c === 0x50/* P */) ? '\u2029' : '';
}

function charFromCodepoint(c) {
  if (c <= 0xFFFF) {
    return String.fromCharCode(c);
  }
  // Encode UTF-16 surrogate pair
  // https://en.wikipedia.org/wiki/UTF-16#Code_points_U.2B010000_to_U.2B10FFFF
  return String.fromCharCode(((c - 0x010000) >> 10) + 0xD800,
                             ((c - 0x010000) & 0x03FF) + 0xDC00);
}

var simpleEscapeCheck = new Array(256); // integer, for fast access
var simpleEscapeMap = new Array(256);
for (var i = 0; i < 256; i++) {
  simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
  simpleEscapeMap[i] = simpleEscapeSequence(i);
}


function State(input, options) {
  this.input = input;

  this.filename  = options['filename']  || null;
  this.schema    = options['schema']    || DEFAULT_FULL_SCHEMA;
  this.onWarning = options['onWarning'] || null;
  this.legacy    = options['legacy']    || false;
  this.json      = options['json']      || false;
  this.listener  = options['listener']  || null;

  this.implicitTypes = this.schema.compiledImplicit;
  this.typeMap       = this.schema.compiledTypeMap;

  this.length     = input.length;
  this.position   = 0;
  this.line       = 0;
  this.lineStart  = 0;
  this.lineIndent = 0;

  this.documents = [];

  /*
  this.version;
  this.checkLineBreaks;
  this.tagMap;
  this.anchorMap;
  this.tag;
  this.anchor;
  this.kind;
  this.result;*/

}


function generateError(state, message) {
  return new YAMLException(
    message,
    new Mark(state.filename, state.input, state.position, state.line, (state.position - state.lineStart)));
}

function throwError(state, message) {
  throw generateError(state, message);
}

function throwWarning(state, message) {
  if (state.onWarning) {
    state.onWarning.call(null, generateError(state, message));
  }
}


var directiveHandlers = {

  YAML: function handleYamlDirective(state, name, args) {

    var match, major, minor;

    if (state.version !== null) {
      throwError(state, 'duplication of %YAML directive');
    }

    if (args.length !== 1) {
      throwError(state, 'YAML directive accepts exactly one argument');
    }

    match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);

    if (match === null) {
      throwError(state, 'ill-formed argument of the YAML directive');
    }

    major = parseInt(match[1], 10);
    minor = parseInt(match[2], 10);

    if (major !== 1) {
      throwError(state, 'unacceptable YAML version of the document');
    }

    state.version = args[0];
    state.checkLineBreaks = (minor < 2);

    if (minor !== 1 && minor !== 2) {
      throwWarning(state, 'unsupported YAML version of the document');
    }
  },

  TAG: function handleTagDirective(state, name, args) {

    var handle, prefix;

    if (args.length !== 2) {
      throwError(state, 'TAG directive accepts exactly two arguments');
    }

    handle = args[0];
    prefix = args[1];

    if (!PATTERN_TAG_HANDLE.test(handle)) {
      throwError(state, 'ill-formed tag handle (first argument) of the TAG directive');
    }

    if (_hasOwnProperty.call(state.tagMap, handle)) {
      throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
    }

    if (!PATTERN_TAG_URI.test(prefix)) {
      throwError(state, 'ill-formed tag prefix (second argument) of the TAG directive');
    }

    state.tagMap[handle] = prefix;
  }
};


function captureSegment(state, start, end, checkJson) {
  var _position, _length, _character, _result;

  if (start < end) {
    _result = state.input.slice(start, end);

    if (checkJson) {
      for (_position = 0, _length = _result.length;
           _position < _length;
           _position += 1) {
        _character = _result.charCodeAt(_position);
        if (!(_character === 0x09 ||
              (0x20 <= _character && _character <= 0x10FFFF))) {
          throwError(state, 'expected valid JSON character');
        }
      }
    } else if (PATTERN_NON_PRINTABLE.test(_result)) {
      throwError(state, 'the stream contains non-printable characters');
    }

    state.result += _result;
  }
}

function mergeMappings(state, destination, source, overridableKeys) {
  var sourceKeys, key, index, quantity;

  if (!common.isObject(source)) {
    throwError(state, 'cannot merge mappings; the provided source object is unacceptable');
  }

  sourceKeys = Object.keys(source);

  for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
    key = sourceKeys[index];

    if (!_hasOwnProperty.call(destination, key)) {
      destination[key] = source[key];
      overridableKeys[key] = true;
    }
  }
}

function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode) {
  var index, quantity;

  keyNode = String(keyNode);

  if (_result === null) {
    _result = {};
  }

  if (keyTag === 'tag:yaml.org,2002:merge') {
    if (Array.isArray(valueNode)) {
      for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
        mergeMappings(state, _result, valueNode[index], overridableKeys);
      }
    } else {
      mergeMappings(state, _result, valueNode, overridableKeys);
    }
  } else {
    if (!state.json &&
        !_hasOwnProperty.call(overridableKeys, keyNode) &&
        _hasOwnProperty.call(_result, keyNode)) {
      throwError(state, 'duplicated mapping key');
    }
    _result[keyNode] = valueNode;
    delete overridableKeys[keyNode];
  }

  return _result;
}

function readLineBreak(state) {
  var ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x0A/* LF */) {
    state.position++;
  } else if (ch === 0x0D/* CR */) {
    state.position++;
    if (state.input.charCodeAt(state.position) === 0x0A/* LF */) {
      state.position++;
    }
  } else {
    throwError(state, 'a line break is expected');
  }

  state.line += 1;
  state.lineStart = state.position;
}

function skipSeparationSpace(state, allowComments, checkIndent) {
  var lineBreaks = 0,
      ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    while (is_WHITE_SPACE(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    if (allowComments && ch === 0x23/* # */) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0x0A/* LF */ && ch !== 0x0D/* CR */ && ch !== 0);
    }

    if (is_EOL(ch)) {
      readLineBreak(state);

      ch = state.input.charCodeAt(state.position);
      lineBreaks++;
      state.lineIndent = 0;

      while (ch === 0x20/* Space */) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
    } else {
      break;
    }
  }

  if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
    throwWarning(state, 'deficient indentation');
  }

  return lineBreaks;
}

function testDocumentSeparator(state) {
  var _position = state.position,
      ch;

  ch = state.input.charCodeAt(_position);

  // Condition state.position === state.lineStart is tested
  // in parent on each call, for efficiency. No needs to test here again.
  if ((ch === 0x2D/* - */ || ch === 0x2E/* . */) &&
      ch === state.input.charCodeAt(_position + 1) &&
      ch === state.input.charCodeAt(_position + 2)) {

    _position += 3;

    ch = state.input.charCodeAt(_position);

    if (ch === 0 || is_WS_OR_EOL(ch)) {
      return true;
    }
  }

  return false;
}

function writeFoldedLines(state, count) {
  if (count === 1) {
    state.result += ' ';
  } else if (count > 1) {
    state.result += common.repeat('\n', count - 1);
  }
}


function readPlainScalar(state, nodeIndent, withinFlowCollection) {
  var preceding,
      following,
      captureStart,
      captureEnd,
      hasPendingContent,
      _line,
      _lineStart,
      _lineIndent,
      _kind = state.kind,
      _result = state.result,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (is_WS_OR_EOL(ch)      ||
      is_FLOW_INDICATOR(ch) ||
      ch === 0x23/* # */    ||
      ch === 0x26/* & */    ||
      ch === 0x2A/* * */    ||
      ch === 0x21/* ! */    ||
      ch === 0x7C/* | */    ||
      ch === 0x3E/* > */    ||
      ch === 0x27/* ' */    ||
      ch === 0x22/* " */    ||
      ch === 0x25/* % */    ||
      ch === 0x40/* @ */    ||
      ch === 0x60/* ` */) {
    return false;
  }

  if (ch === 0x3F/* ? */ || ch === 0x2D/* - */) {
    following = state.input.charCodeAt(state.position + 1);

    if (is_WS_OR_EOL(following) ||
        withinFlowCollection && is_FLOW_INDICATOR(following)) {
      return false;
    }
  }

  state.kind = 'scalar';
  state.result = '';
  captureStart = captureEnd = state.position;
  hasPendingContent = false;

  while (ch !== 0) {
    if (ch === 0x3A/* : */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following) ||
          withinFlowCollection && is_FLOW_INDICATOR(following)) {
        break;
      }

    } else if (ch === 0x23/* # */) {
      preceding = state.input.charCodeAt(state.position - 1);

      if (is_WS_OR_EOL(preceding)) {
        break;
      }

    } else if ((state.position === state.lineStart && testDocumentSeparator(state)) ||
               withinFlowCollection && is_FLOW_INDICATOR(ch)) {
      break;

    } else if (is_EOL(ch)) {
      _line = state.line;
      _lineStart = state.lineStart;
      _lineIndent = state.lineIndent;
      skipSeparationSpace(state, false, -1);

      if (state.lineIndent >= nodeIndent) {
        hasPendingContent = true;
        ch = state.input.charCodeAt(state.position);
        continue;
      } else {
        state.position = captureEnd;
        state.line = _line;
        state.lineStart = _lineStart;
        state.lineIndent = _lineIndent;
        break;
      }
    }

    if (hasPendingContent) {
      captureSegment(state, captureStart, captureEnd, false);
      writeFoldedLines(state, state.line - _line);
      captureStart = captureEnd = state.position;
      hasPendingContent = false;
    }

    if (!is_WHITE_SPACE(ch)) {
      captureEnd = state.position + 1;
    }

    ch = state.input.charCodeAt(++state.position);
  }

  captureSegment(state, captureStart, captureEnd, false);

  if (state.result) {
    return true;
  }

  state.kind = _kind;
  state.result = _result;
  return false;
}

function readSingleQuotedScalar(state, nodeIndent) {
  var ch,
      captureStart, captureEnd;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x27/* ' */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x27/* ' */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (ch === 0x27/* ' */) {
        captureStart = state.position;
        state.position++;
        captureEnd = state.position;
      } else {
        return true;
      }

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a single quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a single quoted scalar');
}

function readDoubleQuotedScalar(state, nodeIndent) {
  var captureStart,
      captureEnd,
      hexLength,
      hexResult,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x22/* " */) {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';
  state.position++;
  captureStart = captureEnd = state.position;

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    if (ch === 0x22/* " */) {
      captureSegment(state, captureStart, state.position, true);
      state.position++;
      return true;

    } else if (ch === 0x5C/* \ */) {
      captureSegment(state, captureStart, state.position, true);
      ch = state.input.charCodeAt(++state.position);

      if (is_EOL(ch)) {
        skipSeparationSpace(state, false, nodeIndent);

        // TODO: rework to inline fn with no type cast?
      } else if (ch < 256 && simpleEscapeCheck[ch]) {
        state.result += simpleEscapeMap[ch];
        state.position++;

      } else if ((tmp = escapedHexLen(ch)) > 0) {
        hexLength = tmp;
        hexResult = 0;

        for (; hexLength > 0; hexLength--) {
          ch = state.input.charCodeAt(++state.position);

          if ((tmp = fromHexCode(ch)) >= 0) {
            hexResult = (hexResult << 4) + tmp;

          } else {
            throwError(state, 'expected hexadecimal character');
          }
        }

        state.result += charFromCodepoint(hexResult);

        state.position++;

      } else {
        throwError(state, 'unknown escape sequence');
      }

      captureStart = captureEnd = state.position;

    } else if (is_EOL(ch)) {
      captureSegment(state, captureStart, captureEnd, true);
      writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
      captureStart = captureEnd = state.position;

    } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
      throwError(state, 'unexpected end of the document within a double quoted scalar');

    } else {
      state.position++;
      captureEnd = state.position;
    }
  }

  throwError(state, 'unexpected end of the stream within a double quoted scalar');
}

function readFlowCollection(state, nodeIndent) {
  var readNext = true,
      _line,
      _tag     = state.tag,
      _result,
      _anchor  = state.anchor,
      following,
      terminator,
      isPair,
      isExplicitPair,
      isMapping,
      overridableKeys = {},
      keyNode,
      keyTag,
      valueNode,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x5B/* [ */) {
    terminator = 0x5D;/* ] */
    isMapping = false;
    _result = [];
  } else if (ch === 0x7B/* { */) {
    terminator = 0x7D;/* } */
    isMapping = true;
    _result = {};
  } else {
    return false;
  }

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(++state.position);

  while (ch !== 0) {
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === terminator) {
      state.position++;
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = isMapping ? 'mapping' : 'sequence';
      state.result = _result;
      return true;
    } else if (!readNext) {
      throwError(state, 'missed comma between flow collection entries');
    }

    keyTag = keyNode = valueNode = null;
    isPair = isExplicitPair = false;

    if (ch === 0x3F/* ? */) {
      following = state.input.charCodeAt(state.position + 1);

      if (is_WS_OR_EOL(following)) {
        isPair = isExplicitPair = true;
        state.position++;
        skipSeparationSpace(state, true, nodeIndent);
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
    keyTag = state.tag;
    keyNode = state.result;
    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if ((isExplicitPair || state.line === _line) && ch === 0x3A/* : */) {
      isPair = true;
      ch = state.input.charCodeAt(++state.position);
      skipSeparationSpace(state, true, nodeIndent);
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      valueNode = state.result;
    }

    if (isMapping) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
    } else if (isPair) {
      _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode));
    } else {
      _result.push(keyNode);
    }

    skipSeparationSpace(state, true, nodeIndent);

    ch = state.input.charCodeAt(state.position);

    if (ch === 0x2C/* , */) {
      readNext = true;
      ch = state.input.charCodeAt(++state.position);
    } else {
      readNext = false;
    }
  }

  throwError(state, 'unexpected end of the stream within a flow collection');
}

function readBlockScalar(state, nodeIndent) {
  var captureStart,
      folding,
      chomping       = CHOMPING_CLIP,
      didReadContent = false,
      detectedIndent = false,
      textIndent     = nodeIndent,
      emptyLines     = 0,
      atMoreIndented = false,
      tmp,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch === 0x7C/* | */) {
    folding = false;
  } else if (ch === 0x3E/* > */) {
    folding = true;
  } else {
    return false;
  }

  state.kind = 'scalar';
  state.result = '';

  while (ch !== 0) {
    ch = state.input.charCodeAt(++state.position);

    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      if (CHOMPING_CLIP === chomping) {
        chomping = (ch === 0x2B/* + */) ? CHOMPING_KEEP : CHOMPING_STRIP;
      } else {
        throwError(state, 'repeat of a chomping mode identifier');
      }

    } else if ((tmp = fromDecimalCode(ch)) >= 0) {
      if (tmp === 0) {
        throwError(state, 'bad explicit indentation width of a block scalar; it cannot be less than one');
      } else if (!detectedIndent) {
        textIndent = nodeIndent + tmp - 1;
        detectedIndent = true;
      } else {
        throwError(state, 'repeat of an indentation width identifier');
      }

    } else {
      break;
    }
  }

  if (is_WHITE_SPACE(ch)) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (is_WHITE_SPACE(ch));

    if (ch === 0x23/* # */) {
      do { ch = state.input.charCodeAt(++state.position); }
      while (!is_EOL(ch) && (ch !== 0));
    }
  }

  while (ch !== 0) {
    readLineBreak(state);
    state.lineIndent = 0;

    ch = state.input.charCodeAt(state.position);

    while ((!detectedIndent || state.lineIndent < textIndent) &&
           (ch === 0x20/* Space */)) {
      state.lineIndent++;
      ch = state.input.charCodeAt(++state.position);
    }

    if (!detectedIndent && state.lineIndent > textIndent) {
      textIndent = state.lineIndent;
    }

    if (is_EOL(ch)) {
      emptyLines++;
      continue;
    }

    // End of the scalar.
    if (state.lineIndent < textIndent) {

      // Perform the chomping.
      if (chomping === CHOMPING_KEEP) {
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
      } else if (chomping === CHOMPING_CLIP) {
        if (didReadContent) { // i.e. only if the scalar is not empty.
          state.result += '\n';
        }
      }

      // Break this `while` cycle and go to the funciton's epilogue.
      break;
    }

    // Folded style: use fancy rules to handle line breaks.
    if (folding) {

      // Lines starting with white space characters (more-indented lines) are not folded.
      if (is_WHITE_SPACE(ch)) {
        atMoreIndented = true;
        // except for the first content line (cf. Example 8.1)
        state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);

      // End of more-indented block.
      } else if (atMoreIndented) {
        atMoreIndented = false;
        state.result += common.repeat('\n', emptyLines + 1);

      // Just one line break - perceive as the same line.
      } else if (emptyLines === 0) {
        if (didReadContent) { // i.e. only if we have already read some scalar content.
          state.result += ' ';
        }

      // Several line breaks - perceive as different lines.
      } else {
        state.result += common.repeat('\n', emptyLines);
      }

    // Literal style: just add exact number of line breaks between content lines.
    } else {
      // Keep all line breaks except the header line break.
      state.result += common.repeat('\n', didReadContent ? 1 + emptyLines : emptyLines);
    }

    didReadContent = true;
    detectedIndent = true;
    emptyLines = 0;
    captureStart = state.position;

    while (!is_EOL(ch) && (ch !== 0)) {
      ch = state.input.charCodeAt(++state.position);
    }

    captureSegment(state, captureStart, state.position, false);
  }

  return true;
}

function readBlockSequence(state, nodeIndent) {
  var _line,
      _tag      = state.tag,
      _anchor   = state.anchor,
      _result   = [],
      following,
      detected  = false,
      ch;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {

    if (ch !== 0x2D/* - */) {
      break;
    }

    following = state.input.charCodeAt(state.position + 1);

    if (!is_WS_OR_EOL(following)) {
      break;
    }

    detected = true;
    state.position++;

    if (skipSeparationSpace(state, true, -1)) {
      if (state.lineIndent <= nodeIndent) {
        _result.push(null);
        ch = state.input.charCodeAt(state.position);
        continue;
      }
    }

    _line = state.line;
    composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
    _result.push(state.result);
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if ((state.line === _line || state.lineIndent > nodeIndent) && (ch !== 0)) {
      throwError(state, 'bad indentation of a sequence entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'sequence';
    state.result = _result;
    return true;
  }
  return false;
}

function readBlockMapping(state, nodeIndent, flowIndent) {
  var following,
      allowCompact,
      _line,
      _tag          = state.tag,
      _anchor       = state.anchor,
      _result       = {},
      overridableKeys = {},
      keyTag        = null,
      keyNode       = null,
      valueNode     = null,
      atExplicitKey = false,
      detected      = false,
      ch;

  if (state.anchor !== null) {
    state.anchorMap[state.anchor] = _result;
  }

  ch = state.input.charCodeAt(state.position);

  while (ch !== 0) {
    following = state.input.charCodeAt(state.position + 1);
    _line = state.line; // Save the current line.

    //
    // Explicit notation case. There are two separate blocks:
    // first for the key (denoted by "?") and second for the value (denoted by ":")
    //
    if ((ch === 0x3F/* ? */ || ch === 0x3A/* : */) && is_WS_OR_EOL(following)) {

      if (ch === 0x3F/* ? */) {
        if (atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
          keyTag = keyNode = valueNode = null;
        }

        detected = true;
        atExplicitKey = true;
        allowCompact = true;

      } else if (atExplicitKey) {
        // i.e. 0x3A/* : */ === character after the explicit key.
        atExplicitKey = false;
        allowCompact = true;

      } else {
        throwError(state, 'incomplete explicit mapping pair; a key node is missed');
      }

      state.position += 1;
      ch = following;

    //
    // Implicit notation case. Flow-style node as the key first, then ":", and the value.
    //
    } else if (composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {

      if (state.line === _line) {
        ch = state.input.charCodeAt(state.position);

        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }

        if (ch === 0x3A/* : */) {
          ch = state.input.charCodeAt(++state.position);

          if (!is_WS_OR_EOL(ch)) {
            throwError(state, 'a whitespace character is expected after the key-value separator within a block mapping');
          }

          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
            keyTag = keyNode = valueNode = null;
          }

          detected = true;
          atExplicitKey = false;
          allowCompact = false;
          keyTag = state.tag;
          keyNode = state.result;

        } else if (detected) {
          throwError(state, 'can not read an implicit mapping pair; a colon is missed');

        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true; // Keep the result of `composeNode`.
        }

      } else if (detected) {
        throwError(state, 'can not read a block mapping entry; a multiline key may not be an implicit key');

      } else {
        state.tag = _tag;
        state.anchor = _anchor;
        return true; // Keep the result of `composeNode`.
      }

    } else {
      break; // Reading is done. Go to the epilogue.
    }

    //
    // Common reading code for both explicit and implicit notations.
    //
    if (state.line === _line || state.lineIndent > nodeIndent) {
      if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
        if (atExplicitKey) {
          keyNode = state.result;
        } else {
          valueNode = state.result;
        }
      }

      if (!atExplicitKey) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode);
        keyTag = keyNode = valueNode = null;
      }

      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
    }

    if (state.lineIndent > nodeIndent && (ch !== 0)) {
      throwError(state, 'bad indentation of a mapping entry');
    } else if (state.lineIndent < nodeIndent) {
      break;
    }
  }

  //
  // Epilogue.
  //

  // Special case: last mapping's node contains only the key in explicit notation.
  if (atExplicitKey) {
    storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null);
  }

  // Expose the resulting mapping.
  if (detected) {
    state.tag = _tag;
    state.anchor = _anchor;
    state.kind = 'mapping';
    state.result = _result;
  }

  return detected;
}

function readTagProperty(state) {
  var _position,
      isVerbatim = false,
      isNamed    = false,
      tagHandle,
      tagName,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x21/* ! */) return false;

  if (state.tag !== null) {
    throwError(state, 'duplication of a tag property');
  }

  ch = state.input.charCodeAt(++state.position);

  if (ch === 0x3C/* < */) {
    isVerbatim = true;
    ch = state.input.charCodeAt(++state.position);

  } else if (ch === 0x21/* ! */) {
    isNamed = true;
    tagHandle = '!!';
    ch = state.input.charCodeAt(++state.position);

  } else {
    tagHandle = '!';
  }

  _position = state.position;

  if (isVerbatim) {
    do { ch = state.input.charCodeAt(++state.position); }
    while (ch !== 0 && ch !== 0x3E/* > */);

    if (state.position < state.length) {
      tagName = state.input.slice(_position, state.position);
      ch = state.input.charCodeAt(++state.position);
    } else {
      throwError(state, 'unexpected end of the stream within a verbatim tag');
    }
  } else {
    while (ch !== 0 && !is_WS_OR_EOL(ch)) {

      if (ch === 0x21/* ! */) {
        if (!isNamed) {
          tagHandle = state.input.slice(_position - 1, state.position + 1);

          if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
            throwError(state, 'named tag handle cannot contain such characters');
          }

          isNamed = true;
          _position = state.position + 1;
        } else {
          throwError(state, 'tag suffix cannot contain exclamation marks');
        }
      }

      ch = state.input.charCodeAt(++state.position);
    }

    tagName = state.input.slice(_position, state.position);

    if (PATTERN_FLOW_INDICATORS.test(tagName)) {
      throwError(state, 'tag suffix cannot contain flow indicator characters');
    }
  }

  if (tagName && !PATTERN_TAG_URI.test(tagName)) {
    throwError(state, 'tag name cannot contain such characters: ' + tagName);
  }

  if (isVerbatim) {
    state.tag = tagName;

  } else if (_hasOwnProperty.call(state.tagMap, tagHandle)) {
    state.tag = state.tagMap[tagHandle] + tagName;

  } else if (tagHandle === '!') {
    state.tag = '!' + tagName;

  } else if (tagHandle === '!!') {
    state.tag = 'tag:yaml.org,2002:' + tagName;

  } else {
    throwError(state, 'undeclared tag handle "' + tagHandle + '"');
  }

  return true;
}

function readAnchorProperty(state) {
  var _position,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x26/* & */) return false;

  if (state.anchor !== null) {
    throwError(state, 'duplication of an anchor property');
  }

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an anchor node must contain at least one character');
  }

  state.anchor = state.input.slice(_position, state.position);
  return true;
}

function readAlias(state) {
  var _position, alias,
      ch;

  ch = state.input.charCodeAt(state.position);

  if (ch !== 0x2A/* * */) return false;

  ch = state.input.charCodeAt(++state.position);
  _position = state.position;

  while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
    ch = state.input.charCodeAt(++state.position);
  }

  if (state.position === _position) {
    throwError(state, 'name of an alias node must contain at least one character');
  }

  alias = state.input.slice(_position, state.position);

  if (!state.anchorMap.hasOwnProperty(alias)) {
    throwError(state, 'unidentified alias "' + alias + '"');
  }

  state.result = state.anchorMap[alias];
  skipSeparationSpace(state, true, -1);
  return true;
}

function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
  var allowBlockStyles,
      allowBlockScalars,
      allowBlockCollections,
      indentStatus = 1, // 1: this>parent, 0: this=parent, -1: this<parent
      atNewLine  = false,
      hasContent = false,
      typeIndex,
      typeQuantity,
      type,
      flowIndent,
      blockIndent;

  if (state.listener !== null) {
    state.listener('open', state);
  }

  state.tag    = null;
  state.anchor = null;
  state.kind   = null;
  state.result = null;

  allowBlockStyles = allowBlockScalars = allowBlockCollections =
    CONTEXT_BLOCK_OUT === nodeContext ||
    CONTEXT_BLOCK_IN  === nodeContext;

  if (allowToSeek) {
    if (skipSeparationSpace(state, true, -1)) {
      atNewLine = true;

      if (state.lineIndent > parentIndent) {
        indentStatus = 1;
      } else if (state.lineIndent === parentIndent) {
        indentStatus = 0;
      } else if (state.lineIndent < parentIndent) {
        indentStatus = -1;
      }
    }
  }

  if (indentStatus === 1) {
    while (readTagProperty(state) || readAnchorProperty(state)) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        allowBlockCollections = allowBlockStyles;

        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      } else {
        allowBlockCollections = false;
      }
    }
  }

  if (allowBlockCollections) {
    allowBlockCollections = atNewLine || allowCompact;
  }

  if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
    if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
      flowIndent = parentIndent;
    } else {
      flowIndent = parentIndent + 1;
    }

    blockIndent = state.position - state.lineStart;

    if (indentStatus === 1) {
      if (allowBlockCollections &&
          (readBlockSequence(state, blockIndent) ||
           readBlockMapping(state, blockIndent, flowIndent)) ||
          readFlowCollection(state, flowIndent)) {
        hasContent = true;
      } else {
        if ((allowBlockScalars && readBlockScalar(state, flowIndent)) ||
            readSingleQuotedScalar(state, flowIndent) ||
            readDoubleQuotedScalar(state, flowIndent)) {
          hasContent = true;

        } else if (readAlias(state)) {
          hasContent = true;

          if (state.tag !== null || state.anchor !== null) {
            throwError(state, 'alias node should not have any properties');
          }

        } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
          hasContent = true;

          if (state.tag === null) {
            state.tag = '?';
          }
        }

        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else if (indentStatus === 0) {
      // Special case: block sequences are allowed to have same indentation level as the parent.
      // http://www.yaml.org/spec/1.2/spec.html#id2799784
      hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
    }
  }

  if (state.tag !== null && state.tag !== '!') {
    if (state.tag === '?') {
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length;
           typeIndex < typeQuantity;
           typeIndex += 1) {
        type = state.implicitTypes[typeIndex];

        // Implicit resolving is not allowed for non-scalar types, and '?'
        // non-specific tag is only assigned to plain scalars. So, it isn't
        // needed to check for 'kind' conformity.

        if (type.resolve(state.result)) { // `state.result` updated in resolver if matched
          state.result = type.construct(state.result);
          state.tag = type.tag;
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (_hasOwnProperty.call(state.typeMap[state.kind || 'fallback'], state.tag)) {
      type = state.typeMap[state.kind || 'fallback'][state.tag];

      if (state.result !== null && type.kind !== state.kind) {
        throwError(state, 'unacceptable node kind for !<' + state.tag + '> tag; it should be "' + type.kind + '", not "' + state.kind + '"');
      }

      if (!type.resolve(state.result)) { // `state.result` updated in resolver if matched
        throwError(state, 'cannot resolve a node with !<' + state.tag + '> explicit tag');
      } else {
        state.result = type.construct(state.result);
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    } else {
      throwError(state, 'unknown tag !<' + state.tag + '>');
    }
  }

  if (state.listener !== null) {
    state.listener('close', state);
  }
  return state.tag !== null ||  state.anchor !== null || hasContent;
}

function readDocument(state) {
  var documentStart = state.position,
      _position,
      directiveName,
      directiveArgs,
      hasDirectives = false,
      ch;

  state.version = null;
  state.checkLineBreaks = state.legacy;
  state.tagMap = {};
  state.anchorMap = {};

  while ((ch = state.input.charCodeAt(state.position)) !== 0) {
    skipSeparationSpace(state, true, -1);

    ch = state.input.charCodeAt(state.position);

    if (state.lineIndent > 0 || ch !== 0x25/* % */) {
      break;
    }

    hasDirectives = true;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;

    while (ch !== 0 && !is_WS_OR_EOL(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }

    directiveName = state.input.slice(_position, state.position);
    directiveArgs = [];

    if (directiveName.length < 1) {
      throwError(state, 'directive name must not be less than one character in length');
    }

    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      if (ch === 0x23/* # */) {
        do { ch = state.input.charCodeAt(++state.position); }
        while (ch !== 0 && !is_EOL(ch));
        break;
      }

      if (is_EOL(ch)) break;

      _position = state.position;

      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }

      directiveArgs.push(state.input.slice(_position, state.position));
    }

    if (ch !== 0) readLineBreak(state);

    if (_hasOwnProperty.call(directiveHandlers, directiveName)) {
      directiveHandlers[directiveName](state, directiveName, directiveArgs);
    } else {
      throwWarning(state, 'unknown document directive "' + directiveName + '"');
    }
  }

  skipSeparationSpace(state, true, -1);

  if (state.lineIndent === 0 &&
      state.input.charCodeAt(state.position)     === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 1) === 0x2D/* - */ &&
      state.input.charCodeAt(state.position + 2) === 0x2D/* - */) {
    state.position += 3;
    skipSeparationSpace(state, true, -1);

  } else if (hasDirectives) {
    throwError(state, 'directives end mark is expected');
  }

  composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
  skipSeparationSpace(state, true, -1);

  if (state.checkLineBreaks &&
      PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
    throwWarning(state, 'non-ASCII line breaks are interpreted as content');
  }

  state.documents.push(state.result);

  if (state.position === state.lineStart && testDocumentSeparator(state)) {

    if (state.input.charCodeAt(state.position) === 0x2E/* . */) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    }
    return;
  }

  if (state.position < (state.length - 1)) {
    throwError(state, 'end of the stream or a document separator is expected');
  } else {
    return;
  }
}


function loadDocuments(input, options) {
  input = String(input);
  options = options || {};

  if (input.length !== 0) {

    // Add tailing `\n` if not exists
    if (input.charCodeAt(input.length - 1) !== 0x0A/* LF */ &&
        input.charCodeAt(input.length - 1) !== 0x0D/* CR */) {
      input += '\n';
    }

    // Strip BOM
    if (input.charCodeAt(0) === 0xFEFF) {
      input = input.slice(1);
    }
  }

  var state = new State(input, options);

  // Use 0 as string terminator. That significantly simplifies bounds check.
  state.input += '\0';

  while (state.input.charCodeAt(state.position) === 0x20/* Space */) {
    state.lineIndent += 1;
    state.position += 1;
  }

  while (state.position < (state.length - 1)) {
    readDocument(state);
  }

  return state.documents;
}


function loadAll(input, iterator, options) {
  var documents = loadDocuments(input, options), index, length;

  for (index = 0, length = documents.length; index < length; index += 1) {
    iterator(documents[index]);
  }
}


function load(input, options) {
  var documents = loadDocuments(input, options);

  if (documents.length === 0) {
    /*eslint-disable no-undefined*/
    return undefined;
  } else if (documents.length === 1) {
    return documents[0];
  }
  throw new YAMLException('expected a single document in the stream, but found more');
}


function safeLoadAll(input, output, options) {
  loadAll(input, output, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}


function safeLoad(input, options) {
  return load(input, common.extend({ schema: DEFAULT_SAFE_SCHEMA }, options));
}


module.exports.loadAll     = loadAll;
module.exports.load        = load;
module.exports.safeLoadAll = safeLoadAll;
module.exports.safeLoad    = safeLoad;

},{"./common":60,"./exception":62,"./mark":64,"./schema/default_full":67,"./schema/default_safe":68}],64:[function(require,module,exports){
'use strict';


var common = require('./common');


function Mark(name, buffer, position, line, column) {
  this.name     = name;
  this.buffer   = buffer;
  this.position = position;
  this.line     = line;
  this.column   = column;
}


Mark.prototype.getSnippet = function getSnippet(indent, maxLength) {
  var head, start, tail, end, snippet;

  if (!this.buffer) return null;

  indent = indent || 4;
  maxLength = maxLength || 75;

  head = '';
  start = this.position;

  while (start > 0 && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start - 1)) === -1) {
    start -= 1;
    if (this.position - start > (maxLength / 2 - 1)) {
      head = ' ... ';
      start += 5;
      break;
    }
  }

  tail = '';
  end = this.position;

  while (end < this.buffer.length && '\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end)) === -1) {
    end += 1;
    if (end - this.position > (maxLength / 2 - 1)) {
      tail = ' ... ';
      end -= 5;
      break;
    }
  }

  snippet = this.buffer.slice(start, end);

  return common.repeat(' ', indent) + head + snippet + tail + '\n' +
         common.repeat(' ', indent + this.position - start + head.length) + '^';
};


Mark.prototype.toString = function toString(compact) {
  var snippet, where = '';

  if (this.name) {
    where += 'in "' + this.name + '" ';
  }

  where += 'at line ' + (this.line + 1) + ', column ' + (this.column + 1);

  if (!compact) {
    snippet = this.getSnippet();

    if (snippet) {
      where += ':\n' + snippet;
    }
  }

  return where;
};


module.exports = Mark;

},{"./common":60}],65:[function(require,module,exports){
'use strict';

/*eslint-disable max-len*/

var common        = require('./common');
var YAMLException = require('./exception');
var Type          = require('./type');


function compileList(schema, name, result) {
  var exclude = [];

  schema.include.forEach(function (includedSchema) {
    result = compileList(includedSchema, name, result);
  });

  schema[name].forEach(function (currentType) {
    result.forEach(function (previousType, previousIndex) {
      if (previousType.tag === currentType.tag && previousType.kind === currentType.kind) {
        exclude.push(previousIndex);
      }
    });

    result.push(currentType);
  });

  return result.filter(function (type, index) {
    return exclude.indexOf(index) === -1;
  });
}


function compileMap(/* lists... */) {
  var result = {
        scalar: {},
        sequence: {},
        mapping: {},
        fallback: {}
      }, index, length;

  function collectType(type) {
    result[type.kind][type.tag] = result['fallback'][type.tag] = type;
  }

  for (index = 0, length = arguments.length; index < length; index += 1) {
    arguments[index].forEach(collectType);
  }
  return result;
}


function Schema(definition) {
  this.include  = definition.include  || [];
  this.implicit = definition.implicit || [];
  this.explicit = definition.explicit || [];

  this.implicit.forEach(function (type) {
    if (type.loadKind && type.loadKind !== 'scalar') {
      throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');
    }
  });

  this.compiledImplicit = compileList(this, 'implicit', []);
  this.compiledExplicit = compileList(this, 'explicit', []);
  this.compiledTypeMap  = compileMap(this.compiledImplicit, this.compiledExplicit);
}


Schema.DEFAULT = null;


Schema.create = function createSchema() {
  var schemas, types;

  switch (arguments.length) {
    case 1:
      schemas = Schema.DEFAULT;
      types = arguments[0];
      break;

    case 2:
      schemas = arguments[0];
      types = arguments[1];
      break;

    default:
      throw new YAMLException('Wrong number of arguments for Schema.create function');
  }

  schemas = common.toArray(schemas);
  types = common.toArray(types);

  if (!schemas.every(function (schema) { return schema instanceof Schema; })) {
    throw new YAMLException('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');
  }

  if (!types.every(function (type) { return type instanceof Type; })) {
    throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');
  }

  return new Schema({
    include: schemas,
    explicit: types
  });
};


module.exports = Schema;

},{"./common":60,"./exception":62,"./type":71}],66:[function(require,module,exports){
// Standard YAML's Core schema.
// http://www.yaml.org/spec/1.2/spec.html#id2804923
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, Core schema has no distinctions from JSON schema is JS-YAML.


'use strict';


var Schema = require('../schema');


module.exports = new Schema({
  include: [
    require('./json')
  ]
});

},{"../schema":65,"./json":70}],67:[function(require,module,exports){
// JS-YAML's default schema for `load` function.
// It is not described in the YAML specification.
//
// This schema is based on JS-YAML's default safe schema and includes
// JavaScript-specific types: !!js/undefined, !!js/regexp and !!js/function.
//
// Also this schema is used as default base schema at `Schema.create` function.


'use strict';


var Schema = require('../schema');


module.exports = Schema.DEFAULT = new Schema({
  include: [
    require('./default_safe')
  ],
  explicit: [
    require('../type/js/undefined'),
    require('../type/js/regexp'),
    require('../type/js/function')
  ]
});

},{"../schema":65,"../type/js/function":76,"../type/js/regexp":77,"../type/js/undefined":78,"./default_safe":68}],68:[function(require,module,exports){
// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)


'use strict';


var Schema = require('../schema');


module.exports = new Schema({
  include: [
    require('./core')
  ],
  implicit: [
    require('../type/timestamp'),
    require('../type/merge')
  ],
  explicit: [
    require('../type/binary'),
    require('../type/omap'),
    require('../type/pairs'),
    require('../type/set')
  ]
});

},{"../schema":65,"../type/binary":72,"../type/merge":80,"../type/omap":82,"../type/pairs":83,"../type/set":85,"../type/timestamp":87,"./core":66}],69:[function(require,module,exports){
// Standard YAML's Failsafe schema.
// http://www.yaml.org/spec/1.2/spec.html#id2802346


'use strict';


var Schema = require('../schema');


module.exports = new Schema({
  explicit: [
    require('../type/str'),
    require('../type/seq'),
    require('../type/map')
  ]
});

},{"../schema":65,"../type/map":79,"../type/seq":84,"../type/str":86}],70:[function(require,module,exports){
// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.


'use strict';


var Schema = require('../schema');


module.exports = new Schema({
  include: [
    require('./failsafe')
  ],
  implicit: [
    require('../type/null'),
    require('../type/bool'),
    require('../type/int'),
    require('../type/float')
  ]
});

},{"../schema":65,"../type/bool":73,"../type/float":74,"../type/int":75,"../type/null":81,"./failsafe":69}],71:[function(require,module,exports){
'use strict';

var YAMLException = require('./exception');

var TYPE_CONSTRUCTOR_OPTIONS = [
  'kind',
  'resolve',
  'construct',
  'instanceOf',
  'predicate',
  'represent',
  'defaultStyle',
  'styleAliases'
];

var YAML_NODE_KINDS = [
  'scalar',
  'sequence',
  'mapping'
];

function compileStyleAliases(map) {
  var result = {};

  if (map !== null) {
    Object.keys(map).forEach(function (style) {
      map[style].forEach(function (alias) {
        result[String(alias)] = style;
      });
    });
  }

  return result;
}

function Type(tag, options) {
  options = options || {};

  Object.keys(options).forEach(function (name) {
    if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
      throw new YAMLException('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
    }
  });

  // TODO: Add tag format check.
  this.tag          = tag;
  this.kind         = options['kind']         || null;
  this.resolve      = options['resolve']      || function () { return true; };
  this.construct    = options['construct']    || function (data) { return data; };
  this.instanceOf   = options['instanceOf']   || null;
  this.predicate    = options['predicate']    || null;
  this.represent    = options['represent']    || null;
  this.defaultStyle = options['defaultStyle'] || null;
  this.styleAliases = compileStyleAliases(options['styleAliases'] || null);

  if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
    throw new YAMLException('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
  }
}

module.exports = Type;

},{"./exception":62}],72:[function(require,module,exports){
'use strict';

/*eslint-disable no-bitwise*/

var NodeBuffer;

try {
  // A trick for browserified version, to not include `Buffer` shim
  var _require = require;
  NodeBuffer = _require('buffer').Buffer;
} catch (__) {}

var Type       = require('../type');


// [ 64, 65, 66 ] -> [ padding, CR, LF ]
var BASE64_MAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';


function resolveYamlBinary(data) {
  if (data === null) return false;

  var code, idx, bitlen = 0, max = data.length, map = BASE64_MAP;

  // Convert one by one.
  for (idx = 0; idx < max; idx++) {
    code = map.indexOf(data.charAt(idx));

    // Skip CR/LF
    if (code > 64) continue;

    // Fail on illegal characters
    if (code < 0) return false;

    bitlen += 6;
  }

  // If there are any bits left, source was corrupted
  return (bitlen % 8) === 0;
}

function constructYamlBinary(data) {
  var idx, tailbits,
      input = data.replace(/[\r\n=]/g, ''), // remove CR/LF & padding to simplify scan
      max = input.length,
      map = BASE64_MAP,
      bits = 0,
      result = [];

  // Collect by 6*4 bits (3 bytes)

  for (idx = 0; idx < max; idx++) {
    if ((idx % 4 === 0) && idx) {
      result.push((bits >> 16) & 0xFF);
      result.push((bits >> 8) & 0xFF);
      result.push(bits & 0xFF);
    }

    bits = (bits << 6) | map.indexOf(input.charAt(idx));
  }

  // Dump tail

  tailbits = (max % 4) * 6;

  if (tailbits === 0) {
    result.push((bits >> 16) & 0xFF);
    result.push((bits >> 8) & 0xFF);
    result.push(bits & 0xFF);
  } else if (tailbits === 18) {
    result.push((bits >> 10) & 0xFF);
    result.push((bits >> 2) & 0xFF);
  } else if (tailbits === 12) {
    result.push((bits >> 4) & 0xFF);
  }

  // Wrap into Buffer for NodeJS and leave Array for browser
  if (NodeBuffer) return new NodeBuffer(result);

  return result;
}

function representYamlBinary(object /*, style*/) {
  var result = '', bits = 0, idx, tail,
      max = object.length,
      map = BASE64_MAP;

  // Convert every three bytes to 4 ASCII characters.

  for (idx = 0; idx < max; idx++) {
    if ((idx % 3 === 0) && idx) {
      result += map[(bits >> 18) & 0x3F];
      result += map[(bits >> 12) & 0x3F];
      result += map[(bits >> 6) & 0x3F];
      result += map[bits & 0x3F];
    }

    bits = (bits << 8) + object[idx];
  }

  // Dump tail

  tail = max % 3;

  if (tail === 0) {
    result += map[(bits >> 18) & 0x3F];
    result += map[(bits >> 12) & 0x3F];
    result += map[(bits >> 6) & 0x3F];
    result += map[bits & 0x3F];
  } else if (tail === 2) {
    result += map[(bits >> 10) & 0x3F];
    result += map[(bits >> 4) & 0x3F];
    result += map[(bits << 2) & 0x3F];
    result += map[64];
  } else if (tail === 1) {
    result += map[(bits >> 2) & 0x3F];
    result += map[(bits << 4) & 0x3F];
    result += map[64];
    result += map[64];
  }

  return result;
}

function isBinary(object) {
  return NodeBuffer && NodeBuffer.isBuffer(object);
}

module.exports = new Type('tag:yaml.org,2002:binary', {
  kind: 'scalar',
  resolve: resolveYamlBinary,
  construct: constructYamlBinary,
  predicate: isBinary,
  represent: representYamlBinary
});

},{"../type":71}],73:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlBoolean(data) {
  if (data === null) return false;

  var max = data.length;

  return (max === 4 && (data === 'true' || data === 'True' || data === 'TRUE')) ||
         (max === 5 && (data === 'false' || data === 'False' || data === 'FALSE'));
}

function constructYamlBoolean(data) {
  return data === 'true' ||
         data === 'True' ||
         data === 'TRUE';
}

function isBoolean(object) {
  return Object.prototype.toString.call(object) === '[object Boolean]';
}

module.exports = new Type('tag:yaml.org,2002:bool', {
  kind: 'scalar',
  resolve: resolveYamlBoolean,
  construct: constructYamlBoolean,
  predicate: isBoolean,
  represent: {
    lowercase: function (object) { return object ? 'true' : 'false'; },
    uppercase: function (object) { return object ? 'TRUE' : 'FALSE'; },
    camelcase: function (object) { return object ? 'True' : 'False'; }
  },
  defaultStyle: 'lowercase'
});

},{"../type":71}],74:[function(require,module,exports){
'use strict';

var common = require('../common');
var Type   = require('../type');

var YAML_FLOAT_PATTERN = new RegExp(
  '^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?' +
  '|\\.[0-9_]+(?:[eE][-+][0-9]+)?' +
  '|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' +
  '|[-+]?\\.(?:inf|Inf|INF)' +
  '|\\.(?:nan|NaN|NAN))$');

function resolveYamlFloat(data) {
  if (data === null) return false;

  if (!YAML_FLOAT_PATTERN.test(data)) return false;

  return true;
}

function constructYamlFloat(data) {
  var value, sign, base, digits;

  value  = data.replace(/_/g, '').toLowerCase();
  sign   = value[0] === '-' ? -1 : 1;
  digits = [];

  if ('+-'.indexOf(value[0]) >= 0) {
    value = value.slice(1);
  }

  if (value === '.inf') {
    return (sign === 1) ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;

  } else if (value === '.nan') {
    return NaN;

  } else if (value.indexOf(':') >= 0) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseFloat(v, 10));
    });

    value = 0.0;
    base = 1;

    digits.forEach(function (d) {
      value += d * base;
      base *= 60;
    });

    return sign * value;

  }
  return sign * parseFloat(value, 10);
}


var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;

function representYamlFloat(object, style) {
  var res;

  if (isNaN(object)) {
    switch (style) {
      case 'lowercase': return '.nan';
      case 'uppercase': return '.NAN';
      case 'camelcase': return '.NaN';
    }
  } else if (Number.POSITIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '.inf';
      case 'uppercase': return '.INF';
      case 'camelcase': return '.Inf';
    }
  } else if (Number.NEGATIVE_INFINITY === object) {
    switch (style) {
      case 'lowercase': return '-.inf';
      case 'uppercase': return '-.INF';
      case 'camelcase': return '-.Inf';
    }
  } else if (common.isNegativeZero(object)) {
    return '-0.0';
  }

  res = object.toString(10);

  // JS stringifier can build scientific format without dots: 5e-100,
  // while YAML requres dot: 5.e-100. Fix it with simple hack

  return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace('e', '.e') : res;
}

function isFloat(object) {
  return (Object.prototype.toString.call(object) === '[object Number]') &&
         (object % 1 !== 0 || common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:float', {
  kind: 'scalar',
  resolve: resolveYamlFloat,
  construct: constructYamlFloat,
  predicate: isFloat,
  represent: representYamlFloat,
  defaultStyle: 'lowercase'
});

},{"../common":60,"../type":71}],75:[function(require,module,exports){
'use strict';

var common = require('../common');
var Type   = require('../type');

function isHexCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */)) ||
         ((0x41/* A */ <= c) && (c <= 0x46/* F */)) ||
         ((0x61/* a */ <= c) && (c <= 0x66/* f */));
}

function isOctCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x37/* 7 */));
}

function isDecCode(c) {
  return ((0x30/* 0 */ <= c) && (c <= 0x39/* 9 */));
}

function resolveYamlInteger(data) {
  if (data === null) return false;

  var max = data.length,
      index = 0,
      hasDigits = false,
      ch;

  if (!max) return false;

  ch = data[index];

  // sign
  if (ch === '-' || ch === '+') {
    ch = data[++index];
  }

  if (ch === '0') {
    // 0
    if (index + 1 === max) return true;
    ch = data[++index];

    // base 2, base 8, base 16

    if (ch === 'b') {
      // base 2
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (ch !== '0' && ch !== '1') return false;
        hasDigits = true;
      }
      return hasDigits;
    }


    if (ch === 'x') {
      // base 16
      index++;

      for (; index < max; index++) {
        ch = data[index];
        if (ch === '_') continue;
        if (!isHexCode(data.charCodeAt(index))) return false;
        hasDigits = true;
      }
      return hasDigits;
    }

    // base 8
    for (; index < max; index++) {
      ch = data[index];
      if (ch === '_') continue;
      if (!isOctCode(data.charCodeAt(index))) return false;
      hasDigits = true;
    }
    return hasDigits;
  }

  // base 10 (except 0) or base 60

  for (; index < max; index++) {
    ch = data[index];
    if (ch === '_') continue;
    if (ch === ':') break;
    if (!isDecCode(data.charCodeAt(index))) {
      return false;
    }
    hasDigits = true;
  }

  if (!hasDigits) return false;

  // if !base60 - done;
  if (ch !== ':') return true;

  // base60 almost not used, no needs to optimize
  return /^(:[0-5]?[0-9])+$/.test(data.slice(index));
}

function constructYamlInteger(data) {
  var value = data, sign = 1, ch, base, digits = [];

  if (value.indexOf('_') !== -1) {
    value = value.replace(/_/g, '');
  }

  ch = value[0];

  if (ch === '-' || ch === '+') {
    if (ch === '-') sign = -1;
    value = value.slice(1);
    ch = value[0];
  }

  if (value === '0') return 0;

  if (ch === '0') {
    if (value[1] === 'b') return sign * parseInt(value.slice(2), 2);
    if (value[1] === 'x') return sign * parseInt(value, 16);
    return sign * parseInt(value, 8);
  }

  if (value.indexOf(':') !== -1) {
    value.split(':').forEach(function (v) {
      digits.unshift(parseInt(v, 10));
    });

    value = 0;
    base = 1;

    digits.forEach(function (d) {
      value += (d * base);
      base *= 60;
    });

    return sign * value;

  }

  return sign * parseInt(value, 10);
}

function isInteger(object) {
  return (Object.prototype.toString.call(object)) === '[object Number]' &&
         (object % 1 === 0 && !common.isNegativeZero(object));
}

module.exports = new Type('tag:yaml.org,2002:int', {
  kind: 'scalar',
  resolve: resolveYamlInteger,
  construct: constructYamlInteger,
  predicate: isInteger,
  represent: {
    binary:      function (object) { return '0b' + object.toString(2); },
    octal:       function (object) { return '0'  + object.toString(8); },
    decimal:     function (object) { return        object.toString(10); },
    hexadecimal: function (object) { return '0x' + object.toString(16).toUpperCase(); }
  },
  defaultStyle: 'decimal',
  styleAliases: {
    binary:      [ 2,  'bin' ],
    octal:       [ 8,  'oct' ],
    decimal:     [ 10, 'dec' ],
    hexadecimal: [ 16, 'hex' ]
  }
});

},{"../common":60,"../type":71}],76:[function(require,module,exports){
'use strict';

var esprima;

// Browserified version does not have esprima
//
// 1. For node.js just require module as deps
// 2. For browser try to require mudule via external AMD system.
//    If not found - try to fallback to window.esprima. If not
//    found too - then fail to parse.
//
try {
  // workaround to exclude package from browserify list.
  var _require = require;
  esprima = _require('esprima');
} catch (_) {
  /*global window */
  if (typeof window !== 'undefined') esprima = window.esprima;
}

var Type = require('../../type');

function resolveJavascriptFunction(data) {
  if (data === null) return false;

  try {
    var source = '(' + data + ')',
        ast    = esprima.parse(source, { range: true });

    if (ast.type                    !== 'Program'             ||
        ast.body.length             !== 1                     ||
        ast.body[0].type            !== 'ExpressionStatement' ||
        ast.body[0].expression.type !== 'FunctionExpression') {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

function constructJavascriptFunction(data) {
  /*jslint evil:true*/

  var source = '(' + data + ')',
      ast    = esprima.parse(source, { range: true }),
      params = [],
      body;

  if (ast.type                    !== 'Program'             ||
      ast.body.length             !== 1                     ||
      ast.body[0].type            !== 'ExpressionStatement' ||
      ast.body[0].expression.type !== 'FunctionExpression') {
    throw new Error('Failed to resolve function');
  }

  ast.body[0].expression.params.forEach(function (param) {
    params.push(param.name);
  });

  body = ast.body[0].expression.body.range;

  // Esprima's ranges include the first '{' and the last '}' characters on
  // function expressions. So cut them out.
  /*eslint-disable no-new-func*/
  return new Function(params, source.slice(body[0] + 1, body[1] - 1));
}

function representJavascriptFunction(object /*, style*/) {
  return object.toString();
}

function isFunction(object) {
  return Object.prototype.toString.call(object) === '[object Function]';
}

module.exports = new Type('tag:yaml.org,2002:js/function', {
  kind: 'scalar',
  resolve: resolveJavascriptFunction,
  construct: constructJavascriptFunction,
  predicate: isFunction,
  represent: representJavascriptFunction
});

},{"../../type":71}],77:[function(require,module,exports){
'use strict';

var Type = require('../../type');

function resolveJavascriptRegExp(data) {
  if (data === null) return false;
  if (data.length === 0) return false;

  var regexp = data,
      tail   = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // if regexp starts with '/' it can have modifiers and must be properly closed
  // `/foo/gim` - modifiers tail can be maximum 3 chars
  if (regexp[0] === '/') {
    if (tail) modifiers = tail[1];

    if (modifiers.length > 3) return false;
    // if expression starts with /, is should be properly terminated
    if (regexp[regexp.length - modifiers.length - 1] !== '/') return false;
  }

  return true;
}

function constructJavascriptRegExp(data) {
  var regexp = data,
      tail   = /\/([gim]*)$/.exec(data),
      modifiers = '';

  // `/foo/gim` - tail can be maximum 4 chars
  if (regexp[0] === '/') {
    if (tail) modifiers = tail[1];
    regexp = regexp.slice(1, regexp.length - modifiers.length - 1);
  }

  return new RegExp(regexp, modifiers);
}

function representJavascriptRegExp(object /*, style*/) {
  var result = '/' + object.source + '/';

  if (object.global) result += 'g';
  if (object.multiline) result += 'm';
  if (object.ignoreCase) result += 'i';

  return result;
}

function isRegExp(object) {
  return Object.prototype.toString.call(object) === '[object RegExp]';
}

module.exports = new Type('tag:yaml.org,2002:js/regexp', {
  kind: 'scalar',
  resolve: resolveJavascriptRegExp,
  construct: constructJavascriptRegExp,
  predicate: isRegExp,
  represent: representJavascriptRegExp
});

},{"../../type":71}],78:[function(require,module,exports){
'use strict';

var Type = require('../../type');

function resolveJavascriptUndefined() {
  return true;
}

function constructJavascriptUndefined() {
  /*eslint-disable no-undefined*/
  return undefined;
}

function representJavascriptUndefined() {
  return '';
}

function isUndefined(object) {
  return typeof object === 'undefined';
}

module.exports = new Type('tag:yaml.org,2002:js/undefined', {
  kind: 'scalar',
  resolve: resolveJavascriptUndefined,
  construct: constructJavascriptUndefined,
  predicate: isUndefined,
  represent: representJavascriptUndefined
});

},{"../../type":71}],79:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:map', {
  kind: 'mapping',
  construct: function (data) { return data !== null ? data : {}; }
});

},{"../type":71}],80:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});

},{"../type":71}],81:[function(require,module,exports){
'use strict';

var Type = require('../type');

function resolveYamlNull(data) {
  if (data === null) return true;

  var max = data.length;

  return (max === 1 && data === '~') ||
         (max === 4 && (data === 'null' || data === 'Null' || data === 'NULL'));
}

function constructYamlNull() {
  return null;
}

function isNull(object) {
  return object === null;
}

module.exports = new Type('tag:yaml.org,2002:null', {
  kind: 'scalar',
  resolve: resolveYamlNull,
  construct: constructYamlNull,
  predicate: isNull,
  represent: {
    canonical: function () { return '~';    },
    lowercase: function () { return 'null'; },
    uppercase: function () { return 'NULL'; },
    camelcase: function () { return 'Null'; }
  },
  defaultStyle: 'lowercase'
});

},{"../type":71}],82:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;
var _toString       = Object.prototype.toString;

function resolveYamlOmap(data) {
  if (data === null) return true;

  var objectKeys = [], index, length, pair, pairKey, pairHasKey,
      object = data;

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];
    pairHasKey = false;

    if (_toString.call(pair) !== '[object Object]') return false;

    for (pairKey in pair) {
      if (_hasOwnProperty.call(pair, pairKey)) {
        if (!pairHasKey) pairHasKey = true;
        else return false;
      }
    }

    if (!pairHasKey) return false;

    if (objectKeys.indexOf(pairKey) === -1) objectKeys.push(pairKey);
    else return false;
  }

  return true;
}

function constructYamlOmap(data) {
  return data !== null ? data : [];
}

module.exports = new Type('tag:yaml.org,2002:omap', {
  kind: 'sequence',
  resolve: resolveYamlOmap,
  construct: constructYamlOmap
});

},{"../type":71}],83:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _toString = Object.prototype.toString;

function resolveYamlPairs(data) {
  if (data === null) return true;

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    if (_toString.call(pair) !== '[object Object]') return false;

    keys = Object.keys(pair);

    if (keys.length !== 1) return false;

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return true;
}

function constructYamlPairs(data) {
  if (data === null) return [];

  var index, length, pair, keys, result,
      object = data;

  result = new Array(object.length);

  for (index = 0, length = object.length; index < length; index += 1) {
    pair = object[index];

    keys = Object.keys(pair);

    result[index] = [ keys[0], pair[keys[0]] ];
  }

  return result;
}

module.exports = new Type('tag:yaml.org,2002:pairs', {
  kind: 'sequence',
  resolve: resolveYamlPairs,
  construct: constructYamlPairs
});

},{"../type":71}],84:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:seq', {
  kind: 'sequence',
  construct: function (data) { return data !== null ? data : []; }
});

},{"../type":71}],85:[function(require,module,exports){
'use strict';

var Type = require('../type');

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function resolveYamlSet(data) {
  if (data === null) return true;

  var key, object = data;

  for (key in object) {
    if (_hasOwnProperty.call(object, key)) {
      if (object[key] !== null) return false;
    }
  }

  return true;
}

function constructYamlSet(data) {
  return data !== null ? data : {};
}

module.exports = new Type('tag:yaml.org,2002:set', {
  kind: 'mapping',
  resolve: resolveYamlSet,
  construct: constructYamlSet
});

},{"../type":71}],86:[function(require,module,exports){
'use strict';

var Type = require('../type');

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return data !== null ? data : ''; }
});

},{"../type":71}],87:[function(require,module,exports){
'use strict';

var Type = require('../type');

var YAML_DATE_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9])'                    + // [2] month
  '-([0-9][0-9])$');                   // [3] day

var YAML_TIMESTAMP_REGEXP = new RegExp(
  '^([0-9][0-9][0-9][0-9])'          + // [1] year
  '-([0-9][0-9]?)'                   + // [2] month
  '-([0-9][0-9]?)'                   + // [3] day
  '(?:[Tt]|[ \\t]+)'                 + // ...
  '([0-9][0-9]?)'                    + // [4] hour
  ':([0-9][0-9])'                    + // [5] minute
  ':([0-9][0-9])'                    + // [6] second
  '(?:\\.([0-9]*))?'                 + // [7] fraction
  '(?:[ \\t]*(Z|([-+])([0-9][0-9]?)' + // [8] tz [9] tz_sign [10] tz_hour
  '(?::([0-9][0-9]))?))?$');           // [11] tz_minute

function resolveYamlTimestamp(data) {
  if (data === null) return false;
  if (YAML_DATE_REGEXP.exec(data) !== null) return true;
  if (YAML_TIMESTAMP_REGEXP.exec(data) !== null) return true;
  return false;
}

function constructYamlTimestamp(data) {
  var match, year, month, day, hour, minute, second, fraction = 0,
      delta = null, tz_hour, tz_minute, date;

  match = YAML_DATE_REGEXP.exec(data);
  if (match === null) match = YAML_TIMESTAMP_REGEXP.exec(data);

  if (match === null) throw new Error('Date resolve error');

  // match: [1] year [2] month [3] day

  year = +(match[1]);
  month = +(match[2]) - 1; // JS month starts with 0
  day = +(match[3]);

  if (!match[4]) { // no hour
    return new Date(Date.UTC(year, month, day));
  }

  // match: [4] hour [5] minute [6] second [7] fraction

  hour = +(match[4]);
  minute = +(match[5]);
  second = +(match[6]);

  if (match[7]) {
    fraction = match[7].slice(0, 3);
    while (fraction.length < 3) { // milli-seconds
      fraction += '0';
    }
    fraction = +fraction;
  }

  // match: [8] tz [9] tz_sign [10] tz_hour [11] tz_minute

  if (match[9]) {
    tz_hour = +(match[10]);
    tz_minute = +(match[11] || 0);
    delta = (tz_hour * 60 + tz_minute) * 60000; // delta in mili-seconds
    if (match[9] === '-') delta = -delta;
  }

  date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));

  if (delta) date.setTime(date.getTime() - delta);

  return date;
}

function representYamlTimestamp(object /*, style*/) {
  return object.toISOString();
}

module.exports = new Type('tag:yaml.org,2002:timestamp', {
  kind: 'scalar',
  resolve: resolveYamlTimestamp,
  construct: constructYamlTimestamp,
  instanceOf: Date,
  represent: representYamlTimestamp
});

},{"../type":71}],88:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

},{}],89:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

}).call(this,require('_process'))
},{"_process":90}],90:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],91:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":92}],92:[function(require,module,exports){
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
},{"./_stream_readable":94,"./_stream_writable":96,"core-util-is":6,"inherits":55,"process-nextick-args":89}],93:[function(require,module,exports){
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":95,"core-util-is":6,"inherits":55}],94:[function(require,module,exports){
(function (process){
'use strict';

module.exports = Readable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/BufferList');
var StringDecoder;

util.inherits(Readable, Stream);

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = bufferShim.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');
      stream.emit('error', _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function (ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = bufferShim.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'))
},{"./_stream_duplex":92,"./internal/streams/BufferList":97,"_process":90,"buffer":5,"buffer-shims":4,"core-util-is":6,"events":53,"inherits":55,"isarray":57,"process-nextick-args":89,"string_decoder/":115,"util":2}],95:[function(require,module,exports){
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":92,"core-util-is":6,"inherits":55}],96:[function(require,module,exports){
(function (process){
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream;
(function () {
  try {
    Stream = require('st' + 'ream');
  } catch (_) {} finally {
    if (!Stream) Stream = require('events').EventEmitter;
  }
})();
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~ ~this.highWaterMark;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;
  // Always throw error if a null is written
  // if we are not in object mode then throw
  // if it is not a buffer, string, or undefined.
  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = bufferShim.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);

  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) processNextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
        afterWrite(stream, state, finished, cb);
      }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
}).call(this,require('_process'))
},{"./_stream_duplex":92,"_process":90,"buffer":5,"buffer-shims":4,"core-util-is":6,"events":53,"inherits":55,"process-nextick-args":89,"util-deprecate":168}],97:[function(require,module,exports){
'use strict';

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

module.exports = BufferList;

function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

BufferList.prototype.push = function (v) {
  var entry = { data: v, next: null };
  if (this.length > 0) this.tail.next = entry;else this.head = entry;
  this.tail = entry;
  ++this.length;
};

BufferList.prototype.unshift = function (v) {
  var entry = { data: v, next: this.head };
  if (this.length === 0) this.tail = entry;
  this.head = entry;
  ++this.length;
};

BufferList.prototype.shift = function () {
  if (this.length === 0) return;
  var ret = this.head.data;
  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
  --this.length;
  return ret;
};

BufferList.prototype.clear = function () {
  this.head = this.tail = null;
  this.length = 0;
};

BufferList.prototype.join = function (s) {
  if (this.length === 0) return '';
  var p = this.head;
  var ret = '' + p.data;
  while (p = p.next) {
    ret += s + p.data;
  }return ret;
};

BufferList.prototype.concat = function (n) {
  if (this.length === 0) return bufferShim.alloc(0);
  if (this.length === 1) return this.head.data;
  var ret = bufferShim.allocUnsafe(n >>> 0);
  var p = this.head;
  var i = 0;
  while (p) {
    p.data.copy(ret, i);
    i += p.data.length;
    p = p.next;
  }
  return ret;
};
},{"buffer":5,"buffer-shims":4}],98:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":93}],99:[function(require,module,exports){
(function (process){
var Stream = (function (){
  try {
    return require('st' + 'ream'); // hack to fix a circular dependency issue when used with browserify
  } catch(_){}
}());
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream || exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

if (!process.browser && process.env.READABLE_STREAM === 'disable' && Stream) {
  module.exports = Stream;
}

}).call(this,require('_process'))
},{"./lib/_stream_duplex.js":92,"./lib/_stream_passthrough.js":93,"./lib/_stream_readable.js":94,"./lib/_stream_transform.js":95,"./lib/_stream_writable.js":96,"_process":90}],100:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":95}],101:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":96}],102:[function(require,module,exports){
(function (Buffer){
;(function (sax) { // wrapper for non-node envs
  sax.parser = function (strict, opt) { return new SAXParser(strict, opt) }
  sax.SAXParser = SAXParser
  sax.SAXStream = SAXStream
  sax.createStream = createStream

  // When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
  // When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
  // since that's the earliest that a buffer overrun could occur.  This way, checks are
  // as rare as required, but as often as necessary to ensure never crossing this bound.
  // Furthermore, buffers are only tested at most once per write(), so passing a very
  // large string into write() might have undesirable effects, but this is manageable by
  // the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
  // edge case, result in creating at most one complete copy of the string passed in.
  // Set to Infinity to have unlimited buffers.
  sax.MAX_BUFFER_LENGTH = 64 * 1024

  var buffers = [
    'comment', 'sgmlDecl', 'textNode', 'tagName', 'doctype',
    'procInstName', 'procInstBody', 'entity', 'attribName',
    'attribValue', 'cdata', 'script'
  ]

  sax.EVENTS = [
    'text',
    'processinginstruction',
    'sgmldeclaration',
    'doctype',
    'comment',
    'opentagstart',
    'attribute',
    'opentag',
    'closetag',
    'opencdata',
    'cdata',
    'closecdata',
    'error',
    'end',
    'ready',
    'script',
    'opennamespace',
    'closenamespace'
  ]

  function SAXParser (strict, opt) {
    if (!(this instanceof SAXParser)) {
      return new SAXParser(strict, opt)
    }

    var parser = this
    clearBuffers(parser)
    parser.q = parser.c = ''
    parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH
    parser.opt = opt || {}
    parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags
    parser.looseCase = parser.opt.lowercase ? 'toLowerCase' : 'toUpperCase'
    parser.tags = []
    parser.closed = parser.closedRoot = parser.sawRoot = false
    parser.tag = parser.error = null
    parser.strict = !!strict
    parser.noscript = !!(strict || parser.opt.noscript)
    parser.state = S.BEGIN
    parser.strictEntities = parser.opt.strictEntities
    parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES)
    parser.attribList = []

    // namespaces form a prototype chain.
    // it always points at the current tag,
    // which protos to its parent tag.
    if (parser.opt.xmlns) {
      parser.ns = Object.create(rootNS)
    }

    // mostly just for error reporting
    parser.trackPosition = parser.opt.position !== false
    if (parser.trackPosition) {
      parser.position = parser.line = parser.column = 0
    }
    emit(parser, 'onready')
  }

  if (!Object.create) {
    Object.create = function (o) {
      function F () {}
      F.prototype = o
      var newf = new F()
      return newf
    }
  }

  if (!Object.keys) {
    Object.keys = function (o) {
      var a = []
      for (var i in o) if (o.hasOwnProperty(i)) a.push(i)
      return a
    }
  }

  function checkBufferLength (parser) {
    var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10)
    var maxActual = 0
    for (var i = 0, l = buffers.length; i < l; i++) {
      var len = parser[buffers[i]].length
      if (len > maxAllowed) {
        // Text/cdata nodes can get big, and since they're buffered,
        // we can get here under normal conditions.
        // Avoid issues by emitting the text node now,
        // so at least it won't get any bigger.
        switch (buffers[i]) {
          case 'textNode':
            closeText(parser)
            break

          case 'cdata':
            emitNode(parser, 'oncdata', parser.cdata)
            parser.cdata = ''
            break

          case 'script':
            emitNode(parser, 'onscript', parser.script)
            parser.script = ''
            break

          default:
            error(parser, 'Max buffer length exceeded: ' + buffers[i])
        }
      }
      maxActual = Math.max(maxActual, len)
    }
    // schedule the next check for the earliest possible buffer overrun.
    var m = sax.MAX_BUFFER_LENGTH - maxActual
    parser.bufferCheckPosition = m + parser.position
  }

  function clearBuffers (parser) {
    for (var i = 0, l = buffers.length; i < l; i++) {
      parser[buffers[i]] = ''
    }
  }

  function flushBuffers (parser) {
    closeText(parser)
    if (parser.cdata !== '') {
      emitNode(parser, 'oncdata', parser.cdata)
      parser.cdata = ''
    }
    if (parser.script !== '') {
      emitNode(parser, 'onscript', parser.script)
      parser.script = ''
    }
  }

  SAXParser.prototype = {
    end: function () { end(this) },
    write: write,
    resume: function () { this.error = null; return this },
    close: function () { return this.write(null) },
    flush: function () { flushBuffers(this) }
  }

  var Stream
  try {
    Stream = require('stream').Stream
  } catch (ex) {
    Stream = function () {}
  }

  var streamWraps = sax.EVENTS.filter(function (ev) {
    return ev !== 'error' && ev !== 'end'
  })

  function createStream (strict, opt) {
    return new SAXStream(strict, opt)
  }

  function SAXStream (strict, opt) {
    if (!(this instanceof SAXStream)) {
      return new SAXStream(strict, opt)
    }

    Stream.apply(this)

    this._parser = new SAXParser(strict, opt)
    this.writable = true
    this.readable = true

    var me = this

    this._parser.onend = function () {
      me.emit('end')
    }

    this._parser.onerror = function (er) {
      me.emit('error', er)

      // if didn't throw, then means error was handled.
      // go ahead and clear error, so we can write again.
      me._parser.error = null
    }

    this._decoder = null

    streamWraps.forEach(function (ev) {
      Object.defineProperty(me, 'on' + ev, {
        get: function () {
          return me._parser['on' + ev]
        },
        set: function (h) {
          if (!h) {
            me.removeAllListeners(ev)
            me._parser['on' + ev] = h
            return h
          }
          me.on(ev, h)
        },
        enumerable: true,
        configurable: false
      })
    })
  }

  SAXStream.prototype = Object.create(Stream.prototype, {
    constructor: {
      value: SAXStream
    }
  })

  SAXStream.prototype.write = function (data) {
    if (typeof Buffer === 'function' &&
      typeof Buffer.isBuffer === 'function' &&
      Buffer.isBuffer(data)) {
      if (!this._decoder) {
        var SD = require('string_decoder').StringDecoder
        this._decoder = new SD('utf8')
      }
      data = this._decoder.write(data)
    }

    this._parser.write(data.toString())
    this.emit('data', data)
    return true
  }

  SAXStream.prototype.end = function (chunk) {
    if (chunk && chunk.length) {
      this.write(chunk)
    }
    this._parser.end()
    return true
  }

  SAXStream.prototype.on = function (ev, handler) {
    var me = this
    if (!me._parser['on' + ev] && streamWraps.indexOf(ev) !== -1) {
      me._parser['on' + ev] = function () {
        var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
        args.splice(0, 0, ev)
        me.emit.apply(me, args)
      }
    }

    return Stream.prototype.on.call(me, ev, handler)
  }

  // character classes and tokens
  var whitespace = '\r\n\t '

  // this really needs to be replaced with character classes.
  // XML allows all manner of ridiculous numbers and digits.

  // (Letter | "_" | ":")
  var quote = '\'"'
  var attribEnd = whitespace + '>'
  var CDATA = '[CDATA['
  var DOCTYPE = 'DOCTYPE'
  var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace'
  var XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/'
  var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE }

  // turn all the string character sets into character class objects.
  whitespace = charClass(whitespace)

  // http://www.w3.org/TR/REC-xml/#NT-NameStartChar
  // This implementation works on strings, a single character at a time
  // as such, it cannot ever support astral-plane characters (10000-EFFFF)
  // without a significant breaking change to either this  parser, or the
  // JavaScript language.  Implementation of an emoji-capable xml parser
  // is left as an exercise for the reader.
  var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/

  var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

  var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/
  var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

  quote = charClass(quote)
  attribEnd = charClass(attribEnd)

  function charClass (str) {
    return str.split('').reduce(function (s, c) {
      s[c] = true
      return s
    }, {})
  }

  function isMatch (regex, c) {
    return regex.test(c)
  }

  function is (charclass, c) {
    return charclass[c]
  }

  function notMatch (regex, c) {
    return !isMatch(regex, c)
  }

  function not (charclass, c) {
    return !is(charclass, c)
  }

  var S = 0
  sax.STATE = {
    BEGIN: S++, // leading byte order mark or whitespace
    BEGIN_WHITESPACE: S++, // leading whitespace
    TEXT: S++, // general stuff
    TEXT_ENTITY: S++, // &amp and such.
    OPEN_WAKA: S++, // <
    SGML_DECL: S++, // <!BLARG
    SGML_DECL_QUOTED: S++, // <!BLARG foo "bar
    DOCTYPE: S++, // <!DOCTYPE
    DOCTYPE_QUOTED: S++, // <!DOCTYPE "//blah
    DOCTYPE_DTD: S++, // <!DOCTYPE "//blah" [ ...
    DOCTYPE_DTD_QUOTED: S++, // <!DOCTYPE "//blah" [ "foo
    COMMENT_STARTING: S++, // <!-
    COMMENT: S++, // <!--
    COMMENT_ENDING: S++, // <!-- blah -
    COMMENT_ENDED: S++, // <!-- blah --
    CDATA: S++, // <![CDATA[ something
    CDATA_ENDING: S++, // ]
    CDATA_ENDING_2: S++, // ]]
    PROC_INST: S++, // <?hi
    PROC_INST_BODY: S++, // <?hi there
    PROC_INST_ENDING: S++, // <?hi "there" ?
    OPEN_TAG: S++, // <strong
    OPEN_TAG_SLASH: S++, // <strong /
    ATTRIB: S++, // <a
    ATTRIB_NAME: S++, // <a foo
    ATTRIB_NAME_SAW_WHITE: S++, // <a foo _
    ATTRIB_VALUE: S++, // <a foo=
    ATTRIB_VALUE_QUOTED: S++, // <a foo="bar
    ATTRIB_VALUE_CLOSED: S++, // <a foo="bar"
    ATTRIB_VALUE_UNQUOTED: S++, // <a foo=bar
    ATTRIB_VALUE_ENTITY_Q: S++, // <foo bar="&quot;"
    ATTRIB_VALUE_ENTITY_U: S++, // <foo bar=&quot
    CLOSE_TAG: S++, // </a
    CLOSE_TAG_SAW_WHITE: S++, // </a   >
    SCRIPT: S++, // <script> ...
    SCRIPT_ENDING: S++ // <script> ... <
  }

  sax.XML_ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'"
  }

  sax.ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'",
    'AElig': 198,
    'Aacute': 193,
    'Acirc': 194,
    'Agrave': 192,
    'Aring': 197,
    'Atilde': 195,
    'Auml': 196,
    'Ccedil': 199,
    'ETH': 208,
    'Eacute': 201,
    'Ecirc': 202,
    'Egrave': 200,
    'Euml': 203,
    'Iacute': 205,
    'Icirc': 206,
    'Igrave': 204,
    'Iuml': 207,
    'Ntilde': 209,
    'Oacute': 211,
    'Ocirc': 212,
    'Ograve': 210,
    'Oslash': 216,
    'Otilde': 213,
    'Ouml': 214,
    'THORN': 222,
    'Uacute': 218,
    'Ucirc': 219,
    'Ugrave': 217,
    'Uuml': 220,
    'Yacute': 221,
    'aacute': 225,
    'acirc': 226,
    'aelig': 230,
    'agrave': 224,
    'aring': 229,
    'atilde': 227,
    'auml': 228,
    'ccedil': 231,
    'eacute': 233,
    'ecirc': 234,
    'egrave': 232,
    'eth': 240,
    'euml': 235,
    'iacute': 237,
    'icirc': 238,
    'igrave': 236,
    'iuml': 239,
    'ntilde': 241,
    'oacute': 243,
    'ocirc': 244,
    'ograve': 242,
    'oslash': 248,
    'otilde': 245,
    'ouml': 246,
    'szlig': 223,
    'thorn': 254,
    'uacute': 250,
    'ucirc': 251,
    'ugrave': 249,
    'uuml': 252,
    'yacute': 253,
    'yuml': 255,
    'copy': 169,
    'reg': 174,
    'nbsp': 160,
    'iexcl': 161,
    'cent': 162,
    'pound': 163,
    'curren': 164,
    'yen': 165,
    'brvbar': 166,
    'sect': 167,
    'uml': 168,
    'ordf': 170,
    'laquo': 171,
    'not': 172,
    'shy': 173,
    'macr': 175,
    'deg': 176,
    'plusmn': 177,
    'sup1': 185,
    'sup2': 178,
    'sup3': 179,
    'acute': 180,
    'micro': 181,
    'para': 182,
    'middot': 183,
    'cedil': 184,
    'ordm': 186,
    'raquo': 187,
    'frac14': 188,
    'frac12': 189,
    'frac34': 190,
    'iquest': 191,
    'times': 215,
    'divide': 247,
    'OElig': 338,
    'oelig': 339,
    'Scaron': 352,
    'scaron': 353,
    'Yuml': 376,
    'fnof': 402,
    'circ': 710,
    'tilde': 732,
    'Alpha': 913,
    'Beta': 914,
    'Gamma': 915,
    'Delta': 916,
    'Epsilon': 917,
    'Zeta': 918,
    'Eta': 919,
    'Theta': 920,
    'Iota': 921,
    'Kappa': 922,
    'Lambda': 923,
    'Mu': 924,
    'Nu': 925,
    'Xi': 926,
    'Omicron': 927,
    'Pi': 928,
    'Rho': 929,
    'Sigma': 931,
    'Tau': 932,
    'Upsilon': 933,
    'Phi': 934,
    'Chi': 935,
    'Psi': 936,
    'Omega': 937,
    'alpha': 945,
    'beta': 946,
    'gamma': 947,
    'delta': 948,
    'epsilon': 949,
    'zeta': 950,
    'eta': 951,
    'theta': 952,
    'iota': 953,
    'kappa': 954,
    'lambda': 955,
    'mu': 956,
    'nu': 957,
    'xi': 958,
    'omicron': 959,
    'pi': 960,
    'rho': 961,
    'sigmaf': 962,
    'sigma': 963,
    'tau': 964,
    'upsilon': 965,
    'phi': 966,
    'chi': 967,
    'psi': 968,
    'omega': 969,
    'thetasym': 977,
    'upsih': 978,
    'piv': 982,
    'ensp': 8194,
    'emsp': 8195,
    'thinsp': 8201,
    'zwnj': 8204,
    'zwj': 8205,
    'lrm': 8206,
    'rlm': 8207,
    'ndash': 8211,
    'mdash': 8212,
    'lsquo': 8216,
    'rsquo': 8217,
    'sbquo': 8218,
    'ldquo': 8220,
    'rdquo': 8221,
    'bdquo': 8222,
    'dagger': 8224,
    'Dagger': 8225,
    'bull': 8226,
    'hellip': 8230,
    'permil': 8240,
    'prime': 8242,
    'Prime': 8243,
    'lsaquo': 8249,
    'rsaquo': 8250,
    'oline': 8254,
    'frasl': 8260,
    'euro': 8364,
    'image': 8465,
    'weierp': 8472,
    'real': 8476,
    'trade': 8482,
    'alefsym': 8501,
    'larr': 8592,
    'uarr': 8593,
    'rarr': 8594,
    'darr': 8595,
    'harr': 8596,
    'crarr': 8629,
    'lArr': 8656,
    'uArr': 8657,
    'rArr': 8658,
    'dArr': 8659,
    'hArr': 8660,
    'forall': 8704,
    'part': 8706,
    'exist': 8707,
    'empty': 8709,
    'nabla': 8711,
    'isin': 8712,
    'notin': 8713,
    'ni': 8715,
    'prod': 8719,
    'sum': 8721,
    'minus': 8722,
    'lowast': 8727,
    'radic': 8730,
    'prop': 8733,
    'infin': 8734,
    'ang': 8736,
    'and': 8743,
    'or': 8744,
    'cap': 8745,
    'cup': 8746,
    'int': 8747,
    'there4': 8756,
    'sim': 8764,
    'cong': 8773,
    'asymp': 8776,
    'ne': 8800,
    'equiv': 8801,
    'le': 8804,
    'ge': 8805,
    'sub': 8834,
    'sup': 8835,
    'nsub': 8836,
    'sube': 8838,
    'supe': 8839,
    'oplus': 8853,
    'otimes': 8855,
    'perp': 8869,
    'sdot': 8901,
    'lceil': 8968,
    'rceil': 8969,
    'lfloor': 8970,
    'rfloor': 8971,
    'lang': 9001,
    'rang': 9002,
    'loz': 9674,
    'spades': 9824,
    'clubs': 9827,
    'hearts': 9829,
    'diams': 9830
  }

  Object.keys(sax.ENTITIES).forEach(function (key) {
    var e = sax.ENTITIES[key]
    var s = typeof e === 'number' ? String.fromCharCode(e) : e
    sax.ENTITIES[key] = s
  })

  for (var s in sax.STATE) {
    sax.STATE[sax.STATE[s]] = s
  }

  // shorthand
  S = sax.STATE

  function emit (parser, event, data) {
    parser[event] && parser[event](data)
  }

  function emitNode (parser, nodeType, data) {
    if (parser.textNode) closeText(parser)
    emit(parser, nodeType, data)
  }

  function closeText (parser) {
    parser.textNode = textopts(parser.opt, parser.textNode)
    if (parser.textNode) emit(parser, 'ontext', parser.textNode)
    parser.textNode = ''
  }

  function textopts (opt, text) {
    if (opt.trim) text = text.trim()
    if (opt.normalize) text = text.replace(/\s+/g, ' ')
    return text
  }

  function error (parser, er) {
    closeText(parser)
    if (parser.trackPosition) {
      er += '\nLine: ' + parser.line +
        '\nColumn: ' + parser.column +
        '\nChar: ' + parser.c
    }
    er = new Error(er)
    parser.error = er
    emit(parser, 'onerror', er)
    return parser
  }

  function end (parser) {
    if (parser.sawRoot && !parser.closedRoot) strictFail(parser, 'Unclosed root tag')
    if ((parser.state !== S.BEGIN) &&
      (parser.state !== S.BEGIN_WHITESPACE) &&
      (parser.state !== S.TEXT)) {
      error(parser, 'Unexpected end')
    }
    closeText(parser)
    parser.c = ''
    parser.closed = true
    emit(parser, 'onend')
    SAXParser.call(parser, parser.strict, parser.opt)
    return parser
  }

  function strictFail (parser, message) {
    if (typeof parser !== 'object' || !(parser instanceof SAXParser)) {
      throw new Error('bad call to strictFail')
    }
    if (parser.strict) {
      error(parser, message)
    }
  }

  function newTag (parser) {
    if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]()
    var parent = parser.tags[parser.tags.length - 1] || parser
    var tag = parser.tag = { name: parser.tagName, attributes: {} }

    // will be overridden if tag contails an xmlns="foo" or xmlns:foo="bar"
    if (parser.opt.xmlns) {
      tag.ns = parent.ns
    }
    parser.attribList.length = 0
    emitNode(parser, 'onopentagstart', tag)
  }

  function qname (name, attribute) {
    var i = name.indexOf(':')
    var qualName = i < 0 ? [ '', name ] : name.split(':')
    var prefix = qualName[0]
    var local = qualName[1]

    // <x "xmlns"="http://foo">
    if (attribute && name === 'xmlns') {
      prefix = 'xmlns'
      local = ''
    }

    return { prefix: prefix, local: local }
  }

  function attrib (parser) {
    if (!parser.strict) {
      parser.attribName = parser.attribName[parser.looseCase]()
    }

    if (parser.attribList.indexOf(parser.attribName) !== -1 ||
      parser.tag.attributes.hasOwnProperty(parser.attribName)) {
      parser.attribName = parser.attribValue = ''
      return
    }

    if (parser.opt.xmlns) {
      var qn = qname(parser.attribName, true)
      var prefix = qn.prefix
      var local = qn.local

      if (prefix === 'xmlns') {
        // namespace binding attribute. push the binding into scope
        if (local === 'xml' && parser.attribValue !== XML_NAMESPACE) {
          strictFail(parser,
            'xml: prefix must be bound to ' + XML_NAMESPACE + '\n' +
            'Actual: ' + parser.attribValue)
        } else if (local === 'xmlns' && parser.attribValue !== XMLNS_NAMESPACE) {
          strictFail(parser,
            'xmlns: prefix must be bound to ' + XMLNS_NAMESPACE + '\n' +
            'Actual: ' + parser.attribValue)
        } else {
          var tag = parser.tag
          var parent = parser.tags[parser.tags.length - 1] || parser
          if (tag.ns === parent.ns) {
            tag.ns = Object.create(parent.ns)
          }
          tag.ns[local] = parser.attribValue
        }
      }

      // defer onattribute events until all attributes have been seen
      // so any new bindings can take effect. preserve attribute order
      // so deferred events can be emitted in document order
      parser.attribList.push([parser.attribName, parser.attribValue])
    } else {
      // in non-xmlns mode, we can emit the event right away
      parser.tag.attributes[parser.attribName] = parser.attribValue
      emitNode(parser, 'onattribute', {
        name: parser.attribName,
        value: parser.attribValue
      })
    }

    parser.attribName = parser.attribValue = ''
  }

  function openTag (parser, selfClosing) {
    if (parser.opt.xmlns) {
      // emit namespace binding events
      var tag = parser.tag

      // add namespace info to tag
      var qn = qname(parser.tagName)
      tag.prefix = qn.prefix
      tag.local = qn.local
      tag.uri = tag.ns[qn.prefix] || ''

      if (tag.prefix && !tag.uri) {
        strictFail(parser, 'Unbound namespace prefix: ' +
          JSON.stringify(parser.tagName))
        tag.uri = qn.prefix
      }

      var parent = parser.tags[parser.tags.length - 1] || parser
      if (tag.ns && parent.ns !== tag.ns) {
        Object.keys(tag.ns).forEach(function (p) {
          emitNode(parser, 'onopennamespace', {
            prefix: p,
            uri: tag.ns[p]
          })
        })
      }

      // handle deferred onattribute events
      // Note: do not apply default ns to attributes:
      //   http://www.w3.org/TR/REC-xml-names/#defaulting
      for (var i = 0, l = parser.attribList.length; i < l; i++) {
        var nv = parser.attribList[i]
        var name = nv[0]
        var value = nv[1]
        var qualName = qname(name, true)
        var prefix = qualName.prefix
        var local = qualName.local
        var uri = prefix === '' ? '' : (tag.ns[prefix] || '')
        var a = {
          name: name,
          value: value,
          prefix: prefix,
          local: local,
          uri: uri
        }

        // if there's any attributes with an undefined namespace,
        // then fail on them now.
        if (prefix && prefix !== 'xmlns' && !uri) {
          strictFail(parser, 'Unbound namespace prefix: ' +
            JSON.stringify(prefix))
          a.uri = prefix
        }
        parser.tag.attributes[name] = a
        emitNode(parser, 'onattribute', a)
      }
      parser.attribList.length = 0
    }

    parser.tag.isSelfClosing = !!selfClosing

    // process the tag
    parser.sawRoot = true
    parser.tags.push(parser.tag)
    emitNode(parser, 'onopentag', parser.tag)
    if (!selfClosing) {
      // special case for <script> in non-strict mode.
      if (!parser.noscript && parser.tagName.toLowerCase() === 'script') {
        parser.state = S.SCRIPT
      } else {
        parser.state = S.TEXT
      }
      parser.tag = null
      parser.tagName = ''
    }
    parser.attribName = parser.attribValue = ''
    parser.attribList.length = 0
  }

  function closeTag (parser) {
    if (!parser.tagName) {
      strictFail(parser, 'Weird empty close tag.')
      parser.textNode += '</>'
      parser.state = S.TEXT
      return
    }

    if (parser.script) {
      if (parser.tagName !== 'script') {
        parser.script += '</' + parser.tagName + '>'
        parser.tagName = ''
        parser.state = S.SCRIPT
        return
      }
      emitNode(parser, 'onscript', parser.script)
      parser.script = ''
    }

    // first make sure that the closing tag actually exists.
    // <a><b></c></b></a> will close everything, otherwise.
    var t = parser.tags.length
    var tagName = parser.tagName
    if (!parser.strict) {
      tagName = tagName[parser.looseCase]()
    }
    var closeTo = tagName
    while (t--) {
      var close = parser.tags[t]
      if (close.name !== closeTo) {
        // fail the first time in strict mode
        strictFail(parser, 'Unexpected close tag')
      } else {
        break
      }
    }

    // didn't find it.  we already failed for strict, so just abort.
    if (t < 0) {
      strictFail(parser, 'Unmatched closing tag: ' + parser.tagName)
      parser.textNode += '</' + parser.tagName + '>'
      parser.state = S.TEXT
      return
    }
    parser.tagName = tagName
    var s = parser.tags.length
    while (s-- > t) {
      var tag = parser.tag = parser.tags.pop()
      parser.tagName = parser.tag.name
      emitNode(parser, 'onclosetag', parser.tagName)

      var x = {}
      for (var i in tag.ns) {
        x[i] = tag.ns[i]
      }

      var parent = parser.tags[parser.tags.length - 1] || parser
      if (parser.opt.xmlns && tag.ns !== parent.ns) {
        // remove namespace bindings introduced by tag
        Object.keys(tag.ns).forEach(function (p) {
          var n = tag.ns[p]
          emitNode(parser, 'onclosenamespace', { prefix: p, uri: n })
        })
      }
    }
    if (t === 0) parser.closedRoot = true
    parser.tagName = parser.attribValue = parser.attribName = ''
    parser.attribList.length = 0
    parser.state = S.TEXT
  }

  function parseEntity (parser) {
    var entity = parser.entity
    var entityLC = entity.toLowerCase()
    var num
    var numStr = ''

    if (parser.ENTITIES[entity]) {
      return parser.ENTITIES[entity]
    }
    if (parser.ENTITIES[entityLC]) {
      return parser.ENTITIES[entityLC]
    }
    entity = entityLC
    if (entity.charAt(0) === '#') {
      if (entity.charAt(1) === 'x') {
        entity = entity.slice(2)
        num = parseInt(entity, 16)
        numStr = num.toString(16)
      } else {
        entity = entity.slice(1)
        num = parseInt(entity, 10)
        numStr = num.toString(10)
      }
    }
    entity = entity.replace(/^0+/, '')
    if (numStr.toLowerCase() !== entity) {
      strictFail(parser, 'Invalid character entity')
      return '&' + parser.entity + ';'
    }

    return String.fromCodePoint(num)
  }

  function beginWhiteSpace (parser, c) {
    if (c === '<') {
      parser.state = S.OPEN_WAKA
      parser.startTagPosition = parser.position
    } else if (not(whitespace, c)) {
      // have to process this as a text node.
      // weird, but happens.
      strictFail(parser, 'Non-whitespace before first tag.')
      parser.textNode = c
      parser.state = S.TEXT
    }
  }

  function charAt (chunk, i) {
    var result = ''
    if (i < chunk.length) {
      result = chunk.charAt(i)
    }
    return result
  }

  function write (chunk) {
    var parser = this
    if (this.error) {
      throw this.error
    }
    if (parser.closed) {
      return error(parser,
        'Cannot write after close. Assign an onready handler.')
    }
    if (chunk === null) {
      return end(parser)
    }
    if (typeof chunk === 'object') {
      chunk = chunk.toString()
    }
    var i = 0
    var c = ''
    while (true) {
      c = charAt(chunk, i++)
      parser.c = c

      if (!c) {
        break
      }

      if (parser.trackPosition) {
        parser.position++
        if (c === '\n') {
          parser.line++
          parser.column = 0
        } else {
          parser.column++
        }
      }

      switch (parser.state) {
        case S.BEGIN:
          parser.state = S.BEGIN_WHITESPACE
          if (c === '\uFEFF') {
            continue
          }
          beginWhiteSpace(parser, c)
          continue

        case S.BEGIN_WHITESPACE:
          beginWhiteSpace(parser, c)
          continue

        case S.TEXT:
          if (parser.sawRoot && !parser.closedRoot) {
            var starti = i - 1
            while (c && c !== '<' && c !== '&') {
              c = charAt(chunk, i++)
              if (c && parser.trackPosition) {
                parser.position++
                if (c === '\n') {
                  parser.line++
                  parser.column = 0
                } else {
                  parser.column++
                }
              }
            }
            parser.textNode += chunk.substring(starti, i - 1)
          }
          if (c === '<' && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
            parser.state = S.OPEN_WAKA
            parser.startTagPosition = parser.position
          } else {
            if (not(whitespace, c) && (!parser.sawRoot || parser.closedRoot)) {
              strictFail(parser, 'Text data outside of root node.')
            }
            if (c === '&') {
              parser.state = S.TEXT_ENTITY
            } else {
              parser.textNode += c
            }
          }
          continue

        case S.SCRIPT:
          // only non-strict
          if (c === '<') {
            parser.state = S.SCRIPT_ENDING
          } else {
            parser.script += c
          }
          continue

        case S.SCRIPT_ENDING:
          if (c === '/') {
            parser.state = S.CLOSE_TAG
          } else {
            parser.script += '<' + c
            parser.state = S.SCRIPT
          }
          continue

        case S.OPEN_WAKA:
          // either a /, ?, !, or text is coming next.
          if (c === '!') {
            parser.state = S.SGML_DECL
            parser.sgmlDecl = ''
          } else if (is(whitespace, c)) {
            // wait for it...
          } else if (isMatch(nameStart, c)) {
            parser.state = S.OPEN_TAG
            parser.tagName = c
          } else if (c === '/') {
            parser.state = S.CLOSE_TAG
            parser.tagName = ''
          } else if (c === '?') {
            parser.state = S.PROC_INST
            parser.procInstName = parser.procInstBody = ''
          } else {
            strictFail(parser, 'Unencoded <')
            // if there was some whitespace, then add that in.
            if (parser.startTagPosition + 1 < parser.position) {
              var pad = parser.position - parser.startTagPosition
              c = new Array(pad).join(' ') + c
            }
            parser.textNode += '<' + c
            parser.state = S.TEXT
          }
          continue

        case S.SGML_DECL:
          if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
            emitNode(parser, 'onopencdata')
            parser.state = S.CDATA
            parser.sgmlDecl = ''
            parser.cdata = ''
          } else if (parser.sgmlDecl + c === '--') {
            parser.state = S.COMMENT
            parser.comment = ''
            parser.sgmlDecl = ''
          } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
            parser.state = S.DOCTYPE
            if (parser.doctype || parser.sawRoot) {
              strictFail(parser,
                'Inappropriately located doctype declaration')
            }
            parser.doctype = ''
            parser.sgmlDecl = ''
          } else if (c === '>') {
            emitNode(parser, 'onsgmldeclaration', parser.sgmlDecl)
            parser.sgmlDecl = ''
            parser.state = S.TEXT
          } else if (is(quote, c)) {
            parser.state = S.SGML_DECL_QUOTED
            parser.sgmlDecl += c
          } else {
            parser.sgmlDecl += c
          }
          continue

        case S.SGML_DECL_QUOTED:
          if (c === parser.q) {
            parser.state = S.SGML_DECL
            parser.q = ''
          }
          parser.sgmlDecl += c
          continue

        case S.DOCTYPE:
          if (c === '>') {
            parser.state = S.TEXT
            emitNode(parser, 'ondoctype', parser.doctype)
            parser.doctype = true // just remember that we saw it.
          } else {
            parser.doctype += c
            if (c === '[') {
              parser.state = S.DOCTYPE_DTD
            } else if (is(quote, c)) {
              parser.state = S.DOCTYPE_QUOTED
              parser.q = c
            }
          }
          continue

        case S.DOCTYPE_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.q = ''
            parser.state = S.DOCTYPE
          }
          continue

        case S.DOCTYPE_DTD:
          parser.doctype += c
          if (c === ']') {
            parser.state = S.DOCTYPE
          } else if (is(quote, c)) {
            parser.state = S.DOCTYPE_DTD_QUOTED
            parser.q = c
          }
          continue

        case S.DOCTYPE_DTD_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.state = S.DOCTYPE_DTD
            parser.q = ''
          }
          continue

        case S.COMMENT:
          if (c === '-') {
            parser.state = S.COMMENT_ENDING
          } else {
            parser.comment += c
          }
          continue

        case S.COMMENT_ENDING:
          if (c === '-') {
            parser.state = S.COMMENT_ENDED
            parser.comment = textopts(parser.opt, parser.comment)
            if (parser.comment) {
              emitNode(parser, 'oncomment', parser.comment)
            }
            parser.comment = ''
          } else {
            parser.comment += '-' + c
            parser.state = S.COMMENT
          }
          continue

        case S.COMMENT_ENDED:
          if (c !== '>') {
            strictFail(parser, 'Malformed comment')
            // allow <!-- blah -- bloo --> in non-strict mode,
            // which is a comment of " blah -- bloo "
            parser.comment += '--' + c
            parser.state = S.COMMENT
          } else {
            parser.state = S.TEXT
          }
          continue

        case S.CDATA:
          if (c === ']') {
            parser.state = S.CDATA_ENDING
          } else {
            parser.cdata += c
          }
          continue

        case S.CDATA_ENDING:
          if (c === ']') {
            parser.state = S.CDATA_ENDING_2
          } else {
            parser.cdata += ']' + c
            parser.state = S.CDATA
          }
          continue

        case S.CDATA_ENDING_2:
          if (c === '>') {
            if (parser.cdata) {
              emitNode(parser, 'oncdata', parser.cdata)
            }
            emitNode(parser, 'onclosecdata')
            parser.cdata = ''
            parser.state = S.TEXT
          } else if (c === ']') {
            parser.cdata += ']'
          } else {
            parser.cdata += ']]' + c
            parser.state = S.CDATA
          }
          continue

        case S.PROC_INST:
          if (c === '?') {
            parser.state = S.PROC_INST_ENDING
          } else if (is(whitespace, c)) {
            parser.state = S.PROC_INST_BODY
          } else {
            parser.procInstName += c
          }
          continue

        case S.PROC_INST_BODY:
          if (!parser.procInstBody && is(whitespace, c)) {
            continue
          } else if (c === '?') {
            parser.state = S.PROC_INST_ENDING
          } else {
            parser.procInstBody += c
          }
          continue

        case S.PROC_INST_ENDING:
          if (c === '>') {
            emitNode(parser, 'onprocessinginstruction', {
              name: parser.procInstName,
              body: parser.procInstBody
            })
            parser.procInstName = parser.procInstBody = ''
            parser.state = S.TEXT
          } else {
            parser.procInstBody += '?' + c
            parser.state = S.PROC_INST_BODY
          }
          continue

        case S.OPEN_TAG:
          if (isMatch(nameBody, c)) {
            parser.tagName += c
          } else {
            newTag(parser)
            if (c === '>') {
              openTag(parser)
            } else if (c === '/') {
              parser.state = S.OPEN_TAG_SLASH
            } else {
              if (not(whitespace, c)) {
                strictFail(parser, 'Invalid character in tag name')
              }
              parser.state = S.ATTRIB
            }
          }
          continue

        case S.OPEN_TAG_SLASH:
          if (c === '>') {
            openTag(parser, true)
            closeTag(parser)
          } else {
            strictFail(parser, 'Forward-slash in opening tag not followed by >')
            parser.state = S.ATTRIB
          }
          continue

        case S.ATTRIB:
          // haven't read the attribute name yet.
          if (is(whitespace, c)) {
            continue
          } else if (c === '>') {
            openTag(parser)
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH
          } else if (isMatch(nameStart, c)) {
            parser.attribName = c
            parser.attribValue = ''
            parser.state = S.ATTRIB_NAME
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_NAME:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE
          } else if (c === '>') {
            strictFail(parser, 'Attribute without value')
            parser.attribValue = parser.attribName
            attrib(parser)
            openTag(parser)
          } else if (is(whitespace, c)) {
            parser.state = S.ATTRIB_NAME_SAW_WHITE
          } else if (isMatch(nameBody, c)) {
            parser.attribName += c
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_NAME_SAW_WHITE:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE
          } else if (is(whitespace, c)) {
            continue
          } else {
            strictFail(parser, 'Attribute without value')
            parser.tag.attributes[parser.attribName] = ''
            parser.attribValue = ''
            emitNode(parser, 'onattribute', {
              name: parser.attribName,
              value: ''
            })
            parser.attribName = ''
            if (c === '>') {
              openTag(parser)
            } else if (isMatch(nameStart, c)) {
              parser.attribName = c
              parser.state = S.ATTRIB_NAME
            } else {
              strictFail(parser, 'Invalid attribute name')
              parser.state = S.ATTRIB
            }
          }
          continue

        case S.ATTRIB_VALUE:
          if (is(whitespace, c)) {
            continue
          } else if (is(quote, c)) {
            parser.q = c
            parser.state = S.ATTRIB_VALUE_QUOTED
          } else {
            strictFail(parser, 'Unquoted attribute value')
            parser.state = S.ATTRIB_VALUE_UNQUOTED
            parser.attribValue = c
          }
          continue

        case S.ATTRIB_VALUE_QUOTED:
          if (c !== parser.q) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_Q
            } else {
              parser.attribValue += c
            }
            continue
          }
          attrib(parser)
          parser.q = ''
          parser.state = S.ATTRIB_VALUE_CLOSED
          continue

        case S.ATTRIB_VALUE_CLOSED:
          if (is(whitespace, c)) {
            parser.state = S.ATTRIB
          } else if (c === '>') {
            openTag(parser)
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH
          } else if (isMatch(nameStart, c)) {
            strictFail(parser, 'No whitespace between attributes')
            parser.attribName = c
            parser.attribValue = ''
            parser.state = S.ATTRIB_NAME
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_VALUE_UNQUOTED:
          if (not(attribEnd, c)) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_U
            } else {
              parser.attribValue += c
            }
            continue
          }
          attrib(parser)
          if (c === '>') {
            openTag(parser)
          } else {
            parser.state = S.ATTRIB
          }
          continue

        case S.CLOSE_TAG:
          if (!parser.tagName) {
            if (is(whitespace, c)) {
              continue
            } else if (notMatch(nameStart, c)) {
              if (parser.script) {
                parser.script += '</' + c
                parser.state = S.SCRIPT
              } else {
                strictFail(parser, 'Invalid tagname in closing tag.')
              }
            } else {
              parser.tagName = c
            }
          } else if (c === '>') {
            closeTag(parser)
          } else if (isMatch(nameBody, c)) {
            parser.tagName += c
          } else if (parser.script) {
            parser.script += '</' + parser.tagName
            parser.tagName = ''
            parser.state = S.SCRIPT
          } else {
            if (not(whitespace, c)) {
              strictFail(parser, 'Invalid tagname in closing tag')
            }
            parser.state = S.CLOSE_TAG_SAW_WHITE
          }
          continue

        case S.CLOSE_TAG_SAW_WHITE:
          if (is(whitespace, c)) {
            continue
          }
          if (c === '>') {
            closeTag(parser)
          } else {
            strictFail(parser, 'Invalid characters in closing tag')
          }
          continue

        case S.TEXT_ENTITY:
        case S.ATTRIB_VALUE_ENTITY_Q:
        case S.ATTRIB_VALUE_ENTITY_U:
          var returnState
          var buffer
          switch (parser.state) {
            case S.TEXT_ENTITY:
              returnState = S.TEXT
              buffer = 'textNode'
              break

            case S.ATTRIB_VALUE_ENTITY_Q:
              returnState = S.ATTRIB_VALUE_QUOTED
              buffer = 'attribValue'
              break

            case S.ATTRIB_VALUE_ENTITY_U:
              returnState = S.ATTRIB_VALUE_UNQUOTED
              buffer = 'attribValue'
              break
          }

          if (c === ';') {
            parser[buffer] += parseEntity(parser)
            parser.entity = ''
            parser.state = returnState
          } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
            parser.entity += c
          } else {
            strictFail(parser, 'Invalid character in entity name')
            parser[buffer] += '&' + parser.entity + c
            parser.entity = ''
            parser.state = returnState
          }

          continue

        default:
          throw new Error(parser, 'Unknown state: ' + parser.state)
      }
    } // while

    if (parser.position >= parser.bufferCheckPosition) {
      checkBufferLength(parser)
    }
    return parser
  }

  /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
  /* istanbul ignore next */
  if (!String.fromCodePoint) {
    (function () {
      var stringFromCharCode = String.fromCharCode
      var floor = Math.floor
      var fromCodePoint = function () {
        var MAX_SIZE = 0x4000
        var codeUnits = []
        var highSurrogate
        var lowSurrogate
        var index = -1
        var length = arguments.length
        if (!length) {
          return ''
        }
        var result = ''
        while (++index < length) {
          var codePoint = Number(arguments[index])
          if (
            !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
            codePoint < 0 || // not a valid Unicode code point
            codePoint > 0x10FFFF || // not a valid Unicode code point
            floor(codePoint) !== codePoint // not an integer
          ) {
            throw RangeError('Invalid code point: ' + codePoint)
          }
          if (codePoint <= 0xFFFF) { // BMP code point
            codeUnits.push(codePoint)
          } else { // Astral code point; split in surrogate halves
            // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            codePoint -= 0x10000
            highSurrogate = (codePoint >> 10) + 0xD800
            lowSurrogate = (codePoint % 0x400) + 0xDC00
            codeUnits.push(highSurrogate, lowSurrogate)
          }
          if (index + 1 === length || codeUnits.length > MAX_SIZE) {
            result += stringFromCharCode.apply(null, codeUnits)
            codeUnits.length = 0
          }
        }
        return result
      }
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(String, 'fromCodePoint', {
          value: fromCodePoint,
          configurable: true,
          writable: true
        })
      } else {
        String.fromCodePoint = fromCodePoint
      }
    }())
  }
})(typeof exports === 'undefined' ? this.sax = {} : exports)

}).call(this,require("buffer").Buffer)
},{"buffer":5,"stream":114,"string_decoder":115}],103:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');
var has = Object.prototype.hasOwnProperty;

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet() {
  this._array = [];
  this._set = Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet.prototype.size = function ArraySet_size() {
  return Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = util.toSetString(aStr);
  var isDuplicate = has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    this._set[sStr] = idx;
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet.prototype.has = function ArraySet_has(aStr) {
  var sStr = util.toSetString(aStr);
  return has.call(this._set, sStr);
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
  var sStr = util.toSetString(aStr);
  if (has.call(this._set, sStr)) {
    return this._set[sStr];
  }
  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

exports.ArraySet = ArraySet;

},{"./util":112}],104:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = require('./base64');

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
exports.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

},{"./base64":105}],105:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
exports.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
exports.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

},{}],106:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

exports.GREATEST_LOWER_BOUND = 1;
exports.LEAST_UPPER_BOUND = 2;

/**
 * Recursive implementation of binary search.
 *
 * @param aLow Indices here and lower do not contain the needle.
 * @param aHigh Indices here and higher do not contain the needle.
 * @param aNeedle The element being searched for.
 * @param aHaystack The non-empty array being searched.
 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 */
function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
  // This function terminates when one of the following is true:
  //
  //   1. We find the exact element we are looking for.
  //
  //   2. We did not find the exact element, but we can return the index of
  //      the next-closest element.
  //
  //   3. We did not find the exact element, and there is no next-closest
  //      element than the one we are searching for, so we return -1.
  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
  var cmp = aCompare(aNeedle, aHaystack[mid], true);
  if (cmp === 0) {
    // Found the element we are looking for.
    return mid;
  }
  else if (cmp > 0) {
    // Our needle is greater than aHaystack[mid].
    if (aHigh - mid > 1) {
      // The element is in the upper half.
      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
    }

    // The exact needle element was not found in this haystack. Determine if
    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return aHigh < aHaystack.length ? aHigh : -1;
    } else {
      return mid;
    }
  }
  else {
    // Our needle is less than aHaystack[mid].
    if (mid - aLow > 1) {
      // The element is in the lower half.
      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
    }

    // we are in termination case (3) or (2) and return the appropriate thing.
    if (aBias == exports.LEAST_UPPER_BOUND) {
      return mid;
    } else {
      return aLow < 0 ? -1 : aLow;
    }
  }
}

/**
 * This is an implementation of binary search which will always try and return
 * the index of the closest element if there is no exact hit. This is because
 * mappings between original and generated line/col pairs are single points,
 * and there is an implicit region between each of them, so a miss just means
 * that you aren't on the very start of a region.
 *
 * @param aNeedle The element you are looking for.
 * @param aHaystack The array that is being searched.
 * @param aCompare A function which takes the needle and an element in the
 *     array and returns -1, 0, or 1 depending on whether the needle is less
 *     than, equal to, or greater than the element, respectively.
 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
 */
exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
  if (aHaystack.length === 0) {
    return -1;
  }

  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
  if (index < 0) {
    return -1;
  }

  // We have found either the exact element, or the next-closest element than
  // the one we are searching for. However, there may be more than one such
  // element. Make sure we always return the smallest of these.
  while (index - 1 >= 0) {
    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
      break;
    }
    --index;
  }

  return index;
};

},{}],107:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

exports.MappingList = MappingList;

},{"./util":112}],108:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */
exports.quickSort = function (ary, comparator) {
  doQuickSort(ary, comparator, 0, ary.length - 1);
};

},{}],109:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util = require('./util');
var binarySearch = require('./binary-search');
var ArraySet = require('./array-set').ArraySet;
var base64VLQ = require('./base64-vlq');
var quickSort = require('./quick-sort').quickSort;

function SourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap)
    : new BasicSourceMapConsumer(sourceMap);
}

SourceMapConsumer.fromSourceMap = function(aSourceMap) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap);
}

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer.GENERATED_ORDER = 1;
SourceMapConsumer.ORIGINAL_ORDER = 2;

SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    mappings.map(function (mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      if (source != null && sourceRoot != null) {
        source = util.join(sourceRoot, source);
      }
      return {
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: Optional. the column number in the original source.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
SourceMapConsumer.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util.getArg(aArgs, 'column', 0)
    };

    if (this.sourceRoot != null) {
      needle.source = util.relative(this.sourceRoot, needle.source);
    }
    if (!this._sources.has(needle.source)) {
      return [];
    }
    needle.source = this._sources.indexOf(needle.source);

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util.getArg(mapping, 'generatedLine', null),
            column: util.getArg(mapping, 'generatedColumn', null),
            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

exports.SourceMapConsumer = SourceMapConsumer;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The only parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sources = util.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util.getArg(sourceMap, 'names', []);
  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util.getArg(sourceMap, 'mappings');
  var file = util.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
        ? util.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._sources.toArray().map(function (s) {
      return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
    }, this);
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;

    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;

        // Because each offset is encoded relative to the previous one,
        // many segments often have the same encoding. We can exploit this
        // fact by caching the parsed variable length fields of each segment,
        // allowing us to avoid a second parse if we encounter the same
        // segment again.
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);

        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }

          if (segment.length === 2) {
            throw new Error('Found a source, but no line and column');
          }

          if (segment.length === 3) {
            throw new Error('Found a source and line, but no column');
          }

          cachedSegments[str] = segment;
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          originalMappings.push(mapping);
        }
      }
    }

    quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;

    quickSort(originalMappings, util.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util.compareByGeneratedPositionsDeflated,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          if (this.sourceRoot != null) {
            source = util.join(this.sourceRoot, source);
          }
        }
        var name = util.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util.getArg(mapping, 'originalLine', null),
          column: util.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    if (this.sourceRoot != null) {
      aSource = util.relative(this.sourceRoot, aSource);
    }

    if (this._sources.has(aSource)) {
      return this.sourcesContent[this._sources.indexOf(aSource)];
    }

    var url;
    if (this.sourceRoot != null
        && (url = util.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + aSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + aSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util.getArg(aArgs, 'source');
    if (this.sourceRoot != null) {
      source = util.relative(this.sourceRoot, source);
    }
    if (!this._sources.has(source)) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    source = this._sources.indexOf(source);

    var needle = {
      source: source,
      originalLine: util.getArg(aArgs, 'line'),
      originalColumn: util.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util.compareByOriginalPositions,
      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util.getArg(mapping, 'generatedLine', null),
          column: util.getArg(mapping, 'generatedColumn', null),
          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The only parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
  }

  var version = util.getArg(sourceMap, 'version');
  var sections = util.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util.getArg(s, 'offset');
    var offsetLine = util.getArg(offset, 'line');
    var offsetColumn = util.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer(util.getArg(s, 'map'))
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.
 *   - column: The column number in the generated source.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.
 *   - column: The column number in the original source, or null.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util.getArg(aArgs, 'line'),
      generatedColumn: util.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.
 *   - column: The column number in the original source.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.
 *   - column: The column number in the generated source, or null.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        if (section.consumer.sourceRoot !== null) {
          source = util.join(section.consumer.sourceRoot, source);
        }
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = section.consumer._names.at(mapping.name);
        this._names.add(name);
        name = this._names.indexOf(name);

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util.compareByOriginalPositions);
  };

exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

},{"./array-set":103,"./base64-vlq":104,"./binary-search":106,"./quick-sort":108,"./util":112}],110:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ = require('./base64-vlq');
var util = require('./util');
var ArraySet = require('./array-set').ArraySet;
var MappingList = require('./mapping-list').MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util.getArg(aArgs, 'file', null);
  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
  this._sources = new ArraySet();
  this._names = new ArraySet();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    });
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util.getArg(aArgs, 'generated');
    var original = util.getArg(aArgs, 'original', null);
    var source = util.getArg(aArgs, 'source', null);
    var name = util.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet();
    var newNames = new ArraySet();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util.join(aSourceMapPath, mapping.source)
          }
          if (sourceRoot != null) {
            mapping.source = util.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      throw new Error('Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = ''

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util.relative(aSourceRoot, source);
      }
      var key = util.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

exports.SourceMapGenerator = SourceMapGenerator;

},{"./array-set":103,"./base64-vlq":104,"./mapping-list":107,"./util":112}],111:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;
var util = require('./util');

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are removed from this array, by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var shiftNextLine = function() {
      var lineContents = remainingLines.shift();
      // The last line of a file might not have a newline.
      var newLine = remainingLines.shift() || "";
      return lineContents + newLine;
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[0];
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[0] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[0];
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[0] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLines.length > 0) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

exports.SourceNode = SourceNode;

},{"./source-map-generator":110,"./util":112}],112:[function(require,module,exports){
/* -*- Mode: js; js-indent-level: 2; -*- */
/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

/**
 * This is a helper function for getting values from parameter/options
 * objects.
 *
 * @param args The object we are extracting values from
 * @param name The name of the property we are getting.
 * @param defaultValue An optional value to return if the property is missing
 * from the object. If this is not specified and the property is missing, an
 * error will be thrown.
 */
function getArg(aArgs, aName, aDefaultValue) {
  if (aName in aArgs) {
    return aArgs[aName];
  } else if (arguments.length === 3) {
    return aDefaultValue;
  } else {
    throw new Error('"' + aName + '" is a required argument.');
  }
}
exports.getArg = getArg;

var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
var dataUrlRegexp = /^data:.+\,.+$/;

function urlParse(aUrl) {
  var match = aUrl.match(urlRegexp);
  if (!match) {
    return null;
  }
  return {
    scheme: match[1],
    auth: match[2],
    host: match[3],
    port: match[4],
    path: match[5]
  };
}
exports.urlParse = urlParse;

function urlGenerate(aParsedUrl) {
  var url = '';
  if (aParsedUrl.scheme) {
    url += aParsedUrl.scheme + ':';
  }
  url += '//';
  if (aParsedUrl.auth) {
    url += aParsedUrl.auth + '@';
  }
  if (aParsedUrl.host) {
    url += aParsedUrl.host;
  }
  if (aParsedUrl.port) {
    url += ":" + aParsedUrl.port
  }
  if (aParsedUrl.path) {
    url += aParsedUrl.path;
  }
  return url;
}
exports.urlGenerate = urlGenerate;

/**
 * Normalizes a path, or the path portion of a URL:
 *
 * - Replaces consecutive slashes with one slash.
 * - Removes unnecessary '.' parts.
 * - Removes unnecessary '<dir>/..' parts.
 *
 * Based on code in the Node.js 'path' core module.
 *
 * @param aPath The path or url to normalize.
 */
function normalize(aPath) {
  var path = aPath;
  var url = urlParse(aPath);
  if (url) {
    if (!url.path) {
      return aPath;
    }
    path = url.path;
  }
  var isAbsolute = exports.isAbsolute(path);

  var parts = path.split(/\/+/);
  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
    part = parts[i];
    if (part === '.') {
      parts.splice(i, 1);
    } else if (part === '..') {
      up++;
    } else if (up > 0) {
      if (part === '') {
        // The first part is blank if the path is absolute. Trying to go
        // above the root is a no-op. Therefore we can remove all '..' parts
        // directly after the root.
        parts.splice(i + 1, up);
        up = 0;
      } else {
        parts.splice(i, 2);
        up--;
      }
    }
  }
  path = parts.join('/');

  if (path === '') {
    path = isAbsolute ? '/' : '.';
  }

  if (url) {
    url.path = path;
    return urlGenerate(url);
  }
  return path;
}
exports.normalize = normalize;

/**
 * Joins two paths/URLs.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be joined with the root.
 *
 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
 *   first.
 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
 *   is updated with the result and aRoot is returned. Otherwise the result
 *   is returned.
 *   - If aPath is absolute, the result is aPath.
 *   - Otherwise the two paths are joined with a slash.
 * - Joining for example 'http://' and 'www.example.com' is also supported.
 */
function join(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }
  if (aPath === "") {
    aPath = ".";
  }
  var aPathUrl = urlParse(aPath);
  var aRootUrl = urlParse(aRoot);
  if (aRootUrl) {
    aRoot = aRootUrl.path || '/';
  }

  // `join(foo, '//www.example.org')`
  if (aPathUrl && !aPathUrl.scheme) {
    if (aRootUrl) {
      aPathUrl.scheme = aRootUrl.scheme;
    }
    return urlGenerate(aPathUrl);
  }

  if (aPathUrl || aPath.match(dataUrlRegexp)) {
    return aPath;
  }

  // `join('http://', 'www.example.com')`
  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
    aRootUrl.host = aPath;
    return urlGenerate(aRootUrl);
  }

  var joined = aPath.charAt(0) === '/'
    ? aPath
    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

  if (aRootUrl) {
    aRootUrl.path = joined;
    return urlGenerate(aRootUrl);
  }
  return joined;
}
exports.join = join;

exports.isAbsolute = function (aPath) {
  return aPath.charAt(0) === '/' || !!aPath.match(urlRegexp);
};

/**
 * Make a path relative to a URL or another path.
 *
 * @param aRoot The root path or URL.
 * @param aPath The path or URL to be made relative to aRoot.
 */
function relative(aRoot, aPath) {
  if (aRoot === "") {
    aRoot = ".";
  }

  aRoot = aRoot.replace(/\/$/, '');

  // It is possible for the path to be above the root. In this case, simply
  // checking whether the root is a prefix of the path won't work. Instead, we
  // need to remove components from the root one by one, until either we find
  // a prefix that fits, or we run out of components to remove.
  var level = 0;
  while (aPath.indexOf(aRoot + '/') !== 0) {
    var index = aRoot.lastIndexOf("/");
    if (index < 0) {
      return aPath;
    }

    // If the only part of the root that is left is the scheme (i.e. http://,
    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
    // have exhausted all components, so the path is not relative to the root.
    aRoot = aRoot.slice(0, index);
    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
      return aPath;
    }

    ++level;
  }

  // Make sure we add a "../" for each component we removed from the root.
  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
}
exports.relative = relative;

var supportsNullProto = (function () {
  var obj = Object.create(null);
  return !('__proto__' in obj);
}());

function identity (s) {
  return s;
}

/**
 * Because behavior goes wacky when you set `__proto__` on objects, we
 * have to prefix all the strings in our set with an arbitrary character.
 *
 * See https://github.com/mozilla/source-map/pull/31 and
 * https://github.com/mozilla/source-map/issues/30
 *
 * @param String aStr
 */
function toSetString(aStr) {
  if (isProtoString(aStr)) {
    return '$' + aStr;
  }

  return aStr;
}
exports.toSetString = supportsNullProto ? identity : toSetString;

function fromSetString(aStr) {
  if (isProtoString(aStr)) {
    return aStr.slice(1);
  }

  return aStr;
}
exports.fromSetString = supportsNullProto ? identity : fromSetString;

function isProtoString(s) {
  if (!s) {
    return false;
  }

  var length = s.length;

  if (length < 9 /* "__proto__".length */) {
    return false;
  }

  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
      s.charCodeAt(length - 9) !== 95  /* '_' */) {
    return false;
  }

  for (var i = length - 10; i >= 0; i--) {
    if (s.charCodeAt(i) !== 36 /* '$' */) {
      return false;
    }
  }

  return true;
}

/**
 * Comparator between two mappings where the original positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same original source/line/column, but different generated
 * line and column the same. Useful when searching for a mapping with a
 * stubbed out mapping.
 */
function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
  var cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0 || onlyCompareOriginal) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByOriginalPositions = compareByOriginalPositions;

/**
 * Comparator between two mappings with deflated source and name indices where
 * the generated positions are compared.
 *
 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
 * mappings with the same generated line and column, but different
 * source/name/original line and column the same. Useful when searching for a
 * mapping with a stubbed out mapping.
 */
function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0 || onlyCompareGenerated) {
    return cmp;
  }

  cmp = mappingA.source - mappingB.source;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return mappingA.name - mappingB.name;
}
exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

function strcmp(aStr1, aStr2) {
  if (aStr1 === aStr2) {
    return 0;
  }

  if (aStr1 > aStr2) {
    return 1;
  }

  return -1;
}

/**
 * Comparator between two mappings with inflated source and name strings where
 * the generated positions are compared.
 */
function compareByGeneratedPositionsInflated(mappingA, mappingB) {
  var cmp = mappingA.generatedLine - mappingB.generatedLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = strcmp(mappingA.source, mappingB.source);
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalLine - mappingB.originalLine;
  if (cmp !== 0) {
    return cmp;
  }

  cmp = mappingA.originalColumn - mappingB.originalColumn;
  if (cmp !== 0) {
    return cmp;
  }

  return strcmp(mappingA.name, mappingB.name);
}
exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

},{}],113:[function(require,module,exports){
/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
exports.SourceMapGenerator = require('./lib/source-map-generator').SourceMapGenerator;
exports.SourceMapConsumer = require('./lib/source-map-consumer').SourceMapConsumer;
exports.SourceNode = require('./lib/source-node').SourceNode;

},{"./lib/source-map-consumer":109,"./lib/source-map-generator":110,"./lib/source-node":111}],114:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":53,"inherits":55,"readable-stream/duplex.js":91,"readable-stream/passthrough.js":98,"readable-stream/readable.js":99,"readable-stream/transform.js":100,"readable-stream/writable.js":101}],115:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":5}],116:[function(require,module,exports){
'use strict';

/**
 * SVGO is a Nodejs-based tool for optimizing SVG vector graphics files.
 *
 * @see https://github.com/svg/svgo
 *
 * @author Kir Belevich <kir@soulshine.in> (https://github.com/deepsweet)
 * @copyright © 2012 Kir Belevich
 * @license MIT https://raw.githubusercontent.com/svg/svgo/master/LICENSE
 */

var CONFIG = require('./svgo/config.js'),
    SVG2JS = require('./svgo/svg2js.js'),
    PLUGINS = require('./svgo/plugins.js'),
    JSAPI = require('./svgo/jsAPI.js'),
    JS2SVG = require('./svgo/js2svg.js');

var SVGO = module.exports = function(config) {

    this.config = CONFIG(config);

};

SVGO.prototype.optimize = function(svgstr, callback) {
    if (this.config.error) return callback(this.config);

    var _this = this,
        config = this.config,
        maxPassCount = config.multipass ? 10 : 1,
        counter = 0,
        prevResultSize = Number.POSITIVE_INFINITY,
        optimizeOnceCallback = function(svgjs) {

            if (svgjs.error) {
                callback(svgjs);
                return;
            }

            if (++counter < maxPassCount && svgjs.data.length < prevResultSize) {
                prevResultSize = svgjs.data.length;
                _this._optimizeOnce(svgjs.data, optimizeOnceCallback);
            } else {
                callback(svgjs);
            }

        };

    _this._optimizeOnce(svgstr, optimizeOnceCallback);

};

SVGO.prototype._optimizeOnce = function(svgstr, callback) {
    var config = this.config;

    SVG2JS(svgstr, function(svgjs) {

        if (svgjs.error) {
            callback(svgjs);
            return;
        }

        svgjs = PLUGINS(svgjs, config.plugins);

        callback(JS2SVG(svgjs, config.js2svg));

    });
};

/**
 * The factory that creates a content item with the helper methods.
 *
 * @param {Object} data which passed to jsAPI constructor
 * @returns {JSAPI} content item
 */
SVGO.prototype.createContentItem = function(data) {

    return new JSAPI(data);

};

},{"./svgo/config.js":117,"./svgo/js2svg.js":118,"./svgo/jsAPI.js":119,"./svgo/plugins.js":120,"./svgo/svg2js.js":121}],117:[function(require,module,exports){
(function (__dirname){
'use strict';

var FS = require('fs');
var yaml = require('js-yaml');

var EXTEND = require('whet.extend');

/**
 * Read and/or extend/replace default config file,
 * prepare and optimize plugins array.
 *
 * @param {Object} [config] input config
 * @return {Object} output config
 */
module.exports = function(config) {

    var defaults;
    config = typeof config == 'object' && config || {};

    if (config.plugins && !Array.isArray(config.plugins)) {
        return { error: 'Error: Invalid plugins list. Provided \'plugins\' in config should be an array.' };
    }

    if (config.full) {
        defaults = config;

        if (Array.isArray(defaults.plugins)) {
            defaults.plugins = preparePluginsArray(defaults.plugins);
        }
    } else {
        defaults = EXTEND({}, yaml.safeLoad(FS.readFileSync(__dirname + '/../../.svgo.yml', 'utf8')));
        defaults.plugins = preparePluginsArray(defaults.plugins);
        defaults = extendConfig(defaults, config);
    }

    if ('floatPrecision' in config && Array.isArray(defaults.plugins)) {
        defaults.plugins.forEach(function(plugin) {
            if (plugin.params && ('floatPrecision' in plugin.params)) {
                // Don't touch default plugin params
                plugin.params = EXTEND({}, plugin.params, { floatPrecision: config.floatPrecision });
            }
        });
    }

    if (Array.isArray(defaults.plugins)) {
        defaults.plugins = optimizePluginsArray(defaults.plugins);
    }

    return defaults;

};

/**
 * Require() all plugins in array.
 *
 * @param {Array} plugins input plugins array
 * @return {Array} input plugins array of arrays
 */
function preparePluginsArray(plugins) {

    var plugin,
        key;

    return plugins.map(function(item) {

        // {}
        if (typeof item === 'object') {

            key = Object.keys(item)[0];

            // custom
            if (typeof item[key] === 'object' && item[key].fn && typeof item[key].fn === 'function') {
                plugin = setupCustomPlugin(key, item[key]);

            } else {

              plugin = EXTEND({}, require('../../plugins/' + key));

              // name: {}
              if (typeof item[key] === 'object') {
                  plugin.params = EXTEND({}, plugin.params || {}, item[key]);
                  plugin.active = true;

              // name: false
              } else if (item[key] === false) {
                 plugin.active = false;

              // name: true
              } else if (item[key] === true) {
                 plugin.active = true;
              }

              plugin.name = key;
            }

        // name
        } else {

            plugin = EXTEND({}, require('../../plugins/' + item));
            plugin.name = item;

        }

        return plugin;

    });

}

/**
 * Extend plugins with the custom config object.
 *
 * @param {Array} plugins input plugins
 * @param {Object} config config
 * @return {Array} output plugins
 */
function extendConfig(defaults, config) {

    var key;

    // plugins
    if (config.plugins) {

        config.plugins.forEach(function(item) {

            // {}
            if (typeof item === 'object') {

                key = Object.keys(item)[0];

                // custom
                if (typeof item[key] === 'object' && item[key].fn && typeof item[key].fn === 'function') {
                    defaults.plugins.push(setupCustomPlugin(key, item[key]));

                } else {
                    defaults.plugins.forEach(function(plugin) {

                        if (plugin.name === key) {
                            // name: {}
                            if (typeof item[key] === 'object') {
                                plugin.params = EXTEND({}, plugin.params || {}, item[key]);
                                plugin.active = true;

                            // name: false
                            } else if (item[key] === false) {
                               plugin.active = false;

                            // name: true
                            } else if (item[key] === true) {
                               plugin.active = true;
                            }
                        }
                    });
                }

            }

        });

    }

    defaults.multipass = config.multipass;

    // svg2js
    if (config.svg2js) {
        defaults.svg2js = config.svg2js;
    }

    // js2svg
    if (config.js2svg) {
        defaults.js2svg = config.js2svg;
    }

    return defaults;

}

/**
 * Setup and enable a custom plugin
 *
 * @param {String} plugin name
 * @param {Object} custom plugin
 * @return {Array} enabled plugin
 */
function setupCustomPlugin(name, plugin) {
    plugin.active = true;
    plugin.params = EXTEND({}, plugin.params || {});
    plugin.name = name;

    return plugin;
}

/**
 * Try to group sequential elements of plugins array.
 *
 * @param {Object} plugins input plugins
 * @return {Array} output plugins
 */
function optimizePluginsArray(plugins) {

    var prev;

    return plugins.reduce(function(plugins, item) {
        if (prev && item.type == prev[0].type) {
            prev.push(item);
        } else {
            plugins.push(prev = [item]);
        }
        return plugins;
    }, []);

}

}).call(this,"/node_modules/svgo/lib/svgo")
},{"fs":3,"js-yaml":58,"whet.extend":169}],118:[function(require,module,exports){
'use strict';

var EOL = require('os').EOL,
    EXTEND = require('whet.extend'),
    textElem = require('../../plugins/_collections.js').elemsGroups.textContent.concat('title');

var defaults = {
    doctypeStart: '<!DOCTYPE',
    doctypeEnd: '>',
    procInstStart: '<?',
    procInstEnd: '?>',
    tagOpenStart: '<',
    tagOpenEnd: '>',
    tagCloseStart: '</',
    tagCloseEnd: '>',
    tagShortStart: '<',
    tagShortEnd: '/>',
    attrStart: '="',
    attrEnd: '"',
    commentStart: '<!--',
    commentEnd: '-->',
    cdataStart: '<![CDATA[',
    cdataEnd: ']]>',
    textStart: '',
    textEnd: '',
    indent: 4,
    regEntities: /[&'"<>]/g,
    regValEntities: /[&"<>]/g,
    encodeEntity: encodeEntity,
    pretty: false,
    useShortTags: true
};

var entities = {
      '&': '&amp;',
      '\'': '&apos;',
      '"': '&quot;',
      '>': '&gt;',
      '<': '&lt;',
    };

/**
 * Convert SVG-as-JS object to SVG (XML) string.
 *
 * @param {Object} data input data
 * @param {Object} config config
 *
 * @return {Object} output data
 */
module.exports = function(data, config) {

    return new JS2SVG(config).convert(data);

};

function JS2SVG(config) {

    if (config) {
        this.config = EXTEND(true, {}, defaults, config);
    } else {
        this.config = defaults;
    }

    var indent = this.config.indent;
    if (typeof indent == 'number' && !isNaN(indent)) {
        this.config.indent = '';
        for (var i = indent; i-- > 0;) this.config.indent += ' ';
    } else if (typeof indent != 'string') {
        this.config.indent = '    ';
    }

    if (this.config.pretty) {
        this.config.doctypeEnd += EOL;
        this.config.procInstEnd += EOL;
        this.config.commentEnd += EOL;
        this.config.cdataEnd += EOL;
        this.config.tagShortEnd += EOL;
        this.config.tagOpenEnd += EOL;
        this.config.tagCloseEnd += EOL;
        this.config.textEnd += EOL;
    }

    this.indentLevel = 0;
    this.textContext = null;

}

function encodeEntity(char) {
    return entities[char];
}

/**
 * Start conversion.
 *
 * @param {Object} data input data
 *
 * @return {String}
 */
JS2SVG.prototype.convert = function(data) {

    var svg = '';

    if (data.content) {

        this.indentLevel++;

        data.content.forEach(function(item) {

            if (item.elem) {
               svg += this.createElem(item);
            } else if (item.text) {
               svg += this.createText(item.text);
            } else if (item.doctype) {
                svg += this.createDoctype(item.doctype);
            } else if (item.processinginstruction) {
                svg += this.createProcInst(item.processinginstruction);
            } else if (item.comment) {
                svg += this.createComment(item.comment);
            } else if (item.cdata) {
                svg += this.createCDATA(item.cdata);
            }

        }, this);

    }

    this.indentLevel--;

    return {
        data: svg,
        info: {
            width: this.width,
            height: this.height
        }
    };

};

/**
 * Create indent string in accordance with the current node level.
 *
 * @return {String}
 */
JS2SVG.prototype.createIndent = function() {

    var indent = '';

    if (this.config.pretty && !this.textContext) {
        for (var i = 1; i < this.indentLevel; i++) {
            indent += this.config.indent;
        }
    }

    return indent;

};

/**
 * Create doctype tag.
 *
 * @param {String} doctype doctype body string
 *
 * @return {String}
 */
JS2SVG.prototype.createDoctype = function(doctype) {

    return  this.config.doctypeStart +
            doctype +
            this.config.doctypeEnd;

};

/**
 * Create XML Processing Instruction tag.
 *
 * @param {Object} instruction instruction object
 *
 * @return {String}
 */
JS2SVG.prototype.createProcInst = function(instruction) {

    return  this.config.procInstStart +
            instruction.name +
            ' ' +
            instruction.body +
            this.config.procInstEnd;

};

/**
 * Create comment tag.
 *
 * @param {String} comment comment body
 *
 * @return {String}
 */
JS2SVG.prototype.createComment = function(comment) {

    return  this.config.commentStart +
            comment +
            this.config.commentEnd;

};

/**
 * Create CDATA section.
 *
 * @param {String} cdata CDATA body
 *
 * @return {String}
 */
JS2SVG.prototype.createCDATA = function(cdata) {

    return  this.createIndent() +
            this.config.cdataStart +
            cdata +
            this.config.cdataEnd;

};

/**
 * Create element tag.
 *
 * @param {Object} data element object
 *
 * @return {String}
 */
JS2SVG.prototype.createElem = function(data) {

    // beautiful injection for obtaining SVG information :)
    if (
        data.isElem('svg') &&
        data.hasAttr('width') &&
        data.hasAttr('height')
    ) {
        this.width = data.attr('width').value;
        this.height = data.attr('height').value;
    }

    // empty element and short tag
    if (data.isEmpty()) {
        if (this.config.useShortTags) {
            return this.createIndent() +
                   this.config.tagShortStart +
                   data.elem +
                   this.createAttrs(data) +
                   this.config.tagShortEnd;
        } else {
            return this.createIndent() +
                   this.config.tagShortStart +
                   data.elem +
                   this.createAttrs(data) +
                   this.config.tagOpenEnd +
                   this.config.tagCloseStart +
                   data.elem +
                   this.config.tagCloseEnd;
        }
    // non-empty element
    } else {
        var tagOpenStart = this.config.tagOpenStart,
            tagOpenEnd = this.config.tagOpenEnd,
            tagCloseStart = this.config.tagCloseStart,
            tagCloseEnd = this.config.tagCloseEnd,
            openIndent = this.createIndent(),
            textIndent = '',
            processedData = '',
            dataEnd = '';

        if (this.textContext) {
            tagOpenStart = defaults.tagOpenStart;
            tagOpenEnd = defaults.tagOpenEnd;
            tagCloseStart = defaults.tagCloseStart;
            tagCloseEnd = defaults.tagCloseEnd;
            openIndent = '';
        } else if (data.isElem(textElem)) {
            if (this.config.pretty) {
                textIndent += openIndent + this.config.indent;
            }
            this.textContext = data;
        }

        processedData += this.convert(data).data;

        if (this.textContext == data) {
            this.textContext = null;
            if (this.config.pretty) dataEnd = EOL;
        }

        return  openIndent +
                tagOpenStart +
                data.elem +
                this.createAttrs(data) +
                tagOpenEnd +
                textIndent +
                processedData +
                dataEnd +
                this.createIndent() +
                tagCloseStart +
                data.elem +
                tagCloseEnd;

    }

};

/**
 * Create element attributes.
 *
 * @param {Object} elem attributes object
 *
 * @return {String}
 */
JS2SVG.prototype.createAttrs = function(elem) {

    var attrs = '';

    elem.eachAttr(function(attr) {

        if (attr.value !== undefined) {
            attrs +=    ' ' +
                        attr.name +
                        this.config.attrStart +
                        String(attr.value).replace(this.config.regValEntities, this.config.encodeEntity) +
                        this.config.attrEnd;
        }
        else {
            attrs +=    ' ' +
                        attr.name;
        }


    }, this);

    return attrs;

};

/**
 * Create text node.
 *
 * @param {String} text text
 *
 * @return {String}
 */
JS2SVG.prototype.createText = function(text) {

    return  this.createIndent() +
            this.config.textStart +
            text.replace(this.config.regEntities, this.config.encodeEntity) +
            (this.textContext ? '' : this.config.textEnd);

};

},{"../../plugins/_collections.js":123,"os":88,"whet.extend":169}],119:[function(require,module,exports){
'use strict';

var EXTEND = require('whet.extend');

var JSAPI = module.exports = function(data, parentNode) {
    EXTEND(this, data);
    if (parentNode) {
        Object.defineProperty(this, 'parentNode', {
            writable: true,
            value: parentNode
        });
    }
};

/**
 * Perform a deep clone of this node.
 *
 * @return {Object} element
 */
JSAPI.prototype.clone = function() {
    var node = this;
    var nodeData = {};

    Object.keys(node).forEach(function(key) {
        if (key !== 'content') {
            nodeData[key] = node[key];
        }
    });

    // Deep-clone node data
    // This is still faster than using EXTEND(true…)
    nodeData = JSON.parse(JSON.stringify(nodeData));

    // parentNode gets set to a proper object by the parent clone,
    // but it needs to be true/false now to do the right thing
    // in the constructor.
    var clonedNode = new JSAPI(nodeData, !!node.parentNode);

    if (node.content) {
        clonedNode.content = node.content.map(function(childNode) {
            var clonedChild = childNode.clone();
            clonedChild.parentNode = clonedNode;
            return clonedChild;
        });
    }

    return clonedNode;
};

/**
 * Determine if item is an element
 * (any, with a specific name or in a names array).
 *
 * @param {String|Array} [param] element name or names arrays
 * @return {Boolean}
 */
JSAPI.prototype.isElem = function(param) {

    if (!param) return !!this.elem;

    if (Array.isArray(param)) return !!this.elem && (param.indexOf(this.elem) > -1);

    return !!this.elem && this.elem === param;

};

/**
 * Renames an element
 *
 * @param {String} name new element name
 * @return {Object} element
 */
JSAPI.prototype.renameElem = function(name) {

    if (name && typeof name === 'string')
        this.elem = this.local = name;

    return this;

};

/**
 * Determine if element is empty.
 *
 * @return {Boolean}
 */
 JSAPI.prototype.isEmpty = function() {

    return !this.content || !this.content.length;

};

/**
 * Changes content by removing elements and/or adding new elements.
 *
 * @param {Number} start Index at which to start changing the content.
 * @param {Number} n Number of elements to remove.
 * @param {Array|Object} [insertion] Elements to add to the content.
 * @return {Array} Removed elements.
 */
 JSAPI.prototype.spliceContent = function(start, n, insertion) {

    if (arguments.length < 2) return [];

    if (!Array.isArray(insertion))
        insertion = Array.apply(null, arguments).slice(2);

    insertion.forEach(function(inner) { inner.parentNode = this }, this);

    return this.content.splice.apply(this.content, [start, n].concat(insertion));


};

/**
 * Determine if element has an attribute
 * (any, or by name or by name + value).
 *
 * @param {String} [name] attribute name
 * @param {String} [val] attribute value (will be toString()'ed)
 * @return {Boolean}
 */
 JSAPI.prototype.hasAttr = function(name, val) {

    if (!this.attrs || !Object.keys(this.attrs).length) return false;

    if (!arguments.length) return !!this.attrs;

    if (val !== undefined) return !!this.attrs[name] && this.attrs[name].value === val.toString();

    return !!this.attrs[name];

};

/**
 * Determine if element has an attribute by local name
 * (any, or by name or by name + value).
 *
 * @param {String} [localName] local attribute name
 * @param {Number|String|RegExp|Function} [val] attribute value (will be toString()'ed or executed, otherwise ignored)
 * @return {Boolean}
 */
 JSAPI.prototype.hasAttrLocal = function(localName, val) {

    if (!this.attrs || !Object.keys(this.attrs).length) return false;

    if (!arguments.length) return !!this.attrs;

    var callback;

    switch (val != null && val.constructor && val.constructor.name) {
        case 'Number':   // same as String
        case 'String':   callback = stringValueTest; break;
        case 'RegExp':   callback = regexpValueTest; break;
        case 'Function': callback = funcValueTest; break;
        default:         callback = nameTest;
    }
    return this.someAttr(callback);

    function nameTest(attr) {
        return attr.local === localName;
    }

    function stringValueTest(attr) {
        return attr.local === localName && val == attr.value;
    }

    function regexpValueTest(attr) {
        return attr.local === localName && val.test(attr.value);
    }

    function funcValueTest(attr) {
        return attr.local === localName && val(attr.value);
    }

};

/**
 * Get a specific attribute from an element
 * (by name or name + value).
 *
 * @param {String} name attribute name
 * @param {String} [val] attribute value (will be toString()'ed)
 * @return {Object|Undefined}
 */
 JSAPI.prototype.attr = function(name, val) {

    if (!this.hasAttr() || !arguments.length) return undefined;

    if (val !== undefined) return this.hasAttr(name, val) ? this.attrs[name] : undefined;

    return this.attrs[name];

};

/**
 * Get computed attribute value from an element
 *
 * @param {String} name attribute name
 * @return {Object|Undefined}
 */
 JSAPI.prototype.computedAttr = function(name, val) {
    /* jshint eqnull: true */
    if (!arguments.length) return;

    for (var elem = this; elem && (!elem.hasAttr(name) || !elem.attr(name).value); elem = elem.parentNode);

    if (val != null) {
        return elem ? elem.hasAttr(name, val) : false;
    } else if (elem && elem.hasAttr(name)) {
        return elem.attrs[name].value;
    }

};

/**
 * Remove a specific attribute.
 *
 * @param {String|Array} name attribute name
 * @param {String} [val] attribute value
 * @return {Boolean}
 */
 JSAPI.prototype.removeAttr = function(name, val, recursive) {

    if (!arguments.length) return false;

    if (Array.isArray(name)) name.forEach(this.removeAttr, this);

    if (!this.hasAttr(name)) return false;

    if (!recursive && val && this.attrs[name].value !== val) return false;

    delete this.attrs[name];

    if (!Object.keys(this.attrs).length) delete this.attrs;

    return true;

};

/**
 * Add attribute.
 *
 * @param {Object} [attr={}] attribute object
 * @return {Object|Boolean} created attribute or false if no attr was passed in
 */
 JSAPI.prototype.addAttr = function(attr) {
    attr = attr || {};

    if (attr.name === undefined ||
        attr.prefix === undefined ||
        attr.local === undefined
    ) return false;

    this.attrs = this.attrs || {};
    this.attrs[attr.name] = attr;

    return this.attrs[attr.name];

};

/**
 * Iterates over all attributes.
 *
 * @param {Function} callback callback
 * @param {Object} [context] callback context
 * @return {Boolean} false if there are no any attributes
 */
 JSAPI.prototype.eachAttr = function(callback, context) {

    if (!this.hasAttr()) return false;

    for (var name in this.attrs) {
        callback.call(context, this.attrs[name]);
    }

    return true;

};

/**
 * Tests whether some attribute passes the test.
 *
 * @param {Function} callback callback
 * @param {Object} [context] callback context
 * @return {Boolean} false if there are no any attributes
 */
 JSAPI.prototype.someAttr = function(callback, context) {

    if (!this.hasAttr()) return false;

    for (var name in this.attrs) {
        if (callback.call(context, this.attrs[name])) return true;
    }

    return false;

};

},{"whet.extend":169}],120:[function(require,module,exports){
'use strict';

/**
 * Plugins engine.
 *
 * @module plugins
 *
 * @param {Object} data input data
 * @param {Object} plugins plugins object from config
 * @return {Object} output data
 */
module.exports = function(data, plugins) {

    plugins.forEach(function(group) {

        switch(group[0].type) {
            case 'perItem':
                data = perItem(data, group);
                break;
            case 'perItemReverse':
                data = perItem(data, group, true);
                break;
            case 'full':
                data = full(data, group);
                break;
        }

    });

    return data;

};

/**
 * Direct or reverse per-item loop.
 *
 * @param {Object} data input data
 * @param {Array} plugins plugins list to process
 * @param {Boolean} [reverse] reverse pass?
 * @return {Object} output data
 */
function perItem(data, plugins, reverse) {

    function monkeys(items) {

        items.content = items.content.filter(function(item) {

            // reverse pass
            if (reverse && item.content) {
                monkeys(item);
            }

            // main filter
            var filter = true;

            for (var i = 0; filter && i < plugins.length; i++) {
                var plugin = plugins[i];

                if (plugin.active && plugin.fn(item, plugin.params) === false) {
                    filter = false;
                }
            }

            // direct pass
            if (!reverse && item.content) {
                monkeys(item);
            }

            return filter;

        });

        return items;

    }

    return monkeys(data);

}

/**
 * "Full" plugins.
 *
 * @param {Object} data input data
 * @param {Array} plugins plugins list to process
 * @return {Object} output data
 */
function full(data, plugins) {

    plugins.forEach(function(plugin) {
        if (plugin.active) {
            data = plugin.fn(data, plugin.params);
        }
    });

    return data;

}

},{}],121:[function(require,module,exports){
'use strict';

var SAX = require('sax'),
    JSAPI = require('./jsAPI.js'),
    entityDeclaration = /<!ENTITY\s+(\S+)\s+(?:'([^\']+)'|"([^\"]+)")\s*>/g;

var config = {
    strict: true,
    trim: false,
    normalize: true,
    lowercase: true,
    xmlns: true,
    position: true
};

/**
 * Convert SVG (XML) string to SVG-as-JS object.
 *
 * @param {String} data input data
 * @param {Function} callback
 */
module.exports = function(data, callback) {

    var sax = SAX.parser(config.strict, config),
        root = new JSAPI({ elem: '#document' }),
        current = root,
        stack = [root],
        textContext = null,
        parsingError = false;

    function pushToContent(content) {

        content = new JSAPI(content, current);

        (current.content = current.content || []).push(content);

        return content;

    }

    sax.ondoctype = function(doctype) {

        pushToContent({
            doctype: doctype
        });

        var subsetStart = doctype.indexOf('['),
            entityMatch;

        if (subsetStart >= 0) {
            entityDeclaration.lastIndex = subsetStart;

            while ((entityMatch = entityDeclaration.exec(data)) != null) {
                sax.ENTITIES[entityMatch[1]] = entityMatch[2] || entityMatch[3];
            }
        }
    };

    sax.onprocessinginstruction = function(data) {

        pushToContent({
            processinginstruction: data
        });

    };

    sax.oncomment = function(comment) {

        pushToContent({
            comment: comment.trim()
        });

    };

    sax.oncdata = function(cdata) {

        pushToContent({
            cdata: cdata
        });

    };

    sax.onopentag = function(data) {

        var elem = {
            elem: data.name,
            prefix: data.prefix,
            local: data.local
        };

        if (Object.keys(data.attributes).length) {
            elem.attrs = {};

            for (var name in data.attributes) {
                elem.attrs[name] = {
                    name: name,
                    value: data.attributes[name].value,
                    prefix: data.attributes[name].prefix,
                    local: data.attributes[name].local
                };
            }
        }

        elem = pushToContent(elem);
        current = elem;

        // Save info about <text> tag to prevent trimming of meaningful whitespace
        if (data.name == 'text' && !data.prefix) {
            textContext = current;
        }

        stack.push(elem);

    };

    sax.ontext = function(text) {

        if (/\S/.test(text) || textContext) {

            if (!textContext)
                text = text.trim();

            pushToContent({
                text: text
            });

        }

    };

    sax.onclosetag = function() {

        var last = stack.pop();

        // Trim text inside <text> tag.
        if (last == textContext) {
            trim(textContext);
            textContext = null;
        }
        current = stack[stack.length - 1];

    };

    sax.onerror = function(e) {

        e.message = 'Error in parsing SVG: ' + e.message;
        if (e.message.indexOf('Unexpected end') < 0) {
            throw e;
        }

    };

    sax.onend = function() {

        if (!this.error) {
            callback(root);
        } else {
            callback({ error: this.error.message });
        }

    };

    try {
        sax.write(data);
    } catch (e) {
        callback({ error: e.message });
        parsingError = true;
    }
    if (!parsingError) sax.close();

    function trim(elem) {
        if (!elem.content) return elem;

        var start = elem.content[0],
            end = elem.content[elem.content.length - 1];

        while (start && start.content && !start.text) start = start.content[0];
        if (start && start.text) start.text = start.text.replace(/^\s+/, '');

        while (end && end.content && !end.text) end = end.content[end.content.length - 1];
        if (end && end.text) end.text = end.text.replace(/\s+$/, '');

        return elem;

    }

};

},{"./jsAPI.js":119,"sax":102}],122:[function(require,module,exports){
(function (Buffer){
'use strict';

/**
 * Encode plain SVG data string into Data URI string.
 *
 * @param {String} str input string
 * @param {String} type Data URI type
 * @return {String} output string
 */
exports.encodeSVGDatauri = function(str, type) {

    var prefix = 'data:image/svg+xml';

    // base64
    if (!type || type === 'base64') {

        prefix += ';base64,';

        str = prefix + new Buffer(str).toString('base64');

    // URI encoded
    } else if (type === 'enc') {

        str = prefix + ',' + encodeURIComponent(str);

    // unencoded
    } else if (type === 'unenc') {

        str = prefix + ',' + str;

    }

    return str;

};

/**
 * Decode SVG Data URI string into plain SVG string.
 *
 * @param {string} str input string
 * @return {String} output string
 */
exports.decodeSVGDatauri = function(str) {
    var regexp = /data:image\/svg\+xml(;charset=[^;,]*)?(;base64)?,(.*)/;
    var match = regexp.exec(str);

    // plain string
    if (!match) return str;

    var data = match[3];

    // base64
    if (match[2]) {

        str = new Buffer(data, 'base64').toString('utf8');

    // URI encoded
    } else if (data.charAt(0) === '%') {

        str = decodeURIComponent(data);

    // unencoded
    } else if (data.charAt(0) === '<') {

        str = data;

    }

    return str;
};

exports.intersectArrays = function(a, b) {
    return a.filter(function(n) {
        return b.indexOf(n) > -1;
    });
};

exports.cleanupOutData = function(data, params) {

    var str = '',
        delimiter,
        prev;

    data.forEach(function(item, i) {

        // space delimiter by default
        delimiter = ' ';

        // no extra space in front of first number
        if (i === 0) {
            delimiter = '';
        }

        // remove floating-point numbers leading zeros
        // 0.5 → .5
        // -0.5 → -.5
        if (params.leadingZero) {
            item = removeLeadingZero(item);
        }

        // no extra space in front of negative number or
        // in front of a floating number if a previous number is floating too
        if (
            params.negativeExtraSpace &&
            (item < 0 ||
                (String(item).charCodeAt(0) == 46 && prev % 1 !== 0)
            )
        ) {
            delimiter = '';
        }

        // save prev item value
        prev = item;

        str += delimiter + item;

    });

    return str;

};

/**
 * Remove floating-point numbers leading zero.
 *
 * @example
 * 0.5 → .5
 *
 * @example
 * -0.5 → -.5
 *
 * @param {Float} num input number
 *
 * @return {String} output number as string
 */
var removeLeadingZero = exports.removeLeadingZero = function(num) {
    var strNum = num.toString();

    if (0 < num && num < 1 && strNum.charCodeAt(0) == 48) {
        strNum = strNum.slice(1);
    } else if (-1 < num && num < 0 && strNum.charCodeAt(1) == 48) {
        strNum = strNum.charAt(0) + strNum.slice(2);
    }

    return strNum;

};

}).call(this,require("buffer").Buffer)
},{"buffer":5}],123:[function(require,module,exports){
'use strict';

// http://www.w3.org/TR/SVG/intro.html#Definitions
exports.elemsGroups = {
    animation: ['animate', 'animateColor', 'animateMotion', 'animateTransform', 'set'],
    descriptive: ['desc', 'metadata', 'title'],
    shape: ['circle', 'ellipse', 'line', 'path', 'polygon', 'polyline', 'rect'],
    structural: ['defs', 'g', 'svg', 'symbol', 'use'],
    paintServer: ['solidColor', 'linearGradient', 'radialGradient', 'meshGradient', 'pattern', 'hatch'],
    nonRendering: ['linearGradient', 'radialGradient', 'pattern', 'clipPath', 'mask', 'marker', 'symbol', 'filter', 'solidColor'],
    container: ['a', 'defs', 'g', 'marker', 'mask', 'missing-glyph', 'pattern', 'svg', 'switch', 'symbol', 'foreignObject'],
    textContent: ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'glyph', 'glyphRef', 'textPath', 'text', 'tref', 'tspan'],
    textContentChild: ['altGlyph', 'textPath', 'tref', 'tspan'],
    lightSource: ['feDiffuseLighting', 'feSpecularLighting', 'feDistantLight', 'fePointLight', 'feSpotLight'],
    filterPrimitive: ['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feFlood', 'feGaussianBlur', 'feImage', 'feMerge', 'feMorphology', 'feOffset', 'feSpecularLighting', 'feTile', 'feTurbulence']
};

exports.pathElems = ['path', 'glyph', 'missing-glyph'];

// http://www.w3.org/TR/SVG/intro.html#Definitions
exports.attrsGroups = {
    animationAddition: ['additive', 'accumulate'],
    animationAttributeTarget: ['attributeType', 'attributeName'],
    animationEvent: ['onbegin', 'onend', 'onrepeat', 'onload'],
    animationTiming: ['begin', 'dur', 'end', 'min', 'max', 'restart', 'repeatCount', 'repeatDur', 'fill'],
    animationValue: ['calcMode', 'values', 'keyTimes', 'keySplines', 'from', 'to', 'by'],
    conditionalProcessing: ['requiredFeatures', 'requiredExtensions', 'systemLanguage'],
    core: ['id', 'tabindex', 'xml:base', 'xml:lang', 'xml:space'],
    graphicalEvent: ['onfocusin', 'onfocusout', 'onactivate', 'onclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onload'],
    presentation: [
        'alignment-baseline',
        'baseline-shift',
        'buffered-rendering',
        'clip',
        'clip-path',
        'clip-rule',
        'color',
        'color-interpolation',
        'color-interpolation-filters',
        'color-profile',
        'color-rendering',
        'cursor',
        'direction',
        'display',
        'dominant-baseline',
        'enable-background',
        'fill',
        'fill-opacity',
        'fill-rule',
        'filter',
        'flood-color',
        'flood-opacity',
        'font-family',
        'font-size',
        'font-size-adjust',
        'font-stretch',
        'font-style',
        'font-variant',
        'font-weight',
        'glyph-orientation-horizontal',
        'glyph-orientation-vertical',
        'image-rendering',
        'kerning',
        'letter-spacing',
        'lighting-color',
        'marker-end',
        'marker-mid',
        'marker-start',
        'mask',
        'opacity',
        'overflow',
        'pointer-events',
        'shape-rendering',
        'solid-color',
        'solid-opacity',
        'stop-color',
        'stop-opacity',
        'stroke',
        'stroke-dasharray',
        'stroke-dashoffset',
        'stroke-linecap',
        'stroke-linejoin',
        'stroke-miterlimit',
        'stroke-opacity',
        'stroke-width',
        'paint-order',
        'text-anchor',
        'text-decoration',
        'text-overflow',
        'white-space',
        'text-rendering',
        'unicode-bidi',
        'vector-effect',
        'viewport-fill',
        'viewport-fill-opacity',
        'visibility',
        'white-space',
        'word-spacing',
        'writing-mode'
    ],
    xlink: ['xlink:href', 'xlink:show', 'xlink:actuate', 'xlink:type', 'xlink:role', 'xlink:arcrole', 'xlink:title'],
    documentEvent: ['onunload', 'onabort', 'onerror', 'onresize', 'onscroll', 'onzoom'],
    filterPrimitive: ['x', 'y', 'width', 'height', 'result'],
    transferFunction: ['type', 'tableValues', 'slope', 'intercept', 'amplitude', 'exponent', 'offset']
};

exports.attrsGroupsDefaults = {
    core: {'xml:space': 'preserve'},
    filterPrimitive: {x: '0', y: '0', width: '100%', height: '100%'},
    presentation: {
        clip: 'auto',
        'clip-path': 'none',
        'clip-rule': 'nonzero',
        mask: 'none',
        opacity: '1',
        'solid-color': '#000',
        'solid-opacity': '1',
        'stop-color': '#000',
        'stop-opacity': '1',
        'fill-opacity': '1',
        'fill-rule': 'nonzero',
        fill: '#000',
        stroke: 'none',
        'stroke-width': '1',
        'stroke-linecap': 'butt',
        'stroke-linejoin': 'miter',
        'stroke-miterlimit': '4',
        'stroke-dasharray': 'none',
        'stroke-dashoffset': '0',
        'stroke-opacity': '1',
        'paint-order': 'normal',
        'vector-effect': 'none',
        'viewport-fill': 'none',
        'viewport-fill-opacity': '1',
        display: 'inline',
        visibility: 'visible',
        'marker-start': 'none',
        'marker-mid': 'none',
        'marker-end': 'none',
        'color-interpolation': 'sRGB',
        'color-interpolation-filters': 'linearRGB',
        'color-rendering': 'auto',
        'shape-rendering': 'auto',
        'text-rendering': 'auto',
        'image-rendering': 'auto',
        'buffered-rendering': 'auto',
        'font-style': 'normal',
        'font-variant': 'normal',
        'font-weight': 'normal',
        'font-stretch': 'normal',
        'font-size': 'medium',
        'font-size-adjust': 'none',
        kerning: 'auto',
        'letter-spacing': 'normal',
        'word-spacing': 'normal',
        'text-decoration': 'none',
        'text-anchor': 'start',
        'text-overflow': 'clip',
        'writing-mode': 'lr-tb',
        'glyph-orientation-vertical': 'auto',
        'glyph-orientation-horizontal': '0deg',
        direction: 'ltr',
        'unicode-bidi': 'normal',
        'dominant-baseline': 'auto',
        'alignment-baseline': 'baseline',
        'baseline-shift': 'baseline'
    },
    transferFunction: {slope: '1', intercept: '0', amplitude: '1', exponent: '1', offset: '0'}
};

// http://www.w3.org/TR/SVG/eltindex.html
exports.elems = {
    a: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'target'
        ],
        defaults: {
            target: '_self'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    altGlyph: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'x',
            'y',
            'dx',
            'dy',
            'glyphRef',
            'format',
            'rotate'
        ]
    },
    altGlyphDef: {
        attrsGroups: [
            'core'
        ],
        content: [
            'glyphRef'
        ]
    },
    altGlyphItem: {
        attrsGroups: [
            'core'
        ],
        content: [
            'glyphRef',
            'altGlyphItem'
        ]
    },
    animate: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'animationAddition',
            'animationAttributeTarget',
            'animationEvent',
            'animationTiming',
            'animationValue',
            'presentation',
            'xlink'
        ],
        attrs: [
            'externalResourcesRequired'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    animateColor: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'animationEvent',
            'xlink',
            'animationAttributeTarget',
            'animationTiming',
            'animationValue',
            'animationAddition',
            'presentation'
        ],
        attrs: [
            'externalResourcesRequired'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    animateMotion: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'animationEvent',
            'xlink',
            'animationTiming',
            'animationValue',
            'animationAddition'
        ],
        attrs: [
            'externalResourcesRequired',
            'path',
            'keyPoints',
            'rotate',
            'origin'
        ],
        defaults: {
            'rotate': '0'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            'mpath'
        ]
    },
    animateTransform: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'animationEvent',
            'xlink',
            'animationAttributeTarget',
            'animationTiming',
            'animationValue',
            'animationAddition'
        ],
        attrs: [
            'externalResourcesRequired',
            'type'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    circle: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'cx',
            'cy',
            'r'
        ],
        defaults: {
            cx: '0',
            cy: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    clipPath: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'clipPathUnits'
        ],
        defaults: {
            clipPathUnits: 'userSpaceOnUse'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape'
        ],
        content: [
            'text',
            'use'
        ]
    },
    'color-profile': {
        attrsGroups: [
            'core',
            'xlink'
        ],
        attrs: [
            'local',
            'name',
            'rendering-intent'
        ],
        defaults: {
            name: 'sRGB',
            'rendering-intent': 'auto'
        },
        contentGroups: [
            'descriptive'
        ]
    },
    cursor: {
        attrsGroups: [
            'core',
            'conditionalProcessing',
            'xlink'
        ],
        attrs: [
            'externalResourcesRequired',
            'x',
            'y'
        ],
        defaults: {
            x: '0',
            y: '0'
        },
        contentGroups: [
            'descriptive'
        ]
    },
    defs: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform'
        ],
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    desc: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'class',
            'style'
        ]
    },
    ellipse: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'cx',
            'cy',
            'rx',
            'ry'
        ],
        defaults: {
            cx: '0',
            cy: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    feBlend: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            // TODO: in - 'If no value is provided and this is the first filter primitive,
            // then this filter primitive will use SourceGraphic as its input'
            'in',
            'in2',
            'mode'
        ],
        defaults: {
            mode: 'normal'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feColorMatrix: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'type',
            'values'
        ],
        defaults: {
            type: 'matrix'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feComponentTransfer: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in'
        ],
        content: [
            'feFuncA',
            'feFuncB',
            'feFuncG',
            'feFuncR'
        ]
    },
    feComposite: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'in2',
            'operator',
            'k1',
            'k2',
            'k3',
            'k4'
        ],
        defaults: {
            operator: 'over',
            k1: '0',
            k2: '0',
            k3: '0',
            k4: '0'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feConvolveMatrix: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'order',
            'kernelMatrix',
            // TODO: divisor - 'The default value is the sum of all values in kernelMatrix,
            // with the exception that if the sum is zero, then the divisor is set to 1'
            'divisor',
            'bias',
            // TODO: targetX - 'By default, the convolution matrix is centered in X over each
            // pixel of the input image (i.e., targetX = floor ( orderX / 2 ))'
            'targetX',
            'targetY',
            'edgeMode',
            // TODO: kernelUnitLength - 'The first number is the <dx> value. The second number
            // is the <dy> value. If the <dy> value is not specified, it defaults to the same value as <dx>'
            'kernelUnitLength',
            'preserveAlpha'
        ],
        defaults: {
            order: '3',
            bias: '0',
            edgeMode: 'duplicate',
            preserveAlpha: 'false'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feDiffuseLighting: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'surfaceScale',
            'diffuseConstant',
            'kernelUnitLength'
        ],
        defaults: {
            surfaceScale: '1',
            diffuseConstant: '1'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            // TODO: 'exactly one light source element, in any order'
            'feDistantLight',
            'fePointLight',
            'feSpotLight'
        ]
    },
    feDisplacementMap: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'in2',
            'scale',
            'xChannelSelector',
            'yChannelSelector'
        ],
        defaults: {
            scale: '0',
            xChannelSelector: 'A',
            yChannelSelector: 'A'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feDistantLight: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'azimuth',
            'elevation'
        ],
        defaults: {
            azimuth: '0',
            elevation: '0'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feFlood: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style'
        ],
        content: [
            'animate',
            'animateColor',
            'set'
        ]
    },
    feFuncA: {
        attrsGroups: [
            'core',
            'transferFunction'
        ],
        content: [
            'set',
            'animate'
        ]
    },
    feFuncB: {
        attrsGroups: [
            'core',
            'transferFunction'
        ],
        content: [
            'set',
            'animate'
        ]
    },
    feFuncG: {
        attrsGroups: [
            'core',
            'transferFunction'
        ],
        content: [
            'set',
            'animate'
        ]
    },
    feFuncR: {
        attrsGroups: [
            'core',
            'transferFunction'
        ],
        content: [
            'set',
            'animate'
        ]
    },
    feGaussianBlur: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'stdDeviation'
        ],
        defaults: {
            stdDeviation: '0'
        },
        content: [
            'set',
            'animate'
        ]
    },
    feImage: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'preserveAspectRatio',
            'xlink:href'
        ],
        defaults: {
            preserveAspectRatio: 'xMidYMid meet'
        },
        content: [
            'animate',
            'animateTransform',
            'set'
        ]
    },
    feMerge: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style'
        ],
        content: [
            'feMergeNode'
        ]
    },
    feMergeNode: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'in'
        ],
        content: [
            'animate',
            'set'
        ]
    },
    feMorphology: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'operator',
            'radius'
        ],
        defaults: {
            operator: 'erode',
            radius: '0'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feOffset: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'dx',
            'dy'
        ],
        defaults: {
            dx: '0',
            dy: '0'
        },
        content: [
            'animate',
            'set'
        ]
    },
    fePointLight: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'x',
            'y',
            'z'
        ],
        defaults: {
            x: '0',
            y: '0',
            z: '0'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feSpecularLighting: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in',
            'surfaceScale',
            'specularConstant',
            'specularExponent',
            'kernelUnitLength'
        ],
        defaults: {
            surfaceScale: '1',
            specularConstant: '1',
            specularExponent: '1'
        },
        contentGroups: [
            'descriptive',
            // TODO: exactly one 'light source element'
            'lightSource'
        ]
    },
    feSpotLight: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'x',
            'y',
            'z',
            'pointsAtX',
            'pointsAtY',
            'pointsAtZ',
            'specularExponent',
            'limitingConeAngle'
        ],
        defaults: {
            x: '0',
            y: '0',
            z: '0',
            pointsAtX: '0',
            pointsAtY: '0',
            pointsAtZ: '0',
            specularExponent: '1'
        },
        content: [
            'animate',
            'set'
        ]
    },
    feTile: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'in'
        ],
        content: [
            'animate',
            'set'
        ]
    },
    feTurbulence: {
        attrsGroups: [
            'core',
            'presentation',
            'filterPrimitive'
        ],
        attrs: [
            'class',
            'style',
            'baseFrequency',
            'numOctaves',
            'seed',
            'stitchTiles',
            'type'
        ],
        defaults: {
            baseFrequency: '0',
            numOctaves: '1',
            seed: '0',
            stitchTiles: 'noStitch',
            type: 'turbulence'
        },
        content: [
            'animate',
            'set'
        ]
    },
    filter: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'x',
            'y',
            'width',
            'height',
            'filterRes',
            'filterUnits',
            'primitiveUnits',
            'xlink:href'
        ],
        defaults: {
            primitiveUnits: 'userSpaceOnUse',
            x: '-10%',
            y: '-10%',
            width: '120%',
            height: '120%'
        },
        contentGroups: [
            'descriptive',
            'filterPrimitive'
        ],
        content: [
            'animate',
            'set'
        ]
    },
    font: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'horiz-origin-x',
            'horiz-origin-y',
            'horiz-adv-x',
            'vert-origin-x',
            'vert-origin-y',
            'vert-adv-y'
        ],
        defaults: {
            'horiz-origin-x': '0',
            'horiz-origin-y': '0'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            'font-face',
            'glyph',
            'hkern',
            'missing-glyph',
            'vkern'
        ]
    },
    'font-face': {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'font-family',
            'font-style',
            'font-variant',
            'font-weight',
            'font-stretch',
            'font-size',
            'unicode-range',
            'units-per-em',
            'panose-1',
            'stemv',
            'stemh',
            'slope',
            'cap-height',
            'x-height',
            'accent-height',
            'ascent',
            'descent',
            'widths',
            'bbox',
            'ideographic',
            'alphabetic',
            'mathematical',
            'hanging',
            'v-ideographic',
            'v-alphabetic',
            'v-mathematical',
            'v-hanging',
            'underline-position',
            'underline-thickness',
            'strikethrough-position',
            'strikethrough-thickness',
            'overline-position',
            'overline-thickness'
        ],
        defaults: {
            'font-style': 'all',
            'font-variant': 'normal',
            'font-weight': 'all',
            'font-stretch': 'normal',
            'unicode-range': 'U+0-10FFFF',
            'units-per-em': '1000',
            'panose-1': '0 0 0 0 0 0 0 0 0 0',
            'slope': '0'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            // TODO: "at most one 'font-face-src' element"
            'font-face-src'
        ]
    },
    // TODO: empty content
    'font-face-format': {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'string'
        ]
    },
    'font-face-name': {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'name'
        ]
    },
    'font-face-src': {
        attrsGroups: [
            'core'
        ],
        content: [
            'font-face-name',
            'font-face-uri'
        ]
    },
    'font-face-uri': {
        attrsGroups: [
            'core',
            'xlink'
        ],
        attrs: [
            'xlink:href'
        ],
        content: [
            'font-face-format'
        ]
    },
    foreignObject: {
        attrsGroups: [
            'core',
            'conditionalProcessing',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'x',
            'y',
            'width',
            'height'
        ],
        defaults: {
            x: 0,
            y: 0
        }
    },
    g: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform'
        ],
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    glyph: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'd',
            'horiz-adv-x',
            'vert-origin-x',
            'vert-origin-y',
            'vert-adv-y',
            'unicode',
            'glyph-name',
            'orientation',
            'arabic-form',
            'lang'
        ],
        defaults: {
            'arabic-form': 'initial'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ],
    },
    glyphRef: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'd',
            'horiz-adv-x',
            'vert-origin-x',
            'vert-origin-y',
            'vert-adv-y'
        ],
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    hatch: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'x',
            'y',
            'pitch',
            'rotate',
            'hatchUnits',
            'hatchContentUnits',
            'transform'
        ],
        defaults: {
            hatchUnits: 'objectBoundingBox',
            hatchContentUnits: 'userSpaceOnUse',
            x: '0',
            y: '0',
            pitch: '0',
            rotate: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ],
        content: [
            'hatchPath'
        ]
    },
    hatchPath: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'd',
            'offset'
        ],
        defaults: {
            offset: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    hkern: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'u1',
            'g1',
            'u2',
            'g2',
            'k'
        ]
    },
    image: {
        attrsGroups: [
            'core',
            'conditionalProcessing',
            'graphicalEvent',
            'xlink',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'preserveAspectRatio',
            'transform',
            'x',
            'y',
            'width',
            'height',
            'xlink:href'
        ],
        defaults: {
            x: '0',
            y: '0',
            preserveAspectRatio: 'xMidYMid meet'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    line: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'x1',
            'y1',
            'x2',
            'y2'
        ],
        defaults: {
            x1: '0',
            y1: '0',
            x2: '0',
            y2: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    linearGradient: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'x1',
            'y1',
            'x2',
            'y2',
            'gradientUnits',
            'gradientTransform',
            'spreadMethod',
            'xlink:href'
        ],
        defaults: {
            x1: '0',
            y1: '0',
            x2: '100%',
            y2: '0',
            spreadMethod: 'pad'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            'animate',
            'animateTransform',
            'set',
            'stop'
        ]
    },
    marker: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'viewBox',
            'preserveAspectRatio',
            'refX',
            'refY',
            'markerUnits',
            'markerWidth',
            'markerHeight',
            'orient'
        ],
        defaults: {
            markerUnits: 'strokeWidth',
            refX: '0',
            refY: '0',
            markerWidth: '3',
            markerHeight: '3'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    mask: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'x',
            'y',
            'width',
            'height',
            'maskUnits',
            'maskContentUnits'
        ],
        defaults: {
            maskUnits: 'objectBoundingBox',
            maskContentUnits: 'userSpaceOnUse',
            x: '-10%',
            y: '-10%',
            width: '120%',
            height: '120%'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    metadata: {
        attrsGroups: [
            'core'
        ]
    },
    'missing-glyph': {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'd',
            'horiz-adv-x',
            'vert-origin-x',
            'vert-origin-y',
            'vert-adv-y'
        ],
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    mpath: {
        attrsGroups: [
            'core',
            'xlink'
        ],
        attrs: [
            'externalResourcesRequired',
            'xlink:href'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    path: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'd',
            'pathLength'
        ],
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    pattern: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'viewBox',
            'preserveAspectRatio',
            'x',
            'y',
            'width',
            'height',
            'patternUnits',
            'patternContentUnits',
            'patternTransform',
            'xlink:href'
        ],
        defaults: {
            patternUnits: 'objectBoundingBox',
            patternContentUnits: 'userSpaceOnUse',
            x: '0',
            y: '0',
            width: '0',
            height: '0',
            preserveAspectRatio: 'xMidYMid meet'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'paintServer',
            'shape',
            'structural'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    polygon: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'points'
        ],
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    polyline: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'points'
        ],
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    radialGradient: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'cx',
            'cy',
            'r',
            'fx',
            'fy',
            'fr',
            'gradientUnits',
            'gradientTransform',
            'spreadMethod',
            'xlink:href'
        ],
        defaults: {
            gradientUnits: 'objectBoundingBox',
            cx: '50%',
            cy: '50%',
            r: '50%'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            'animate',
            'animateTransform',
            'set',
            'stop'
        ]
    },
    meshGradient: {
        attrsGroups: [
            'core',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'x',
            'y',
            'gradientUnits',
            'transform'
        ],
        contentGroups: [
            'descriptive',
            'paintServer',
            'animation',
        ],
        content: [
            'meshRow'
        ]
    },
    meshRow: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style'
        ],
        contentGroups: [
            'descriptive'
        ],
        content: [
            'meshPatch'
        ]
    },
    meshPatch: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style'
        ],
        contentGroups: [
            'descriptive'
        ],
        content: [
            'stop'
        ]
    },
    rect: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'x',
            'y',
            'width',
            'height',
            'rx',
            'ry'
        ],
        defaults: {
            x: '0',
            y: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    script: {
        attrsGroups: [
            'core',
            'xlink'
        ],
        attrs: [
            'externalResourcesRequired',
            'type',
            'xlink:href'
        ]
    },
    set: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'animation',
            'xlink',
            'animationAttributeTarget',
            'animationTiming',
        ],
        attrs: [
            'externalResourcesRequired',
            'to'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    solidColor: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style'
        ],
        contentGroups: [
            'paintServer'
        ]
    },
    stop: {
        attrsGroups: [
            'core',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'offset',
            'path'
        ],
        content: [
            'animate',
            'animateColor',
            'set'
        ]
    },
    style: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'type',
            'media',
            'title'
        ],
        defaults: {
            type: 'text/css'
        }
    },
    svg: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'documentEvent',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'x',
            'y',
            'width',
            'height',
            'viewBox',
            'preserveAspectRatio',
            'zoomAndPan',
            'version',
            'baseProfile',
            'contentScriptType',
            'contentStyleType'
        ],
        defaults: {
            x: '0',
            y: '0',
            width: '100%',
            height: '100%',
            preserveAspectRatio: 'xMidYMid meet',
            zoomAndPan: 'magnify',
            version: '1.1',
            baseProfile: 'none',
            contentScriptType: 'application/ecmascript',
            contentStyleType: 'text/css'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    switch: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform'
        ],
        contentGroups: [
            'animation',
            'descriptive',
            'shape'
        ],
        content: [
            'a',
            'foreignObject',
            'g',
            'image',
            'svg',
            'switch',
            'text',
            'use'
        ]
    },
    symbol: {
        attrsGroups: [
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'preserveAspectRatio',
            'viewBox',
            'refX',
            'refY'
        ],
        defaults: {
            refX: 0,
            refY: 0
        },
        contentGroups: [
            'animation',
            'descriptive',
            'shape',
            'structural',
            'paintServer'
        ],
        content: [
            'a',
            'altGlyphDef',
            'clipPath',
            'color-profile',
            'cursor',
            'filter',
            'font',
            'font-face',
            'foreignObject',
            'image',
            'marker',
            'mask',
            'pattern',
            'script',
            'style',
            'switch',
            'text',
            'view'
        ]
    },
    text: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'lengthAdjust',
            'x',
            'y',
            'dx',
            'dy',
            'rotate',
            'textLength'
        ],
        defaults: {
            x: '0',
            y: '0',
            lengthAdjust: 'spacing'
        },
        contentGroups: [
            'animation',
            'descriptive',
            'textContentChild'
        ],
        content: [
            'a'
        ]
    },
    textPath: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'xlink:href',
            'startOffset',
            'method',
            'spacing',
            'd'
        ],
        defaults: {
            startOffset: '0',
            method: 'align',
            spacing: 'exact'
        },
        contentGroups: [
            'descriptive'
        ],
        content: [
            'a',
            'altGlyph',
            'animate',
            'animateColor',
            'set',
            'tref',
            'tspan'
        ]
    },
    title: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'class',
            'style'
        ]
    },
    tref: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'xlink:href'
        ],
        contentGroups: [
            'descriptive'
        ],
        content: [
            'animate',
            'animateColor',
            'set'
        ]
    },
    tspan: {
        attrsGroups: [
            'conditionalProcessing',
            'core',
            'graphicalEvent',
            'presentation'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'x',
            'y',
            'dx',
            'dy',
            'rotate',
            'textLength',
            'lengthAdjust'
        ],
        contentGroups: [
            'descriptive'
        ],
        content: [
            'a',
            'altGlyph',
            'animate',
            'animateColor',
            'set',
            'tref',
            'tspan'
        ]
    },
    use: {
        attrsGroups: [
            'core',
            'conditionalProcessing',
            'graphicalEvent',
            'presentation',
            'xlink'
        ],
        attrs: [
            'class',
            'style',
            'externalResourcesRequired',
            'transform',
            'x',
            'y',
            'width',
            'height',
            'xlink:href'
        ],
        defaults: {
            x: '0',
            y: '0'
        },
        contentGroups: [
            'animation',
            'descriptive'
        ]
    },
    view: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'externalResourcesRequired',
            'viewBox',
            'preserveAspectRatio',
            'zoomAndPan',
            'viewTarget'
        ],
        contentGroups: [
            'descriptive'
        ]
    },
    vkern: {
        attrsGroups: [
            'core'
        ],
        attrs: [
            'u1',
            'g1',
            'u2',
            'g2',
            'k'
        ]
    }
};

// http://wiki.inkscape.org/wiki/index.php/Inkscape-specific_XML_attributes
exports.editorNamespaces = [
    'http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd',
    'http://inkscape.sourceforge.net/DTD/sodipodi-0.dtd',
    'http://www.inkscape.org/namespaces/inkscape',
    'http://www.bohemiancoding.com/sketch/ns',
    'http://ns.adobe.com/AdobeIllustrator/10.0/',
    'http://ns.adobe.com/Graphs/1.0/',
    'http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/',
    'http://ns.adobe.com/Variables/1.0/',
    'http://ns.adobe.com/SaveForWeb/1.0/',
    'http://ns.adobe.com/Extensibility/1.0/',
    'http://ns.adobe.com/Flows/1.0/',
    'http://ns.adobe.com/ImageReplacement/1.0/',
    'http://ns.adobe.com/GenericCustomNamespace/1.0/',
    'http://ns.adobe.com/XPath/1.0/'
];

// http://www.w3.org/TR/SVG/linking.html#processingIRI
exports.referencesProps = [
    'clip-path',
    'color-profile',
    'fill',
    'filter',
    'marker-start',
    'marker-mid',
    'marker-end',
    'mask',
    'stroke',
    'style'
];

// http://www.w3.org/TR/SVG/propidx.html
exports.inheritableAttrs = [
    'clip-rule',
    'color',
    'color-interpolation',
    'color-interpolation-filters',
    'color-profile',
    'color-rendering',
    'cursor',
    'direction',
    'fill',
    'fill-opacity',
    'fill-rule',
    'font',
    'font-family',
    'font-size',
    'font-size-adjust',
    'font-stretch',
    'font-style',
    'font-variant',
    'font-weight',
    'glyph-orientation-horizontal',
    'glyph-orientation-vertical',
    'image-rendering',
    'kerning',
    'letter-spacing',
    'marker',
    'marker-end',
    'marker-mid',
    'marker-start',
    'pointer-events',
    'shape-rendering',
    'stroke',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'text-anchor',
    'text-rendering',
    'transform',
    'visibility',
    'white-space',
    'word-spacing',
    'writing-mode'
];

// http://www.w3.org/TR/SVG/single-page.html#types-ColorKeywords
exports.colorsNames = {
    'aliceblue': '#f0f8ff',
    'antiquewhite': '#faebd7',
    'aqua': '#0ff',
    'aquamarine': '#7fffd4',
    'azure': '#f0ffff',
    'beige': '#f5f5dc',
    'bisque': '#ffe4c4',
    'black': '#000',
    'blanchedalmond': '#ffebcd',
    'blue': '#00f',
    'blueviolet': '#8a2be2',
    'brown': '#a52a2a',
    'burlywood': '#deb887',
    'cadetblue': '#5f9ea0',
    'chartreuse': '#7fff00',
    'chocolate': '#d2691e',
    'coral': '#ff7f50',
    'cornflowerblue': '#6495ed',
    'cornsilk': '#fff8dc',
    'crimson': '#dc143c',
    'cyan': '#0ff',
    'darkblue': '#00008b',
    'darkcyan': '#008b8b',
    'darkgoldenrod': '#b8860b',
    'darkgray': '#a9a9a9',
    'darkgreen': '#006400',
    'darkkhaki': '#bdb76b',
    'darkmagenta': '#8b008b',
    'darkolivegreen': '#556b2f',
    'darkorange': '#ff8c00',
    'darkorchid': '#9932cc',
    'darkred': '#8b0000',
    'darksalmon': '#e9967a',
    'darkseagreen': '#8fbc8f',
    'darkslateblue': '#483d8b',
    'darkslategray': '#2f4f4f',
    'darkturquoise': '#00ced1',
    'darkviolet': '#9400d3',
    'deeppink': '#ff1493',
    'deepskyblue': '#00bfff',
    'dimgray': '#696969',
    'dodgerblue': '#1e90ff',
    'firebrick': '#b22222',
    'floralwhite': '#fffaf0',
    'forestgreen': '#228b22',
    'fuchsia': '#f0f',
    'gainsboro': '#dcdcdc',
    'ghostwhite': '#f8f8ff',
    'gold': '#ffd700',
    'goldenrod': '#daa520',
    'gray': '#808080',
    'green': '#008000',
    'greenyellow': '#adff2f',
    'honeydew': '#f0fff0',
    'hotpink': '#ff69b4',
    'indianred': '#cd5c5c',
    'indigo': '#4b0082',
    'ivory': '#fffff0',
    'khaki': '#f0e68c',
    'lavender': '#e6e6fa',
    'lavenderblush': '#fff0f5',
    'lawngreen': '#7cfc00',
    'lemonchiffon': '#fffacd',
    'lightblue': '#add8e6',
    'lightcoral': '#f08080',
    'lightcyan': '#e0ffff',
    'lightgoldenrodyellow': '#fafad2',
    'lightgreen': '#90ee90',
    'lightgrey': '#d3d3d3',
    'lightpink': '#ffb6c1',
    'lightsalmon': '#ffa07a',
    'lightseagreen': '#20b2aa',
    'lightskyblue': '#87cefa',
    'lightslategray': '#789',
    'lightsteelblue': '#b0c4de',
    'lightyellow': '#ffffe0',
    'lime': '#0f0',
    'limegreen': '#32cd32',
    'linen': '#faf0e6',
    'magenta': '#f0f',
    'maroon': '#800000',
    'mediumaquamarine': '#66cdaa',
    'mediumblue': '#0000cd',
    'mediumorchid': '#ba55d3',
    'mediumpurple': '#9370db',
    'mediumseagreen': '#3cb371',
    'mediumslateblue': '#7b68ee',
    'mediumspringgreen': '#00fa9a',
    'mediumturquoise': '#48d1cc',
    'mediumvioletred': '#c71585',
    'midnightblue': '#191970',
    'mintcream': '#f5fffa',
    'mistyrose': '#ffe4e1',
    'moccasin': '#ffe4b5',
    'navajowhite': '#ffdead',
    'navy': '#000080',
    'oldlace': '#fdf5e6',
    'olive': '#808000',
    'olivedrab': '#6b8e23',
    'orange': '#ffa500',
    'orangered': '#ff4500',
    'orchid': '#da70d6',
    'palegoldenrod': '#eee8aa',
    'palegreen': '#98fb98',
    'paleturquoise': '#afeeee',
    'palevioletred': '#db7093',
    'papayawhip': '#ffefd5',
    'peachpuff': '#ffdab9',
    'peru': '#cd853f',
    'pink': '#ffc0cb',
    'plum': '#dda0dd',
    'powderblue': '#b0e0e6',
    'purple': '#800080',
    'red': '#f00',
    'rosybrown': '#bc8f8f',
    'royalblue': '#4169e1',
    'saddlebrown': '#8b4513',
    'salmon': '#fa8072',
    'sandybrown': '#f4a460',
    'seagreen': '#2e8b57',
    'seashell': '#fff5ee',
    'sienna': '#a0522d',
    'silver': '#c0c0c0',
    'skyblue': '#87ceeb',
    'slateblue': '#6a5acd',
    'slategray': '#708090',
    'snow': '#fffafa',
    'springgreen': '#00ff7f',
    'steelblue': '#4682b4',
    'tan': '#d2b48c',
    'teal': '#008080',
    'thistle': '#d8bfd8',
    'tomato': '#ff6347',
    'turquoise': '#40e0d0',
    'violet': '#ee82ee',
    'wheat': '#f5deb3',
    'white': '#fff',
    'whitesmoke': '#f5f5f5',
    'yellow': '#ff0',
    'yellowgreen': '#9acd32'
};

exports.colorsShortNames = {
  '#f0ffff': 'azure',
  '#f5f5dc': 'beige',
  '#ffe4c4': 'bisque',
  '#a52a2a': 'brown',
  '#ff7f50': 'coral',
  '#ffd700': 'gold',
  '#808080': 'gray',
  '#008000': 'green',
  '#4b0082': 'indigo',
  '#fffff0': 'ivory',
  '#f0e68c': 'khaki',
  '#faf0e6': 'linen',
  '#800000': 'maroon',
  '#000080': 'navy',
  '#808000': 'olive',
  '#ffa500': 'orange',
  '#da70d6': 'orchid',
  '#cd853f': 'peru',
  '#ffc0cb': 'pink',
  '#dda0dd': 'plum',
  '#800080': 'purple',
  '#f00': 'red',
  '#fa8072': 'salmon',
  '#a0522d': 'sienna',
  '#c0c0c0': 'silver',
  '#fffafa': 'snow',
  '#d2b48c': 'tan',
  '#008080': 'teal',
  '#ff6347': 'tomato',
  '#ee82ee': 'violet',
  '#f5deb3': 'wheat'
};

// http://www.w3.org/TR/SVG/single-page.html#types-DataTypeColor
exports.colorsProps = [
    'color', 'fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color'
];

},{}],124:[function(require,module,exports){
/* global a2c */
'use strict';

var regPathInstructions = /([MmLlHhVvCcSsQqTtAaZz])\s*/,
    regPathData = /[-+]?(?:\d*\.\d+|\d+\.?)([eE][-+]?\d+)?/g,
    regNumericValues = /[-+]?(\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/,
    transform2js = require('./_transforms').transform2js,
    transformsMultiply = require('./_transforms').transformsMultiply,
    transformArc = require('./_transforms').transformArc,
    collections = require('./_collections.js'),
    referencesProps = collections.referencesProps,
    defaultStrokeWidth = collections.attrsGroupsDefaults.presentation['stroke-width'],
    cleanupOutData = require('../lib/svgo/tools').cleanupOutData,
    removeLeadingZero = require('../lib/svgo/tools').removeLeadingZero,
    prevCtrlPoint;

/**
 * Convert path string to JS representation.
 *
 * @param {String} pathString input string
 * @param {Object} params plugin params
 * @return {Array} output array
 */
exports.path2js = function(path) {
    if (path.pathJS) return path.pathJS;

    var paramsLength = { // Number of parameters of every path command
            H: 1, V: 1, M: 2, L: 2, T: 2, Q: 4, S: 4, C: 6, A: 7,
            h: 1, v: 1, m: 2, l: 2, t: 2, q: 4, s: 4, c: 6, a: 7
        },
        pathData = [],   // JS representation of the path data
        instruction, // current instruction context
        startMoveto = false;

    // splitting path string into array like ['M', '10 50', 'L', '20 30']
    path.attr('d').value.split(regPathInstructions).forEach(function(data) {
        if (!data) return;
        if (!startMoveto) {
            if (data == 'M' || data == 'm') {
                startMoveto = true;
            } else return;
        }

        // instruction item
        if (regPathInstructions.test(data)) {
            instruction = data;

            // z - instruction w/o data
            if (instruction == 'Z' || instruction == 'z') {
                pathData.push({
                    instruction: 'z'
                });
            }
        // data item
        } else {
            data = data.match(regPathData);
            if (!data) return;

            data = data.map(Number);

            // Subsequent moveto pairs of coordinates are threated as implicit lineto commands
            // http://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands
            if (instruction == 'M' || instruction == 'm') {
                pathData.push({
                    instruction: pathData.length == 0 ? 'M' : instruction,
                    data: data.splice(0, 2)
                });
                instruction = instruction == 'M' ? 'L' : 'l';
            }

            for (var pair = paramsLength[instruction]; data.length;) {
                pathData.push({
                    instruction: instruction,
                    data: data.splice(0, pair)
                });
            }
        }
    });

    // First moveto is actually absolute. Subsequent coordinates were separated above.
    if (pathData.length && pathData[0].instruction == 'm') {
        pathData[0].instruction = 'M';
    }
    path.pathJS = pathData;

    return pathData;
};

/**
 * Convert relative Path data to absolute.
 *
 * @param {Array} data input data
 * @return {Array} output data
 */
var relative2absolute = exports.relative2absolute = function(data) {
    var currentPoint = [0, 0],
        subpathPoint = [0, 0],
        i;

    data = data.map(function(item) {

        var instruction = item.instruction,
            itemData = item.data && item.data.slice();

        if (instruction == 'M') {

            set(currentPoint, itemData);
            set(subpathPoint, itemData);

        } else if ('mlcsqt'.indexOf(instruction) > -1) {

            for (i = 0; i < itemData.length; i++) {
                itemData[i] += currentPoint[i % 2];
            }
            set(currentPoint, itemData);

            if (instruction == 'm') {
                set(subpathPoint, itemData);
            }

        } else if (instruction == 'a') {

            itemData[5] += currentPoint[0];
            itemData[6] += currentPoint[1];
            set(currentPoint, itemData);

        } else if (instruction == 'h') {

            itemData[0] += currentPoint[0];
            currentPoint[0] = itemData[0];

        } else if (instruction == 'v') {

            itemData[0] += currentPoint[1];
            currentPoint[1] = itemData[0];

        } else if ('MZLCSQTA'.indexOf(instruction) > -1) {

            set(currentPoint, itemData);

        } else if (instruction == 'H') {

            currentPoint[0] = itemData[0];

        } else if (instruction == 'V') {

            currentPoint[1] = itemData[0];

        } else if (instruction == 'z') {

            set(currentPoint, subpathPoint);

        }

        return instruction == 'z' ?
            { instruction: 'z' } :
            {
                instruction: instruction.toUpperCase(),
                data: itemData
            };

    });

    return data;
};

/**
 * Apply transformation(s) to the Path data.
 *
 * @param {Object} elem current element
 * @param {Array} path input path data
 * @param {Object} params whether to apply transforms to stroked lines and transform precision (used for stroke width)
 * @return {Array} output path data
 */
exports.applyTransforms = function(elem, path, params) {
    // if there are no 'stroke' attr and references to other objects such as
    // gradiends or clip-path which are also subjects to transform.
    if (!elem.hasAttr('transform') || !elem.attr('transform').value ||
        elem.someAttr(function(attr) {
            return ~referencesProps.indexOf(attr.name) && ~attr.value.indexOf('url(');
        }))
        return path;

    var matrix = transformsMultiply(transform2js(elem.attr('transform').value)),
        stroke = elem.computedAttr('stroke'),
        id = elem.computedAttr('id'),
        transformPrecision = params.transformPrecision,
        newPoint, scale;

    if (stroke && stroke != 'none') {
        if (!params.applyTransformsStroked ||
            (matrix.data[0] != matrix.data[3] || matrix.data[1] != -matrix.data[2]) &&
            (matrix.data[0] != -matrix.data[3] || matrix.data[1] != matrix.data[2]))
            return path;

        // "stroke-width" should be inside the part with ID, otherwise it can be overrided in <use>
        if (id) {
            var idElem = elem,
                hasStrokeWidth = false;

            do {
                if (idElem.hasAttr('stroke-width')) hasStrokeWidth = true;
            } while (!idElem.hasAttr('id', id) && !hasStrokeWidth && (idElem = idElem.parentNode));

            if (!hasStrokeWidth) return path;
        }

        scale = +Math.sqrt(matrix.data[0] * matrix.data[0] + matrix.data[1] * matrix.data[1]).toFixed(transformPrecision);

        if (scale !== 1) {
            var strokeWidth = elem.computedAttr('stroke-width') || defaultStrokeWidth;

            if (elem.hasAttr('stroke-width')) {
                elem.attrs['stroke-width'].value = elem.attrs['stroke-width'].value.trim()
                    .replace(regNumericValues, function(num) { return removeLeadingZero(num * scale) });
            } else {
                elem.addAttr({
                    name: 'stroke-width',
                    prefix: '',
                    local: 'stroke-width',
                    value: strokeWidth.replace(regNumericValues, function(num) { return removeLeadingZero(num * scale) })
                });
            }
        }
    } else if (id) { // Stroke and stroke-width can be redefined with <use>
        return path;
    }

    path.forEach(function(pathItem) {

        if (pathItem.data) {

            // h -> l
            if (pathItem.instruction === 'h') {

                pathItem.instruction = 'l';
                pathItem.data[1] = 0;

            // v -> l
            } else if (pathItem.instruction === 'v') {

                pathItem.instruction = 'l';
                pathItem.data[1] = pathItem.data[0];
                pathItem.data[0] = 0;

            }

            // if there is a translate() transform
            if (pathItem.instruction === 'M' &&
                (matrix.data[4] !== 0 ||
                matrix.data[5] !== 0)
            ) {

                // then apply it only to the first absoluted M
                newPoint = transformPoint(matrix.data, pathItem.data[0], pathItem.data[1]);
                set(pathItem.data, newPoint);
                set(pathItem.coords, newPoint);

                // clear translate() data from transform matrix
                matrix.data[4] = 0;
                matrix.data[5] = 0;

            } else {

                if (pathItem.instruction == 'a') {

                    transformArc(pathItem.data, matrix.data);

                    // reduce number of digits in rotation angle
                    if (Math.abs(pathItem.data[2]) > 80) {
                        var a = pathItem.data[0],
                            rotation = pathItem.data[2];
                        pathItem.data[0] = pathItem.data[1];
                        pathItem.data[1] = a;
                        pathItem.data[2] = rotation + (rotation > 0 ? -90 : 90);
                    }

                    newPoint = transformPoint(matrix.data, pathItem.data[5], pathItem.data[6]);
                    pathItem.data[5] = newPoint[0];
                    pathItem.data[6] = newPoint[1];

                } else {

                    for (var i = 0; i < pathItem.data.length; i += 2) {
                        newPoint = transformPoint(matrix.data, pathItem.data[i], pathItem.data[i + 1]);
                        pathItem.data[i] = newPoint[0];
                        pathItem.data[i + 1] = newPoint[1];
                    }
                }

                pathItem.coords[0] = pathItem.base[0] + pathItem.data[pathItem.data.length - 2];
                pathItem.coords[1] = pathItem.base[1] + pathItem.data[pathItem.data.length - 1];

            }

        }

    });

    // remove transform attr
    elem.removeAttr('transform');

    return path;
};

/**
 * Apply transform 3x3 matrix to x-y point.
 *
 * @param {Array} matrix transform 3x3 matrix
 * @param {Array} point x-y point
 * @return {Array} point with new coordinates
 */
function transformPoint(matrix, x, y) {

    return [
        matrix[0] * x + matrix[2] * y + matrix[4],
        matrix[1] * x + matrix[3] * y + matrix[5]
    ];

}

/**
 * Compute Cubic Bézie bounding box.
 *
 * @see http://processingjs.nihongoresources.com/bezierinfo/
 *
 * @param {Float} xa
 * @param {Float} ya
 * @param {Float} xb
 * @param {Float} yb
 * @param {Float} xc
 * @param {Float} yc
 * @param {Float} xd
 * @param {Float} yd
 *
 * @return {Object}
 */
exports.computeCubicBoundingBox = function(xa, ya, xb, yb, xc, yc, xd, yd) {

    var minx = Number.POSITIVE_INFINITY,
        miny = Number.POSITIVE_INFINITY,
        maxx = Number.NEGATIVE_INFINITY,
        maxy = Number.NEGATIVE_INFINITY,
        ts,
        t,
        x,
        y,
        i;

    // X
    if (xa < minx) { minx = xa; }
    if (xa > maxx) { maxx = xa; }
    if (xd < minx) { minx= xd; }
    if (xd > maxx) { maxx = xd; }

    ts = computeCubicFirstDerivativeRoots(xa, xb, xc, xd);

    for (i = 0; i < ts.length; i++) {

        t = ts[i];

        if (t >= 0 && t <= 1) {
            x = computeCubicBaseValue(t, xa, xb, xc, xd);
            // y = computeCubicBaseValue(t, ya, yb, yc, yd);

            if (x < minx) { minx = x; }
            if (x > maxx) { maxx = x; }
        }

    }

    // Y
    if (ya < miny) { miny = ya; }
    if (ya > maxy) { maxy = ya; }
    if (yd < miny) { miny = yd; }
    if (yd > maxy) { maxy = yd; }

    ts = computeCubicFirstDerivativeRoots(ya, yb, yc, yd);

    for (i = 0; i < ts.length; i++) {

        t = ts[i];

        if (t >= 0 && t <= 1) {
            // x = computeCubicBaseValue(t, xa, xb, xc, xd);
            y = computeCubicBaseValue(t, ya, yb, yc, yd);

            if (y < miny) { miny = y; }
            if (y > maxy) { maxy = y; }
        }

    }

    return {
        minx: minx,
        miny: miny,
        maxx: maxx,
        maxy: maxy
    };

};

// compute the value for the cubic bezier function at time=t
function computeCubicBaseValue(t, a, b, c, d) {

    var mt = 1 - t;

    return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;

}

// compute the value for the first derivative of the cubic bezier function at time=t
function computeCubicFirstDerivativeRoots(a, b, c, d) {

    var result = [-1, -1],
        tl = -a + 2 * b - c,
        tr = -Math.sqrt(-a * (c - d) + b * b - b * (c + d) + c * c),
        dn = -a + 3 * b - 3 * c + d;

    if (dn !== 0) {
        result[0] = (tl + tr) / dn;
        result[1] = (tl - tr) / dn;
    }

    return result;

}

/**
 * Compute Quadratic Bézier bounding box.
 *
 * @see http://processingjs.nihongoresources.com/bezierinfo/
 *
 * @param {Float} xa
 * @param {Float} ya
 * @param {Float} xb
 * @param {Float} yb
 * @param {Float} xc
 * @param {Float} yc
 *
 * @return {Object}
 */
exports.computeQuadraticBoundingBox = function(xa, ya, xb, yb, xc, yc) {

    var minx = Number.POSITIVE_INFINITY,
        miny = Number.POSITIVE_INFINITY,
        maxx = Number.NEGATIVE_INFINITY,
        maxy = Number.NEGATIVE_INFINITY,
        t,
        x,
        y;

    // X
    if (xa < minx) { minx = xa; }
    if (xa > maxx) { maxx = xa; }
    if (xc < minx) { minx = xc; }
    if (xc > maxx) { maxx = xc; }

    t = computeQuadraticFirstDerivativeRoot(xa, xb, xc);

    if (t >= 0 && t <= 1) {
        x = computeQuadraticBaseValue(t, xa, xb, xc);
        // y = computeQuadraticBaseValue(t, ya, yb, yc);

        if (x < minx) { minx = x; }
        if (x > maxx) { maxx = x; }
    }

    // Y
    if (ya < miny) { miny = ya; }
    if (ya > maxy) { maxy = ya; }
    if (yc < miny) { miny = yc; }
    if (yc > maxy) { maxy = yc; }

    t = computeQuadraticFirstDerivativeRoot(ya, yb, yc);

    if (t >= 0 && t <=1 ) {
        // x = computeQuadraticBaseValue(t, xa, xb, xc);
        y = computeQuadraticBaseValue(t, ya, yb, yc);

        if (y < miny) { miny = y; }
        if (y > maxy) { maxy = y ; }

    }

    return {
        minx: minx,
        miny: miny,
        maxx: maxx,
        maxy: maxy
    };

};

// compute the value for the quadratic bezier function at time=t
function computeQuadraticBaseValue(t, a, b, c) {

    var mt = 1 - t;

    return mt * mt * a + 2 * mt * t * b + t * t * c;

}

// compute the value for the first derivative of the quadratic bezier function at time=t
function computeQuadraticFirstDerivativeRoot(a, b, c) {

    var t = -1,
        denominator = a - 2 * b + c;

    if (denominator !== 0) {
        t = (a - b) / denominator;
    }

    return t;

}

/**
 * Convert path array to string.
 *
 * @param {Array} path input path data
 * @param {Object} params plugin params
 * @return {String} output path string
 */
exports.js2path = function(path, data, params) {

    path.pathJS = data;

    if (params.collapseRepeated) {
        data = collapseRepeated(data);
    }

    path.attr('d').value = data.reduce(function(pathString, item) {
        return pathString += item.instruction + (item.data ? cleanupOutData(item.data, params) : '');
    }, '');

};

/**
 * Collapse repeated instructions data
 *
 * @param {Array} path input path data
 * @return {Array} output path data
 */
function collapseRepeated(data) {

    var prev,
        prevIndex;

    // copy an array and modifieds item to keep original data untouched
    data = data.reduce(function(newPath, item) {
        if (
            prev && item.data &&
            item.instruction == prev.instruction
        ) {
            // concat previous data with current
            if (item.instruction != 'M') {
                prev = newPath[prevIndex] = {
                    instruction: prev.instruction,
                    data: prev.data.concat(item.data),
                    coords: item.coords,
                    base: prev.base
                };
            } else {
                prev.data = item.data;
                prev.coords = item.coords;
            }
        } else {
            newPath.push(item);
            prev = item;
            prevIndex = newPath.length - 1;
        }

        return newPath;
    }, []);

    return data;

}

function set(dest, source) {
    dest[0] = source[source.length - 2];
    dest[1] = source[source.length - 1];
    return dest;
}

/**
 * Checks if two paths have an intersection by checking convex hulls
 * collision using Gilbert-Johnson-Keerthi distance algorithm
 * http://entropyinteractive.com/2011/04/gjk-algorithm/
 *
 * @param {Array} path1 JS path representation
 * @param {Array} path2 JS path representation
 * @return {Boolean}
 */
exports.intersects = function(path1, path2) {
    if (path1.length < 3 || path2.length < 3) return false; // nothing to fill

    // Collect points of every subpath.
    var points1 = relative2absolute(path1).reduce(gatherPoints, []),
        points2 = relative2absolute(path2).reduce(gatherPoints, []);

    // Axis-aligned bounding box check.
    if (points1.maxX <= points2.minX || points2.maxX <= points1.minX ||
        points1.maxY <= points2.minY || points2.maxY <= points1.minY ||
        points1.every(function (set1) {
            return points2.every(function (set2) {
                return set1[set1.maxX][0] <= set2[set2.minX][0] ||
                    set2[set2.maxX][0] <= set1[set1.minX][0] ||
                    set1[set1.maxY][1] <= set2[set2.minY][1] ||
                    set2[set2.maxY][1] <= set1[set1.minY][1];
            });
        })
    ) return false;

    // Get a convex hull from points of each subpath. Has the most complexity O(n·log n).
    var hullNest1 = points1.map(convexHull),
        hullNest2 = points2.map(convexHull);

    // Check intersection of every subpath of the first path with every subpath of the second.
    return hullNest1.some(function(hull1) {
        if (hull1.length < 3) return false;

        return hullNest2.some(function(hull2) {
            if (hull2.length < 3) return false;

            var simplex = [getSupport(hull1, hull2, [1, 0])], // create the initial simplex
                direction = minus(simplex[0]); // set the direction to point towards the origin

            var iterations = 1e4; // infinite loop protection, 10 000 iterations is more than enough
            while (true) {
                if (iterations-- == 0) {
                    console.error('Error: infinite loop while processing mergePaths plugin.');
                    return true; // true is the safe value that means “do nothing with paths”
                }
                // add a new point
                simplex.push(getSupport(hull1, hull2, direction));
                // see if the new point was on the correct side of the origin
                if (dot(direction, simplex[simplex.length - 1]) <= 0) return false;
                // process the simplex
                if (processSimplex(simplex, direction)) return true;
            }
        });
    });

    function getSupport(a, b, direction) {
        return sub(supportPoint(a, direction), supportPoint(b, minus(direction)));
    }

    // Computes farthest polygon point in particular direction.
    // Thanks to knowledge of min/max x and y coordinates we can choose a quadrant to search in.
    // Since we're working on convex hull, the dot product is increasing until we find the farthest point.
    function supportPoint(polygon, direction) {
        var index = direction[1] >= 0 ?
                direction[0] < 0 ? polygon.maxY : polygon.maxX :
                direction[0] < 0 ? polygon.minX : polygon.minY,
            max = -Infinity,
            value;
        while ((value = dot(polygon[index], direction)) > max) {
            max = value;
            index = ++index % polygon.length;
        }
        return polygon[(index || polygon.length) - 1];
    }
};

function processSimplex(simplex, direction) {
    /* jshint -W004 */

    // we only need to handle to 1-simplex and 2-simplex
    if (simplex.length == 2) { // 1-simplex
        var a = simplex[1],
            b = simplex[0],
            AO = minus(simplex[1]),
            AB = sub(b, a);
        // AO is in the same direction as AB
        if (dot(AO, AB) > 0) {
            // get the vector perpendicular to AB facing O
            set(direction, orth(AB, a));
        } else {
            set(direction, AO);
            // only A remains in the simplex
            simplex.shift();
        }
    } else { // 2-simplex
        var a = simplex[2], // [a, b, c] = simplex
            b = simplex[1],
            c = simplex[0],
            AB = sub(b, a),
            AC = sub(c, a),
            AO = minus(a),
            ACB = orth(AB, AC), // the vector perpendicular to AB facing away from C
            ABC = orth(AC, AB); // the vector perpendicular to AC facing away from B

        if (dot(ACB, AO) > 0) {
            if (dot(AB, AO) > 0) { // region 4
                set(direction, ACB);
                simplex.shift(); // simplex = [b, a]
            } else { // region 5
                set(direction, AO);
                simplex.splice(0, 2); // simplex = [a]
            }
        } else if (dot(ABC, AO) > 0) {
            if (dot(AC, AO) > 0) { // region 6
                set(direction, ABC);
                simplex.splice(1, 1); // simplex = [c, a]
            } else { // region 5 (again)
                set(direction, AO);
                simplex.splice(0, 2); // simplex = [a]
            }
        } else // region 7
            return true;
    }
    return false;
}

function minus(v) {
    return [-v[0], -v[1]];
}

function sub(v1, v2) {
    return [v1[0] - v2[0], v1[1] - v2[1]];
}

function dot(v1, v2) {
    return v1[0] * v2[0] + v1[1] * v2[1];
}

function orth(v, from) {
    var o = [-v[1], v[0]];
    return dot(o, minus(from)) < 0 ? minus(o) : o;
}

function gatherPoints(points, item, index, path) {

    var subPath = points.length && points[points.length - 1],
        prev = index && path[index - 1],
        basePoint = subPath.length && subPath[subPath.length - 1],
        data = item.data,
        ctrlPoint = basePoint;

    switch (item.instruction) {
        case 'M':
            points.push(subPath = []);
            break;
        case 'H':
            addPoint(subPath, [data[0], basePoint[1]]);
            break;
        case 'V':
            addPoint(subPath, [basePoint[0], data[0]]);
            break;
        case 'Q':
            addPoint(subPath, data.slice(0, 2));
            prevCtrlPoint = [data[2] - data[0], data[3] - data[1]]; // Save control point for shorthand
            break;
        case 'T':
            if (prev.instruction == 'Q' && prev.instruction == 'T') {
                ctrlPoint = [basePoint[0] + prevCtrlPoint[0], basePoint[1] + prevCtrlPoint[1]];
                addPoint(subPath, ctrlPoint);
                prevCtrlPoint = [data[0] - ctrlPoint[0], data[1] - ctrlPoint[1]];
            }
            break;
        case 'C':
            // Approximate quibic Bezier curve with middle points between control points
            addPoint(subPath, [.5 * (basePoint[0] + data[0]), .5 * (basePoint[1] + data[1])]);
            addPoint(subPath, [.5 * (data[0] + data[2]), .5 * (data[1] + data[3])]);
            addPoint(subPath, [.5 * (data[2] + data[4]), .5 * (data[3] + data[5])]);
            prevCtrlPoint = [data[4] - data[2], data[5] - data[3]]; // Save control point for shorthand
            break;
        case 'S':
            if (prev.instruction == 'C' && prev.instruction == 'S') {
                addPoint(subPath, [basePoint[0] + .5 * prevCtrlPoint[0], basePoint[1] + .5 * prevCtrlPoint[1]]);
                ctrlPoint = [basePoint[0] + prevCtrlPoint[0], basePoint[1] + prevCtrlPoint[1]];
            }
            addPoint(subPath, [.5 * (ctrlPoint[0] + data[0]), .5 * (ctrlPoint[1]+ data[1])]);
            addPoint(subPath, [.5 * (data[0] + data[2]), .5 * (data[1] + data[3])]);
            prevCtrlPoint = [data[2] - data[0], data[3] - data[1]];
            break;
        case 'A':
            // Convert the arc to bezier curves and use the same approximation
            var curves = a2c.apply(0, basePoint.concat(data));
            for (var cData; (cData = curves.splice(0,6).map(toAbsolute)).length;) {
                addPoint(subPath, [.5 * (basePoint[0] + cData[0]), .5 * (basePoint[1] + cData[1])]);
                addPoint(subPath, [.5 * (cData[0] + cData[2]), .5 * (cData[1] + cData[3])]);
                addPoint(subPath, [.5 * (cData[2] + cData[4]), .5 * (cData[3] + cData[5])]);
                if (curves.length) addPoint(subPath, basePoint = cData.slice(-2));
            }
            break;
    }
    // Save final command coordinates
    if (data && data.length >= 2) addPoint(subPath, data.slice(-2));
    return points;

    function toAbsolute(n, i) { return n + basePoint[i % 2] }

    // Writes data about the extreme points on each axle
    function addPoint(path, point) {
        if (!path.length || point[1] > path[path.maxY][1]) {
            path.maxY = path.length;
            points.maxY = points.length ? Math.max(point[1], points.maxY) : point[1];
        }
        if (!path.length || point[0] > path[path.maxX][0]) {
            path.maxX = path.length;
            points.maxX = points.length ? Math.max(point[0], points.maxX) : point[0];
        }
        if (!path.length || point[1] < path[path.minY][1]) {
            path.minY = path.length;
            points.minY = points.length ? Math.min(point[1], points.minY) : point[1];
        }
        if (!path.length || point[0] < path[path.minX][0]) {
            path.minX = path.length;
            points.minX = points.length ? Math.min(point[0], points.minX) : point[0];
        }
        path.push(point);
    }
}

/**
 * Forms a convex hull from set of points of every subpath using monotone chain convex hull algorithm.
 * http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain
 *
 * @param points An array of [X, Y] coordinates
 */
function convexHull(points) {
    /* jshint -W004 */

    points.sort(function(a, b) {
        return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0];
    });

    var lower = [],
        minY = 0,
        bottom = 0;
    for (var i = 0; i < points.length; i++) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
            lower.pop();
        }
        if (points[i][1] < points[minY][1]) {
            minY = i;
            bottom = lower.length;
        }
        lower.push(points[i]);
    }

    var upper = [],
        maxY = points.length - 1,
        top = 0;
    for (var i = points.length; i--;) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
            upper.pop();
        }
        if (points[i][1] > points[maxY][1]) {
            maxY = i;
            top = upper.length;
        }
        upper.push(points[i]);
    }

    // last points are equal to starting points of the other part
    upper.pop();
    lower.pop();

    var hull = lower.concat(upper);

    hull.minX = 0; // by sorting
    hull.maxX = lower.length;
    hull.minY = bottom;
    hull.maxY = (lower.length + top) % hull.length;

    return hull;
}

function cross(o, a, b) {
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

/* Based on code from Snap.svg (Apache 2 license). http://snapsvg.io/
 * Thanks to Dmitry Baranovskiy for his great work!
 */

// jshint ignore: start
function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
    // for more information of where this Math came from visit:
    // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
    var _120 = Math.PI * 120 / 180,
        rad = Math.PI / 180 * (+angle || 0),
        res = [],
        rotateX = function(x, y, rad) { return x * Math.cos(rad) - y * Math.sin(rad) },
        rotateY = function(x, y, rad) { return x * Math.sin(rad) + y * Math.cos(rad) };
    if (!recursive) {
        x1 = rotateX(x1, y1, -rad);
        y1 = rotateY(x1, y1, -rad);
        x2 = rotateX(x2, y2, -rad);
        y2 = rotateY(x2, y2, -rad);
        var x = (x1 - x2) / 2,
            y = (y1 - y2) / 2;
        var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
        if (h > 1) {
            h = Math.sqrt(h);
            rx = h * rx;
            ry = h * ry;
        }
        var rx2 = rx * rx,
            ry2 = ry * ry,
            k = (large_arc_flag == sweep_flag ? -1 : 1) *
                Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
            cx = k * rx * y / ry + (x1 + x2) / 2,
            cy = k * -ry * x / rx + (y1 + y2) / 2,
            f1 = Math.asin(((y1 - cy) / ry).toFixed(9)),
            f2 = Math.asin(((y2 - cy) / ry).toFixed(9));

        f1 = x1 < cx ? Math.PI - f1 : f1;
        f2 = x2 < cx ? Math.PI - f2 : f2;
        f1 < 0 && (f1 = Math.PI * 2 + f1);
        f2 < 0 && (f2 = Math.PI * 2 + f2);
        if (sweep_flag && f1 > f2) {
            f1 = f1 - Math.PI * 2;
        }
        if (!sweep_flag && f2 > f1) {
            f2 = f2 - Math.PI * 2;
        }
    } else {
        f1 = recursive[0];
        f2 = recursive[1];
        cx = recursive[2];
        cy = recursive[3];
    }
    var df = f2 - f1;
    if (Math.abs(df) > _120) {
        var f2old = f2,
            x2old = x2,
            y2old = y2;
        f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
        x2 = cx + rx * Math.cos(f2);
        y2 = cy + ry * Math.sin(f2);
        res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
    }
    df = f2 - f1;
    var c1 = Math.cos(f1),
        s1 = Math.sin(f1),
        c2 = Math.cos(f2),
        s2 = Math.sin(f2),
        t = Math.tan(df / 4),
        hx = 4 / 3 * rx * t,
        hy = 4 / 3 * ry * t,
        m = [
            - hx * s1, hy * c1,
            x2 + hx * s2 - x1, y2 - hy * c2 - y1,
            x2 - x1, y2 - y1
        ];
    if (recursive) {
        return m.concat(res);
    } else {
        res = m.concat(res);
        var newres = [];
        for (var i = 0, n = res.length; i < n; i++) {
            newres[i] = i % 2 ? rotateY(res[i - 1], res[i], rad) : rotateX(res[i], res[i + 1], rad);
        }
        return newres;
    }
}
// jshint ignore: end

},{"../lib/svgo/tools":122,"./_collections.js":123,"./_transforms":125}],125:[function(require,module,exports){
'use strict';

var regTransformTypes = /matrix|translate|scale|rotate|skewX|skewY/,
    regTransformSplit = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/,
    regNumericValues = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;

/**
 * Convert transform string to JS representation.
 *
 * @param {String} transformString input string
 * @param {Object} params plugin params
 * @return {Array} output array
 */
exports.transform2js = function(transformString) {

        // JS representation of the transform data
    var transforms = [],
        // current transform context
        current;

    // split value into ['', 'translate', '10 50', '', 'scale', '2', '', 'rotate', '-45', '']
    transformString.split(regTransformSplit).forEach(function(item) {
        /*jshint -W084 */
        var num;

        if (item) {
            // if item is a translate function
            if (regTransformTypes.test(item)) {
                // then collect it and change current context
                transforms.push(current = { name: item });
            // else if item is data
            } else {
                // then split it into [10, 50] and collect as context.data
                while (num = regNumericValues.exec(item)) {
                    num = Number(num);
                    if (current.data)
                        current.data.push(num);
                    else
                        current.data = [num];
                }
            }
        }
    });

    return transforms;

};

/**
 * Multiply transforms into one.
 *
 * @param {Array} input transforms array
 * @return {Array} output matrix array
 */
exports.transformsMultiply = function(transforms) {

    // convert transforms objects to the matrices
    transforms = transforms.map(function(transform) {
        if (transform.name === 'matrix') {
            return transform.data;
        }
        return transformToMatrix(transform);
    });

    // multiply all matrices into one
    transforms = {
        name: 'matrix',
        data: transforms.reduce(function(a, b) {
            return multiplyTransformMatrices(a, b);
        })
    };

    return transforms;

};

/**
 * Do math like a schoolgirl.
 *
 * @type {Object}
 */
var mth = exports.mth = {

    rad: function(deg) {
        return deg * Math.PI / 180;
    },

    deg: function(rad) {
        return rad * 180 / Math.PI;
    },

    cos: function(deg) {
        return Math.cos(this.rad(deg));
    },

    acos: function(val, floatPrecision) {
        return +(this.deg(Math.acos(val)).toFixed(floatPrecision));
    },

    sin: function(deg) {
        return Math.sin(this.rad(deg));
    },

    asin: function(val, floatPrecision) {
        return +(this.deg(Math.asin(val)).toFixed(floatPrecision));
    },

    tan: function(deg) {
        return Math.tan(this.rad(deg));
    },

    atan: function(val, floatPrecision) {
        return +(this.deg(Math.atan(val)).toFixed(floatPrecision));
    }

};

/**
 * Decompose matrix into simple transforms. See
 * http://www.maths-informatique-jeux.com/blog/frederic/?post/2013/12/01/Decomposition-of-2D-transform-matrices
 *
 * @param {Object} data matrix transform object
 * @return {Object|Array} transforms array or original transform object
 */
exports.matrixToTransform = function(transform, params) {
    var floatPrecision = params.floatPrecision,
        data = transform.data,
        transforms = [],
        sx = +Math.sqrt(data[0] * data[0] + data[1] * data[1]).toFixed(params.transformPrecision),
        sy = +((data[0] * data[3] - data[1] * data[2]) / sx).toFixed(params.transformPrecision),
        colsSum = data[0] * data[2] + data[1] * data[3],
        rowsSum = data[0] * data[1] + data[2] * data[3],
        scaleBefore = rowsSum || +(sx == sy);

    // [..., ..., ..., ..., tx, ty] → translate(tx, ty)
    if (data[4] || data[5]) {
        transforms.push({ name: 'translate', data: data.slice(4, data[5] ? 6 : 5) });
    }

    // [sx, 0, tan(a)·sy, sy, 0, 0] → skewX(a)·scale(sx, sy)
    if (!data[1] && data[2]) {
        transforms.push({ name: 'skewX', data: [mth.atan(data[2] / sy, floatPrecision)] });

    // [sx, sx·tan(a), 0, sy, 0, 0] → skewY(a)·scale(sx, sy)
    } else if (data[1] && !data[2]) {
        transforms.push({ name: 'skewY', data: [mth.atan(data[1] / data[0], floatPrecision)] });
        sx = data[0];
        sy = data[3];

    // [sx·cos(a), sx·sin(a), sy·-sin(a), sy·cos(a), x, y] → rotate(a[, cx, cy])·(scale or skewX) or
    // [sx·cos(a), sy·sin(a), sx·-sin(a), sy·cos(a), x, y] → scale(sx, sy)·rotate(a[, cx, cy]) (if !scaleBefore)
    } else if (!colsSum || (sx == 1 && sy == 1) || !scaleBefore) {
        if (!scaleBefore) {
            sx = (data[0] < 0 ? -1 : 1) * Math.sqrt(data[0] * data[0] + data[2] * data[2]);
            sy = (data[3] < 0 ? -1 : 1) * Math.sqrt(data[1] * data[1] + data[3] * data[3]);
            transforms.push({ name: 'scale', data: [sx, sy] });
        }
        var rotate = [mth.acos(data[0] / sx, floatPrecision) * (data[1] * sy < 0 ? -1 : 1)];

        if (rotate[0]) transforms.push({ name: 'rotate', data: rotate });

        if (rowsSum && colsSum) transforms.push({
            name: 'skewX',
            data: [mth.atan(colsSum / (sx * sx), floatPrecision)]
        });

        // rotate(a, cx, cy) can consume translate() within optional arguments cx, cy (rotation point)
        if (rotate[0] && (data[4] || data[5])) {
            transforms.shift();
            var cos = data[0] / sx,
                sin = data[1] / (scaleBefore ? sx : sy),
                x = data[4] * (scaleBefore || sy),
                y = data[5] * (scaleBefore || sx),
                denom = (Math.pow(1 - cos, 2) + Math.pow(sin, 2)) * (scaleBefore || sx * sy);
            rotate.push(((1 - cos) * x - sin * y) / denom);
            rotate.push(((1 - cos) * y + sin * x) / denom);
        }

    // Too many transformations, return original matrix if it isn't just a scale/translate
    } else if (data[1] || data[2]) {
        return transform;
    }

    if (scaleBefore && (sx != 1 || sy != 1) || !transforms.length) transforms.push({
        name: 'scale',
        data: sx == sy ? [sx] : [sx, sy]
    });

    return transforms;
};

/**
 * Convert transform to the matrix data.
 *
 * @param {Object} transform transform object
 * @return {Array} matrix data
 */
function transformToMatrix(transform) {

    if (transform.name === 'matrix') return transform.data;

    var matrix;

    switch (transform.name) {
        case 'translate':
            // [1, 0, 0, 1, tx, ty]
            matrix = [1, 0, 0, 1, transform.data[0], transform.data[1] || 0];
            break;
        case 'scale':
            // [sx, 0, 0, sy, 0, 0]
            matrix = [transform.data[0], 0, 0, transform.data[1] || transform.data[0], 0, 0];
            break;
        case 'rotate':
            // [cos(a), sin(a), -sin(a), cos(a), x, y]
            var cos = mth.cos(transform.data[0]),
                sin = mth.sin(transform.data[0]),
                cx = transform.data[1] || 0,
                cy = transform.data[2] || 0;

            matrix = [cos, sin, -sin, cos, (1 - cos) * cx + sin * cy, (1 - cos) * cy - sin * cx];
            break;
        case 'skewX':
            // [1, 0, tan(a), 1, 0, 0]
            matrix = [1, 0, mth.tan(transform.data[0]), 1, 0, 0];
            break;
        case 'skewY':
            // [1, tan(a), 0, 1, 0, 0]
            matrix = [1, mth.tan(transform.data[0]), 0, 1, 0, 0];
            break;
    }

    return matrix;

}

/**
 * Applies transformation to an arc. To do so, we represent ellipse as a matrix, multiply it
 * by the transformation matrix and use a singular value decomposition to represent in a form
 * rotate(θ)·scale(a b)·rotate(φ). This gives us new ellipse params a, b and θ.
 * SVD is being done with the formulae provided by Wolffram|Alpha (svd {{m0, m2}, {m1, m3}})
 *
 * @param {Array} arc [a, b, rotation in deg]
 * @param {Array} transform transformation matrix
 * @return {Array} arc transformed input arc
 */
exports.transformArc = function(arc, transform) {

    var a = arc[0],
        b = arc[1],
        rot = arc[2] * Math.PI / 180,
        cos = Math.cos(rot),
        sin = Math.sin(rot),
        h = Math.pow(arc[5] * cos + arc[6] * sin, 2) / (4 * a * a) +
            Math.pow(arc[6] * cos - arc[5] * sin, 2) / (4 * b * b);
    if (h > 1) {
        h = Math.sqrt(h);
        a *= h;
        b *= h;
    }
    var ellipse = [a * cos, a * sin, -b * sin, b * cos, 0, 0],
        m = multiplyTransformMatrices(transform, ellipse),
        // Decompose the new ellipse matrix
        lastCol = m[2] * m[2] + m[3] * m[3],
        squareSum = m[0] * m[0] + m[1] * m[1] + lastCol,
        root = Math.sqrt(
            (Math.pow(m[0] - m[3], 2) + Math.pow(m[1] + m[2], 2)) *
            (Math.pow(m[0] + m[3], 2) + Math.pow(m[1] - m[2], 2))
        );

    if (!root) { // circle
        arc[0] = arc[1] = Math.sqrt(squareSum / 2);
        arc[2] = 0;
    } else {
        var majorAxisSqr = (squareSum + root) / 2,
            minorAxisSqr = (squareSum - root) / 2,
            major = Math.abs(majorAxisSqr - lastCol) > 1e-6,
            sub = (major ? majorAxisSqr : minorAxisSqr) - lastCol,
            rowsSum = m[0] * m[2] + m[1] * m[3],
            term1 = m[0] * sub + m[2] * rowsSum,
            term2 = m[1] * sub + m[3] * rowsSum;
        arc[0] = Math.sqrt(majorAxisSqr);
        arc[1] = Math.sqrt(minorAxisSqr);
        arc[2] = ((major ? term2 < 0 : term1 > 0) ? -1 : 1) *
            Math.acos((major ? term1 : term2) / Math.sqrt(term1 * term1 + term2 * term2)) * 180 / Math.PI;
    }
    return arc;

};

/**
 * Multiply transformation matrices.
 *
 * @param {Array} a matrix A data
 * @param {Array} b matrix B data
 * @return {Array} result
 */
function multiplyTransformMatrices(a, b) {

    return [
        a[0] * b[0] + a[2] * b[1],
        a[1] * b[0] + a[3] * b[1],
        a[0] * b[2] + a[2] * b[3],
        a[1] * b[2] + a[3] * b[3],
        a[0] * b[4] + a[2] * b[5] + a[4],
        a[1] * b[4] + a[3] * b[5] + a[5]
    ];

}

},{}],126:[function(require,module,exports){
'use strict';

exports.type = 'full';

exports.active = false;

exports.description = 'adds attributes to an outer <svg> element';

var ENOCLS = 'Error in plugin "addAttributesToSVGElement": absent parameters.\n\
It should have a list of classes in "attributes" or one "attribute".\n\
Config example:\n\n\
\
plugins:\n\
- addAttributesToSVGElement:\n\
    attribute: "mySvg"\n\n\
\
plugins:\n\
- addAttributesToSVGElement:\n\
    attributes: ["mySvg", "size-big"]\n';

/**
 * Add attributes to an outer <svg> element. Example config:
 *
 * plugins:
 * - addAttributesToSVGElement:
 *     attribute: 'data-icon'
 *
 * plugins:
 * - addAttributesToSVGElement:
 *     attributes: ['data-icon', 'data-disabled']
 *
 * @author April Arcus
 */
exports.fn = function(data, params) {
    if (!params || !(Array.isArray(params.attributes) && params.attributes.some(String) || params.attribute)) {
        console.error(ENOCLS);
        return data;
    }

    var attributes = params.attributes || [ params.attribute ],
        svg = data.content[0];

    if (svg.isElem('svg')) {
        attributes.forEach(function (attribute) {
            if (!svg.hasAttr(attribute)) {
                svg.addAttr({
                    name: attribute,
                    prefix: '',
                    local: attribute
                });
            }
        });
    }

    return data;

};

},{}],127:[function(require,module,exports){
'use strict';

exports.type = 'full';

exports.active = false;

exports.description = 'adds classnames to an outer <svg> element';

var ENOCLS = 'Error in plugin "addClassesToSVGElement": absent parameters.\n\
It should have a list of classes in "classNames" or one "className".\n\
Config example:\n\n\
\
plugins:\n\
- addClassesToSVGElement:\n\
    className: "mySvg"\n\n\
\
plugins:\n\
- addClassesToSVGElement:\n\
    classNames: ["mySvg", "size-big"]\n';

/**
 * Add classnames to an outer <svg> element. Example config:
 *
 * plugins:
 * - addClassesToSVGElement:
 *     className: 'mySvg'
 *
 * plugins:
 * - addClassesToSVGElement:
 *     classNames: ['mySvg', 'size-big']
 *
 * @author April Arcus
 */
exports.fn = function(data, params) {
    if (!params || !(Array.isArray(params.classNames) && params.classNames.some(String) || params.className)) {
        console.error(ENOCLS);
        return data;
    }

    var classNames = params.classNames || [ params.className ],
        svg = data.content[0];

    if (svg.isElem('svg')) {
        if (svg.hasAttr('class')) {
            var classes = svg.attr('class').value.split(' ');
            classNames.forEach(function(className){
                if (classes.indexOf(className) < 0) {
                    classes.push(className);
                }
            });
            svg.attr('class').value = classes.join(' ');
        } else {
            svg.addAttr({
                name: 'class',
                value: classNames.join(' '),
                prefix: '',
                local: 'class'
            });
        }
    }

    return data;

};

},{}],128:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'cleanups attributes from newlines, trailing and repeating spaces';

exports.params = {
    newlines: true,
    trim: true,
    spaces: true
};

var regNewlinesNeedSpace = /(\S)\r?\n(\S)/g,
    regNewlines = /\r?\n/g,
    regSpaces = /\s{2,}/g;

/**
 * Cleanup attributes values from newlines, trailing and repeating spaces.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item, params) {

    if (item.isElem()) {

        item.eachAttr(function(attr) {

            if (params.newlines) {
                // new line which requires a space instead of themselve
                attr.value = attr.value.replace(regNewlinesNeedSpace, function(match, p1, p2) {
                    return p1 + ' ' + p2;
                });

                // simple new line
                attr.value = attr.value.replace(regNewlines, '');
            }

            if (params.trim) {
                attr.value = attr.value.trim();
            }

            if (params.spaces) {
                attr.value = attr.value.replace(regSpaces, ' ');
            }

        });

    }

};

},{}],129:[function(require,module,exports){
'use strict';

exports.type = 'full';

exports.active = true;

exports.description = 'remove or cleanup enable-background attribute when possible';

/**
 * Remove or cleanup enable-background attr which coincides with a width/height box.
 *
 * @see http://www.w3.org/TR/SVG/filters.html#EnableBackgroundProperty
 *
 * @example
 * <svg width="100" height="50" enable-background="new 0 0 100 50">
 *             ⬇
 * <svg width="100" height="50">
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(data) {

    var regEnableBackground = /^new\s0\s0\s([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)\s([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)$/,
        hasFilter = false,
        elems = ['svg', 'mask', 'pattern'];

    function checkEnableBackground(item) {
        if (
            item.isElem(elems) &&
            item.hasAttr('enable-background') &&
            item.hasAttr('width') &&
            item.hasAttr('height')
        ) {

            var match = item.attr('enable-background').value.match(regEnableBackground);

            if (match) {
                if (
                    item.attr('width').value === match[1] &&
                    item.attr('height').value === match[3]
                ) {
                    if (item.isElem('svg')) {
                        item.removeAttr('enable-background');
                    } else {
                        item.attr('enable-background').value = 'new';
                    }
                }
            }

        }
    }

    function checkForFilter(item) {
        if (item.isElem('filter')) {
            hasFilter = true;
        }
    }

    function monkeys(items, fn) {
        items.content.forEach(function(item) {
            fn(item);

            if (item.content) {
                monkeys(item, fn);
            }
        });
        return items;
    }

    var firstStep = monkeys(data, function(item) {
        checkEnableBackground(item);
        if (!hasFilter) {
            checkForFilter(item);
        }
    });

    return hasFilter ? firstStep : monkeys(firstStep, function(item) {
            //we don't need 'enable-background' if we have no filters
            item.removeAttr('enable-background');
        });
};

},{}],130:[function(require,module,exports){
'use strict';

exports.type = 'full';

exports.active = true;

exports.description = 'removes unused IDs and minifies used';

exports.params = {
    remove: true,
    minify: true,
    prefix: ''
};

var referencesProps = require('./_collections').referencesProps,
    regReferencesUrl = /\burl\(("|')?#(.+?)\1\)/,
    regReferencesHref = /^#(.+?)$/,
    regReferencesBegin = /^(\w+?)\./,
    styleOrScript = ['style', 'script'],
    generateIDchars = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ],
    maxIDindex = generateIDchars.length - 1;

/**
 * Remove unused and minify used IDs
 * (only if there are no any <style> or <script>).
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 *
 * @author Kir Belevich
 */
exports.fn = function(data, params) {

    var currentID,
        currentIDstring,
        IDs = Object.create(null),
        referencesIDs = Object.create(null),
        idPrefix = 'id-', // prefix IDs so that values like '__proto__' don't break the work
        hasStyleOrScript = false;

    /**
     * Bananas!
     *
     * @param {Array} items input items
     * @return {Array} output items
     */
    function monkeys(items) {

        for (var i = 0; i < items.content.length && !hasStyleOrScript; i++) {

            var item = items.content[i],
                match;

            // check if <style> of <script> presents
            if (item.isElem(styleOrScript)) {
                hasStyleOrScript = true;
                continue;
            }

            // …and don't remove any ID if yes
            if (item.isElem()) {

                item.eachAttr(function(attr) {
                    var key;
                    // save IDs
                    if (attr.name === 'id') {
                        key = idPrefix + attr.value;
                        if (key in IDs) {
                            item.removeAttr('id');
                        } else {
                            IDs[key] = item;
                        }
                    }

                    // save IDs url() references
                    else if (referencesProps.indexOf(attr.name) > -1) {
                        match = attr.value.match(regReferencesUrl);

                        if (match) {
                            key = idPrefix + match[2];
                            if (referencesIDs[key]) {
                                referencesIDs[key].push(attr);
                            } else {
                                referencesIDs[key] = [attr];
                            }
                        }
                    }

                    // save IDs href references
                    else if (
                        attr.local === 'href' && (match = attr.value.match(regReferencesHref)) ||
                        attr.name === 'begin' && (match = attr.value.match(regReferencesBegin))
                    ) {
                        key = idPrefix + match[1];
                        if (referencesIDs[key]) {
                            referencesIDs[key].push(attr);
                        } else {
                            referencesIDs[key] = [attr];
                        }
                    }
                });

            }

            // go deeper
            if (item.content) {
                monkeys(item);
            }
        }

        return items;

    }

    data = monkeys(data);

    if (hasStyleOrScript) {
        return data;
    }

    var idKey;
    for (var k in referencesIDs) {
        if (IDs[k]) {
            idKey = k;
            k = k.replace(idPrefix, '');
            // replace referenced IDs with the minified ones
            if (params.minify) {
                currentIDstring = getIDstring(currentID = generateID(currentID), params);
                IDs[idKey].attr('id').value = currentIDstring;

                referencesIDs[idKey].forEach(function(attr) {
                    attr.value = attr.value
                        .replace('#' + k, '#' + currentIDstring)
                        .replace(k + '.', currentIDstring + '.');
                });

                idKey = idPrefix + k;
            }

            // don't remove referenced IDs
            delete IDs[idKey];
        }
    }

    // remove non-referenced IDs attributes from elements
    if (params.remove) {

        for(var ID in IDs) {
            IDs[ID].removeAttr('id');
        }

    }

    return data;

};

/**
 * Generate unique minimal ID.
 *
 * @param {Array} [currentID] current ID
 * @return {Array} generated ID array
 */
function generateID(currentID) {

    if (!currentID) return [0];

    currentID[currentID.length - 1]++;

    for(var i = currentID.length - 1; i > 0; i--) {
        if (currentID[i] > maxIDindex) {
            currentID[i] = 0;

            if (currentID[i - 1] !== undefined) {
                currentID[i - 1]++;
            }
        }
    }

    if (currentID[0] > maxIDindex) {
        currentID[0] = 0;
        currentID.unshift(0);
    }

    return currentID;

}

/**
 * Get string from generated ID array.
 *
 * @param {Array} arr input ID array
 * @return {String} output ID string
 */
function getIDstring(arr, params) {

    var str = params.prefix;

    arr.forEach(function(i) {
        str += generateIDchars[i];
    });

    return str;

}

},{"./_collections":123}],131:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'rounds list of values to the fixed precision';

exports.params = {
    floatPrecision: 3,
    leadingZero: true,
    defaultPx: true,
    convertToPx: true
};

var regNumericValues = /^([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)(px|pt|pc|mm|cm|m|in|ft|em|ex|%)?$/,
    regSeparator = /\s+,?\s*|,\s*/,
    removeLeadingZero = require('../lib/svgo/tools').removeLeadingZero,
    absoluteLengths = { // relative to px
        cm: 96/2.54,
        mm: 96/25.4,
        in: 96,
        pt: 4/3,
        pc: 16
    };

/**
 * Round list of values to the fixed precision.
 *
 * @example
 * <svg viewBox="0 0 200.28423 200.28423" enable-background="new 0 0 200.28423 200.28423">
 *         ⬇
 * <svg viewBox="0 0 200.284 200.284" enable-background="new 0 0 200.284 200.284">
 *
 *
 * <polygon points="208.250977 77.1308594 223.069336 ... "/>
 *         ⬇
 * <polygon points="208.251 77.131 223.069 ... "/>
 *
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author kiyopikko
 */
exports.fn = function(item, params) {


    if ( item.hasAttr('points') ) {
        roundValues(item.attrs.points);
    }

    if ( item.hasAttr('enable-background') ) {
        roundValues(item.attrs['enable-background']);
    }

    if ( item.hasAttr('viewBox') ) {
        roundValues(item.attrs.viewBox);
    }

    if ( item.hasAttr('stroke-dasharray') ) {
        roundValues(item.attrs['stroke-dasharray']);
    }

    if ( item.hasAttr('dx') ) {
        roundValues(item.attrs.dx);
    }

    if ( item.hasAttr('dy') ) {
        roundValues(item.attrs.dy);
    }

    if ( item.hasAttr('x') ) {
        roundValues(item.attrs.x);
    }

    if ( item.hasAttr('y') ) {
        roundValues(item.attrs.y);
    }


    function roundValues($prop){

        var num, units,
            match,
            matchNew,
            lists = $prop.value,
            listsArr = lists.split(regSeparator),
            roundedListArr = [],
            roundedList;

        listsArr.forEach(function(elem){

            match = elem.match(regNumericValues);
            matchNew = elem.match(/new/);

             // if attribute value matches regNumericValues
            if(match){

                // round it to the fixed precision
                num = +(+match[1]).toFixed(params.floatPrecision),
                units = match[3] || '';

                // convert absolute values to pixels
                if (params.convertToPx && units && (units in absoluteLengths)) {
                    var pxNum = +(absoluteLengths[units] * match[1]).toFixed(params.floatPrecision);

                    if (String(pxNum).length < match[0].length)
                        num = pxNum,
                        units = 'px';
                }

                 // and remove leading zero
                if (params.leadingZero) {
                    num = removeLeadingZero(num);
                }

                // remove default 'px' units
                if (params.defaultPx && units === 'px') {
                    units = '';
                }

                roundedListArr.push(num+units);

            }
            // if attribute value is "new"(only enable-background).
            else if(matchNew){

                roundedListArr.push('new');

            }

        });

        roundedList = roundedListArr.join(' ');
        $prop.value = roundedList;

    }

};

},{"../lib/svgo/tools":122}],132:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'rounds numeric values to the fixed precision, removes default ‘px’ units';

exports.params = {
    floatPrecision: 3,
    leadingZero: true,
    defaultPx: true,
    convertToPx: true
};

var regNumericValues = /^([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)(px|pt|pc|mm|cm|m|in|ft|em|ex|%)?$/,
    removeLeadingZero = require('../lib/svgo/tools').removeLeadingZero,
    absoluteLengths = { // relative to px
        cm: 96/2.54,
        mm: 96/25.4,
        in: 96,
        pt: 4/3,
        pc: 16
    };

/**
 * Round numeric values to the fixed precision,
 * remove default 'px' units.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item, params) {

    if (item.isElem()) {

        var match;

        item.eachAttr(function(attr) {
            match = attr.value.match(regNumericValues);

            // if attribute value matches regNumericValues
            if (match) {
                // round it to the fixed precision
                var num = +(+match[1]).toFixed(params.floatPrecision),
                    units = match[3] || '';

                // convert absolute values to pixels
                if (params.convertToPx && units && (units in absoluteLengths)) {
                    var pxNum = +(absoluteLengths[units] * match[1]).toFixed(params.floatPrecision);

                    if (String(pxNum).length < match[0].length)
                        num = pxNum,
                        units = 'px';
                }

                // and remove leading zero
                if (params.leadingZero) {
                    num = removeLeadingZero(num);
                }

                // remove default 'px' units
                if (params.defaultPx && units === 'px') {
                    units = '';
                }

                attr.value = num + units;
            }
        });

    }

};

},{"../lib/svgo/tools":122}],133:[function(require,module,exports){
'use strict';

exports.type = 'perItemReverse';

exports.active = true;

exports.description = 'collapses useless groups';

var collections = require('./_collections'),
    attrsInheritable = collections.inheritableAttrs,
    animationElems = collections.elemsGroups.animation;

function hasAnimatedAttr(item) {
    /* jshint validthis:true */
    return item.isElem(animationElems) && item.hasAttr('attributeName', this) ||
        !item.isEmpty() && item.content.some(hasAnimatedAttr, this);
}

/*
 * Collapse useless groups.
 *
 * @example
 * <g>
 *     <g attr1="val1">
 *         <path d="..."/>
 *     </g>
 * </g>
 *         ⬇
 * <g>
 *     <g>
 *         <path attr1="val1" d="..."/>
 *     </g>
 * </g>
 *         ⬇
 * <path attr1="val1" d="..."/>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    // non-empty elements
    if (item.isElem() && !item.isElem('switch') && !item.isEmpty()) {

        item.content.forEach(function(g, i) {

            // non-empty groups
            if (g.isElem('g') && !g.isEmpty()) {

                // move group attibutes to the single content element
                if (g.hasAttr() && g.content.length === 1) {
                    var inner = g.content[0];

                    if (inner.isElem() && !inner.hasAttr('id') &&
                        !(g.hasAttr('class') && inner.hasAttr('class')) && (
                            !g.hasAttr('clip-path') && !g.hasAttr('mask') ||
                            inner.isElem('g') && !g.hasAttr('transform') && !inner.hasAttr('transform')
                        )
                    ) {
                        g.eachAttr(function(attr) {
                            if (g.content.some(hasAnimatedAttr, attr.name)) return;

                            if (!inner.hasAttr(attr.name)) {
                                inner.addAttr(attr);
                            } else if (attr.name == 'transform') {
                                inner.attr(attr.name).value = attr.value + ' ' + inner.attr(attr.name).value;
                            } else if (
                                attrsInheritable.indexOf(attr.name) < 0 &&
                                !inner.hasAttr(attr.name, attr.value)
                            ) {
                                return;
                            }

                            g.removeAttr(attr.name);
                        });
                    }
                }

                // collapse groups without attributes
                if (!g.hasAttr() && !g.content.some(function(item) { return item.isElem(animationElems) })) {
                    item.spliceContent(i, 1, g.content);
                }
            }

        });

    }

};

},{"./_collections":123}],134:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'converts colors: rgb() to #rrggbb and #rrggbb to #rgb';

exports.params = {
    currentColor: false,
    names2hex: true,
    rgb2hex: true,
    shorthex: true,
    shortname: true
};

var collections = require('./_collections'),
    rNumber = '([+-]?(?:\\d*\\.\\d+|\\d+\\.?)%?)',
    rComma = '\\s*,\\s*',
    regRGB = new RegExp('^rgb\\(\\s*' + rNumber + rComma + rNumber + rComma + rNumber + '\\s*\\)$'),
    regHEX = /^\#(([a-fA-F0-9])\2){3}$/,
    none = /\bnone\b/i;

/**
 * Convert different colors formats in element attributes to hex.
 *
 * @see http://www.w3.org/TR/SVG/types.html#DataTypeColor
 * @see http://www.w3.org/TR/SVG/single-page.html#types-ColorKeywords
 *
 * @example
 * Convert color name keyword to long hex:
 * fuchsia ➡ #ff00ff
 *
 * Convert rgb() to long hex:
 * rgb(255, 0, 255) ➡ #ff00ff
 * rgb(50%, 100, 100%) ➡ #7f64ff
 *
 * Convert long hex to short hex:
 * #aabbcc ➡ #abc
 *
 * Convert hex to short name
 * #000080 ➡ navy
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item, params) {

    if (item.elem) {

        item.eachAttr(function(attr) {

            if (collections.colorsProps.indexOf(attr.name) > -1) {

                var val = attr.value,
                    match;

                // Convert colors to currentColor
                if (params.currentColor) {
                    if (typeof params.currentColor === 'string') {
                        match = val === params.currentColor;
                    } else if (params.currentColor.exec) {
                        match = params.currentColor.exec(val);
                    } else {
                        match = !val.match(none);
                    }
                    if (match) {
                        val = 'currentColor';
                    }
                }

                // Convert color name keyword to long hex
                if (params.names2hex && val.toLowerCase() in collections.colorsNames) {
                    val = collections.colorsNames[val.toLowerCase()];
                }

                // Convert rgb() to long hex
                if (params.rgb2hex && (match = val.match(regRGB))) {
                    match = match.slice(1, 4).map(function(m) {
                        if (m.indexOf('%') > -1)
                            m = Math.round(parseFloat(m) * 2.55);

                        return Math.max(0, Math.min(m, 255));
                    });

                    val = rgb2hex(match);
                }

                // Convert long hex to short hex
                if (params.shorthex && (match = val.match(regHEX))) {
                    val = '#' + match[0][1] + match[0][3] + match[0][5];
                }

                // Convert hex to short name
                if (params.shortname && val in collections.colorsShortNames) {
                    val = collections.colorsShortNames[val];
                }

                attr.value = val;

            }

        });

    }

};

/**
 * Convert [r, g, b] to #rrggbb.
 *
 * @see https://gist.github.com/983535
 *
 * @example
 * rgb2hex([255, 255, 255]) // '#ffffff'
 *
 * @param {Array} rgb [r, g, b]
 * @return {String} #rrggbb
 *
 * @author Jed Schmidt
 */
function rgb2hex(rgb) {
    return '#' + ('00000' + (rgb[0] << 16 | rgb[1] << 8 | rgb[2]).toString(16)).slice(-6).toUpperCase();
}

},{"./_collections":123}],135:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'optimizes path data: writes in shorter form, applies transformations';

exports.params = {
    applyTransforms: true,
    applyTransformsStroked: true,
    makeArcs: {
        threshold: 2.5, // coefficient of rounding error
        tolerance: 0.5  // percentage of radius
    },
    straightCurves: true,
    lineShorthands: true,
    curveSmoothShorthands: true,
    floatPrecision: 3,
    transformPrecision: 5,
    removeUseless: true,
    collapseRepeated: true,
    utilizeAbsolute: true,
    leadingZero: true,
    negativeExtraSpace: true
};

var pathElems = require('./_collections.js').pathElems,
    path2js = require('./_path.js').path2js,
    js2path = require('./_path.js').js2path,
    applyTransforms = require('./_path.js').applyTransforms,
    cleanupOutData = require('../lib/svgo/tools').cleanupOutData,
    roundData,
    precision,
    error,
    arcThreshold,
    arcTolerance,
    hasMarkerMid;

/**
 * Convert absolute Path to relative,
 * collapse repeated instructions,
 * detect and convert Lineto shorthands,
 * remove useless instructions like "l0,0",
 * trim useless delimiters and leading zeros,
 * decrease accuracy of floating-point numbers.
 *
 * @see http://www.w3.org/TR/SVG/paths.html#PathData
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item, params) {

    if (item.isElem(pathElems) && item.hasAttr('d')) {

        precision = params.floatPrecision;
        error = precision !== false ? +Math.pow(.1, precision).toFixed(precision) : 1e-2;
        roundData = precision > 0 && precision < 20 ? strongRound : round;
        if (params.makeArcs) {
            arcThreshold = params.makeArcs.threshold;
            arcTolerance = params.makeArcs.tolerance;
        }
        hasMarkerMid = item.hasAttr('marker-mid');

        var data = path2js(item);

        // TODO: get rid of functions returns
        if (data.length) {
            convertToRelative(data);

            if (params.applyTransforms) {
                data = applyTransforms(item, data, params);
            }

            data = filters(data, params);

            if (params.utilizeAbsolute) {
                data = convertToMixed(data, params);
            }

            js2path(item, data, params);
        }

    }

};

/**
 * Convert absolute path data coordinates to relative.
 *
 * @param {Array} path input path data
 * @param {Object} params plugin params
 * @return {Array} output path data
 */
function convertToRelative(path) {

    var point = [0, 0],
        subpathPoint = [0, 0],
        baseItem;

    path.forEach(function(item, index) {

        var instruction = item.instruction,
            data = item.data;

        // data !== !z
        if (data) {

            // already relative
            // recalculate current point
            if ('mcslqta'.indexOf(instruction) > -1) {

                point[0] += data[data.length - 2];
                point[1] += data[data.length - 1];

                if (instruction === 'm') {
                    subpathPoint[0] = point[0];
                    subpathPoint[1] = point[1];
                    baseItem = item;
                }

            } else if (instruction === 'h') {

                point[0] += data[0];

            } else if (instruction === 'v') {

                point[1] += data[0];

            }

            // convert absolute path data coordinates to relative
            // if "M" was not transformed from "m"
            // M → m
            if (instruction === 'M') {

                if (index > 0) instruction = 'm';

                data[0] -= point[0];
                data[1] -= point[1];

                subpathPoint[0] = point[0] += data[0];
                subpathPoint[1] = point[1] += data[1];

                baseItem = item;

            }

            // L → l
            // T → t
            else if ('LT'.indexOf(instruction) > -1) {

                instruction = instruction.toLowerCase();

                // x y
                // 0 1
                data[0] -= point[0];
                data[1] -= point[1];

                point[0] += data[0];
                point[1] += data[1];

            // C → c
            } else if (instruction === 'C') {

                instruction = 'c';

                // x1 y1 x2 y2 x y
                // 0  1  2  3  4 5
                data[0] -= point[0];
                data[1] -= point[1];
                data[2] -= point[0];
                data[3] -= point[1];
                data[4] -= point[0];
                data[5] -= point[1];

                point[0] += data[4];
                point[1] += data[5];

            // S → s
            // Q → q
            } else if ('SQ'.indexOf(instruction) > -1) {

                instruction = instruction.toLowerCase();

                // x1 y1 x y
                // 0  1  2 3
                data[0] -= point[0];
                data[1] -= point[1];
                data[2] -= point[0];
                data[3] -= point[1];

                point[0] += data[2];
                point[1] += data[3];

            // A → a
            } else if (instruction === 'A') {

                instruction = 'a';

                // rx ry x-axis-rotation large-arc-flag sweep-flag x y
                // 0  1  2               3              4          5 6
                data[5] -= point[0];
                data[6] -= point[1];

                point[0] += data[5];
                point[1] += data[6];

            // H → h
            } else if (instruction === 'H') {

                instruction = 'h';

                data[0] -= point[0];

                point[0] += data[0];

            // V → v
            } else if (instruction === 'V') {

                instruction = 'v';

                data[0] -= point[1];

                point[1] += data[0];

            }

            item.instruction = instruction;
            item.data = data;

            // store absolute coordinates for later use
            item.coords = point.slice(-2);

        }

        // !data === z, reset current point
        else if (instruction == 'z') {
            if (baseItem) {
                item.coords = baseItem.coords;
            }
            point[0] = subpathPoint[0];
            point[1] = subpathPoint[1];
        }

        item.base = index > 0 ? path[index - 1].coords : [0, 0];

    });

    return path;

}

/**
 * Main filters loop.
 *
 * @param {Array} path input path data
 * @param {Object} params plugin params
 * @return {Array} output path data
 */
function filters(path, params) {

    var stringify = data2Path.bind(null, params),
        relSubpoint = [0, 0],
        pathBase = [0, 0],
        prev = {};

    path = path.filter(function(item, index, path) {

        var instruction = item.instruction,
            data = item.data,
            next = path[index + 1];

        if (data) {

            var sdata = data,
                circle;

            if (instruction === 's') {
                sdata = [0, 0].concat(data);

                if ('cs'.indexOf(prev.instruction) > -1) {
                    var pdata = prev.data,
                        n = pdata.length;

                    // (-x, -y) of the prev tangent point relative to the current point
                    sdata[0] = pdata[n - 2] - pdata[n - 4];
                    sdata[1] = pdata[n - 1] - pdata[n - 3];
                }

            }

            // convert curves to arcs if possible
            if (
                params.makeArcs &&
                (instruction == 'c' || instruction == 's') &&
                isConvex(sdata) &&
                (circle = findCircle(sdata))
            ) {
                var r = roundData([circle.radius])[0],
                    angle = findArcAngle(sdata, circle),
                    sweep = sdata[5] * sdata[0] - sdata[4] * sdata[1] > 0 ? 1 : 0,
                    arc = {
                        instruction: 'a',
                        data: [r, r, 0, 0, sweep, sdata[4], sdata[5]],
                        coords: item.coords.slice(),
                        base: item.base
                    },
                    output = [arc],
                    // relative coordinates to adjust the found circle
                    relCenter = [circle.center[0] - sdata[4], circle.center[1] - sdata[5]],
                    relCircle = { center: relCenter, radius: circle.radius },
                    arcCurves = [item],
                    hasPrev = 0,
                    suffix = '',
                    nextLonghand;

                if (
                    prev.instruction == 'c' && isConvex(prev.data) && isArcPrev(prev.data, circle) ||
                    prev.instruction == 'a' && prev.sdata && isArcPrev(prev.sdata, circle)
                ) {
                    arcCurves.unshift(prev);
                    arc.base = prev.base;
                    arc.data[5] = arc.coords[0] - arc.base[0];
                    arc.data[6] = arc.coords[1] - arc.base[1];
                    var prevData = prev.instruction == 'a' ? prev.sdata : prev.data;
                    angle += findArcAngle(prevData,
                        {
                            center: [prevData[4] + relCenter[0], prevData[5] + relCenter[1]],
                            radius: circle.radius
                        }
                    );
                    if (angle > Math.PI) arc.data[3] = 1;
                    hasPrev = 1;
                }

                // check if next curves are fitting the arc
                for (var j = index; (next = path[++j]) && ~'cs'.indexOf(next.instruction);) {
                    var nextData = next.data;
                    if (next.instruction == 's') {
                        nextLonghand = makeLonghand({instruction: 's', data: next.data.slice() },
                            path[j - 1].data);
                        nextData = nextLonghand.data;
                        nextLonghand.data = nextData.slice(0, 2);
                        suffix = stringify([nextLonghand]);
                    }
                    if (isConvex(nextData) && isArc(nextData, relCircle)) {
                        angle += findArcAngle(nextData, relCircle);
                        if (angle - 2 * Math.PI > 1e-3) break; // more than 360°
                        if (angle > Math.PI) arc.data[3] = 1;
                        arcCurves.push(next);
                        if (2 * Math.PI - angle > 1e-3) { // less than 360°
                            arc.coords = next.coords;
                            arc.data[5] = arc.coords[0] - arc.base[0];
                            arc.data[6] = arc.coords[1] - arc.base[1];
                        } else {
                            // full circle, make a half-circle arc and add a second one
                            arc.data[5] = 2 * (relCircle.center[0] - nextData[4]);
                            arc.data[6] = 2 * (relCircle.center[1] - nextData[5]);
                            arc.coords = [arc.base[0] + arc.data[5], arc.base[1] + arc.data[6]];
                            arc = {
                                instruction: 'a',
                                data: [r, r, 0, 0, sweep,
                                    next.coords[0] - arc.coords[0], next.coords[1] - arc.coords[1]],
                                coords: next.coords,
                                base: arc.coords
                            };
                            output.push(arc);
                            j++;
                            break;
                        }
                        relCenter[0] -= nextData[4];
                        relCenter[1] -= nextData[5];
                    } else break;
                }

                if ((stringify(output) + suffix).length < stringify(arcCurves).length) {
                    if (path[j] && path[j].instruction == 's') {
                        makeLonghand(path[j], path[j - 1].data);
                    }
                    if (hasPrev) {
                        var prevArc = output.shift();
                        roundData(prevArc.data);
                        relSubpoint[0] += prevArc.data[5] - prev.data[prev.data.length - 2];
                        relSubpoint[1] += prevArc.data[6] - prev.data[prev.data.length - 1];
                        prev.instruction = 'a';
                        prev.data = prevArc.data;
                        item.base = prev.coords = prevArc.coords;
                    }
                    arc = output.shift();
                    if (arcCurves.length == 1) {
                        item.sdata = sdata.slice(); // preserve curve data for future checks
                    } else if (arcCurves.length - 1 - hasPrev > 0) {
                        // filter out consumed next items
                        path.splice.apply(path, [index + 1, arcCurves.length - 1 - hasPrev].concat(output));
                    }
                    if (!arc) return false;
                    instruction = 'a';
                    data = arc.data;
                    item.coords = arc.coords;
                }
            }

            // Rounding relative coordinates, taking in account accummulating error
            // to get closer to absolute coordinates. Sum of rounded value remains same:
            // l .25 3 .25 2 .25 3 .25 2 -> l .3 3 .2 2 .3 3 .2 2
            if (precision !== false) {
                if ('mltqsc'.indexOf(instruction) > -1) {
                    for (var i = data.length; i--;) {
                        data[i] += item.base[i % 2] - relSubpoint[i % 2];
                    }
                } else if (instruction == 'h') {
                    data[0] += item.base[0] - relSubpoint[0];
                } else if (instruction == 'v') {
                    data[0] += item.base[1] - relSubpoint[1];
                } else if (instruction == 'a') {
                    data[5] += item.base[0] - relSubpoint[0];
                    data[6] += item.base[1] - relSubpoint[1];
                }
                roundData(data);

                if      (instruction == 'h') relSubpoint[0] += data[0];
                else if (instruction == 'v') relSubpoint[1] += data[0];
                else {
                    relSubpoint[0] += data[data.length - 2];
                    relSubpoint[1] += data[data.length - 1];
                }
                roundData(relSubpoint);

                if (instruction.toLowerCase() == 'm') {
                    pathBase[0] = relSubpoint[0];
                    pathBase[1] = relSubpoint[1];
                }
            }

            // convert straight curves into lines segments
            if (params.straightCurves) {

                if (
                    instruction === 'c' &&
                    isCurveStraightLine(data) ||
                    instruction === 's' &&
                    isCurveStraightLine(sdata)
                ) {
                    if (next && next.instruction == 's')
                        makeLonghand(next, data); // fix up next curve
                    instruction = 'l';
                    data = data.slice(-2);
                }

                else if (
                    instruction === 'q' &&
                    isCurveStraightLine(data)
                ) {
                    if (next && next.instruction == 't')
                        makeLonghand(next, data); // fix up next curve
                    instruction = 'l';
                    data = data.slice(-2);
                }

                else if (
                    instruction === 't' &&
                    prev.instruction !== 'q' &&
                    prev.instruction !== 't'
                ) {
                    instruction = 'l';
                    data = data.slice(-2);
                }

                else if (
                    instruction === 'a' &&
                    (data[0] === 0 || data[1] === 0)
                ) {
                    instruction = 'l';
                    data = data.slice(-2);
                }
            }

            // horizontal and vertical line shorthands
            // l 50 0 → h 50
            // l 0 50 → v 50
            if (
                params.lineShorthands &&
                instruction === 'l'
            ) {
                if (data[1] === 0) {
                    instruction = 'h';
                    data.pop();
                } else if (data[0] === 0) {
                    instruction = 'v';
                    data.shift();
                }
            }

            // collapse repeated commands
            // h 20 h 30 -> h 50
            if (
                params.collapseRepeated &&
                !hasMarkerMid &&
                ('mhv'.indexOf(instruction) > -1) &&
                prev.instruction &&
                instruction == prev.instruction.toLowerCase() &&
                (
                    (instruction != 'h' && instruction != 'v') ||
                    (prev.data[0] >= 0) == (item.data[0] >= 0)
            )) {
                prev.data[0] += data[0];
                if (instruction != 'h' && instruction != 'v') {
                    prev.data[1] += data[1];
                }
                prev.coords = item.coords;
                path[index] = prev;
                return false;
            }

            // convert curves into smooth shorthands
            if (params.curveSmoothShorthands && prev.instruction) {

                // curveto
                if (instruction === 'c') {

                    // c + c → c + s
                    if (
                        prev.instruction === 'c' &&
                        data[0] === -(prev.data[2] - prev.data[4]) &&
                        data[1] === -(prev.data[3] - prev.data[5])
                    ) {
                        instruction = 's';
                        data = data.slice(2);
                    }

                    // s + c → s + s
                    else if (
                        prev.instruction === 's' &&
                        data[0] === -(prev.data[0] - prev.data[2]) &&
                        data[1] === -(prev.data[1] - prev.data[3])
                    ) {
                        instruction = 's';
                        data = data.slice(2);
                    }

                    // [^cs] + c → [^cs] + s
                    else if (
                        'cs'.indexOf(prev.instruction) === -1 &&
                        data[0] === 0 &&
                        data[1] === 0
                    ) {
                        instruction = 's';
                        data = data.slice(2);
                    }

                }

                // quadratic Bézier curveto
                else if (instruction === 'q') {

                    // q + q → q + t
                    if (
                        prev.instruction === 'q' &&
                        data[0] === (prev.data[2] - prev.data[0]) &&
                        data[1] === (prev.data[3] - prev.data[1])
                    ) {
                        instruction = 't';
                        data = data.slice(2);
                    }

                    // t + q → t + t
                    else if (
                        prev.instruction === 't' &&
                        data[2] === prev.data[0] &&
                        data[3] === prev.data[1]
                    ) {
                        instruction = 't';
                        data = data.slice(2);
                    }

                }

            }

            // remove useless non-first path segments
            if (params.removeUseless) {

                // l 0,0 / h 0 / v 0 / q 0,0 0,0 / t 0,0 / c 0,0 0,0 0,0 / s 0,0 0,0
                if (
                    (
                     'lhvqtcs'.indexOf(instruction) > -1
                    ) &&
                    data.every(function(i) { return i === 0; })
                ) {
                    path[index] = prev;
                    return false;
                }

                // a 25,25 -30 0,1 0,0
                if (
                    instruction === 'a' &&
                    data[5] === 0 &&
                    data[6] === 0
                ) {
                    path[index] = prev;
                    return false;
                }

            }

            item.instruction = instruction;
            item.data = data;

            prev = item;

        } else {

            // z resets coordinates
            relSubpoint[0] = pathBase[0];
            relSubpoint[1] = pathBase[1];
            if (prev.instruction == 'z') return false;
            prev = item;

        }

        return true;

    });

    return path;

}

/**
 * Writes data in shortest form using absolute or relative coordinates.
 *
 * @param {Array} data input path data
 * @return {Boolean} output
 */
function convertToMixed(path, params) {

    var prev = path[0];

    path = path.filter(function(item, index) {

        if (index == 0) return true;
        if (!item.data) {
            prev = item;
            return true;
        }

        var instruction = item.instruction,
            data = item.data,
            adata = data && data.slice(0);

        if ('mltqsc'.indexOf(instruction) > -1) {
            for (var i = adata.length; i--;) {
                adata[i] += item.base[i % 2];
            }
        } else if (instruction == 'h') {
                adata[0] += item.base[0];
        } else if (instruction == 'v') {
                adata[0] += item.base[1];
        } else if (instruction == 'a') {
                adata[5] += item.base[0];
                adata[6] += item.base[1];
        }

        roundData(adata);

        var absoluteDataStr = cleanupOutData(adata, params),
            relativeDataStr = cleanupOutData(data, params);

        // Convert to absolute coordinates if it's shorter.
        // v-20 -> V0
        // Don't convert if it fits following previous instruction.
        // l20 30-10-50 instead of l20 30L20 30
        if (
            absoluteDataStr.length < relativeDataStr.length &&
            !(
                params.negativeExtraSpace &&
                instruction == prev.instruction &&
                prev.instruction.charCodeAt(0) > 96 &&
                absoluteDataStr.length == relativeDataStr.length - 1 &&
                (data[0] < 0 || /^0\./.test(data[0]) && prev.data[prev.data.length - 1] % 1)
            )
        ) {
            item.instruction = instruction.toUpperCase();
            item.data = adata;
        }

        prev = item;

        return true;

    });

    return path;

}

/**
 * Checks if curve is convex. Control points of such a curve must form
 * a convex quadrilateral with diagonals crosspoint inside of it.
 *
 * @param {Array} data input path data
 * @return {Boolean} output
 */
function isConvex(data) {

    var center = getIntersection([0, 0, data[2], data[3], data[0], data[1], data[4], data[5]]);

    return center &&
        (data[2] < center[0] == center[0] < 0) &&
        (data[3] < center[1] == center[1] < 0) &&
        (data[4] < center[0] == center[0] < data[0]) &&
        (data[5] < center[1] == center[1] < data[1]);

}

/**
 * Computes lines equations by two points and returns their intersection point.
 *
 * @param {Array} coords 8 numbers for 4 pairs of coordinates (x,y)
 * @return {Array|undefined} output coordinate of lines' crosspoint
 */
function getIntersection(coords) {

        // Prev line equation parameters.
    var a1 = coords[1] - coords[3], // y1 - y2
        b1 = coords[2] - coords[0], // x2 - x1
        c1 = coords[0] * coords[3] - coords[2] * coords[1], // x1 * y2 - x2 * y1

        // Next line equation parameters
        a2 = coords[5] - coords[7], // y1 - y2
        b2 = coords[6] - coords[4], // x2 - x1
        c2 = coords[4] * coords[7] - coords[5] * coords[6], // x1 * y2 - x2 * y1
        denom = (a1 * b2 - a2 * b1);

    if (!denom) return; // parallel lines havn't an intersection

    var cross = [
            (b1 * c2 - b2 * c1) / denom,
            (a1 * c2 - a2 * c1) / -denom
        ];
    if (
        !isNaN(cross[0]) && !isNaN(cross[1]) &&
        isFinite(cross[0]) && isFinite(cross[1])
    ) {
        return cross;
    }

}

/**
 * Decrease accuracy of floating-point numbers
 * in path data keeping a specified number of decimals.
 * Smart rounds values like 2.3491 to 2.35 instead of 2.349.
 * Doesn't apply "smartness" if the number precision fits already.
 *
 * @param {Array} data input data array
 * @return {Array} output data array
 */
function strongRound(data) {
    for (var i = data.length; i-- > 0;) {
        if (data[i].toFixed(precision) != data[i]) {
            var rounded = +data[i].toFixed(precision - 1);
            data[i] = +Math.abs(rounded - data[i]).toFixed(precision + 1) >= error ?
                +data[i].toFixed(precision) :
                rounded;
        }
    }
    return data;
}

/**
 * Simple rounding function if precision is 0.
 *
 * @param {Array} data input data array
 * @return {Array} output data array
 */
function round(data) {
    for (var i = data.length; i-- > 0;) {
        data[i] = Math.round(data[i]);
    }
    return data;
}

/**
 * Checks if a curve is a straight line by measuring distance
 * from middle points to the line formed by end points.
 *
 * @param {Array} xs array of curve points x-coordinates
 * @param {Array} ys array of curve points y-coordinates
 * @return {Boolean}
 */

function isCurveStraightLine(data) {

    // Get line equation a·x + b·y + c = 0 coefficients a, b (c = 0) by start and end points.
    var i = data.length - 2,
        a = -data[i + 1], // y1 − y2 (y1 = 0)
        b = data[i],      // x2 − x1 (x1 = 0)
        d = 1 / (a * a + b * b); // same part for all points

    if (i <= 1 || !isFinite(d)) return false; // curve that ends at start point isn't the case

    // Distance from point (x0, y0) to the line is sqrt((c − a·x0 − b·y0)² / (a² + b²))
    while ((i -= 2) >= 0) {
        if (Math.sqrt(Math.pow(a * data[i] + b * data[i + 1], 2) * d) > error)
            return false;
    }

    return true;

}

/**
 * Converts next curve from shorthand to full form using the current curve data.
 *
 * @param {Object} item curve to convert
 * @param {Array} data current curve data
 */

function makeLonghand(item, data) {
    switch (item.instruction) {
        case 's': item.instruction = 'c'; break;
        case 't': item.instruction = 'q'; break;
    }
    item.data.unshift(data[data.length - 2] - data[data.length - 4], data[data.length - 1] - data[data.length - 3]);
    return item;
}

/**
 * Returns distance between two points
 *
 * @param {Array} point1 first point coordinates
 * @param {Array} point2 second point coordinates
 * @return {Number} distance
 */

function getDistance(point1, point2) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2));
}

/**
 * Returns coordinates of the curve point corresponding to the certain t
 * a·(1 - t)³·p1 + b·(1 - t)²·t·p2 + c·(1 - t)·t²·p3 + d·t³·p4,
 * where pN are control points and p1 is zero due to relative coordinates.
 *
 * @param {Array} curve array of curve points coordinates
 * @param {Number} t parametric position from 0 to 1
 * @return {Array} Point coordinates
 */

function getCubicBezierPoint(curve, t) {
    var sqrT = t * t,
        cubT = sqrT * t,
        mt = 1 - t,
        sqrMt = mt * mt;

    return [
        3 * sqrMt * t * curve[0] + 3 * mt * sqrT * curve[2] + cubT * curve[4],
        3 * sqrMt * t * curve[1] + 3 * mt * sqrT * curve[3] + cubT * curve[5]
    ];
}

/**
 * Finds circle by 3 points of the curve and checks if the curve fits the found circle.
 *
 * @param {Array} curve
 * @return {Object|undefined} circle
 */

function findCircle(curve) {
    var midPoint = getCubicBezierPoint(curve, 1/2),
        m1 = [midPoint[0] / 2, midPoint[1] / 2],
        m2 = [(midPoint[0] + curve[4]) / 2, (midPoint[1] + curve[5]) / 2],
        center = getIntersection([
            m1[0], m1[1],
            m1[0] + m1[1], m1[1] - m1[0],
            m2[0], m2[1],
            m2[0] + (m2[1] - midPoint[1]), m2[1] - (m2[0] - midPoint[0])
        ]),
        radius = center && getDistance([0, 0], center),
        tolerance = Math.min(arcThreshold * error, arcTolerance * radius / 100);

    if (center && [1/4, 3/4].every(function(point) {
        return Math.abs(getDistance(getCubicBezierPoint(curve, point), center) - radius) <= tolerance;
    }))
        return { center: center, radius: radius};
}

/**
 * Checks if a curve fits the given circe.
 *
 * @param {Object} circle
 * @param {Array} curve
 * @return {Boolean}
 */

function isArc(curve,  circle) {
    var tolerance = Math.min(arcThreshold * error, arcTolerance * circle.radius / 100);

    return [0, 1/4, 1/2, 3/4, 1].every(function(point) {
        return Math.abs(getDistance(getCubicBezierPoint(curve, point), circle.center) - circle.radius) <= tolerance;
    });
}

/**
 * Checks if a previos curve fits the given circe.
 *
 * @param {Object} circle
 * @param {Array} curve
 * @return {Boolean}
 */

function isArcPrev(curve,  circle) {
    return isArc(curve, {
        center: [circle.center[0] + curve[4], circle.center[1] + curve[5]],
        radius: circle.radius
    });
}

/**
 * Finds angle of a curve fitting the given arc.

 * @param {Array} curve
 * @param {Object} relCircle
 * @return {Number} angle
 */

function findArcAngle(curve, relCircle) {
    var x1 = -relCircle.center[0],
        y1 = -relCircle.center[1],
        x2 = curve[4] - relCircle.center[0],
        y2 = curve[5] - relCircle.center[1];

    return Math.acos(
            (x1 * x2 + y1 * y2) /
            Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))
        );
}

/**
 * Converts given path data to string.
 *
 * @param {Object} params
 * @param {Array} pathData
 * @return {String}
 */

function data2Path(params, pathData) {
    return pathData.reduce(function(pathString, item) {
        return pathString += item.instruction + (item.data ? cleanupOutData(roundData(item.data.slice()), params) : '');
    }, '');
}

},{"../lib/svgo/tools":122,"./_collections.js":123,"./_path.js":124}],136:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'converts basic shapes to more compact path form';

var none = { value: 0 },
    regNumber = /[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g;

/**
 * Converts basic shape to more compact path.
 * It also allows further optimizations like
 * combining paths with similar attributes.
 *
 * @see http://www.w3.org/TR/SVG/shapes.html
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Lev Solntsev
 */
exports.fn = function(item) {

    if (
        item.isElem('rect') &&
        item.hasAttr('width') &&
        item.hasAttr('height') &&
        !item.hasAttr('rx') &&
        !item.hasAttr('ry')
    ) {

        var x = +(item.attr('x') || none).value,
            y = +(item.attr('y') || none).value,
            width  = +item.attr('width').value,
            height = +item.attr('height').value;

            // Values like '100%' compute to NaN, thus running after
            // cleanupNumericValues when 'px' units has already been removed.
            // TODO: Calculate sizes from % and non-px units if possible.
        if (isNaN(x - y + width - height)) return;

        var pathData =
            'M' + x + ' ' + y +
            'H' + (x + width) +
            'V' + (y + height) +
            'H' + x +
            'z';

        item.addAttr({
                name: 'd',
                value: pathData,
                prefix: '',
                local: 'd'
            });

        item.renameElem('path')
            .removeAttr(['x', 'y', 'width', 'height']);

    } else if (item.isElem('line')) {

        var x1 = +(item.attr('x1') || none).value,
            y1 = +(item.attr('y1') || none).value,
            x2 = +(item.attr('x2') || none).value,
            y2 = +(item.attr('y2') || none).value;
        if (isNaN(x1 - y1 + x2 - y2)) return;

        item.addAttr({
                name: 'd',
                value: 'M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2,
                prefix: '',
                local: 'd'
            });

        item.renameElem('path')
            .removeAttr(['x1', 'y1', 'x2', 'y2']);

    } else if ((
            item.isElem('polyline') ||
            item.isElem('polygon')
        ) &&
        item.hasAttr('points')
    ) {

        var coords = (item.attr('points').value.match(regNumber) || []).map(Number);
        if (coords.length < 4) return false;

        item.addAttr({
                name: 'd',
                value: 'M' + coords.slice(0,2).join(' ') +
                       'L' + coords.slice(2).join(' ') +
                       (item.isElem('polygon') ? 'z' : ''),
                prefix: '',
                local: 'd'
            });

        item.renameElem('path')
            .removeAttr('points');
    }

};

},{}],137:[function(require,module,exports){
/* jshint quotmark: false */
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'converts style to attributes';

var EXTEND = require('whet.extend'),
    stylingProps = require('./_collections').attrsGroups.presentation,
    rEscape = '\\\\(?:[0-9a-f]{1,6}\\s?|\\r\\n|.)',                 // Like \" or \2051. Code points consume one space.
    rAttr = '\\s*(' + g('[^:;\\\\]', rEscape) + '*?)\\s*',          // attribute name like ‘fill’
    rSingleQuotes = "'(?:[^'\\n\\r\\\\]|" + rEscape + ")*?(?:'|$)", // string in single quotes: 'smth'
    rQuotes = '"(?:[^"\\n\\r\\\\]|' + rEscape + ')*?(?:"|$)',       // string in double quotes: "smth"
    rQuotedString = new RegExp('^' + g(rSingleQuotes, rQuotes) + '$'),

    // Parentheses, E.g.: url(data:image/png;base64,iVBO...).
    // ':' and ';' inside of it should be threated as is. (Just like in strings.)
    rParenthesis = '\\(' + g('[^\'"()\\\\]+', rEscape, rSingleQuotes, rQuotes) + '*?' + '\\)',

    // The value. It can have strings and parentheses (see above). Fallbacks to anything in case of unexpected input.
    rValue = '\\s*(' + g('[^\'"();\\\\]+?', rEscape, rSingleQuotes, rQuotes, rParenthesis, '[^;]*?') + '*?' + ')',

    // End of declaration. Spaces outside of capturing groups help to do natural trimming.
    rDeclEnd = '\\s*(?:;\\s*|$)',

    // Final RegExp to parse CSS declarations.
    regDeclarationBlock = new RegExp(rAttr + ':' + rValue + rDeclEnd, 'ig'),

    // Comments expression. Honors escape sequences and strings.
    regStripComments = new RegExp(g(rEscape, rSingleQuotes, rQuotes, '/\\*[^]*?\\*/'), 'ig');

/**
 * Convert style in attributes. Cleanups comments and illegal declarations (without colon) as a side effect.
 *
 * @example
 * <g style="fill:#000; color: #fff;">
 *             ⬇
 * <g fill="#000" color="#fff">
 *
 * @example
 * <g style="fill:#000; color: #fff; -webkit-blah: blah">
 *             ⬇
 * <g fill="#000" color="#fff" style="-webkit-blah: blah">
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {
    /* jshint boss: true */

    if (item.elem && item.hasAttr('style')) {
            // ['opacity: 1', 'color: #000']
        var styleValue = item.attr('style').value,
            styles = [],
            attrs = {};

        // Strip CSS comments preserving escape sequences and strings.
        styleValue = styleValue.replace(regStripComments, function(match) {
            return match[0] == '/' ? '' :
                match[0] == '\\' && /[-g-z]/i.test(match[1]) ? match[1] : match;
        });

        regDeclarationBlock.lastIndex = 0;
        for (var rule; rule = regDeclarationBlock.exec(styleValue);) {
            styles.push([rule[1], rule[2]]);
        }

        if (styles.length) {

            styles = styles.filter(function(style) {
                if (style[0]) {
                    var prop = style[0].toLowerCase(),
                        val = style[1];

                    if (rQuotedString.test(val)) {
                        val = val.slice(1, -1);
                    }

                    if (stylingProps.indexOf(prop) > -1) {

                        attrs[prop] = {
                            name: prop,
                            value: val,
                            local: prop,
                            prefix: ''
                        };

                        return false;
                    }
                }

                return true;
            });

            EXTEND(item.attrs, attrs);

            if (styles.length) {
                item.attr('style').value = styles
                    .map(function(declaration) { return declaration.join(':') })
                    .join(';');
            } else {
                item.removeAttr('style');
            }

        }

    }

};

function g() {
    return '(?:' + Array.prototype.join.call(arguments, '|') + ')';
}

},{"./_collections":123,"whet.extend":169}],138:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'collapses multiple transformations and optimizes it';

exports.params = {
    convertToShorts: true,
    // degPrecision: 3, // transformPrecision (or matrix precision) - 2 by default
    floatPrecision: 3,
    transformPrecision: 5,
    matrixToTransform: true,
    shortTranslate: true,
    shortScale: true,
    shortRotate: true,
    removeUseless: true,
    collapseIntoOne: true,
    leadingZero: true,
    negativeExtraSpace: false
};

var cleanupOutData = require('../lib/svgo/tools').cleanupOutData,
    EXTEND = require('whet.extend'),
    transform2js = require('./_transforms.js').transform2js,
    transformsMultiply = require('./_transforms.js').transformsMultiply,
    matrixToTransform = require('./_transforms.js').matrixToTransform,
    degRound,
    floatRound,
    transformRound;

/**
 * Convert matrices to the short aliases,
 * convert long translate, scale or rotate transform notations to the shorts ones,
 * convert transforms to the matrices and multiply them all into one,
 * remove useless transforms.
 *
 * @see http://www.w3.org/TR/SVG/coords.html#TransformMatrixDefined
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item, params) {

    if (item.elem) {

        // transform
        if (item.hasAttr('transform')) {
            convertTransform(item, 'transform', params);
        }

        // gradientTransform
        if (item.hasAttr('gradientTransform')) {
            convertTransform(item, 'gradientTransform', params);
        }

        // patternTransform
        if (item.hasAttr('patternTransform')) {
            convertTransform(item, 'patternTransform', params);
        }

    }

};

/**
 * Main function.
 *
 * @param {Object} item input item
 * @param {String} attrName attribute name
 * @param {Object} params plugin params
 */
function convertTransform(item, attrName, params) {
    var data = transform2js(item.attr(attrName).value);
    params = definePrecision(data, params);

    if (params.collapseIntoOne && data.length > 1) {
        data = [transformsMultiply(data)];
    }

    if (params.convertToShorts) {
        data = convertToShorts(data, params);
    } else {
        data.forEach(roundTransform);
    }

    if (params.removeUseless) {
        data = removeUseless(data);
    }

    if (data.length) {
        item.attr(attrName).value = js2transform(data, params);
    } else {
        item.removeAttr(attrName);
    }
}

/**
 * Defines precision to work with certain parts.
 * transformPrecision - for scale and four first matrix parameters (needs a better precision due to multiplying),
 * floatPrecision - for translate including two last matrix and rotate parameters,
 * degPrecision - for rotate and skew. By default it's equal to (rougly)
 * transformPrecision - 2 or floatPrecision whichever is lower. Can be set in params.
 *
 * @param {Array} transforms input array
 * @param {Object} params plugin params
 * @return {Array} output array
 */
function definePrecision(data, params) {
    /* jshint validthis: true */
    var matrixData = data.reduce(getMatrixData, []),
        significantDigits = params.transformPrecision;

    // Clone params so it don't affect other elements transformations.
    params = EXTEND({}, params);

    // Limit transform precision with matrix one. Calculating with larger precision doesn't add any value.
    if (matrixData.length) {
        params.transformPrecision = Math.min(params.transformPrecision,
            Math.max.apply(Math, matrixData.map(floatDigits)) || params.transformPrecision);

        significantDigits = Math.max.apply(Math, matrixData.map(function(n) {
            return String(n).replace(/\D+/g, '').length; // Number of digits in a number. 123.45 → 5
        }));
    }
    // No sense in angle precision more then number of significant digits in matrix.
    if (!('degPrecision' in params)) {
        params.degPrecision = Math.max(0, Math.min(params.floatPrecision, significantDigits - 2));
    }

    floatRound = params.floatPrecision >= 1 && params.floatPrecision < 20 ?
        smartRound.bind(this, params.floatPrecision) :
        round;
    degRound = params.degPrecision >= 1 && params.floatPrecision < 20 ?
        smartRound.bind(this, params.degPrecision) :
        round;
    transformRound = params.transformPrecision >= 1 && params.floatPrecision < 20 ?
        smartRound.bind(this, params.transformPrecision) :
        round;

    return params;
}

/**
 * Gathers four first matrix parameters.
 *
 * @param {Array} a array of data
 * @param {Object} transform
 * @return {Array} output array
 */
function getMatrixData(a, b) {
    return b.name == 'matrix' ? a.concat(b.data.slice(0, 4)) : a;
}

/**
 * Returns number of digits after the point. 0.125 → 3
 */
function floatDigits(n) {
    return (n = String(n)).slice(n.indexOf('.')).length - 1;
}

/**
 * Convert transforms to the shorthand alternatives.
 *
 * @param {Array} transforms input array
 * @param {Object} params plugin params
 * @return {Array} output array
 */
function convertToShorts(transforms, params) {

    for(var i = 0; i < transforms.length; i++) {

        var transform = transforms[i];

        // convert matrix to the short aliases
        if (
            params.matrixToTransform &&
            transform.name === 'matrix'
        ) {
            var decomposed = matrixToTransform(transform, params);
            if (decomposed != transform &&
                js2transform(decomposed, params).length <= js2transform([transform], params).length) {

                transforms.splice.apply(transforms, [i, 1].concat(decomposed));
            }
            transform = transforms[i];
        }

        // fixed-point numbers
        // 12.754997 → 12.755
        roundTransform(transform);

        // convert long translate transform notation to the shorts one
        // translate(10 0) → translate(10)
        if (
            params.shortTranslate &&
            transform.name === 'translate' &&
            transform.data.length === 2 &&
            !transform.data[1]
        ) {
            transform.data.pop();
        }

        // convert long scale transform notation to the shorts one
        // scale(2 2) → scale(2)
        if (
            params.shortScale &&
            transform.name === 'scale' &&
            transform.data.length === 2 &&
            transform.data[0] === transform.data[1]
        ) {
            transform.data.pop();
        }

        // convert long rotate transform notation to the short one
        // translate(cx cy) rotate(a) translate(-cx -cy) → rotate(a cx cy)
        if (
            params.shortRotate &&
            transforms[i - 2] &&
            transforms[i - 2].name === 'translate' &&
            transforms[i - 1].name === 'rotate' &&
            transforms[i].name === 'translate' &&
            transforms[i - 2].data[0] === -transforms[i].data[0] &&
            transforms[i - 2].data[1] === -transforms[i].data[1]
        ) {
            transforms.splice(i - 2, 3, {
                name: 'rotate',
                data: [
                    transforms[i - 1].data[0],
                    transforms[i - 2].data[0],
                    transforms[i - 2].data[1]
                ]
            });

            // splice compensation
            i -= 2;

            transform = transforms[i];
        }

    }

    return transforms;

}

/**
 * Remove useless transforms.
 *
 * @param {Array} transforms input array
 * @return {Array} output array
 */
function removeUseless(transforms) {

    return transforms.filter(function(transform) {

        // translate(0), rotate(0[, cx, cy]), skewX(0), skewY(0)
        if (
            ['translate', 'rotate', 'skewX', 'skewY'].indexOf(transform.name) > -1 &&
            (transform.data.length == 1 || transform.name == 'rotate') &&
            !transform.data[0] ||

            // translate(0, 0)
            transform.name == 'translate' &&
            !transform.data[0] &&
            !transform.data[1] ||

            // scale(1)
            transform.name == 'scale' &&
            transform.data[0] == 1 &&
            (transform.data.length < 2 || transform.data[1] == 1) ||

            // matrix(1 0 0 1 0 0)
            transform.name == 'matrix' &&
            transform.data[0] == 1 &&
            transform.data[3] == 1 &&
            !(transform.data[1] || transform.data[2] || transform.data[4] || transform.data[5])
        ) {
            return false;
        }

        return true;

    });

}

/**
 * Convert transforms JS representation to string.
 *
 * @param {Array} transformJS JS representation array
 * @param {Object} params plugin params
 * @return {String} output string
 */
function js2transform(transformJS, params) {

    var transformString = '';

    // collect output value string
    transformJS.forEach(function(transform) {
        roundTransform(transform);
        transformString += (transformString && ' ') + transform.name + '(' + cleanupOutData(transform.data, params) + ')';
    });

    return transformString;

}

function roundTransform(transform) {
    switch (transform.name) {
        case 'translate':
            transform.data = floatRound(transform.data);
            break;
        case 'rotate':
            transform.data = degRound(transform.data.slice(0, 1)).concat(floatRound(transform.data.slice(1)));
            break;
        case 'skewX':
        case 'skewY':
            transform.data = degRound(transform.data);
            break;
        case 'scale':
            transform.data = transformRound(transform.data);
            break;
        case 'matrix':
            transform.data = transformRound(transform.data.slice(0, 4)).concat(floatRound(transform.data.slice(4)));
            break;
    }
    return transform;
}

/**
 * Rounds numbers in array.
 *
 * @param {Array} data input data array
 * @return {Array} output data array
 */
function round(data) {
    return data.map(Math.round);
}

/**
 * Decrease accuracy of floating-point numbers
 * in transforms keeping a specified number of decimals.
 * Smart rounds values like 2.349 to 2.35.
 *
 * @param {Number} fixed number of decimals
 * @param {Array} data input data array
 * @return {Array} output data array
 */
function smartRound(precision, data) {
    for (var i = data.length, tolerance = +Math.pow(.1, precision).toFixed(precision); i--;) {
        if (data[i].toFixed(precision) != data[i]) {
            var rounded = +data[i].toFixed(precision - 1);
            data[i] = +Math.abs(rounded - data[i]).toFixed(precision + 1) >= tolerance ?
                +data[i].toFixed(precision) :
                rounded;
        }
    }
    return data;
}

},{"../lib/svgo/tools":122,"./_transforms.js":125,"whet.extend":169}],139:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'merges multiple paths in one if possible';

exports.params = {
    collapseRepeated: true,
    leadingZero: true,
    negativeExtraSpace: true
};

var path2js = require('./_path.js').path2js,
    js2path = require('./_path.js').js2path,
    intersects = require('./_path.js').intersects;

/**
 * Merge multiple Paths into one.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich, Lev Solntsev
 */
exports.fn = function(item, params) {

    if (!item.isElem() || item.isEmpty()) return;

    var prevContentItem = null,
        prevContentItemKeys = null;

    item.content = item.content.filter(function(contentItem) {

        if (prevContentItem &&
            prevContentItem.isElem('path') &&
            prevContentItem.isEmpty() &&
            prevContentItem.hasAttr('d') &&
            contentItem.isElem('path') &&
            contentItem.isEmpty() &&
            contentItem.hasAttr('d')
        ) {

            if (!prevContentItemKeys) {
                prevContentItemKeys = Object.keys(prevContentItem.attrs);
            }

            var contentItemAttrs = Object.keys(contentItem.attrs),
                equalData = prevContentItemKeys.length == contentItemAttrs.length &&
                    contentItemAttrs.every(function(key) {
                        return key == 'd' ||
                            prevContentItem.hasAttr(key) &&
                            prevContentItem.attr(key).value == contentItem.attr(key).value;
                    }),
                prevPathJS = path2js(prevContentItem),
                curPathJS = path2js(contentItem);

            if (equalData && !intersects(prevPathJS, curPathJS)) {
                js2path(prevContentItem, prevPathJS.concat(curPathJS), params);
                return false;
            }
        }

        prevContentItem = contentItem;
        prevContentItemKeys = null;
        return true;

    });

};

},{"./_path.js":124}],140:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.params = {
    svgo: {}
};

exports.description = 'minifies existing styles in svg';

var csso = require('csso');

/**
 * Minifies styles (<style> element + style attribute) using svgo
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author strarsis <strarsis@gmail.com>
 */
exports.fn = function(item, svgoOptions) {

    if(item.elem) {
        if(item.isElem('style') && !item.isEmpty()) {
            var styleCss = item.content[0].text || item.content[0].cdata || [],
                DATA = styleCss.indexOf('>') >= 0 || styleCss.indexOf('<') >= 0 ? 'cdata' : 'text';
            if(styleCss.length > 0) {
                var styleCssMinified = csso.minify(styleCss, svgoOptions);
                item.content[0][DATA] = styleCssMinified.css;
            }
      }

      if(item.hasAttr('style')) {
          var itemCss = item.attr('style').value;
          if(itemCss.length > 0) {
              var itemCssMinified = csso.minifyBlock(itemCss, svgoOptions);
              item.attr('style').value = itemCssMinified.css;
          }
      }
    }

    return item;
};

},{"csso":42}],141:[function(require,module,exports){
'use strict';

exports.type = 'perItemReverse';

exports.active = true;

exports.description = 'moves elements attributes to the existing group wrapper';

var inheritableAttrs = require('./_collections').inheritableAttrs,
    pathElems = require('./_collections.js').pathElems;

/**
 * Collapse content's intersected and inheritable
 * attributes to the existing group wrapper.
 *
 * @example
 * <g attr1="val1">
 *     <g attr2="val2">
 *         text
 *     </g>
 *     <circle attr2="val2" attr3="val3"/>
 * </g>
 *              ⬇
 * <g attr1="val1" attr2="val2">
 *     <g>
 *         text
 *     </g>
 *    <circle attr3="val3"/>
 * </g>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    if (item.isElem('g') && !item.isEmpty() && item.content.length > 1) {

        var intersection = {},
            hasTransform = false,
            hasClip = item.hasAttr('clip-path') || item.hasAttr('mask'),
            intersected = item.content.every(function(inner) {
                if (inner.isElem() && inner.hasAttr()) {
                    // don't mess with possible styles (hack until CSS parsing is implemented)
                    if (inner.hasAttr('class')) return false;
                    if (!Object.keys(intersection).length) {
                        intersection = inner.attrs;
                    } else {
                        intersection = intersectInheritableAttrs(intersection, inner.attrs);

                        if (!intersection) return false;
                    }

                    return true;
                }
            }),
            allPath = item.content.every(function(inner) {
                return inner.isElem(pathElems);
            });

        if (intersected) {

            item.content.forEach(function(g) {

                for (var name in intersection) {

                    if (!allPath && !hasClip || name !== 'transform') {

                        g.removeAttr(name);

                        if (name === 'transform') {
                            if (!hasTransform) {
                                if (item.hasAttr('transform')) {
                                    item.attr('transform').value += ' ' + intersection[name].value;
                                } else {
                                    item.addAttr(intersection[name]);
                                }

                                hasTransform = true;
                            }
                        } else {
                            item.addAttr(intersection[name]);
                        }

                    }
                }

            });

        }

    }

};

/**
 * Intersect inheritable attributes.
 *
 * @param {Object} a first attrs object
 * @param {Object} b second attrs object
 *
 * @return {Object} intersected attrs object
 */
function intersectInheritableAttrs(a, b) {

    var c = {};

    for (var n in a) {
        if (
            b.hasOwnProperty(n) &&
            inheritableAttrs.indexOf(n) > -1 &&
            a[n].name === b[n].name &&
            a[n].value === b[n].value &&
            a[n].prefix === b[n].prefix &&
            a[n].local === b[n].local
        ) {
            c[n] = a[n];
        }
    }

    if (!Object.keys(c).length) return false;

    return c;

}

},{"./_collections":123,"./_collections.js":123}],142:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'moves some group attributes to the content elements';

var collections = require('./_collections.js'),
    pathElems = collections.pathElems.concat(['g', 'text']),
    referencesProps = collections.referencesProps;

/**
 * Move group attrs to the content elements.
 *
 * @example
 * <g transform="scale(2)">
 *     <path transform="rotate(45)" d="M0,0 L10,20"/>
 *     <path transform="translate(10, 20)" d="M0,10 L20,30"/>
 * </g>
 *                          ⬇
 * <g>
 *     <path transform="scale(2) rotate(45)" d="M0,0 L10,20"/>
 *     <path transform="scale(2) translate(10, 20)" d="M0,10 L20,30"/>
 * </g>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    // move group transform attr to content's pathElems
    if (
        item.isElem('g') &&
        item.hasAttr('transform') &&
        !item.isEmpty() &&
        !item.someAttr(function(attr) {
            return ~referencesProps.indexOf(attr.name) && ~attr.value.indexOf('url(');
        }) &&
        item.content.every(function(inner) {
            return inner.isElem(pathElems) && !inner.hasAttr('id');
        })
    ) {
        item.content.forEach(function(inner) {
            var attr = item.attr('transform');
            if (inner.hasAttr('transform')) {
                inner.attr('transform').value = attr.value + ' ' + inner.attr('transform').value;
            } else {
                inner.addAttr({
                    'name': attr.name,
                    'local': attr.local,
                    'prefix': attr.prefix,
                    'value': attr.value
                });
            }
        });

        item.removeAttr('transform');
    }

};

},{"./_collections.js":123}],143:[function(require,module,exports){
'use strict';

var ELEM_SEP = ':';

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes specified attributes';

exports.params = {
    attrs: []
};

/**
 * Remove attributes
 *
 * @param attrs:
 *
 *   format: [ element* : attribute* ]
 *
 *   element   : regexp (wrapped into ^...$), single * or omitted > all elements
 *   attribute : regexp (wrapped into ^...$)
 *
 *   examples:
 *
 *     > basic: remove fill attribute
 *     ---
 *     removeAttrs:
 *       attrs: 'fill'
 *
 *     > remove fill attribute on path element
 *     ---
 *       attrs: 'path:fill'
 *
 *
 *     > remove all fill and stroke attribute
 *     ---
 *       attrs:
 *         - 'fill'
 *         - 'stroke'
 *
 *     [is same as]
 *
 *       attrs: '(fill|stroke)'
 *
 *     [is same as]
 *
 *       attrs: '*:(fill|stroke)'
 *
 *     [is same as]
 *
 *       attrs: '.*:(fill|stroke)'
 *
 *
 *     > remove all stroke related attributes
 *     ----
 *     attrs: 'stroke.*'
 *
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Benny Schudel
 */
exports.fn = function(item, params) {

        // wrap into an array if params is not
    if (!Array.isArray(params.attrs)) {
        params.attrs = [params.attrs];
    }

    if (item.isElem()) {

            // prepare patterns
        var patterns = params.attrs.map(function(pattern) {

                // apply to all elements if specifc element is omitted
            if (pattern.indexOf(ELEM_SEP) === -1) {
                pattern = ['.*', ELEM_SEP, pattern].join('');
            }

                // create regexps for element and attribute name
            return pattern.split(ELEM_SEP)
                .map(function(value) {

                        // adjust single * to match anything
                    if (value === '*') { value = '.*'; }

                    return new RegExp(['^', value, '$'].join(''), 'i');
                });

        });

            // loop patterns
        patterns.forEach(function(pattern) {

                // matches element
            if (pattern[0].test(item.elem)) {

                    // loop attributes
                item.eachAttr(function(attr) {
                    var name = attr.name;

                        // matches attribute name
                    if (pattern[1].test(name)) {
                        item.removeAttr(name);
                    }

                });

            }

        });

    }

};

},{}],144:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes comments';

/**
 * Remove comments.
 *
 * @example
 * <!-- Generator: Adobe Illustrator 15.0.0, SVG Export
 * Plug-In . SVG Version: 6.00 Build 0)  -->
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    if (item.comment && item.comment.charAt(0) !== '!') {
        return false;
    }

};

},{}],145:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.params = {
    removeAny: false
};

exports.description = 'removes <desc> (only non-meaningful by default)';

var standardDescs = /^Created with/;

/**
 * Removes <desc>.
 * Removes only standard editors content or empty elements 'cause it can be used for accessibility.
 * Enable parameter 'removeAny' to remove any description.
 *
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Element/desc
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Daniel Wabyick
 */
exports.fn = function(item, params) {

    return !item.isElem('desc') || !(params.removeAny || item.isEmpty() ||
            standardDescs.test(item.content[0].text));

};

},{}],146:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes width and height in presence of viewBox';

/**
 * Remove width/height attributes when a viewBox attribute is present.
 *
 * @example
 * <svg width="100" height="50" viewBox="0 0 100 50">
 *   ↓
 * <svg viewBox="0 0 100 50">
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if true, with and height will be filtered out
 *
 * @author Benny Schudel
 */
exports.fn = function(item) {

    if (
        item.isElem('svg') &&
        item.hasAttr('viewBox')
    ) {
        item.removeAttr('width');
        item.removeAttr('height');
    }

};

},{}],147:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes doctype declaration';

/**
 * Remove DOCTYPE declaration.
 *
 * "Unfortunately the SVG DTDs are a source of so many
 * issues that the SVG WG has decided not to write one
 * for the upcoming SVG 1.2 standard. In fact SVG WG
 * members are even telling people not to use a DOCTYPE
 * declaration in SVG 1.0 and 1.1 documents"
 * https://jwatt.org/svg/authoring/#doctype-declaration
 *
 * @example
 * <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
 * q"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
 *
 * @example
 * <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
 * "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" [
 *     <!-- an internal subset can be embedded here -->
 * ]>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    if (item.doctype) {
        return false;
    }

};

},{}],148:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes editors namespaces, elements and attributes';

var editorNamespaces = require('./_collections').editorNamespaces,
    prefixes = [];

exports.params = {
    additionalNamespaces: []
};

/**
 * Remove editors namespaces, elements and attributes.
 *
 * @example
 * <svg xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd">
 * <sodipodi:namedview/>
 * <path sodipodi:nodetypes="cccc"/>
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item, params) {

    if (Array.isArray(params.additionalNamespaces)) {
        editorNamespaces = editorNamespaces.concat(params.additionalNamespaces);
    }

    if (item.elem) {

        if (item.isElem('svg')) {

            item.eachAttr(function(attr) {
                if (attr.prefix === 'xmlns' && editorNamespaces.indexOf(attr.value) > -1) {
                    prefixes.push(attr.local);

                    // <svg xmlns:sodipodi="">
                    item.removeAttr(attr.name);
                }
            });

        }

        // <* sodipodi:*="">
        item.eachAttr(function(attr) {
            if (prefixes.indexOf(attr.prefix) > -1) {
                item.removeAttr(attr.name);
            }
        });

        // <sodipodi:*>
        if (prefixes.indexOf(item.prefix) > -1) {
            return false;
        }

    }

};

},{"./_collections":123}],149:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes arbitrary elements by ID or className (disabled by default)';

exports.params = {
    id: [],
    class: []
};

/**
 * Remove arbitrary SVG elements by ID or className.
 *
 * @param id
 *   examples:
 *
 *     > single: remove element with ID of `elementID`
 *     ---
 *     removeElementsByAttr:
 *       id: 'elementID'
 *
 *     > list: remove multiple elements by ID
 *     ---
 *     removeElementsByAttr:
 *       id:
 *         - 'elementID'
 *         - 'anotherID'
 *
 * @param class
 *   examples:
 *
 *     > single: remove all elements with class of `elementClass`
 *     ---
 *     removeElementsByAttr:
 *       class: 'elementClass'
 *
 *     > list: remove all elements with class of `elementClass` or `anotherClass`
 *     ---
 *     removeElementsByAttr:
 *       class:
 *         - 'elementClass'
 *         - 'anotherClass'
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Eli Dupuis (@elidupuis)
 */
exports.fn = function(item, params) {
    var elemId, elemClass;

    // wrap params in an array if not already
    ['id', 'class'].forEach(function(key) {
        if (!Array.isArray(params[key])) {
            params[key] = [ params[key] ];
        }
    });

    // abort if current item is no an element
    if (!item.isElem()) {
        return;
    }

    // remove element if it's `id` matches configured `id` params
    elemId = item.attr('id');
    if (elemId) {
        return params.id.indexOf(elemId.value) === -1;
    }

    // remove element if it's `class` contains any of the configured `class` params
    elemClass = item.attr('class');
    if (elemClass) {
        var hasClassRegex = new RegExp(params.class.join('|'));
        return !hasClassRegex.test(elemClass.value);
    }
};

},{}],150:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes empty attributes';

/**
 * Remove attributes with empty values.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    if (item.elem) {

        item.eachAttr(function(attr) {
            if (attr.value === '') {
                item.removeAttr(attr.name);
            }
        });

    }

};

},{}],151:[function(require,module,exports){
'use strict';

exports.type = 'perItemReverse';

exports.active = true;

exports.description = 'removes empty container elements';

var container = require('./_collections').elemsGroups.container;

/**
 * Remove empty containers.
 *
 * @see http://www.w3.org/TR/SVG/intro.html#TermContainerElement
 *
 * @example
 * <defs/>
 *
 * @example
 * <g><marker><a/></marker></g>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    return !(item.isElem(container) && !item.isElem('svg') && item.isEmpty() &&
        (!item.isElem('pattern') || !item.hasAttrLocal('href')));

};

},{"./_collections":123}],152:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes empty <text> elements';

exports.params = {
    text: true,
    tspan: true,
    tref: true
};

/**
 * Remove empty Text elements.
 *
 * @see http://www.w3.org/TR/SVG/text.html
 *
 * @example
 * Remove empty text element:
 * <text/>
 *
 * Remove empty tspan element:
 * <tspan/>
 *
 * Remove tref with empty xlink:href attribute:
 * <tref xlink:href=""/>
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item, params) {

    // Remove empty text element
    if (
        params.text &&
        item.isElem('text') &&
        item.isEmpty()
    ) return false;

    // Remove empty tspan element
    if (
        params.tspan &&
        item.isElem('tspan') &&
        item.isEmpty()
    ) return false;

    // Remove tref with empty xlink:href attribute
    if (
        params.tref &&
        item.isElem('tref') &&
        !item.hasAttrLocal('href')
    ) return false;

};

},{}],153:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes hidden elements (zero sized, with absent attributes)';

exports.params = {
    displayNone: true,
    opacity0: true,
    circleR0: true,
    ellipseRX0: true,
    ellipseRY0: true,
    rectWidth0: true,
    rectHeight0: true,
    patternWidth0: true,
    patternHeight0: true,
    imageWidth0: true,
    imageHeight0: true,
    pathEmptyD: true,
    polylineEmptyPoints: true,
    polygonEmptyPoints: true
};

var regValidPath = /M\s*(?:[-+]?(?:\d*\.\d+|\d+(?:\.|(?!\.)))([eE][-+]?\d+)?(?!\d)\s*,?\s*){2}\D*\d/i;

/**
 * Remove hidden elements with disabled rendering:
 * - display="none"
 * - opacity="0"
 * - circle with zero radius
 * - ellipse with zero x-axis or y-axis radius
 * - rectangle with zero width or height
 * - pattern with zero width or height
 * - image with zero width or height
 * - path with empty data
 * - polyline with empty points
 * - polygon with empty points
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item, params) {

    if (item.elem) {

        // display="none"
        //
        // http://www.w3.org/TR/SVG/painting.html#DisplayProperty
        // "A value of display: none indicates that the given element
        // and its children shall not be rendered directly"
        if (
            params.displayNone &&
            item.hasAttr('display', 'none')
        ) return false;

        // opacity="0"
        //
        // http://www.w3.org/TR/SVG/masking.html#ObjectAndGroupOpacityProperties
        if (
            params.opacity0 &&
            item.hasAttr('opacity', '0')
        ) return false;

        // Circles with zero radius
        //
        // http://www.w3.org/TR/SVG/shapes.html#CircleElementRAttribute
        // "A value of zero disables rendering of the element"
        //
        // <circle r="0">
        if (
            params.circleR0 &&
            item.isElem('circle') &&
            item.isEmpty() &&
            item.hasAttr('r', '0')
        ) return false;

        // Ellipse with zero x-axis radius
        //
        // http://www.w3.org/TR/SVG/shapes.html#EllipseElementRXAttribute
        // "A value of zero disables rendering of the element"
        //
        // <ellipse rx="0">
        if (
            params.ellipseRX0 &&
            item.isElem('ellipse') &&
            item.isEmpty() &&
            item.hasAttr('rx', '0')
        ) return false;

        // Ellipse with zero y-axis radius
        //
        // http://www.w3.org/TR/SVG/shapes.html#EllipseElementRYAttribute
        // "A value of zero disables rendering of the element"
        //
        // <ellipse ry="0">
        if (
            params.ellipseRY0 &&
            item.isElem('ellipse') &&
            item.isEmpty() &&
            item.hasAttr('ry', '0')
        ) return false;

        // Rectangle with zero width
        //
        // http://www.w3.org/TR/SVG/shapes.html#RectElementWidthAttribute
        // "A value of zero disables rendering of the element"
        //
        // <rect width="0">
        if (
            params.rectWidth0 &&
            item.isElem('rect') &&
            item.isEmpty() &&
            item.hasAttr('width', '0')
        ) return false;

        // Rectangle with zero height
        //
        // http://www.w3.org/TR/SVG/shapes.html#RectElementHeightAttribute
        // "A value of zero disables rendering of the element"
        //
        // <rect height="0">
        if (
            params.rectHeight0 &&
            params.rectWidth0 &&
            item.isElem('rect') &&
            item.isEmpty() &&
            item.hasAttr('height', '0')
        ) return false;

        // Pattern with zero width
        //
        // http://www.w3.org/TR/SVG/pservers.html#PatternElementWidthAttribute
        // "A value of zero disables rendering of the element (i.e., no paint is applied)"
        //
        // <pattern width="0">
        if (
            params.patternWidth0 &&
            item.isElem('pattern') &&
            item.hasAttr('width', '0')
        ) return false;

        // Pattern with zero height
        //
        // http://www.w3.org/TR/SVG/pservers.html#PatternElementHeightAttribute
        // "A value of zero disables rendering of the element (i.e., no paint is applied)"
        //
        // <pattern height="0">
        if (
            params.patternHeight0 &&
            item.isElem('pattern') &&
            item.hasAttr('height', '0')
        ) return false;

        // Image with zero width
        //
        // http://www.w3.org/TR/SVG/struct.html#ImageElementWidthAttribute
        // "A value of zero disables rendering of the element"
        //
        // <image width="0">
        if (
            params.imageWidth0 &&
            item.isElem('image') &&
            item.hasAttr('width', '0')
        ) return false;

        // Image with zero height
        //
        // http://www.w3.org/TR/SVG/struct.html#ImageElementHeightAttribute
        // "A value of zero disables rendering of the element"
        //
        // <image height="0">
        if (
            params.imageHeight0 &&
            item.isElem('image') &&
            item.hasAttr('height', '0')
        ) return false;

        // Path with empty data
        //
        // http://www.w3.org/TR/SVG/paths.html#DAttribute
        //
        // <path d=""/>
        if (
            params.pathEmptyD &&
            item.isElem('path') &&
            (!item.hasAttr('d') || !regValidPath.test(item.attr('d').value))
        ) return false;

        // Polyline with empty points
        //
        // http://www.w3.org/TR/SVG/shapes.html#PolylineElementPointsAttribute
        //
        // <polyline points="">
        if (
            params.polylineEmptyPoints &&
            item.isElem('polyline') &&
            !item.hasAttr('points')
        ) return false;

        // Polygon with empty points
        //
        // http://www.w3.org/TR/SVG/shapes.html#PolygonElementPointsAttribute
        //
        // <polygon points="">
        if (
            params.polygonEmptyPoints &&
            item.isElem('polygon') &&
            !item.hasAttr('points')
        ) return false;

    }

};

},{}],154:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes <metadata>';

/**
 * Remove <metadata>.
 *
 * http://www.w3.org/TR/SVG/metadata.html
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    return !item.isElem('metadata');

};

},{}],155:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes non-inheritable group’s presentational attributes';

var inheritableAttrs = require('./_collections').inheritableAttrs,
    attrsGroups = require('./_collections').attrsGroups,
    excludedAttrs = ['display', 'opacity'];

/**
 * Remove non-inheritable group's "presentation" attributes.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    if (item.isElem('g')) {

        item.eachAttr(function(attr) {
            if (
                ~attrsGroups.presentation.indexOf(attr.name) &&
                ~attrsGroups.graphicalEvent.indexOf(attr.name) &&
                ~attrsGroups.core.indexOf(attr.name) &&
                ~attrsGroups.conditionalProcessing.indexOf(attr.name) &&
                !~excludedAttrs.indexOf(attr.name) &&
                !~inheritableAttrs.indexOf(attr.name)
            ) {
                item.removeAttr(attr.name);
            }
        });

    }

};

},{"./_collections":123}],156:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes raster images (disabled by default)';

/**
 * Remove raster images references in <image>.
 *
 * @see https://bugs.webkit.org/show_bug.cgi?id=63548
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    if (
        item.isElem('image') &&
        item.hasAttrLocal('href', /(\.|image\/)(jpg|png|gif)/)
    ) {
        return false;
    }

};

},{}],157:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes <style> element (disabled by default)';

/**
 * Remove <style>.
 *
 * http://www.w3.org/TR/SVG/styling.html#StyleElement
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Betsy Dupuis
 */
exports.fn = function(item) {

    return !item.isElem('style');

};

},{}],158:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes <title> (disabled by default)';

/**
 * Remove <title>.
 * Disabled by default cause it may be used for accessibility.
 *
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Igor Kalashnikov
 */
exports.fn = function(item) {

    return !item.isElem('title');

};

},{}],159:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes unknown elements content and attributes, removes attrs with default values';

exports.params = {
    unknownContent: true,
    unknownAttrs: true,
    defaultAttrs: true,
    uselessOverrides: true,
    keepDataAttrs: true
};

var collections = require('./_collections'),
    elems = collections.elems,
    attrsGroups = collections.attrsGroups,
    elemsGroups = collections.elemsGroups,
    attrsGroupsDefaults = collections.attrsGroupsDefaults,
    attrsInheritable = collections.inheritableAttrs;

// collect and extend all references
for (var elem in elems) {
    elem = elems[elem];

    if (elem.attrsGroups) {
        elem.attrs = elem.attrs || [];

        elem.attrsGroups.forEach(function(attrsGroupName) {
            elem.attrs = elem.attrs.concat(attrsGroups[attrsGroupName]);

            var groupDefaults = attrsGroupsDefaults[attrsGroupName];

            if (groupDefaults) {
                elem.defaults = elem.defaults || {};

                for (var attrName in groupDefaults) {
                    elem.defaults[attrName] = groupDefaults[attrName];
                }
            }
        });

    }

    if (elem.contentGroups) {
        elem.content = elem.content || [];

        elem.contentGroups.forEach(function(contentGroupName) {
            elem.content = elem.content.concat(elemsGroups[contentGroupName]);
        });
    }
}

/**
 * Remove unknown elements content and attributes,
 * remove attributes with default values.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item, params) {

    // elems w/o namespace prefix
    if (item.isElem() && !item.prefix) {

        var elem = item.elem;

        // remove unknown element's content
        if (
            params.unknownContent &&
            !item.isEmpty() &&
            elems[elem] && // make sure we know of this element before checking its children
            elem !== 'foreignObject' // Don't check foreignObject
        ) {
            item.content.forEach(function(content, i) {
                if (
                    content.isElem() &&
                    !content.prefix &&
                    (
                        (
                            elems[elem].content && // Do we have a record of its permitted content?
                            elems[elem].content.indexOf(content.elem) === -1
                        ) ||
                        (
                            !elems[elem].content && // we dont know about its permitted content
                            !elems[content.elem] // check that we know about the element at all
                        )
                    )
                ) {
                    item.content.splice(i, 1);
                }
            });
        }

        // remove element's unknown attrs and attrs with default values
        if (elems[elem] && elems[elem].attrs) {

            item.eachAttr(function(attr) {

                if (
                    attr.name !== 'xmlns' &&
                    (attr.prefix === 'xml' || !attr.prefix) &&
                    (!params.keepDataAttrs || attr.name.indexOf('data-') != 0)
                ) {
                    if (
                        // unknown attrs
                        (
                            params.unknownAttrs &&
                            elems[elem].attrs.indexOf(attr.name) === -1
                        ) ||
                        // attrs with default values
                        (
                            params.defaultAttrs &&
                            elems[elem].defaults &&
                            elems[elem].defaults[attr.name] === attr.value && (
                                attrsInheritable.indexOf(attr.name) < 0 ||
                                !item.parentNode.computedAttr(attr.name)
                            )
                        ) ||
                        // useless overrides
                        (
                            params.uselessOverrides &&
                            attr.name !== 'transform' &&
                            attrsInheritable.indexOf(attr.name) > -1 &&
                            item.parentNode.computedAttr(attr.name, attr.value)
                        )
                    ) {
                        item.removeAttr(attr.name);
                    }
                }

            });

        }

    }

};

},{"./_collections":123}],160:[function(require,module,exports){
'use strict';

exports.type = 'full';

exports.active = true;

exports.description = 'removes unused namespaces declaration';

/**
 * Remove unused namespaces declaration.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(data) {

    var svgElem,
        xmlnsCollection = [];

    /**
     * Remove namespace from collection.
     *
     * @param {String} ns namescape name
     */
    function removeNSfromCollection(ns) {

        var pos = xmlnsCollection.indexOf(ns);

        // if found - remove ns from the namespaces collection
        if (pos > -1) {
            xmlnsCollection.splice(pos, 1);
        }

    }

    /**
     * Bananas!
     *
     * @param {Array} items input items
     *
     * @return {Array} output items
     */
    function monkeys(items) {

        var i = 0,
            length = items.content.length;

        while(i < length) {

            var item = items.content[i];

            if (item.isElem('svg')) {

                item.eachAttr(function(attr) {
                    // collect namespaces
                    if (attr.prefix === 'xmlns' && attr.local) {
                        xmlnsCollection.push(attr.local);
                    }
                });

                // if svg element has ns-attr
                if (xmlnsCollection.length) {
                    // save svg element
                    svgElem = item;
                }

            } else if (xmlnsCollection.length) {

                // check item for the ns-attrs
                if (item.prefix) {
                    removeNSfromCollection(item.prefix);
                }

                // check each attr for the ns-attrs
                item.eachAttr(function(attr) {
                    removeNSfromCollection(attr.prefix);
                });

            }

            // if nothing is found - go deeper
            if (xmlnsCollection.length && item.content) {
                monkeys(item);
            }

            i++;

        }

        return items;

    }

    data = monkeys(data);

    // remove svg element ns-attributes if they are not used even once
    if (xmlnsCollection.length) {
        xmlnsCollection.forEach(function(name) {
            svgElem.removeAttr('xmlns:' + name);
        });
    }

    return data;

};

},{}],161:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes elements in <defs> without id';

var nonRendering = require('./_collections').elemsGroups.nonRendering,
    defs;

/**
 * Removes content of defs and properties that aren't rendered directly without ids.
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Lev Solntsev
 */
exports.fn = function(item) {

    if (item.isElem('defs')) {

        defs = item;
        item.content = (item.content || []).reduce(getUsefulItems, []);

        if (item.isEmpty()) return false;

    } else if (item.isElem(nonRendering) && !item.hasAttr('id')) {

        return false;

    }

};

function getUsefulItems(usefulItems, item) {

    if (item.hasAttr('id') || item.isElem('style')) {

        usefulItems.push(item);
        item.parentNode = defs;

    } else if (!item.isEmpty()) {

        item.content.reduce(getUsefulItems, usefulItems);

    }

    return usefulItems;
}

},{"./_collections":123}],162:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes useless stroke and fill attributes';

exports.params = {
    stroke: true,
    fill: true
};

var shape = require('./_collections').elemsGroups.shape,
    regStrokeProps = /^stroke/,
    regFillProps = /^fill-/,
    styleOrScript = ['style', 'script'],
    hasStyleOrScript = false;

/**
 * Remove useless stroke and fill attrs.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item, params) {

    if (item.isElem(styleOrScript)) {
        hasStyleOrScript = true;
    }

    if (!hasStyleOrScript && item.isElem(shape) && !item.computedAttr('id')) {

        var stroke = params.stroke && item.computedAttr('stroke'),
            fill = params.fill && !item.computedAttr('fill', 'none');

        // remove stroke*
        if (
            params.stroke &&
            (!stroke ||
                stroke == 'none' ||
                item.computedAttr('stroke-opacity', '0') ||
                item.computedAttr('stroke-width', '0')
            )
        ) {
            var parentStroke = item.parentNode.computedAttr('stroke'),
                declineStroke = parentStroke && parentStroke != 'none';

            item.eachAttr(function(attr) {
                if (regStrokeProps.test(attr.name)) {
                    item.removeAttr(attr.name);
                }
            });

            if (declineStroke) item.addAttr({
                name: 'stroke',
                value: 'none',
                prefix: '',
                local: 'stroke'
            });
        }

        // remove fill*
        if (
            params.fill &&
            (!fill || item.computedAttr('fill-opacity', '0'))
        ) {
            item.eachAttr(function(attr) {
                if (regFillProps.test(attr.name)) {
                    item.removeAttr(attr.name);
                }
            });

            if (fill) {
                if (item.hasAttr('fill'))
                    item.attr('fill').value = 'none';
                else
                    item.addAttr({
                        name: 'fill',
                        value: 'none',
                        prefix: '',
                        local: 'fill'
                    });
            }
        }

    }

};

},{"./_collections":123}],163:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes viewBox attribute when possible (disabled by default)';

var regViewBox = /^0\s0\s([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)\s([\-+]?\d*\.?\d+([eE][\-+]?\d+)?)$/,
    viewBoxElems = ['svg', 'pattern'];

/**
 * Remove viewBox attr which coincides with a width/height box.
 *
 * @see http://www.w3.org/TR/SVG/coords.html#ViewBoxAttribute
 *
 * @example
 * <svg width="100" height="50" viewBox="0 0 100 50">
 *             ⬇
 * <svg width="100" height="50">
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    if (
        item.isElem(viewBoxElems) &&
        item.hasAttr('viewBox') &&
        item.hasAttr('width') &&
        item.hasAttr('height')
    ) {

        var match = item.attr('viewBox').value.match(regViewBox);

        if (match) {
            if (
                item.attr('width').value === match[1] &&
                item.attr('height').value === match[3]
            ) {
                item.removeAttr('viewBox');
            }
        }

    }

};

},{}],164:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'removes xmlns attribute (for inline svg, disabled by default)';

/**
 * Remove the xmlns attribute when present.
 *
 * @example
 * <svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
 *   ↓
 * <svg viewBox="0 0 100 50">
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if true, xmlns will be filtered out
 *
 * @author Ricardo Tomasi
 */
exports.fn = function(item) {

    if (item.isElem('svg') && item.hasAttr('xmlns')) {
        item.removeAttr('xmlns');
    }

};
},{}],165:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = true;

exports.description = 'removes XML processing instructions';

/**
 * Remove XML Processing Instruction.
 *
 * @example
 * <?xml version="1.0" encoding="utf-8"?>
 *
 * @param {Object} item current iteration item
 * @return {Boolean} if false, item will be filtered out
 *
 * @author Kir Belevich
 */
exports.fn = function(item) {

    return !(item.processinginstruction && item.processinginstruction.name === 'xml');

};

},{}],166:[function(require,module,exports){
'use strict';

exports.type = 'perItem';

exports.active = false;

exports.description = 'sorts element attributes (disabled by default)';

exports.params = {
	order: [
		'id',
		'width', 'height',
		'x', 'x1', 'x2',
		'y', 'y1', 'y2',
		'cx', 'cy', 'r',
		'fill', 'stroke', 'marker',
		'd', 'points'
	]
};

/**
 * Sort element attributes for epic readability.
 *
 * @param {Object} item current iteration item
 * @param {Object} params plugin params
 *
 * @author Nikolay Frantsev
 */
exports.fn = function(item, params) {

	var attrs = [],
		sorted = {},
		orderlen = params.order.length + 1;

	if (item.elem) {

		item.eachAttr(function(attr) {
			attrs.push(attr);
		});

		attrs.sort(function(a, b) {
			if (a.prefix != b.prefix) {
				// xmlns attributes implicitly have the prefix xmlns
				if (a.prefix == 'xmlns')
					return -1;
				if (b.prefix == 'xmlns')
					return 1;
				return a.prefix < b.prefix ? -1 : 1;
			}

			var aindex = orderlen;
			var bindex = orderlen;

			for (var i = 0; i < params.order.length; i++) {
				if (a.name == params.order[i]) {
					aindex = i;
				} else if (a.name.indexOf(params.order[i] + '-') === 0) {
					aindex = i + .5;
				}
				if (b.name == params.order[i]) {
					bindex = i;
				} else if (b.name.indexOf(params.order[i] + '-') === 0) {
					bindex = i + .5;
				}
			}

			if (aindex != bindex) {
				return aindex - bindex;
			}
			return a.name < b.name ? -1 : 1;
		});

		attrs.forEach(function (attr) {
			sorted[attr.name] = attr;
		});

		item.attrs = sorted;

	}

};

},{}],167:[function(require,module,exports){
'use strict';

/*
 * Thanks to http://fontello.com project for sponsoring this plugin
 */

exports.type = 'full';

exports.active = false;

exports.description = 'performs a set of operations on SVG with one path inside (disabled by default)';

exports.params = {
    // width and height to resize SVG and rescale inner Path
    width: false,
    height: false,

    // scale inner Path without resizing SVG
    scale: false,

    // shiftX/Y inner Path
    shiftX: false,
    shiftY: false,

    // crop SVG width along the real width of inner Path
    hcrop: false,

    // vertical center inner Path inside SVG height
    vcenter: false,

    // stringify params
    floatPrecision: 3,
    leadingZero: true,
    negativeExtraSpace: true
};

var _path = require('./_path.js'),
    relative2absolute = _path.relative2absolute,
    computeCubicBoundingBox = _path.computeCubicBoundingBox,
    computeQuadraticBoundingBox = _path.computeQuadraticBoundingBox,
    applyTransforms = _path.applyTransforms,
    js2path = _path.js2path,
    path2js = _path.path2js,
    EXTEND = require('whet.extend');

exports.fn = function(data, params) {

    data.content.forEach(function(item) {

        // only for SVG with one Path inside
        if (item.isElem('svg') &&
            item.content.length === 1 &&
            item.content[0].isElem('path')
        ) {

            var svgElem = item,
                pathElem = svgElem.content[0],
                // get absoluted Path data
                path = relative2absolute(EXTEND(true, [], path2js(pathElem))),
                xs = [],
                ys = [],
                cubicСontrolPoint = [0, 0],
                quadraticСontrolPoint = [0, 0],
                lastPoint = [0, 0],
                cubicBoundingBox,
                quadraticBoundingBox,
                i,
                segment;

            path.forEach(function(pathItem) {

                // ML
                if ('ML'.indexOf(pathItem.instruction) > -1) {

                    for (i = 0; i < pathItem.data.length; i++) {
                        if (i % 2 === 0) {
                            xs.push(pathItem.data[i]);
                        } else {
                            ys.push(pathItem.data[i]);
                        }
                    }

                    lastPoint = cubicСontrolPoint = quadraticСontrolPoint = pathItem.data.slice(-2);

                // H
                } else if (pathItem.instruction === 'H') {

                    pathItem.data.forEach(function(d) {
                        xs.push(d);
                    });

                    lastPoint[0] = cubicСontrolPoint[0] = quadraticСontrolPoint[0] = pathItem.data[pathItem.data.length - 2];

                // V
                } else if (pathItem.instruction === 'V') {

                    pathItem.data.forEach(function(d) {
                        ys.push(d);
                    });

                    lastPoint[1] = cubicСontrolPoint[1] = quadraticСontrolPoint[1] = pathItem.data[pathItem.data.length - 1];

                // C
                } else if (pathItem.instruction === 'C') {

                    for (i = 0; i < pathItem.data.length; i += 6) {

                        segment = pathItem.data.slice(i, i + 6);

                        cubicBoundingBox = computeCubicBoundingBox.apply(this, lastPoint.concat(segment));

                        xs.push(cubicBoundingBox.minx);
                        xs.push(cubicBoundingBox.maxx);

                        ys.push(cubicBoundingBox.miny);
                        ys.push(cubicBoundingBox.maxy);

                        // reflected control point for the next possible S
                        cubicСontrolPoint = [
                            2 * segment[4] - segment[2],
                            2 * segment[5] - segment[3]
                        ];

                        lastPoint = segment.slice(-2);

                    }

                // S
                } else if (pathItem.instruction === 'S') {

                    for (i = 0; i < pathItem.data.length; i += 4) {

                        segment = pathItem.data.slice(i, i + 4);

                        cubicBoundingBox = computeCubicBoundingBox.apply(this, lastPoint.concat(cubicСontrolPoint).concat(segment));

                        xs.push(cubicBoundingBox.minx);
                        xs.push(cubicBoundingBox.maxx);

                        ys.push(cubicBoundingBox.miny);
                        ys.push(cubicBoundingBox.maxy);

                        // reflected control point for the next possible S
                        cubicСontrolPoint = [
                            2 * segment[2] - cubicСontrolPoint[0],
                            2 * segment[3] - cubicСontrolPoint[1],
                        ];

                        lastPoint = segment.slice(-2);

                    }

                // Q
                } else if (pathItem.instruction === 'Q') {

                    for (i = 0; i < pathItem.data.length; i += 4) {

                        segment = pathItem.data.slice(i, i + 4);

                        quadraticBoundingBox = computeQuadraticBoundingBox.apply(this, lastPoint.concat(segment));

                        xs.push(quadraticBoundingBox.minx);
                        xs.push(quadraticBoundingBox.maxx);

                        ys.push(quadraticBoundingBox.miny);
                        ys.push(quadraticBoundingBox.maxy);

                        // reflected control point for the next possible T
                        quadraticСontrolPoint = [
                            2 * segment[2] - segment[0],
                            2 * segment[3] - segment[1]
                        ];

                        lastPoint = segment.slice(-2);

                    }

                // S
                } else if (pathItem.instruction === 'T') {

                    for (i = 0; i < pathItem.data.length; i += 2) {

                        segment = pathItem.data.slice(i, i + 2);

                        quadraticBoundingBox = computeQuadraticBoundingBox.apply(this, lastPoint.concat(quadraticСontrolPoint).concat(segment));

                        xs.push(quadraticBoundingBox.minx);
                        xs.push(quadraticBoundingBox.maxx);

                        ys.push(quadraticBoundingBox.miny);
                        ys.push(quadraticBoundingBox.maxy);

                        // reflected control point for the next possible T
                        quadraticСontrolPoint = [
                            2 * segment[0] - quadraticСontrolPoint[0],
                            2 * segment[1] - quadraticСontrolPoint[1]
                        ];

                        lastPoint = segment.slice(-2);

                    }

                }

            });

            var xmin = Math.min.apply(this, xs).toFixed(params.floatPrecision),
                xmax = Math.max.apply(this, xs).toFixed(params.floatPrecision),
                ymin = Math.min.apply(this, ys).toFixed(params.floatPrecision),
                ymax = Math.max.apply(this, ys).toFixed(params.floatPrecision),
                svgWidth = +svgElem.attr('width').value,
                svgHeight = +svgElem.attr('height').value,
                realWidth = Math.round(xmax - xmin),
                realHeight = Math.round(ymax - ymin),
                transform = '',
                scale;

            // width & height
            if (params.width && params.height) {

                scale = Math.min(params.width / svgWidth, params.height / svgHeight);

                realWidth = realWidth * scale;
                realHeight = realHeight * scale;

                svgWidth = svgElem.attr('width').value = params.width;
                svgHeight = svgElem.attr('height').value = params.height;

                transform += ' scale(' + scale + ')';

            // width
            } else if (params.width && !params.height) {

                scale = params.width / svgWidth;

                realWidth = realWidth * scale;
                realHeight = realHeight * scale;

                svgWidth = svgElem.attr('width').value = params.width;
                svgHeight = svgElem.attr('height').value = svgHeight * scale;

                transform += ' scale(' + scale + ')';

            // height
            } else if (params.height && !params.width) {

                scale = params.height / svgHeight;

                realWidth = realWidth * scale;
                realHeight = realHeight * scale;

                svgWidth = svgElem.attr('width').value = svgWidth * scale;
                svgHeight = svgElem.attr('height').value = params.height;

                transform += ' scale(' + scale + ')';

            }

            // shiftX
            if (params.shiftX) {
                transform += ' translate(' + realWidth * params.shiftX + ', 0)';
            }

            // shiftY
            if (params.shiftY) {
                transform += ' translate(0, ' + realHeight * params.shiftY + ')';
            }

            // scale
            if (params.scale) {
                scale = params.scale;

                var shiftX = svgWidth / 2,
                    shiftY = svgHeight / 2;

                realWidth = realWidth * scale;
                realHeight = realHeight * scale;

                if (params.shiftX || params.shiftY) {
                    transform += ' scale(' + scale + ')';
                } else {
                    transform += ' translate(' + shiftX + ' ' + shiftY + ') scale(' + scale + ') translate(-' + shiftX + ' -' + shiftY + ')';
                }
            }

            // hcrop
            if (params.hcrop) {
                transform += ' translate(' + (-xmin) + ' 0)';

                svgElem.attr('width').value = realWidth;
            }

            // vcenter
            if (params.vcenter) {
                transform += ' translate(0 ' + (((svgHeight - realHeight) / 2) - ymin) + ')';
            }

            if (transform) {
                pathElem.addAttr({
                    name: 'transform',
                    prefix: '',
                    local: 'transform',
                    value: transform
                });

                path = applyTransforms(pathElem, pathElem.pathJS, true, params.floatPrecision);

                // transformed data rounding
                path.forEach(function(pathItem) {
                    if (pathItem.data) {
                        pathItem.data = pathItem.data.map(function(num) {
                            return +num.toFixed(params.floatPrecision);
                        });
                    }
                });

                // save new
                js2path(pathElem, path, params);
            }

        }

    });

    return data;

};

},{"./_path.js":124,"whet.extend":169}],168:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],169:[function(require,module,exports){
module.exports = require( './lib/whet.extend' );
},{"./lib/whet.extend":170}],170:[function(require,module,exports){
// Generated by CoffeeScript 1.3.3

/*
 * whet.extend v0.9.7
 * Standalone port of jQuery.extend that actually works on node.js
 * https://github.com/Meettya/whet.extend
 *
 * Copyright 2012, Dmitrii Karpich
 * Released under the MIT License
*/


(function() {
  var extend, _findValue, _isClass, _isOwnProp, _isPlainObj, _isPrimitiveType, _isTypeOf, _prepareClone,
    __slice = [].slice;

  module.exports = extend = function() {
    var args, copy, deep, name, options, target, _i, _len, _ref;
    deep = arguments[0], target = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (!_isClass(deep, 'Boolean')) {
      args.unshift(target);
      _ref = [deep || {}, false], target = _ref[0], deep = _ref[1];
    }
    if (_isPrimitiveType(target)) {
      target = {};
    }
    for (_i = 0, _len = args.length; _i < _len; _i++) {
      options = args[_i];
      if (options != null) {
        for (name in options) {
          copy = options[name];
          target[name] = _findValue(deep, copy, target[name]);
        }
      }
    }
    return target;
  };

  /*
  Internal methods from now
  */


  _isClass = function(obj, str) {
    return ("[object " + str + "]") === Object.prototype.toString.call(obj);
  };

  _isOwnProp = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };

  _isTypeOf = function(obj, str) {
    return str === typeof obj;
  };

  _isPlainObj = function(obj) {
    var key;
    if (!obj) {
      return false;
    }
    if (obj.nodeType || obj.setInterval || !_isClass(obj, 'Object')) {
      return false;
    }
    if (obj.constructor && !_isOwnProp(obj, 'constructor') && !_isOwnProp(obj.constructor.prototype, 'isPrototypeOf')) {
      return false;
    }
    for (key in obj) {
      key;

    }
    return key === void 0 || _isOwnProp(obj, key);
  };

  _isPrimitiveType = function(obj) {
    return !(_isTypeOf(obj, 'object') || _isTypeOf(obj, 'function'));
  };

  _prepareClone = function(copy, src) {
    if (_isClass(copy, 'Array')) {
      if (_isClass(src, 'Array')) {
        return src;
      } else {
        return [];
      }
    } else {
      if (_isPlainObj(src)) {
        return src;
      } else {
        return {};
      }
    }
  };

  _findValue = function(deep, copy, src) {
    var clone;
    if (deep && (_isClass(copy, 'Array') || _isPlainObj(copy))) {
      clone = _prepareClone(copy, src);
      return extend(deep, clone, copy);
    } else {
      return copy;
    }
  };

}).call(this);

},{}],171:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var svgo = require('svgo');
var addAttributesToSVGElement = require('svgo/plugins/addAttributesToSVGElement');
var addClassesToSVGElement = require('svgo/plugins/addClassesToSVGElement');
var cleanupAttrs = require('svgo/plugins/cleanupAttrs');
var cleanupEnableBackground = require('svgo/plugins/cleanupEnableBackground');
var cleanupIDs = require('svgo/plugins/cleanupIDs');
var cleanupListOfValues = require('svgo/plugins/cleanupListOfValues');
var cleanupNumericValues = require('svgo/plugins/cleanupNumericValues');
var collapseGroups = require('svgo/plugins/collapseGroups');
var convertColors = require('svgo/plugins/convertColors');
var convertPathData = require('svgo/plugins/convertPathData');
var convertShapeToPath = require('svgo/plugins/convertShapeToPath');
var convertStyleToAttrs = require('svgo/plugins/convertStyleToAttrs');
var convertTransform = require('svgo/plugins/convertTransform');
var mergePaths = require('svgo/plugins/mergePaths');
var minifyStyles = require('svgo/plugins/minifyStyles');
var moveElemsAttrsToGroup = require('svgo/plugins/moveElemsAttrsToGroup');
var moveGroupAttrsToElems = require('svgo/plugins/moveGroupAttrsToElems');
var removeAttrs = require('svgo/plugins/removeAttrs');
var removeComments = require('svgo/plugins/removeComments');
var removeDesc = require('svgo/plugins/removeDesc');
var removeDimensions = require('svgo/plugins/removeDimensions');
var removeDoctype = require('svgo/plugins/removeDoctype');
var removeEditorsNSData = require('svgo/plugins/removeEditorsNSData');
var removeElementsByAttr = require('svgo/plugins/removeElementsByAttr');
var removeEmptyAttrs = require('svgo/plugins/removeEmptyAttrs');
var removeEmptyContainers = require('svgo/plugins/removeEmptyContainers');
var removeEmptyText = require('svgo/plugins/removeEmptyText');
var removeHiddenElems = require('svgo/plugins/removeHiddenElems');
var removeMetadata = require('svgo/plugins/removeMetadata');
var removeNonInheritableGroupAttrs = require('svgo/plugins/removeNonInheritableGroupAttrs');
var removeRasterImages = require('svgo/plugins/removeRasterImages');
var removeStyleElement = require('svgo/plugins/removeStyleElement');
var removeTitle = require('svgo/plugins/removeTitle');
var removeUnknownsAndDefaults = require('svgo/plugins/removeUnknownsAndDefaults');
var removeUnusedNS = require('svgo/plugins/removeUnusedNS');
var removeUselessDefs = require('svgo/plugins/removeUselessDefs');
var removeUselessStrokeAndFill = require('svgo/plugins/removeUselessStrokeAndFill');
var removeViewBox = require('svgo/plugins/removeViewBox');
var removeXMLNS = require('svgo/plugins/removeXMLNS');
var removeXMLProcInst = require('svgo/plugins/removeXMLProcInst');
var sortAttrs = require('svgo/plugins/sortAttrs');
var transformsWithOnePath = require('svgo/plugins/transformsWithOnePath');

var SketchPlugin = exports.SketchPlugin = {
  name: "SVGO Compressor",
  description: "A Plugin that compresses SVG assets using SVGO, right when you export them. This Plugin *requires* Sketch 3.8.",
  author: "Ale Muñoz",
  authorEmail: "ale@sketchapp.com",
  version: "1.3.6",
  identifier: "com.sketchapp.plugins.svgo-compressor",
  homepage: "https:/github.com/BohemianCoding/svgo-compressor",
  compatibleVersion: 3.8,
  commands: {
    svgo: {
      name: 'About SVGO Compressor',
      handlers: {
        run: "___svgo_run_handler_",
        actions: {
          "ExportSlices": "___svgo_run_handler_", // TODO: Fix this ugly hack
          "Export": "___svgo_run_handler_" // TODO: Fix this ugly hack
        }
      },
      run: function run(context) {
        var svgoJSONFilePath = MSPluginManager.mainPluginsFolderURL().path() + '/svgo.json';
        var svgoJSON;
        if (NSFileManager.defaultManager().fileExistsAtPath(svgoJSONFilePath)) {
          log('Reading SVGO defaults from JSON file');
          svgoJSON = JSON.parse(NSString.stringWithContentsOfFile_encoding_error(svgoJSONFilePath, NSUTF8StringEncoding, nil));
        } else {
          // The way to setup SVGO Plugins is a bit convoluted, due to the fact that CocoaScript
          // doesn't really play well with the 'require's used in SVGO. So apologies in advance
          // for the clunky method…
          // 
          // So, for every SVGO Plugin you want to use, you'll have to add an object to svgoJSON.plugins,
          // with a 'name' key and a 'params' key (optional, only needed if you want to change any of the default params for a plugin)
          // 
          // This is the list of SVGO Plugins available as of 2016-05-26:
          // 
          // - addAttributesToSVGElement - adds attributes to an outer <svg> element
          // - addClassesToSVGElement - add classnames to an outer <svg> element
          // - cleanupAttrs - cleanup attributes from newlines, trailing and repeating spaces
          // - cleanUpEnableBackground - remove or cleanup enable-background attribute when possible
          // - cleanupIDs - remove unused and minify used IDs
          // - cleanupListOfValues - round numeric values in attributes that take a list of numbers, like viewBox or enableBackground
          // - cleanupNumericValues - round numeric values to the fixed precision, remove default 'px' units
          // - collapseGroups - collapse useless groups
          // - convertColors - convert colors (from rgb() to #rrggbb, from #rrggbb to #rgb)
          // - convertPathData - convert Path data to relative or absolute whichever is shorter, convert one segment to another, trim useless delimiters, smart rounding and much more
          // - convertShapeToPath - convert some basic shapes to path
          // - convertStyleToAttrs - convert styles into attributes
          // - convertTransform - collapse multiple transforms into one, convert matrices to the short aliases and much more
          // - mergePaths - merge multiple Paths into one
          // - minifyStyles - minify <style> elements content with CSSO
          // - moveElemsAttrsToGroup - move elements attributes to the existing group wrapper
          // - moveGroupAttrsToElems - move some group attributes to the content elements
          // - removeAttrs - remove attributes by pattern
          // - removeComments - remove comments
          // - removeDesc - remove <desc> (only non-meaningful by default)
          // - removeDimensions - remove width/height attributes if viewBox is present
          // - removeDoctype - remove doctype declaration
          // - removeEditorsNSData - remove editors namespaces, elements and attributes
          // - removeEmptyAttrs - remove empty attributes
          // - removeEmptyContainers - remove empty Container elements
          // - removeEmptyText - remove empty Text elements
          // - removeHiddenElems - remove hidden elements
          // - removeMetadata - remove <metadata>
          // - removeNonInheritableGroupAttrs - remove non-inheritable group's "presentation" attributes
          // - removeRasterImages - remove raster images
          // - removeStyleElement - remove <style> elements
          // - removeTitle - remove <title>
          // - removeUnknownsAndDefaults - remove unknown elements content and attributes, remove attrs with default values
          // - removeUnusedNS - remove unused namespaces declaration
          // - removeUselessDefs - remove elements of <defs> without id
          // - removeUselessStrokeAndFill - remove useless stroke and fill attrs
          // - removeViewBox - remove viewBox attribute when possible
          // - removeXMLProcInst - remove XML processing instructions
          // - sortAttrs - sort element attributes for epic readability
          // - transformsWithOnePath - apply transforms, crop by real width, center vertical alignment and resize SVG with one Path inside
          // 
          // These are some sane defaults we've found to work reasonably well, compressing your SVG without
          // altering the shapes or the look. Your milleage may vary, so feel free to tweak these…
          svgoJSON = {
            "comment": "This is the settings file for the SVGO Compressor Plugin. For more info, please check <https://github.com/BohemianCoding/svgo-compressor>",
            "pretty": true,
            "indent": 2,
            "plugins": [{ "name": "cleanupIDs" }, { "name": "cleanupListOfValues" }, { "name": "cleanupNumericValues" }, { "name": "collapseGroups" }, { "name": "convertColors" }, { "name": "convertStyleToAttrs" }, { "name": "convertTransform" }, { "name": "mergePaths" }, { "name": "minifyStyles" }, { "name": "removeComments" }, { "name": "removeDesc", "params": { "removeAny": true } }, { "name": "removeDoctype" }, { "name": "removeEditorsNSData" }, { "name": "removeEmptyAttrs" }, { "name": "removeEmptyContainers" }, { "name": "removeEmptyText" }, { "name": "removeMetadata" }, { "name": "removeNonInheritableGroupAttrs" }, { "name": "removeTitle" }, { "name": "removeUnknownsAndDefaults" }, { "name": "removeUnusedNS" }, { "name": "removeUselessDefs" }, { "name": "removeUselessStrokeAndFill" }, { "name": "removeXMLNS" }, { "name": "removeXMLProcInst" }, { "name": "sortAttrs" }]
          };
          NSString.stringWithString(JSON.stringify(svgoJSON, null, '  ')).writeToFile_atomically_encoding_error(svgoJSONFilePath, true, NSUTF8StringEncoding, nil);
        }

        if (!context.actionContext) {
          // Plugin was run from the menu, so let's open the settings window
          // context.document.showMessage("Opening Settings")
          var alert = COSAlertWindow.new();
          alert.setMessageText("About SVGO Compressor");
          alert.setInformativeText("This Plugin uses SVGO to compress SVG assets exported from Sketch.\n\nIt works automatically whenever you export to SVG, so you don’t need to do anything special. Just work on your design as always, and enjoy smaller & cleaner SVG files.\n\nIf for some reason you’re not happy with the default options, you can edit the svgo.json file in the Application Support folder for Sketch.\n");
          alert.addButtonWithTitle('Edit SVGO Settings…');
          alert.addButtonWithTitle('Cancel');

          var response = alert.runModal();
          if (response === 1000) {
            var open_finder = NSTask.alloc().init(),
                open_finder_args = NSArray.arrayWithObjects(svgoJSONFilePath, nil);
            open_finder.setLaunchPath("/usr/bin/open");
            open_finder.setArguments(open_finder_args);
            open_finder.launch();
          }
        } else {
          var parsedSVGOPlugins = [];
          for (var j = 0; j < svgoJSON.plugins.length; j++) {
            var item = svgoJSON.plugins[j];
            var plugin = eval(item.name);
            log('Enabled plugin: ' + item.name);
            plugin.pluginName = item.name;
            plugin.active = true;
            if (plugin.params) {
              // Plugin supports params
              log('—› default params: ' + JSON.stringify(plugin.params, null, 2));
            }
            if (item.params != null) {
              log('—› new params: ' + JSON.stringify(item.params, null, 2));
              if (plugin.params == undefined) {
                plugin.params = {};
              }
              for (var attrname in item.params) {
                plugin.params[attrname] = item.params[attrname];
              }
              log('—› resulting params: ' + JSON.stringify(plugin.params, null, 2));
            }
            parsedSVGOPlugins.push([plugin]);
          }

          var exports = context.actionContext.exports;
          var filesToCompress = [];
          for (var i = 0; i < exports.count(); i++) {
            var currentExport = exports.objectAtIndex(i);
            if (currentExport.request.format() == 'svg') {
              filesToCompress.push(currentExport.path);
            }
          }

          if (filesToCompress.length > 0) {
            var originalTotalSize = 0;
            var compressedTotalSize = 0;
            if (svgoJSON.pretty == null) {
              svgoJSON.pretty = true;
            }
            if (svgoJSON.indent == null) {
              svgoJSON.indent = 2;
            }
            var svgCompressor = new svgo({
              full: true,
              js2svg: {
                pretty: svgoJSON.pretty,
                indent: svgoJSON.indent
              },
              plugins: parsedSVGOPlugins
            });
            for (var i = 0; i < filesToCompress.length; i++) {
              var currentFile = filesToCompress[i];
              var svgString = "" + NSString.stringWithContentsOfFile_encoding_error(currentFile, NSUTF8StringEncoding, nil);
              originalTotalSize += svgString.length;
              for (var pluginIndex = 0; pluginIndex < svgCompressor.config.plugins[0].length; pluginIndex++) {
                var plugin = svgCompressor.config.plugins[0][pluginIndex];
                if (plugin.pluginName == "cleanupIDs") {
                  var prefix = currentFile.lastPathComponent().stringByDeletingPathExtension().replace(/\s+/g, '-').toLowerCase() + "-";
                  log('Setting cleanupIDs prefix to: ' + prefix);
                  plugin.params['prefix'] = prefix;
                }
              }
              svgCompressor.optimize(svgString, function (result) {
                compressedTotalSize += result.data.length;
                NSString.stringWithString(result.data).writeToFile_atomically_encoding_error(currentFile, true, NSUTF8StringEncoding, nil);
              });
            }
            var compressionRatio = (100 - compressedTotalSize * 100 / originalTotalSize).toFixed(2);
            var msg = filesToCompress.length + " SVG files compressed by " + compressionRatio + "%, from " + originalTotalSize + " bytes to " + compressedTotalSize + " bytes.";
            log(msg);
            NSApplication.sharedApplication().orderedDocuments().firstObject().showMessage(msg);
          }
        }
      }
    }
  }
};

__globals.___svgo_run_handler_ = function (context, params) {
  SketchPlugin.commands['svgo'].run(context, params);
};

/*__$begin_of_manifest_
{
    "name": "SVGO Compressor",
    "description": "A Plugin that compresses SVG assets using SVGO, right when you export them. This Plugin *requires* Sketch 3.8.",
    "author": "Ale Muñoz",
    "authorEmail": "ale@sketchapp.com",
    "version": "1.3.6",
    "identifier": "com.sketchapp.plugins.svgo-compressor",
    "homepage": "https:/github.com/BohemianCoding/svgo-compressor",
    "compatibleVersion": 3.8,
    "commands": [
        {
            "identifier": "svgo",
            "handler": "___svgo_run_handler_",
            "script": "plugin.js",
            "name": "About SVGO Compressor",
            "handlers": {
                "run": "___svgo_run_handler_",
                "actions": {
                    "ExportSlices": "___svgo_run_handler_",
                    "Export": "___svgo_run_handler_"
                }
            }
        }
    ],
    "disableCocoaScriptPreprocessor": true
}__$end_of_manifest_
*/

},{"svgo":116,"svgo/plugins/addAttributesToSVGElement":126,"svgo/plugins/addClassesToSVGElement":127,"svgo/plugins/cleanupAttrs":128,"svgo/plugins/cleanupEnableBackground":129,"svgo/plugins/cleanupIDs":130,"svgo/plugins/cleanupListOfValues":131,"svgo/plugins/cleanupNumericValues":132,"svgo/plugins/collapseGroups":133,"svgo/plugins/convertColors":134,"svgo/plugins/convertPathData":135,"svgo/plugins/convertShapeToPath":136,"svgo/plugins/convertStyleToAttrs":137,"svgo/plugins/convertTransform":138,"svgo/plugins/mergePaths":139,"svgo/plugins/minifyStyles":140,"svgo/plugins/moveElemsAttrsToGroup":141,"svgo/plugins/moveGroupAttrsToElems":142,"svgo/plugins/removeAttrs":143,"svgo/plugins/removeComments":144,"svgo/plugins/removeDesc":145,"svgo/plugins/removeDimensions":146,"svgo/plugins/removeDoctype":147,"svgo/plugins/removeEditorsNSData":148,"svgo/plugins/removeElementsByAttr":149,"svgo/plugins/removeEmptyAttrs":150,"svgo/plugins/removeEmptyContainers":151,"svgo/plugins/removeEmptyText":152,"svgo/plugins/removeHiddenElems":153,"svgo/plugins/removeMetadata":154,"svgo/plugins/removeNonInheritableGroupAttrs":155,"svgo/plugins/removeRasterImages":156,"svgo/plugins/removeStyleElement":157,"svgo/plugins/removeTitle":158,"svgo/plugins/removeUnknownsAndDefaults":159,"svgo/plugins/removeUnusedNS":160,"svgo/plugins/removeUselessDefs":161,"svgo/plugins/removeUselessStrokeAndFill":162,"svgo/plugins/removeViewBox":163,"svgo/plugins/removeXMLNS":164,"svgo/plugins/removeXMLProcInst":165,"svgo/plugins/sortAttrs":166,"svgo/plugins/transformsWithOnePath":167}]},{},[171]);
