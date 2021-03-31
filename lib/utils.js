"use babel"

// exec
import { exec as execRaw } from "child_process"
import { promisify } from "util"
export const exec = promisify(execRaw)
import { constants } from "buffer"
export const MAX_STRING_LENGTH = constants.MAX_STRING_LENGTH

// fast merge function
// https://uilicious.com/blog/javascript-array-push-is-945x-faster-than-array-concat/
export function merge(arr1: Array<any>, arr2: Array<any>) {
  if (!arr2.length) {
    return
  }
  Array.prototype.push.apply(arr1, arr2)
}

// get unique entries of an array
export function unique(arr: Array<any>) {
  return [...new Set(arr)]
}

// fast union function (replacement for _.union)
export function union(arr1: Array<any>, arr2: Array<any>) {
  merge(arr1, arr2)
  return unique(arr1)
}
