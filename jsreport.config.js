module.exports = {
  name: 'fs-store-azure-sb-sync',
  main: 'lib/main.js',
  dependencies: ['templates', 'fs-store'],
  optionsSchema: {
    extensions: {
      'fs-store': {
        type: 'object',
        properties: {
          sync: {
            type: 'object',
            properties: {
              provider: { type: 'string', enum: ['azure-sb'] }
            }
          }
        }
      },
      'fs-store-azure-sb-sync': {
        type: 'object',
        properties: {
          connectionString: { type: 'string' },
          topic: { type: 'string' },
          subscription: { type: 'string' }
        }
      }
    }
  }
}
