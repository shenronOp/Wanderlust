const redis=require("ioredis")
const client=new redis(process.env.REDIS_URL)
module.exports=client;