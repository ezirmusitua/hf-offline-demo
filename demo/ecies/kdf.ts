import crypto from "isomorphic-webcrypto";
import { concatArrayBuffer, formatToTyped, intTo32BE } from "./buffer";

export enum HashAlgo {
  SHA256 = "sha256"
}
const HASHERS = {
  [HashAlgo.SHA256]: async (data: Uint8Array) => {
    return crypto.subtle.digest({ name: "SHA-256" }, data);
  }
};

export class X963KDF {
  hashAlgo: HashAlgo;
  private _digest: (data: Uint8Array) => Uint8Array;
  constructor(hashAlgo = HashAlgo.SHA256) {
    this.hashAlgo = hashAlgo;
    this._digest = HASHERS[this.hashAlgo.toLowerCase()];
  }

  async derive(key, byteLength, sharedInfo) {
    let output = new Uint8Array();
    let outputlen = 0;
    let counter = 1;
    while (byteLength > outputlen) {
      let toHash = concatArrayBuffer([key, intTo32BE(counter)], Uint8Array);
      if (sharedInfo) {
        toHash = concatArrayBuffer([toHash, sharedInfo], Uint8Array);
      }
      const hashResult = formatToTyped(await this._digest(toHash), Uint8Array);
      outputlen += hashResult.byteLength;
      output = concatArrayBuffer([output, hashResult], Uint8Array);
      counter += 1;
    }
    return output.slice(0, byteLength);
  }
}
