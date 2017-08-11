'use babel'

export default {
  normalizeSlashes: {
    type: 'boolean',
    description: 'Replaces backward slashes with forward slashes on windows (if possible)',
    default: true
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
