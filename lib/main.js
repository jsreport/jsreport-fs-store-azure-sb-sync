const sync = require('./syncAzureServiceBus')

module.exports = (reporter, definition) => {
  const options = { ...definition.options }
  // avoid exposing connection string through /api/extensions
  definition.options = {}

  if (reporter.fsStore) {
    reporter.fsStore.registerSync('azure-sb', () => (sync({
      ...options,
      logger: reporter.logger,
      serialize: reporter.fsStore.serialize,
      parse: reporter.fsStore.parse
    })))
  }
}
