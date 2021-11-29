/** @babel */

import { createRunner } from "atom-jasmine3-test-runner"

// optional options to customize the runner
const extraOptions = {
  specHelper: {
    atom: true,
    attachToDom: true,
    customMatchers: true,
  },
}

export default createRunner(extraOptions)
