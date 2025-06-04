const redisClient = require("../config/redis");

const rateLimiter = async(req, res, next) => {

  try{
      const ip = req.ip;
      const currentTime = Date.now();

      const count = await redisClient.incr(ip);
      if(count>60){
        throw new Error("Rate limit exceeded. Please try again later.");
      }

      if(count ===1) {
        await redisClient.expire(3600); // Set expiration time to 1 hour (3600 seconds)
      }

      next();
  }
  catch(err) {
    console.error("Error in rate limiter:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports =rateLimiter;