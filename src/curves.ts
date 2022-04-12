import { ec as EC } from 'elliptic'

const parameters = {
    secp256k1: [1, 3, 132, 0, 10],
    p192: [1, 2, 840, 10045, 3, 1, 1],
    p224: [1, 3, 132, 0, 33],
    p256: [1, 2, 840, 10045, 3, 1, 7],
    p384: [1, 3, 132, 0, 34],
    p521: [1, 3, 132, 0, 35]
}

export const aliases: { [key: string]: string } = {
    p192: 'prime192v1',
    p224: 'secp224r1',
    p256: 'prime256v1',
    p384: 'secp384r1',
    p521: 'secp521r1'
}

export interface CurveOptions {
    curveParameters: number[];
    privatePEMOptions: { label: string };
    publicPEMOptions: { label: string };
    curve: EC;
}

export type CurveNames = keyof typeof parameters | 'priv'

const ecCurves: { [curve: string]: EC } = {}

export const curves: { [curveName: string]: CurveOptions } = {} as any

for (const [curveName, curveParameters] of Object.entries(parameters)) {
    const options: CurveOptions = {
        curveParameters,
        privatePEMOptions: {label: 'EC PRIVATE KEY'},
        publicPEMOptions: {label: 'PUBLIC KEY'},
        get curve (): EC {
            let ec = ecCurves[curveName]
            if (ec === undefined) {
                ec = new EC(curveName)
                ecCurves[curveName] = ec
            }
            return ec
        }
    }
    curves[curveName] = options
    const aliasName = aliases[curveName]
    if (aliasName) {
        curves[aliasName] = options
    }
}
