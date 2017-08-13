'use babel'

export default {
  normalizeSlashes: {
    type: 'boolean',
    description: 'Replaces backward slashes with forward slashes on windows (if possible)',
    default: true
  },
  maxFileCount: {
    type: 'number',
    description: 'The maximum amount of files to be handled',
    default: 2000
  },
  suggestionPriority: {
    type: 'number',
    description: 'Suggestion priority of this provider. If set to a number larger than or equal to 1, suggestions will be displayed on top of default suggestions.',
    default: 2
  },
  ignoredNames: {
    type: 'boolean',
    default: true,
    description: 'Ignore items matched by the `Ignore Names` core option.'
  },
  scopes: {
    type: 'array',
    default: [],
    items: {
      type: 'object',
      properties: {
        scopes: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        prefixes: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        extensions: {
          type: ['array'],
          items: {
            type: 'string'
          }
        },
        relative: {
          type: 'boolean',
          default: true
        },
        replaceOnInsert: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: ['string', 'string']
            }
          }
        }
      }
    }
  }
}
