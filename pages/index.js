import styles from '../styles/Home.module.css'
//import ResponsiveAppBar from "../components/navbar";
import cookie from "cookie";
import jwt from "jsonwebtoken";
//import StickyFooter from "../components/Footer";
import Typography from "@mui/material/Typography";
import Bot from "../models/bot";
import dbConnect from "../lib/dbConnect";
import HeadTag from "../components/headtag";
import dynamic from "next/dynamic";
import StickyFooter from "../components/Footer";
const BotCard = dynamic(() => import("../components/BotCard"));
const ResponsiveAppBar = dynamic(() => import("../components/navbar"));
//const StickyFooter = dynamic(() => import("../components/Footer"));
export async function getServerSideProps(ctx) {
  let key = null;
  await dbConnect();
  try {
    const cookies = cookie.parse(ctx.req.headers.cookie);
    const user = cookies.token;
    key = jwt.verify(user, process.env.JWT_KEY);
  } catch {
    key = null;
  }
  const bots = await Bot.find({approved:true},{_id:0,token:0}).lean();
  console.log(bots);
  // bots._id = bots._id.toString();
  return {
    props: {
      user: key,
      bot: bots
    }
  }
}
export default function Home({...key}) {
  const data = key.user;
  const botdata =key.bot
  console.log(botdata)
  // useEffect(()=>{
  //   if(!data){
  //     router.replace(`https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=identify%20email`)
  //   }
  // })
  return (
    <div className={styles.container}>
      <ResponsiveAppBar userdata={data}/>
      <HeadTag title='메인' img={process.env.NORMAL_IMG} description='다양한 봇과 서버가 모여 만들어진 공간, Universe
' url={process.env.BASE_URL}/>
      <main className={styles.main}>
        <Typography variant="h3" sx={{fontFamily: 'Do Hyeon'}} className={styles.title}>
            다양한 봇과 서버가 모여 만들어진 공간.<br/>
          이곳{" "}<strong>UNIVERSE</strong>에서 다양한 봇과 서버를 찾아보세요!
        </Typography>

        <div style={{display:'inline-grid',marginTop: '2rem',marginBottom: '2rem'}}>
          <Typography variant="h4" sx={{fontFamily: 'Do Hyeon'}}>
            🤖 봇 리스트
          </Typography>
          <div className={styles.grid} style={{gap:'1em'}}>
            <BotCard bot={botdata.slice(0,5)}/>
          </div>
        </div>
      </main>
      <StickyFooter/>
    </div>
  )
}
