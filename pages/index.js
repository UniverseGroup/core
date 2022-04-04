import styles from '../styles/Home.module.css'
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Typography from "@mui/material/Typography";
import Bot from "../models/bot";
import dbConnect from "../lib/dbConnect";
import HeadTag from "../components/headtag";
import dynamic from "next/dynamic";
import StickyFooter from "../components/Footer";
import {BiRightArrowAlt} from "react-icons/bi";
import Link from "next/link";
const BotCard = dynamic(() => import("../components/BotCard"));
const ResponsiveAppBar = dynamic(() => import("../components/navbar"));
const SearchBar = dynamic(() => import("../components/Search"));
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
  const bots = await Bot.find({approved:true},{_id:0,token:0}).limit(5).lean();
  console.log(bots);
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
        {/*<section style={{display:'flex',flexWrap:'wrap',justifyContent:'center',position:'relative'}}>*/}
        {/*  <SearchBar/>*/}
        {/*</section>*/}
        <SearchBar/>
        <div style={{display:'inline-grid',marginTop: '2rem',marginBottom: '2rem'}}>
          <Typography variant="h4" sx={{fontFamily: 'Do Hyeon'}}>
            💎 초기 등록봇
          </Typography>
          <div className={styles.grid} style={{gap:'1em'}}>
            <BotCard bot={botdata} mode="EarlyBot"/>
          </div>
          <Typography variant="h4" sx={{fontFamily: 'Do Hyeon', marginTop:'3em'}}>
            🤖 봇 리스트
          </Typography>
          <div className={styles.grid} style={{gap:'1em'}}>
            <BotCard bot={botdata}/>
            <Link href={`/bots`}>
              <div className="anncard">
                <div className="anncard__body" style={{textAlign:'center',marginTop:'50%',marginBottom:'50%',color:"#7289da"}}>
                  <BiRightArrowAlt size="10em"/>
                  <Typography gutterBottom variant="h5" component="h2" sx={{fontFamily: 'Do Hyeon'}}>
                    더 많은 봇 보기
                  </Typography>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <StickyFooter/>
    </div>
  )
}
