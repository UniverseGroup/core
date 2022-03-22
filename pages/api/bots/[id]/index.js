import dbConnect from "../../../../lib/dbConnect";
import Bot from "../../../../models/bot";
import User from "../../../../models/user";
//import PendBot from "../../../../models/pendbot";
import {FetchUrl} from "../../../../lib/fetchTool";
import {kickUser} from "../../../../lib/DiscordTool";
import pendbot from "../../../../models/pendbot";

export default async (req, res) => {
    await dbConnect();
    const {query: {id}, method,headers,cookies} = req
    const {
        longdesc, botprefix, siteurl, opensource, serverurl, inviteurl, shortdesc,
        category, library, captcha, owners
    } = req.body;
    switch (method) {
        case 'PUT':
            const user = cookies.token;
            if(user===undefined){
                return res.status(401).json({
                    message:'not logged in'
                });
            }
            const params = new URLSearchParams({
                secret: process.env.HCAPTCHA_SECRET_KEY,
                response:captcha,
            })
            const checkCaptcha = (await (await fetch(FetchUrl.captchaVerify,{
                method:'POST',
                body:params,
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })).json());
            if(!checkCaptcha.success){
                return res.status(403).json({message:"Captcha Failed"})
            }
            const bot = await Bot.findOneAndUpdate({botid: id}, {
                $set: {
                    botdescription: longdesc,
                    prefix: botprefix,
                    website: siteurl,
                    github: opensource,
                    support: serverurl,
                    invite: inviteurl,
                    slug: shortdesc,
                    category: category,
                    library: library
                }
            }, {new: true});
            res.status(200).json(bot);
            break;
        case 'PATCH':
            const patch_params = new URLSearchParams({
                secret: process.env.HCAPTCHA_SECRET_KEY,
                response:captcha,
            })
            const patch_checkCaptcha = (await (await fetch(FetchUrl.captchaVerify,{
                method:'POST',
                body:patch_params,
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })).json());
            if(!patch_checkCaptcha.success){
                return res.status(403).json({message:"Captcha Failed"})
            }
            const patch_bot = await Bot.findOneAndUpdate({botid: id}, {
                $set: {
                    owners: owners
                }
            }, {new: true});
            res.status(200).json(patch_bot);
            break;
        case 'DELETE':
            const delete_params = new URLSearchParams({
                secret: process.env.HCAPTCHA_SECRET_KEY,
                response:captcha,
            })
            const delete_checkCaptcha = (await (await fetch(FetchUrl.captchaVerify,{
                method:'POST',
                body:delete_params,
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                }
            })).json());
            console.log(delete_checkCaptcha)
            if(!delete_checkCaptcha.success){
                return res.status(403).json({message:"Captcha Failed"})
            }
            await User.updateMany({}, {$pull:{"bots":{botid:id}}})
            await Bot.findOneAndDelete({botid: id});
            await pendbot.deleteMany({botid: id});
            await kickUser(id,'Bot Deleted');
            res.status(200).json({message:"Deleted"});
        case 'GET':
            const botData = await Bot.findOne({botid: id},{_id: 0, __v: 0,token: 0});
            res.status(200).json(botData);
            break;
    }

};
