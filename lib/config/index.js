'use babel'

export default {
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
