'use strict'

const redis = require('redis')

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

const redisClient = redis.createClient(redisUrl)

module.exports = redisClient
