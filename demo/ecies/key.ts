// import { Key } from "js-crypto-key-utils";
// import crypto from "isomorphic-webcrypto";
// import * as ECKey from "eckey";
// import * as conv from "binstring";
import * as x509 from "./x509";
import crypto from "isomorphic-webcrypto";
import { toBase64, fromBase64, concatArrayBuffer } from "./buffer";

enum EC_CURVE_NAMES {
  secp256r1 = "P-256",
  prime256v1 = "P-256",
  P256 = "P-256",
  secp256k1 = "P-256K",
  P256K = "P-256K",
  P384 = "P-384",
  secp384r1 = "P-384",
  P521 = "P-521",
  secp521r1 = "P-521"
}

export function readPublicKeyFromCertPem(pemContent): x509.PublicKey {
  const cert = x509.Certificate.fromPEM(pemContent);
  return cert.publicKey;
}

export function readPrivateKeyFromKeyPem(pemContent): x509.PrivateKey {
  return x509.PrivateKey.fromPEM(pemContent);
}

enum ECCurveName {
  P256 = "P-256",
  P384 = "P-384",
  P512 = "P-512"
}

export class ECDH {
  private _curveName: ECCurveName;
  private _privateKeyIn: x509.PrivateKey;
  private _privateKey: CryptoKey;
  private _publicKey: CryptoKey;
  constructor(privateKey?: x509.PrivateKey, curveName = ECCurveName.P256) {
    this._curveName = curveName;
    this._privateKeyIn = privateKey;
  }

  async getPublicCodePoint() {
    if (!this._publicKey) throw new Error("No Ephemeral Key Pair Generated");
    const publicKeyJwk = await crypto.subtle.exportKey("jwk", this._publicKey);
    const publicKeyRaw = concatArrayBuffer([
      new Uint8Array(4),
      fromBase64(
        publicKeyJwk.x.replace(/\-/g, "+").replace(/\_/g, "/") +
          "=".repeat(44 - publicKeyJwk.x.length)
      ),
      fromBase64(
        publicKeyJwk.y.replace(/\-/g, "+").replace(/\_/g, "/") +
          "=".repeat(44 - publicKeyJwk.y.length)
      )
    ]);
    return publicKeyRaw;
  }

  async importPublicFromRaw(rawContent: Uint8Array) {
    const content = new Uint8Array(rawContent).slice(1);
    const length = content.byteLength;
    const validBitsLen = {
      [ECCurveName.P256]: 256 * 2,
      [ECCurveName.P384]: 384 * 2,
      [ECCurveName.P512]: 512 * 2
    }[this._curveName];
    if (length * 8 != validBitsLen) {
      throw new Error(`Invalid key size (${length * 8} bits)`);
    }
    const jwk = {
      kty: "EC",
      crv: this._curveName,
      x: toBase64(content.slice(0, length / 2)),
      y: toBase64(content.slice(length / 2)),
      ext: true
    };
    return await crypto.subtle.importKey(
      "jwk",
      jwk,
      {
        name: "ECDSA",
        namedCurve: this._curveName
      },
      false, //whether the key is extractable (i.e. can be used in exportKey),
      ["verify"]
    );
  }

  async importPrivateKey(prv: x509.PrivateKey) {
    const der = prv.toDER();
    try {
      return await crypto.subtle.importKey(
        "pkcs8",
        der,
        { name: "ECDSA", namedCurve: this._curveName },
        false,
        ["sign"]
      );
    } catch (e) {
      console.log("Failed Import Private Key: ", JSON.stringify(e), e);
    }
  }

  async generateKeyPair() {
    if (this._privateKeyIn) {
      console.log("TRY IMPORT PRIVATE KEY");
      this._privateKey = await this.importPrivateKey(this._privateKeyIn);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!PRIVATE", this._privateKey);
    } else {
      const keypair = await crypto.subtle.generateKey(
        {
          name: "ECDH",
          namedCurve: this._curveName
        },
        true,
        ["deriveBits"]
      );
      this._publicKey = keypair.publicKey;
      this._privateKey = keypair.privateKey;
    }
  }

  async computeSecret(publicKeyRaw: Uint8Array) {
    if (!this._privateKey) {
      await this.generateKeyPair();
    }
    const publicKey = await this.importPublicFromRaw(publicKeyRaw);
    const derivedKey = await window.crypto.subtle.deriveBits(
      {
        name: "ECDH",
        public: publicKey,
        namedCurve: this._curveName
      } as any,
      this._privateKey,
      32 * 8
    );
    return new Uint8Array(derivedKey);
  }
}
