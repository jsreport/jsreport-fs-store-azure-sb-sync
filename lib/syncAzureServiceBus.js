/* eslint no-path-concat: 0 */
const Promise = require('bluebird')
const azure = require('azure-sb')
const crypto = require('crypto')
const hostname = require('os').hostname()
const { serialize, parse } = require('jsreport-fs-store/lib/customUtils')
const hostId = 'jsreport-' + crypto.createHash('sha1').update(hostname + __dirname).digest('hex')

module.exports = ({ topic = 'jsreport', subscription = hostId, connectionString, logger }) => {
  if (!connectionString) {
    throw new Error('The fs store is configured to use azure service bus sync connectionString to sb is not ser. Use store.sync.connectionString or extensions.fs-store-azure-sb-sync.connectionString to set the proper value.')
  }

  const sbService = azure.createServiceBusService(connectionString)
  Promise.promisifyAll(sbService)

  return {
    async init () {
      logger.debug('fs store is initializing azure sb synchronization')
      logger.debug(`fs store is ensuring sb topic ${topic} exists`)
      await sbService.createTopicIfNotExistsAsync(topic)
      try {
        logger.debug(`fs store is ensuring sb subscription ${subscription} exists`)
        await sbService.createSubscriptionAsync(topic, subscription)
      } catch (e) {

      }
      this._initTime = new Date()
      this._listen().catch(logger.error.bind(logger))
    },

    async _listen () {
      try {
        const response = await sbService.receiveSubscriptionMessageAsync(topic, subscription)

        if (new Date(response.brokerProperties.EnqueuedTimeUtc) < this._initTime) {
          logger.debug(`fs store received sync message is out of date, skipping its processing`)
          return this._listen()
        }

        const message = parse(response.body)

        if (message.meta.source === subscription) {
          logger.debug(`fs store received sync message came from the same source, skipping its processing`)
          return this._listen()
        }

        logger.debug(`fs store processing sync message for action ${message.action}`)
        this.subscription(message)
        this._listen()
      } catch (e) {
        this._listen()
      }
    },

    subscribe (subscription) {
      this.subscription = subscription
    },

    publish (message) {
      logger.debug(`fs store publishing sync message ${message.action}`)
      const messageClone = Object.assign({}, message)
      messageClone.meta = {
        source: subscription
      }
      return sbService.sendTopicMessageAsync(topic, serialize(messageClone))
    },

    stop () {
    }
  }
}
