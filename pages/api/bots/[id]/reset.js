import dbConnect from "../../../../lib/dbConnect";
import Bot from "../../../../models/bot";
import PendBot from "../../../../models/pendbot";
import {checkToken} from "../../../../lib/Csrf";
import jwt from "jsonwebtoken";
export default async (req,res)=>{
    const {query:{id},method,headers} = req;
    await dbConnect();
    switch (method){
        case 'POST':
            try{
                const _csrf = checkToken(req,res,headers['x-csrf-token']);
                if(!_csrf) return
                const pendbot = await PendBot.findOne({botid: id,approved:true}).lean()
                const token = jwt.sign({'botid':id,'ownerid':pendbot.ownerid}, process.env.JWT_KEY)
                const bot = await Bot.findOneAndUpdate({botid:id,token:req.body.token},{$set:{token:token}},{new:true}).lean()
                res.status(200).json({message:"success",data:bot})
            } catch (e) {
                res.status(500).json({message:"error",error:e.message})
            }
            break;
        default:
            res.status(405).json({message:"method not allowed"})
    }
}