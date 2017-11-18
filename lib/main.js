const sync = require('./syncAzureServiceBus')

module.exports = (reporter, definition) => {
  if (reporter.fsStore) {
    reporter.fsStore.registerSync('azure-sb', (options) => (sync(Object.assign({ logger: reporter.logger }, options, definition.options))))
  }
}
