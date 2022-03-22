import dbConnect from "../../../../lib/dbConnect";
import User from "../../../../models/User";

export default async (req, res) => {
  await dbConnect();
  const { query: {id},method } = req;
  switch (method){
      case 'GET':
          const user = await User.findOne({userid:id},{_id:0,__v:0,hearts:0}).lean();
          if(!user) {
              return res.status(404).json({message: "User not found"});
          }
          res.status(200).json(user);
          break;
      default:
          res.status(405).json({msg:'Method not allowed'});
  }
};
