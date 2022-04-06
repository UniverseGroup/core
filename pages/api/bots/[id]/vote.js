import dbConnect from "../../../../lib/dbConnect";
import Bot from "../../../../models/bot";
import User from "../../../../models/user";
import {checkToken} from "../../../../lib/Csrf";
import {VerifyCaptcha} from "../../../../lib/Captcha";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export default async (req,res)=>{
    const {query:{id,userid},method,headers} = req;
    await dbConnect();
    switch (method){
        case 'PUT':
            try{
                const _csrf = checkToken(req,res,headers['x-csrf-token']);
                console.log(_csrf)
                if(!_csrf) return
                const _captcha = await VerifyCaptcha(req.body.hcaptcha);
                console.log(_captcha)
                if(!_captcha) return res.status(400).json({message:"Invalid Captcha"})
                const cookies = cookie.parse(headers.cookie);
                const user = cookies.token;
                const userdata = jwt.verify(user, process.env.JWT_KEY)
                await User.findOneAndUpdate({userid:userdata.id},{$push:{hearts:id}})
                await Bot.findOneAndUpdate({botid:id},{$inc:{hearts:1}})
                res.status(200).json({message:"success"})
            } catch (error) {
                res.status(400).json({message:error.message})
            }
            break
        case 'DELETE':
            try{
                const _csrf = checkToken(req,res,headers['x-csrf-token']);
                if(!_csrf) return
                const _captcha = await VerifyCaptcha(req.body.hcaptcha);
                if(!_captcha) return res.status(400).json({message:"Invalid Captcha"})
                const cookies = cookie.parse(headers.cookie);
                const user = cookies.token;
                const userdata = jwt.verify(user, process.env.JWT_KEY)
                await User.findOneAndUpdate({userid:userdata.id},{$pull:{hearts:id}})
                await Bot.findOneAndUpdate({botid:id},{$inc:{hearts:-1}})
                res.status(200).json({message:"success"})
            } catch (error) {
                res.status(400).json({message:error.message})
            }
            break
        case 'GET':
            try{
                const _user = await User.findOne({userid:userid}).lean()
                if(!_user || !_user.hearts.includes(id)) return res.status(400).json({status:400,message:"This User doesnot voted for this bot"})
                if(_user.hearts.includes(id)) return res.status(200).json({status:200,message:"This User have already voted for this bot"})
            } catch (e) {
                res.status(400).json({message:e.message})
            }
            break
        default:
            res.status(405).send(`Method ${method} Not Allowed`)
    }

}
