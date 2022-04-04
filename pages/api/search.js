import dbConnect from '../../lib/dbConnect';
import Bot from '../../models/Bot';
import {getUserData} from "../../lib/DiscordTool"


export default async (req,res)=>{
    await dbConnect()
    const {query:{q,bots,servers},method} = req;
    switch (method){
        case 'GET':
            const bots = await Bot.find({botname:{ $regex: '.*' + q + '.*' , $options : 'i'}},{botname:1,botid:1,botavatar:1,slug:1,_id:0}).limit(10).lean()
            if(!bots) return res.status(404).json([])
            res.status(200).json(bots)
            break;
    }
}
