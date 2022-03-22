import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import Bot from "../../../../models/Bot";
import {FetchUrl} from "../../../../lib/fetchTool";
export default async (req, res) => {
    await dbConnect();
    const { query: { id }, method } = req;
    const { oldowner, botid,captcha } = req.body;
    switch (method) {
        case 'GET':
            const user = await User.findOne({ userid: id }, { _id: 0, __v: 0, hearts: 0 }).lean();
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
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
            await User.findOneAndUpdate({ userid: oldowner }, {$pull:{"bots":{botid:botid}}})
            const BotData = await Bot.findOne({botid: botid},{_id: 0, __v: 0,token: 0});
            BotData.token = ""
            const patch_bot = await User.findOneAndUpdate({userid: id}, {
                $push: {
                    bots: BotData
                }
            }, {new: true});
            res.status(200).json(patch_bot);
            break;
        default:
            res.status(405).json({ msg: 'Method not allowed' });
    }
};
