import { Template } from "./template"

import { Contract, Transaction } from "./instantiate"

import {
  address as Address,
  keyring as KeyRing,
  opcode as Opcode,
  primitives,
  script as Script,
} from "bcoin"

const MTX = primitives.MTX
const TX = primitives.TX

import * as crypto from "bcrypto"

import { secp256k1 } from "./crypto"

export const toSighash = (
  instantiated: Contract,
  spendTransaction: Transaction
) => {
  if (spendTransaction === undefined) {
    return undefined
  }
  try {
    const script = instantiated.publicKey
      ? Script.fromPubkeyhash(
          crypto.hash160(Buffer.from(instantiated.publicKey, "hex"))
        )
      : Script.fromRaw(Buffer.from(instantiated.script, "hex"))
    return spendTransaction.signatureHash(0, script, instantiated.amount, 1, 1)
  } catch (e) {
    return undefined
  }
}

export const spend = (
  spendSourceTransaction: any,
  spendDestinationAddress: any,
  amount: number,
  locktime: number,
  sequenceNumber: { sequence: number; seconds: boolean }
) => {
  const sourceTransaction = TX.fromJSON(spendSourceTransaction)
  const m = new MTX()
  m.addTX(sourceTransaction, 0)
  m.addOutput({
    address: spendDestinationAddress,
    value: amount
  })
  m.setLocktime(locktime)
  m.setSequence(0, sequenceNumber.sequence, sequenceNumber.seconds)
  return m
}

export function toBuf(arg: Buffer | number | string) {
  if (typeof arg === "number") {
    return Opcode.fromInt(arg)
      .toNum()
      .toRaw() // roundabout, but seems to be the only exposed way
  } else if (typeof arg === "string") {
    return Buffer.from(arg, "hex")
  } else {
    return arg
  }
}

export const fulfill = (
  instantiated: Contract,
  spendTx: any,
  clauseArgs: any[],
  spendClauseName: string
) => {
  const spendTransaction = spendTx.clone()
  // deal with a weird bug in the cloning
  spendTransaction.view = spendTx.view
  const script = instantiated.publicKey
    ? Buffer.from(instantiated.publicKey, "hex")
    : Buffer.from(instantiated.script, "hex")
  const realClauses = instantiated.template.clauses
  const spendClauseIndex = realClauses
    .map(clause => clause.name)
    .indexOf(spendClauseName)
  if (spendClauseIndex === -1) {
    throw new Error("could not find clause: " + spendClauseName)
  }
  const numClauses = instantiated.template.clauses.length
  console.log('clauseArgs: '+JSON.stringify(clauseArgs))
  const generatedArgs = clauseArgs.reverse().map(toBuf)
  console.log('generatedArgs: '+JSON.stringify(generatedArgs))
  const maybeClauseArg = numClauses > 1 ? [toBuf(spendClauseIndex)] : []
  const args = [...generatedArgs, ...maybeClauseArg, script]
  console.log('args: '+JSON.stringify(args))
  const scriptSig = Script.fromArray(args)
  console.log('scriptSig: '+JSON.stringify(scriptSig))
  spendTransaction.inputs[0].script = scriptSig
  return spendTransaction
}

const sigHashType = Buffer.from([1])

export const createSignature = (sigHash: Buffer, secret: string) => {
  let privKey
  try {
    privKey = KeyRing.fromSecret(secret).getPrivateKey()
  } catch (e) {
    console.log(e)
    return undefined
  }
  const sig = secp256k1.signDER(sigHash, privKey) as Buffer
  const fullSig = Buffer.concat([sig, sigHashType])
  return fullSig
}
