import PendBot from "../../../../models/pendbot";
import Bot from "../../../../models/bot";
import User from "../../../../models/user";
import dbConnect from "../../../../lib/dbConnect";
import jwt from "jsonwebtoken";
import {getUserData,sendSubmitMessage} from "../../../../lib/DiscordTool";
import {Fetch,FetchUrl} from "../../../../lib/fetchTool"
export default async (req,res)=>{
    const {query:{id},method,body,headers,cookies} = req;
    await dbConnect();
    switch (method){
        case 'POST':
            try{
                if(headers.referer!==process.env.BASE_URL+'addbot'){
                    return res.status(403).json({message:"Forbidden"})
                }
                const user = cookies.token;
                if(user===undefined){
                    return res.status(401).json({
                        message:'not logged in'
                    });
                }
                const userdata = jwt.verify(user, process.env.JWT_KEY)
                const params = new URLSearchParams({
                    secret: process.env.HCAPTCHA_SECRET_KEY,
                    response:body.captcha,
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
                if(body.botid==='953110159247433758'){
                    return res.status(403).json({message:"You cannot submit this bot"})
                }
                const issubmit = await Bot.findOne({'botid':id});
                if(Boolean(issubmit)){
                    if(issubmit.approved){
                        return res.status(403).json({message:"Bot already approved"})
                    }
                }

                const submitid= Math.round(new Date().getTime()/1000)
                const submit_data = new PendBot(
                    {
                        id:submitid,
                        botid:body.botid,
                        ownerid:userdata.id,
                        prefix:body.botprefix,
                        botdescription:body.longdesc,
                        slug:body.shortdesc
                    }
                )
                const useravatar_format = userdata&&userdata.avatar.startsWith("a_") ? "gif" : "png"
                const useravatar =userdata&&`https://cdn.discordapp.com/avatars/${userdata.id}/${userdata.avatar}.${useravatar_format}`
                const botdata = await getUserData(body.botid)
                // const botavatar_format = botdata&&botdata.avatar.startsWith("a_") ? "gif" : "png"
                const botavatar =botdata&&`https://cdn.discordapp.com/avatars/${botdata.id}/${botdata.avatar}.png`
                if(!botdata.hasOwnProperty('bot')){
                    return res.status(403).json({
                        status:403,
                        message:"this user is not a bot"
                    })
                }
                const new_bot = new Bot(
                    {
                        botid:body.botid,
                        botname:botdata.username,
                        botdescription:body.longdesc,
                        botavatar:botavatar,
                        owners:[{id:userdata.id,username:userdata.username,discriminator:userdata.discriminator,avatar:useravatar}],
                        prefix:body.botprefix,
                        slug:body.shortdesc,
                        library:body.library,
                        invite:body.inviteurl?body.inviteurl:`https://discordapp.com/oauth2/authorize?client_id=${body.botid}&scope=bot&permissions=0`,
                        category:body.category,
                        website:body.website,
                        github:body.github,
                        support:body.support,
                        discordVerified:(botdata.public_flags===65536),
                    }
                )
                await User.findOneAndUpdate({userid:userdata.id},{$push:{bots:new_bot}})
                await submit_data.save();
                await new_bot.save();
                const send_msg = await sendSubmitMessage(userdata.id,userdata.username,userdata.discriminator,body.botid,botdata.username,botdata.discriminator,submitid)
                console.log(send_msg)
                return res.status(200).json({
                    status:200,
                    message:"Bot submitted"
                })
            }catch (e) {
                return res.status(403).json({
                    status:403,
                    message:e.message
                })
            }
        default:
            res.setHeader('Allow',['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
