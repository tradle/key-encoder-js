# @tradle/Key Encoder JS

> Fork of [key-encoder][] with updated dependencies and support for more curves.

[key-encoder]: https://github.com/stacks-network/key-encoder-js

### Installation

```
$ npm install @tradle/key-encoder
```

### Getting Started

To get started, first define your key encoder and raw private/public keys.

#### SECP256k1 Key Encoders

```js
var KeyEncoder = require('@tradle/key-encoder'),
    keyEncoder = new KeyEncoder('secp256k1')
```

As shown above, there is built in support for SECP256k1 (the curve Bitcoin uses), but you can pass in your own curve parameters for any curve you'd like.

#### Key Encoders w/ Custom Curves

```js
var EC = require('elliptic').ec
var encoderOptions = {
    curveParameters: [1, 3, 132, 0, 10],
    privatePEMOptions: {label: 'EC PRIVATE KEY'},
    publicPEMOptions: {label: 'PUBLIC KEY'},
    curve: new EC('secp256k1')
}
var keyEncoder = new KeyEncoder(encoderOptions)
```

#### Declaring Raw Keys

```js
var rawPrivateKey = '844055cca13efd78ce79a4c3a4c5aba5db0ebeb7ae9d56906c03d333c5668d5b',
    rawPublicKey = '04147b79e9e1dd3324ceea115ff4037b6c877c73777131418bfb2b713effd0f502327b923861581bd5535eeae006765269f404f5f5c52214e9721b04aa7d040a75'
```

### Encoding Private Keys

Encode to and from raw, PEM (encode to 'pkcs8' and 'pkcs1'), and DER formats.

#### Encoding Private Keys as PEMs

```js
var pemPrivateKey = keyEncoder.encodePrivate(rawPrivateKey, 'raw', 'pem', 'pkcs8') //default is 'pkcs1'
```

Example output:

```
-----BEGIN PRIVATE KEY-----
MIGNAgEAMBAGByqGSM49AgEGBSuBBAAKBHYwdAIBAQQghEBVzKE+/XjOeaTDpMWr
pdsOvreunVaQbAPTM8VmjVugBwYFK4EEAAqhRANCAAQUe3np4d0zJM7qEV/0A3ts
h3xzd3ExQYv7K3E+/9D1AjJ7kjhhWBvVU17q4AZ2Umn0BPX1xSIU6XIbBKp9BAp1
-----END PRIVATE KEY-----
```

#### Encoding Private Keys to DER Format

```js
var derPrivateKey = keyEncoder.encodePrivate(rawPrivateKey, 'raw', 'der')
```

Example output:

```
30740201010420844055cca13efd78ce79a4c3a4c5aba5db0ebeb7ae9d56906c03d333c5668d5ba00706052b8104000aa14403420004147b79e9e1dd3324ceea115ff4037b6c877c73777131418bfb2b713effd0f502327b923861581bd5535eeae006765269f404f5f5c52214e9721b04aa7d040a75
```

### Encoding Public Keys

Encode to and from raw, PEM, and DER formats.

#### Encoding Public Keys as PEMs

```js
var pemPublicKey = keyEncoder.encodePublic(rawPublicKey, 'raw', 'pem')
```

Example output:

```
-----BEGIN PUBLIC KEY-----
MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEFHt56eHdMyTO6hFf9AN7bId8c3dxMUGL
+ytxPv/Q9QIye5I4YVgb1VNe6uAGdlJp9AT19cUiFOlyGwSqfQQKdQ==
-----END PUBLIC KEY-----
```

#### Encoding Public Keys to DER Format

```js
var derPublicKey = keyEncoder.encodePublic(rawPublicKey, 'raw', 'der')
```

Example output:

```
3056301006072a8648ce3d020106052b8104000a03420004147b79e9e1dd3324ceea115ff4037b6c877c73777131418bfb2b713effd0f502327b923861581bd5535eeae006765269f404f5f5c52214e9721b04aa7d040a75
```
