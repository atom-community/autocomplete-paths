'use babel'

import { exec } from 'child_process'

export function execPromise(cmd, options) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
      if (err) {
        return reject(err);
      }
      resolve(stdout);
    });
  });
}

// fast merge function
// https://uilicious.com/blog/javascript-array-push-is-945x-faster-than-array-concat/
export function merge(arr1: Array<any>, arr2: Array<any>) {
  if (!arr2.length) return
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
