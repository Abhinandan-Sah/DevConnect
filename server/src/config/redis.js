const redis = require("redis")

const redisClient = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-16720.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 16720
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

module.exports = redisClient;
