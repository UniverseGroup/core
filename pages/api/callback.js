import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import dbConnect from "../../lib/dbConnect";
import User from "../../models/user";
import {discordUrls} from "../../lib/DiscordTool"
import { getNextUrl,destoryNextUrl } from '../../lib/_nextUrl';
export default async (req, res) => {
    await dbConnect()
    const code = req.query.code;
    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        code,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: 'authorization_code',
        scope: 'identify email guilds guilds.join'
    })
    const token = (await (await fetch(discordUrls.token, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })).json());
    const userinfo = (await (await fetch(discordUrls.me, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token['access_token']}`
        }
    })).json())
    console.log(token)

    if(userinfo.message==='401: Unauthorized'){
        res.writeHead(302, {
            Location: '/'
        })
        return res.end()
    }

    const useravatar_format = userinfo&&userinfo.avatar.startsWith("a_") ? "gif" : "webp"
    const useravatar =userinfo&&`https://cdn.discordapp.com/avatars/${userinfo.id}/${userinfo.avatar}.${useravatar_format}`
    await User.findOneAndUpdate({userid: userinfo.id},{
        userid: userinfo.id,
        username: userinfo.username,
        discriminator: userinfo.discriminator,
        useravatar: useravatar,
    },{upsert: true, new: true})
    const userdata = await User.findOne({userid: userinfo.id},{_id:0}).lean()
    userinfo.access_token = token['access_token']
    userinfo.refresh_token = token['refresh_token']
    userinfo.permission = userdata && userdata.permissions
    console.log(userinfo)
    const user = jwt.sign(userinfo, process.env.JWT_KEY);
    const cookies = new Cookies(req, res);
    cookies.set('token', user, {
        httpOnly: false
    })
    const next_url = getNextUrl(req, res);
    destoryNextUrl(req, res);
    res.redirect(next_url)
}
