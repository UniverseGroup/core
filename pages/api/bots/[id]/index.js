import dbConnect from "../../../../lib/dbConnect";
import Bot from "../../../../models/Bot";
import {FetchUrl} from "../../../../lib/fetchTool";

export default async (req, res) => {
    await dbConnect();
    const {query: {id}, method,headers,cookies} = req
    const {
        longdesc, botprefix, siteurl, opensource, serverurl, inviteurl, shortdesc,
        category, library, captcha
    } = req.body;
    switch (method) {
        case 'PUT':
            if(headers.referer!==process.env.BASE_URL+'addbot'){
                return res.status(403).json({message:"Forbidden"})
            }
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
        case 'GET':
            const botData = await Bot.findOne({botid: id},{_id: 0, __v: 0,token: 0});
            res.status(200).json(botData);
            break;
    }

};
