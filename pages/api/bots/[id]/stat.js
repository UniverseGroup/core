import rateLimit from '../../../../utils/rate-limit.js';
import dbConnect from '../../../../lib/dbConnect.js';
import Bot from '../../../../models/bot.js';
const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second

})
export default async (req,res)=>{
    const {query:{id},method,headers,cookies} = req;
    const {servers,users,commands}=req.body;
    await dbConnect()
    switch (method){
        case 'POST':
            console.log(cookies)
            const bot_token=headers.authorization
            if(!bot_token){
                res.status(400).json({error:'No token provided'})
                return
            }
            try {
                await limiter.check(res,1,bot_token);
            } catch (error) {
                console.log(error)
                return res.status(429).json({
                    status:429,
                    message:'Too many requests'
                })
            }
            if(!servers&&!users) return res.status(400).json({
                status:400,
                message:'Bad request'
            })
            const bot = await Bot.findOne({token:bot_token,botid:id})
            if(!bot) return res.status(404).json({
                status:404,
                message:'Bot not found'
            })
            const newtimes = new Date()
            const format_time = `${newtimes.getMonth()+1}/${newtimes.getDate()}`
            await Bot.findOneAndUpdate({token:bot_token},{$set:{
                guilds:servers,
                users:users,
            }},{new:true})
            if(commands){
                await Bot.findOneAndUpdate({token:bot_token},{$push:{
                        commands: {commands:commands,time:format_time}
                    }},{new:true})
            }
            res.status(200).json({
                status:200,
                message:'Success'
            })
            break;
        default:
            res.status(405).json({
                status:405,
                message:'Method not allowed'
            })
            break;



    }

}
