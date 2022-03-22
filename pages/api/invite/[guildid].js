import jwt from "jsonwebtoken";
import {JoinServer} from "../../../lib/DiscordTool";
export default async (req,res)=>{
    const {method,query,cookies}=req;
    switch (method){
        case"GET":
            if(!query.guildid){
                res.status(400).json({
                    status:400,
                    message:"Bad Request",
                    data:{
                        error:"guildid is required"
                    }
                });
                return;
            }
            const user = cookies.token;
            if(user===undefined){
                return res.status(401).json({
                    message:'not logged in'
                });
            }
            const userdata = jwt.verify(user, process.env.JWT_KEY)
            const Join = (await (await JoinServer({guildId:query.guildid, userId:userdata.id, accessToken:userdata.access_token})).json());
            console.log(Join);
            res.status(200).json({
                status: 200,
                message: "Success",
                data: Join
            });
            break;
        default:
            res.setHeader('Allow',['POST']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }

}
