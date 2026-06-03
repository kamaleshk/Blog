require("dotenv").config();
const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL
});

client.on("connect", ()=>{
  console.log("Redis connected")
});

client.on("error", (err)=>{
  console.log("Redis connection faile", err)
});

(async () =>{
  await client.connect();
  console.log("Successfully Redis connection establised")
})();

module.exports = client;