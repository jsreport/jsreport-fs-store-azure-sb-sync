const sync = require('./syncAzureServiceBus')

module.exports = (reporter, definition) => {
  if (reporter.fsStore) {
    reporter.fsStore.registerSync('azure-sb', (options) => (sync(Object.assign({}, definition.options, { logger: reporter.logger }))))
  }
}
