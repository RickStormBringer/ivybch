import { createTypeSignature, TypeSignature } from "./types"

import { BugError } from "../errors"

export type ComparisonOperator = 
  | "=="  
  | "!="
  | ">"
  | "<"
  
export function isComparisonOperator(str: string): str is ComparisonOperator {
  return ["==", "!=", ">", "<"].indexOf(str) !== -1
}

export type FunctionName =
  | "checkSig"
  | "checkDataSig"
  | "ripemd160"
  | "sha1"
  | "sha256"
  | "older"
  | "after"
  | "checkMultiSig"
  | "bytes"
  | "size"


export type Opcode = string // for now

export type BinaryOperator = ComparisonOperator

export type Instruction = BinaryOperator | FunctionName

// slightly hackish runtime type guard

export function isInstruction(
  instructionName: Instruction | string
): instructionName is Instruction {
  const opcodes = getOpcodes(instructionName as Instruction)
  return opcodes !== undefined
}

export function getOpcodes(instruction: Instruction): Opcode[] {
  switch (instruction) {
    case "checkSig":
      return ["CHECKSIG"]
    case "checkDataSig":
      return ["CHECKDATASIG"]
    case "ripemd160":
      return ["RIPEMD160"]
    case "sha1":
      return ["SHA1"]
    case "sha256":
      return ["SHA256"]
    case "older":
      return ["CHECKSEQUENCEVERIFY", "DROP", "1"] // will get special treatment
    case "after":
      return ["CHECKLOCKTIMEVERIFY", "DROP", "1"] // will get special treatment
    case "checkMultiSig":
      return ["CHECKMULTISIG"] // will get special treatment
    case "==":
      return ["EQUAL"]
    case "!=":
      return ["EQUAL", "NOT"]
    case "bytes":
      return []
    case "size":
      return ["SIZE", "SWAP", "DROP"]
    case ">":
      return ["GREATERTHAN", "DROP", "1"]  
    case "<":
      return ["LESSTHAN", "DROP", "1"]  

  }
}

export function getTypeSignature(instruction: Instruction): TypeSignature {
  switch (instruction) {
    case "checkSig":
      return createTypeSignature(["PublicKey", "Signature"], "Boolean")
    case "checkDataSig":
      return createTypeSignature(["PublicKey", "Bytes", "Signature"], "Boolean")
    case "older":
      return createTypeSignature(["Duration"], "Boolean")
    case "after":
      return createTypeSignature(["Time"], "Boolean")
    case "size":
      return createTypeSignature(["Bytes"], "Integer")
    case "checkMultiSig":
      return createTypeSignature(
        [
          { type: "listType", elementType: "PublicKey" },
          { type: "listType", elementType: "Signature" }
        ],
        "Boolean"
      )
    case "==":
    case "!=":
    case ">": 
    case "<":
      throw new Error("should not call getTypeSignature on == or !=")
    case "ripemd160":
    case "sha1":
    case "sha256":
      throw new Error("should not call getTypeSignature on hash function")
    case "bytes":
      throw new Error("should not call getTypeSignature on bytes function")
  }
}
