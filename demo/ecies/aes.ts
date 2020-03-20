import crypto from "isomorphic-webcrypto";
import { formatToTyped } from "./buffer";

enum KeyUsage {
  ENC = "encrypt",
  DEC = "decrypt"
}

export class AES_GCM {
  static algoName = "AES-GCM";
  tagBLen: number;
  keyBLen: number;
  plaintext: Uint8Array;
  ciphertext: Uint8Array;
  tag: Uint8Array;
  _completed: boolean;

  constructor(keyBytesLen = 16, tagBytesLen = 16) {
    this.tagBLen = tagBytesLen;
    this.keyBLen = keyBytesLen;
    this.plaintext = null;
    this.ciphertext = null;
    this.tag = null;
    this._completed = false;
  }

  async importKey(key, usage = KeyUsage.ENC) {
    return await crypto.subtle.importKey(
      "raw",
      formatToTyped(key, Uint8Array),
      { name: AES_GCM.algoName, length: this.keyBLen * 8 },
      false,
      [usage]
    );
  }

  async encrypt(
    key: ArrayBuffer | Uint8Array,
    iv: ArrayBuffer | Uint8Array,
    message: ArrayBuffer | Uint8Array | Uint16Array
  ) {
    if (this._completed) return this;
    const formattedKey = await this.importKey(key);
    const formattedIv = formatToTyped(iv, Uint8Array);
    const formattedMessage = formatToTyped(message, Uint8Array);
    const output = formatToTyped(
      await crypto.subtle.encrypt(
        {
          name: AES_GCM.algoName,
          iv: formattedIv,
          tagLength: this.tagBLen * 8
        },
        formattedKey,
        formattedMessage
      ),
      Uint8Array
    );
    this.ciphertext = output.slice(0, -this.tagBLen);
    this.tag = output.slice(-this.tagBLen);
    return this;
  }

  async decrypt(
    key: ArrayBuffer | Uint8Array,
    iv: ArrayBuffer | Uint8Array,
    ciphertext: ArrayBuffer | Uint8Array | Uint16Array
  ) {
    if (this._completed) return this;
    const formattedKey = await this.importKey(key, KeyUsage.DEC);
    const formattedIv = formatToTyped(iv, Uint8Array);
    const encrypted = formatToTyped(ciphertext, Uint8Array);
    this.plaintext = formatToTyped(
      await crypto.subtle.decrypt(
        {
          name: AES_GCM.algoName,
          iv: formattedIv,
          tagLength: this.tagBLen * 8
        },
        formattedKey,
        encrypted
      ),
      Uint8Array
    );
    return this;
  }
}
