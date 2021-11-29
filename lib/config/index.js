import { OptionScopes } from "./option-scopes"

export const config = {
  normalizeSlashes: {
    type: "boolean",
    description: "Replaces backward slashes with forward slashes on windows (if possible)",
    default: true,
  },
  maxFileCount: {
    type: "number",
    description: "The maximum amount of files to be handled",
    default: 2000,
  },
  suggestionPriority: {
    type: "number",
    description:
      "Suggestion priority of this provider. If set to a number larger than or equal to 1, suggestions will be displayed on top of default suggestions.",
    default: 2,
  },
  followSymlinks: {
    type: "boolean",
    default: false,
    description: "Follow directory symlinks. Disable if you have a self-referencing symlink.",
  },
  imagePreview: {
    type: "boolean",
    default: false,
    description: "Show preview icon for images.",
  },
  ignoredNames: {
    type: "boolean",
    default: true,
    description: "Ignore items matched by the `Ignore Names` core option.",
  },
  ignoreSubmodules: {
    type: "boolean",
    default: false,
    description: "Ignore submodule directories.",
  },
  ignoredPatterns: {
    type: "array",
    default: [],
    items: {
      type: "string",
    },
    description: "Ignore additional **glob** or file path patterns.",
  },
  ignoreBuiltinScopes: {
    type: "boolean",
    default: false,
    description: "Ignore built-in scopes and use only scopes from user configuration.",
  },
  scopes: {
    type: "array",
    default: [],
    items: {
      type: "object",
      properties: {
        scopes: {
          type: ["array"],
          items: {
            type: "string",
          },
        },
        prefixes: {
          type: ["array"],
          items: {
            type: "string",
          },
        },
        extensions: {
          type: ["array"],
          items: {
            type: "string",
          },
        },
        relative: {
          type: "boolean",
          default: true,
        },
        replaceOnInsert: {
          type: "array",
          items: {
            type: "array",
            items: {
              type: ["string", "string"],
            },
          },
        },
      },
    },
  },
}

const keys = Object.keys(OptionScopes)
for (let i = 0, len = keys.length; i < len; i++) {
  config[keys[i]] = {
    type: "boolean",
    default: false,
  }
}
