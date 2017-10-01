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
