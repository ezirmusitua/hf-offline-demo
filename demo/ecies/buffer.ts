export function concatArrayBuffer(input, typed = Uint8Array) {
  const outputTotalLen = input.reduce((s, c) => s + c.byteLength, 0);
  const output = new typed(outputTotalLen);
  let targetIdx = 0;
  let targetItemIdx = 0;
  let outputFilledCount = 0;
  while (outputFilledCount < outputTotalLen) {
    let target = input[targetIdx];
    if (ArrayBuffer.isView(target)) {
      target = formatToTyped(target, typed);
    }
    if (target.byteLength > 0) {
      output[outputFilledCount] = target[targetItemIdx];
      outputFilledCount += 1;
      targetItemIdx += 1;
    }
    if (targetItemIdx >= target.byteLength) {
      targetItemIdx = 0;
      targetIdx += 1;
    }
  }
  return output;
}

export function uint8ArrayToHex(array) {
  const ui8array = formatToTyped(array, Uint8Array);
  let result = "";
  const ensure8Bits = str =>
    str.length < 2 ? "0".repeat(2 - str.length) + str : str;
  for (let i = 0; i < ui8array.byteLength; i++) {
    result += ensure8Bits(ui8array[i].toString(16));
  }
  return result;
}

export function unicodeToUint8Array(str) {
  const escstr = encodeURIComponent(str);
  const binstr = escstr.replace(/%([0-9A-F]{2})/g, (match, p1) => {
    return String.fromCharCode("0x" + p1);
  });
  const ua = new Uint8Array(binstr.length);
  Array.prototype.forEach.call(binstr, function(ch, i) {
    ua[i] = ch.charCodeAt(0);
  });
  return ua;
}

export function uint8ArrayToUnicode(ua) {
  const binstr = Array.prototype.map
    .call(ua, ch => {
      return String.fromCharCode(ch);
    })
    .join("");
  const escstr = binstr.replace(/(.)/g, function(m, p) {
    let code = p
      .charCodeAt(p)
      .toString(16)
      .toUpperCase();
    if (code.length < 2) {
      code = "0" + code;
    }
    return "%" + code;
  });
  return decodeURIComponent(escstr);
}

export function formatToTyped(input, typed) {
  const isArrayBuffer = input instanceof ArrayBuffer;
  const isTyped = ArrayBuffer.isView(input);
  const isArray = Array.isArray(input);
  if (!isArrayBuffer && !isTyped && !isArray) throw new Error("Invalid type");
  return new typed(isArray || isArrayBuffer ? input : input.buffer);
}

export function fromBase64(input) {
  const asciiStr = atob(input);
  const uint8Array = asciiToUint8Array(asciiStr);
  return uint8Array;
}

export function asciiToUint8Array(str) {
  const chars = [];
  for (let i = 0; i < str.length; ++i) {
    chars.push(str.charCodeAt(i));
  }
  return new Uint8Array(chars);
}

export function uint8ArrayToAscii(array) {
  const ui8array = formatToTyped(array, Uint8Array);
  let result = "";
  for (let i = 0; i < ui8array.byteLength; i++) {
    result += String.fromCharCode(ui8array[i]);
  }
  return result;
}

export function toBase64(input: Uint8Array): string {
  const formattedInput = formatToTyped(input, Uint8Array);
  const asciiStr = uint8ArrayToAscii(formattedInput);
  return btoa(asciiStr);
}

export function intTo32BE(i: number): Uint8Array {
  let iInHexStr = i.toString(16);
  if (iInHexStr.length > 8)
    throw new Error("Integer's bit length is longer than 32");
  iInHexStr = "0".repeat(8 - iInHexStr.length) + iInHexStr;
  const iInHex = iInHexStr.split("").reduce((r, c, i) => {
    if (i % 2 === 0) {
      r.push(c);
    } else {
      r[r.length - 1] += c;
    }
    return r;
  }, []);
  const byteLength = 32 / 8;
  const buf = new Uint8Array(byteLength);
  let pos = byteLength - 1;
  while (pos >= 0) {
    buf[pos] = iInHex[pos];
    pos -= 1;
  }
  return buf;
}
