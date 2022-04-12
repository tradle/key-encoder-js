import * as test from 'tape'
// @ts-ignore
import * as BN from 'bn.js'
import KeyEncoder from './index'
import { aliases, curves } from './index'
const crypto = require('crypto')
const ECPrivateKeyASN = KeyEncoder.ECPrivateKeyASN
const ECPrivateKey8ASN = KeyEncoder.ECPrivateKey8ASN
const SubjectPublicKeyInfoASN = KeyEncoder.SubjectPublicKeyInfoASN

const keys = {
    rawPrivate: '844055cca13efd78ce79a4c3a4c5aba5db0ebeb7ae9d56906c03d333c5668d5b',
    rawPublic: '04147b79e9e1dd3324ceea115ff4037b6c877c73777131418bfb2b713effd0f502327b923861581bd5535eeae006765269f404f5f5c52214e9721b04aa7d040a75',
    pemPrivate: '-----BEGIN EC PRIVATE KEY-----\n' +
    'MHQCAQEEIIRAVcyhPv14znmkw6TFq6XbDr63rp1WkGwD0zPFZo1boAcGBSuBBAAK\n' +
    'oUQDQgAEFHt56eHdMyTO6hFf9AN7bId8c3dxMUGL+ytxPv/Q9QIye5I4YVgb1VNe\n' +
    '6uAGdlJp9AT19cUiFOlyGwSqfQQKdQ==\n' +
    '-----END EC PRIVATE KEY-----',
    pemPrivatePKCS8: '-----BEGIN PRIVATE KEY-----\n' +
    'MIGNAgEAMBAGByqGSM49AgEGBSuBBAAKBHYwdAIBAQQghEBVzKE+/XjOeaTDpMWr\n' +
    'pdsOvreunVaQbAPTM8VmjVugBwYFK4EEAAqhRANCAAQUe3np4d0zJM7qEV/0A3ts\n' +
    'h3xzd3ExQYv7K3E+/9D1AjJ7kjhhWBvVU17q4AZ2Umn0BPX1xSIU6XIbBKp9BAp1\n' +
    '-----END PRIVATE KEY-----',
    pemCompactPrivate: '-----BEGIN EC PRIVATE KEY-----\n' +
    'MC4CAQEEIIRAVcyhPv14znmkw6TFq6XbDr63rp1WkGwD0zPFZo1boAcGBSuBBAAK\n' +
    '-----END EC PRIVATE KEY-----',
    pemPublic: '-----BEGIN PUBLIC KEY-----\n' +
    'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEFHt56eHdMyTO6hFf9AN7bId8c3dxMUGL\n' +
    '+ytxPv/Q9QIye5I4YVgb1VNe6uAGdlJp9AT19cUiFOlyGwSqfQQKdQ==\n' +
    '-----END PUBLIC KEY-----',
    derPrivate: '30740201010420844055cca13efd78ce79a4c3a4c5aba5db0ebeb7ae9d56906c03d333c5668d5ba00706052b8104000aa14403420004147b79e9e1dd3324ceea115ff4037b6c877c73777131418bfb2b713effd0f502327b923861581bd5535eeae006765269f404f5f5c52214e9721b04aa7d040a75',
    derPrivatePKCS8: '30818d020100301006072a8648ce3d020106052b8104000a047630740201010420 844055cca13efd78ce79a4c3a4c5aba5db0ebeb7ae9d56906c03d333c5668d5ba00706052b8104000aa14403420004147b79e9e1dd3324ceea115ff4037b6c877c73777131418bfb2b713effd0f502327b923861581bd5535eeae006765269f404f5f5c52214e9721b04aa7d040a75',
    derPublic: '3056301006072a8648ce3d020106052b8104000a03420004147b79e9e1dd3324ceea115ff4037b6c877c73777131418bfb2b713effd0f502327b923861581bd5535eeae006765269f404f5f5c52214e9721b04aa7d040a75'
}

const keyEncoder = new KeyEncoder('secp256k1')

test('encodeECPrivateKeyASN', function(t) {
    var secp256k1Parameters = [1, 3, 132, 0, 10],
        pemOptions =  {label: 'EC PRIVATE KEY'}

    var privateKeyObject = {
        version: new BN(1),
        privateKey: Buffer.from(keys.rawPrivate, 'hex'),
        parameters: secp256k1Parameters,
        publicKey: { unused: 0, data: Buffer.from(keys.rawPublic, 'hex') }
    }

    var privateKeyPEM = ECPrivateKeyASN.encode(privateKeyObject, 'pem', pemOptions)
    t.equal(privateKeyPEM, keys.pemPrivate, 'encoded PEM private key should match the OpenSSL reference')

    var decodedPrivateKeyObject = ECPrivateKeyASN.decode(privateKeyPEM, 'pem', pemOptions)
    t.equal(JSON.stringify(privateKeyObject), JSON.stringify(decodedPrivateKeyObject), 'encoded-and-decoded private key object should match the original')

    var openSSLPrivateKeyObject = ECPrivateKeyASN.decode(keys.pemPrivate, 'pem', pemOptions)
    t.equal(JSON.stringify(privateKeyObject), JSON.stringify(openSSLPrivateKeyObject), 'private key object should match the one decoded from the OpenSSL PEM')
    t.end()
})

test('encodeECPrivateKey8ASN', function(t) {
    var secp256k1Parameters = [1, 3, 132, 0, 10],
        pemOptions =  {label: 'PRIVATE KEY'}

    var privateKey = {
        version: new BN(1),
        privateKey: Buffer.from(keys.rawPrivate, 'hex'),
        parameters: secp256k1Parameters,
        publicKey: { unused: 0, data: Buffer.from(keys.rawPublic, 'hex') }
    }
    var privateKeyObject = {
        version: new BN(0),
        privateKeyAlgorithm: {
            ecPublicKey: [1, 2, 840, 10045, 2, 1],
            curve: secp256k1Parameters,
        },
        privateKey: privateKey,
    }

    var privateKeyPEM = ECPrivateKey8ASN.encode(privateKeyObject, 'pem', pemOptions)
    t.equal(privateKeyPEM, keys.pemPrivatePKCS8, 'encoded PEM private key should match the OpenSSL reference')

    var decodedPrivateKeyObject = ECPrivateKey8ASN.decode(privateKeyPEM, 'pem', pemOptions)
    t.equal(JSON.stringify(privateKeyObject), JSON.stringify(decodedPrivateKeyObject), 'encoded-and-decoded private key object should match the original')

    var openSSLPrivateKeyObject = ECPrivateKey8ASN.decode(keys.pemPrivatePKCS8,'pem',pemOptions)
    t.equal(JSON.stringify(privateKeyObject), JSON.stringify(openSSLPrivateKeyObject), 'private key object should match the one decoded from the OpenSSL PEM')
    t.end()
})

test('encodeSubjectPublicKeyInfoASN', function(t) {
    var secp256k1Parameters = [1, 3, 132, 0, 10],
        pemOptions =  {label: 'PUBLIC KEY'}

    var publicKeyObject = {
        algorithm: {
            id: [1, 2, 840, 10045, 2, 1],
            curve: secp256k1Parameters
        },
        pub: {
            unused: 0,
            data: Buffer.from(keys.rawPublic, 'hex')
        },
    }

    var publicKeyPEM = SubjectPublicKeyInfoASN.encode(publicKeyObject, 'pem', pemOptions)
    t.equal(typeof publicKeyPEM, "string")
    t.equal(publicKeyPEM, keys.pemPublic, 'encoded PEM public key should match the OpenSSL reference')
    t.end()
})

test('encodeRawPrivateKey', function(t) {
    var privateKeyPEM = keyEncoder.encodePrivate(keys.rawPrivate, 'raw', 'pem')
    t.equal(typeof privateKeyPEM, "string")
    t.equal(privateKeyPEM, keys.pemPrivate, 'encoded PEM private key should match the OpenSSL reference')

    var privateKeyDER = keyEncoder.encodePrivate(keys.rawPrivate, 'raw', 'der')
    t.equal(typeof privateKeyDER, "string")
    t.equal(privateKeyDER, keys.derPrivate, 'encoded DER private key should match the OpenSSL reference')
    t.end()
})

test('encodeDERPrivateKey', function(t) {
    var rawPrivateKey = keyEncoder.encodePrivate(keys.derPrivate, 'der', 'raw')
    t.equal(typeof rawPrivateKey, "string")
    t.equal(rawPrivateKey, keys.rawPrivate, 'encoded raw private key should match the OpenSSL reference')

    var privateKeyPEM = keyEncoder.encodePrivate(keys.derPrivate, 'der', 'pem')
    t.equal(typeof privateKeyPEM, "string")
    t.equal(privateKeyPEM, keys.pemPrivate, 'encoded PEM private key should match the OpenSSL reference')
    t.end()
})

test('encodePEMPrivateKey', function(t) {
    var rawPrivateKey = keyEncoder.encodePrivate(keys.pemPrivate, 'pem', 'raw')
    t.equal(typeof rawPrivateKey, "string")
    t.equal(rawPrivateKey, keys.rawPrivate, 'encoded raw private key should match the OpenSSL reference')

    var privateKeyDER = keyEncoder.encodePrivate(keys.pemPrivate, 'pem', 'der')
    t.equal(typeof privateKeyDER, "string")
    t.equal(privateKeyDER, keys.derPrivate, 'encoded DER private key should match the OpenSSL reference')
    t.end()
})

test('encodeRawPublicKey', function(t) {
    var publicKeyPEM = keyEncoder.encodePublic(keys.rawPublic, 'raw', 'pem')
    t.equal(typeof publicKeyPEM, "string")
    t.equal(publicKeyPEM, keys.pemPublic, 'encoded PEM public key should match the OpenSSL reference')

    var publicKeyDER = keyEncoder.encodePublic(keys.rawPublic, 'raw', 'der')
    t.equal(typeof publicKeyDER, "string")
    t.equal(publicKeyDER, keys.derPublic, 'encoded DER public key should match the OpenSSL reference')
    t.end()
})

test('encodeDERPublicKey', function(t) {
    var rawPublicKey = keyEncoder.encodePublic(keys.derPublic, 'der', 'raw')
    t.equal(typeof rawPublicKey, "string")
    t.equal(rawPublicKey, keys.rawPublic, 'encoded raw public key should match the OpenSSL reference')

    var publicKeyPEM = keyEncoder.encodePublic(keys.derPublic, 'der', 'pem')
    t.equal(typeof publicKeyPEM, "string")
    t.equal(publicKeyPEM, keys.pemPublic, 'encoded PEM public key should match the OpenSSL reference')
    t.end()
})

test('encodePEMPublicKey', function(t) {
    var rawPublicKey = keyEncoder.encodePublic(keys.pemPublic, 'pem', 'raw')
    t.equal(typeof rawPublicKey, "string")
    t.equal(rawPublicKey, keys.rawPublic, 'encoded raw public key should match the OpenSSL reference')

    var publicKeyDER = keyEncoder.encodePublic(keys.pemPublic, 'pem', 'der')
    t.equal(typeof publicKeyDER, "string")
    t.equal(publicKeyDER, keys.derPublic, 'encoded DER public key should match the OpenSSL reference')
    t.end()
})

test('elliptic sign => native verify compact', function (t) {
    var testData = 'some data',
        hashingAlgorithm = 'sha256',
        testDataHash = crypto.createHash(hashingAlgorithm).update(testData).digest()

    for (var curveName in aliases) {
        var curve = curves[curveName].curve,
            keyEncoder = new KeyEncoder(curveName)
        t.ok(keyEncoder, 'curve ' + curveName + ': created a key encoder')

        var keypair = curve.genKeyPair(),
            publixKeyHex = keypair.getPublic('hex'),
            publicKeyPEM = keyEncoder.encodePublic(publixKeyHex, 'raw', 'pem')

        var signatureOfTestData = keypair.sign(testDataHash).toDER('hex')
        t.ok(signatureOfTestData, 'curve ' + curveName + ': signed test data')

        var verified = crypto
            .createVerify(hashingAlgorithm)
            .update(testData)
            .verify(publicKeyPEM, signatureOfTestData, 'hex')
        t.ok(verified, 'curve ' + curveName + ': verified signature')
    }

    t.end()
})

test('native sign => elliptic verify compact', function (t) {
    var testData = 'some data',
        hashingAlgorithm = 'sha256',
        testDataHash = crypto.createHash(hashingAlgorithm).update(testData).digest()

    for (var curveName in aliases) {
        var curve = curves[curveName].curve,
            keyEncoder = new KeyEncoder(curveName)
        t.ok(keyEncoder, 'curve ' + curveName + ': created a key encoder')

        var ecdh = crypto.createECDH(aliases[curveName])
        ecdh.generateKeys()
        var privateKey = ecdh.getPrivateKey(),
            privateKeyPEM = keyEncoder.encodePrivate(privateKey, 'raw', 'pem')
        
        var signatureOfTestData = crypto
            .createSign(hashingAlgorithm)
            .update(testData)
            .sign(privateKeyPEM, 'hex')
        t.ok(signatureOfTestData, 'curve ' + curveName + ': signed test data')

        var verified = curve
            .keyFromPrivate(privateKey)
            .verify(testDataHash, signatureOfTestData)
        t.ok(verified, 'curve ' + curveName + ': verified signature')
    }

    t.end()
})

