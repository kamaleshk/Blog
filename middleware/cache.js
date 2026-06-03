const redisClient = require("../config/redis");

exports.cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    try {
      const cacheResponse = await redisClient.get(key);
      if (cacheResponse) {
        return res.json({
          sucess: true,
          cached: true,
          data: JSON.parse(cacheResponse),
        });
      }
      console.log("Request is not cached");

      const originalJson = res.json.bind(res);

      res.json = async (data) => {
        const cacheData = redisClient.setEx(
          key,
          duration,
          JSON.stringify(data),
        );

        originalJson({
          success: true,
          cached: false,
          data,
        });
      };
      next();
    } catch (error) {
      console.log(err);
      next();
    }
  };
};

exports.clearCache = async (pattern) =>{
  try{
    const keys = await redisClient.keys(pattern);
    if(keys.length > 0){
      await redisClient.del(keys);
      console.log("Successfully deleted the cache")
    }
    
  }catch(error){
    console.log("Error while clear cache",err)
  }
}
