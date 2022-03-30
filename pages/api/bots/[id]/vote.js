import dbConnect from "../../../../lib/dbConnect";
import Bot from "../../../../models/bot";
import User from "../../../../models/user";

export default async (req,res)=>{
    const {query:{id,userid},method,headers} = req;
    //await dbConnect();
    switch (method){
        case 'PUT':
            console.log(headers)
            res.status(200).json({
                message:`Voted for bot ${id}`
            })
            break
        default:
            res.status(405).send(`Method ${method} Not Allowed`)
    }

}
