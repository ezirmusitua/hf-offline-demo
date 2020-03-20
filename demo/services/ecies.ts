import crypto from "isomorphic-webcrypto";
import { AES_GCM } from "../ecies/aes";
import {
  // con,
  concatArrayBuffer,
  // uint8ArrayToUnicode,
  unicodeToUint8Array,
  toBase64
} from "../ecies/buffer";
// import { X963KDF } from "../ecies/kdf";
import {
  readPublicKeyFromCertPem,
  readPrivateKeyFromKeyPem,
  ECDH
} from "../ecies/key";
// import {
//   kSecKeyAlgorithmECIESEncryptionCofactorX963SHA256AESGCM,
//   readPrivateKeyFromKeyPem,
//   readPublicKeyFromCertPem
// } from "../ecies";

export class ECIES {
  // static eciesHelper = kSecKeyAlgorithmECIESEncryptionCofactorX963SHA256AESGCM(
  //   "prime256v1"
  // );
  static certPem: string;
  static keyPem: string;

  static init(certPem, keyPem) {
    ECIES.certPem = certPem;
    ECIES.keyPem = keyPem;
  }

  public static async encrypt() {
    if (!ECIES.certPem) throw new Error("Certificate Not Set");
    // const key = crypto.getRandomValues(new Uint8Array(16));
    // const iv = crypto.getRandomValues(new Uint8Array(16));
    // const message = unicodeToUint8Array("Hello World");
    // const aesEnc = new AES_GCM();
    // await aesEnc.encrypt(key, iv, message);
    // const encrypted = concatArrayBuffer(
    //   [aesEnc.ciphertext, aesEnc.tag],
    //   Uint8Array
    // );
    // alert(`aes gcm encryption: ${toBase64(encrypted)}`);
    const publicKey = readPublicKeyFromCertPem(TestCertPem);
    const privateKey = readPrivateKeyFromKeyPem(TestKeyPem);
    const ecdh1 = new ECDH();
    const sharedSecret1 = await ecdh1.computeSecret(publicKey.keyRaw);
    const ephemPub = await ecdh1.getPublicCodePoint();
    console.log(toBase64(ephemPub));
    console.log(toBase64(sharedSecret1));
    const ecdh2 = new ECDH(privateKey);
    const sharedSecret2 = await ecdh2.computeSecret(ephemPub);
    // alert(toBase64(sharedSecret2));
    // const derivedKey = await (new X963KDF()).derive(key, 16, message);
    // alert(`x963kdf: ${toBase64(derivedKey)}`);
    // const publicKey = readPublicKeyFromCertPem(ECIES.certPem);
    // return ECIES.eciesHelper.encrypt(publicKey, message);
  }

  public static decrypt(ciphertext) {
    if (!ECIES.keyPem) throw new Error("Key Not Set");
    // const privateKey = readPrivateKeyFromKeyPem(ECIES.keyPem);
    // return ECIES.eciesHelper.decrypt(privateKey, ciphertext);
  }
}

export const TestCertPem = `-----BEGIN CERTIFICATE-----
MIICGjCCAcCgAwIBAgIQdTf6GFMTws3FQ1u6RQmy4TAKBggqhkjOPQQDAjBpMQsw
CQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEWMBQGA1UEBxMNU2FuIEZy
YW5jaXNjbzEUMBIGA1UEChMLZXhhbXBsZS5jb20xFzAVBgNVBAMTDmNhLmV4YW1w
bGUuY29tMB4XDTIwMDEyNTIzMjYwMFoXDTMwMDEyMjIzMjYwMFowZjELMAkGA1UE
BhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNhbiBGcmFuY2lz
Y28xDjAMBgNVBAsTBWFkbWluMRowGAYDVQQDDBFBZG1pbkBleGFtcGxlLmNvbTBZ
MBMGByqGSM49AgEGCCqGSM49AwEHA0IABK70Yu5TA5ELRaqN2uN3muA2IG5Vr0Tb
w48tmcIzIpOr6qwwaX5ZZPC/MoK+jKi7FoqycMPsL7/QwiEu+mpVDpSjTTBLMA4G
A1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAAMCsGA1UdIwQkMCKAIFJJyNm/gnkm
ityYTqH0Nrtmidq8OuWvM87T4x2LS2rdMAoGCCqGSM49BAMCA0gAMEUCIQCAup+Y
O1kToiYf1dEH1t8AeGElnXVBBHxQWb/3lBWquwIgTOPdbW5gH/6p/dFkpzTnO77S
cz2spXvDf8pnilIsEOU=
-----END CERTIFICATE-----`;

export const TestKeyPem = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgW/BFvJ4pe7aE5HAo
h8lWvcGx2ZCcNTk3n/VtP1xkLi2hRANCAASu9GLuUwORC0Wqjdrjd5rgNiBuVa9E
28OPLZnCMyKTq+qsMGl+WWTwvzKCvoyouxaKsnDD7C+/0MIhLvpqVQ6U
-----END PRIVATE KEY-----`;
