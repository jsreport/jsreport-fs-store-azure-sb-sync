/* eslint no-path-concat: 0 */
const Promise = require('bluebird')
const azure = require('azure-sb')
const crypto = require('crypto')
const hostname = require('os').hostname()
const hostId = crypto.createHash('sha1').update(hostname + __dirname).digest('hex')
console.log(hostId)

module.exports = ({ topicName = 'jsreport', subscriptionName = hostId, connectionString, logger }) => {
  if (!connectionString) {
    throw new Error('The fs store is configured to use azure service bus sync connectionString to sb is not ser. Use connectionString.sync.connectionString or fs-store-azure-sb-sync.connectionString to set the proper value.')
  }

  const sbService = azure.createServiceBusService(connectionString)
  Promise.promisifyAll(sbService)

  return {
    async init () {
      logger.debug('Initializing fs store azure sb synchronization')
      logger.debug(`Ensuring sb topic ${topicName} exists`)
      await sbService.createTopicIfNotExistsAsync(topicName)
      try {
        logger.debug(`Ensuring sb subscription ${subscriptionName} exists`)
        await sbService.createSubscriptionAsync(topicName, subscriptionName)
      } catch (e) {

      }
      this._initTime = new Date()
      this._listen().catch(logger.error.bind(logger))
    },

    async _listen () {
      try {
        const response = await sbService.receiveSubscriptionMessageAsync(topicName, subscriptionName)

        if (new Date(response.brokerProperties.EnqueuedTimeUtc) < this._initTime) {
          logger.debug(`Received sync message is out of date, skipping its processing`)
          return this._listen()
        }

        const message = JSON.parse(response.body)

        if (message.meta.source === subscriptionName) {
          logger.debug(`Received sync message came from the same source, skipping its processing`)
          return this._listen()
        }

        logger.debug(`Processing sync message for action ${message.action}`)
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
      logger.debug(`Publishing sync message ${message.action}`)
      const messageClone = Object.assign({}, message)
      messageClone.meta = {
        source: subscriptionName
      }
      return sbService.sendTopicMessageAsync(topicName, JSON.stringify(messageClone))
    },

    stop () {
    }
  }
}
