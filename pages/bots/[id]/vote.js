import dbConnect from "../../../lib/dbConnect";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Bot from "../../../models/bot";
import discordUrls from "../../../lib/DiscordTool";
import ResponsiveAppBar from "../../../components/navbar";
import StickyFooter from "../../../components/Footer";
import styles from "../../../styles/Home.module.css";
import HeadTag from "../../../components/headtag";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Image from "next/image"
export async function getServerSideProps({ req, res, query }) {
    let key = null;
    await dbConnect()
    try {
        const cookies = cookie.parse(req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY)
    } catch {
        // key = null;
        res.writeHead(302, { Location: discordUrls.login })
        return res.end()
    }
    const bot = await Bot.findOne({ botid: query.id }, { _id: 0, __v: 0 }).lean()
    return {
        props: {
            user: key,
            bot: bot,
        }
    }
}

const BotVotePage = ({...data}) => {
    const userdata = data.user
    const botdata = data.bot
    return (
        <div className={styles.container}>
            <ResponsiveAppBar userdata={userdata}/>
            <HeadTag title={`${botdata.botname} 추천페이지`} img={botdata.botavatar}
                     description={`${botdata.botname} 추천하기`}
                     url={process.env.BASE_URL+'/bots/'+botdata.botid+'/vote'}/>
            <main className={styles.main}>
                {/*<div style={{textAlign:'center'}}>*/}
                {/*    <Image src={`/api/imageproxy?url=${encodeURIComponent(botdata.botavatar+"?size=512")}`} width={128} height={128}/>*/}
                {/*</div>*/}
                <Typography variant="h3" sx={{fontFamily: 'Do Hyeon'}} className={styles.title} style={{marginBottom:'1em'}}>
                    <Image alt='botimg' src={`/api/imageproxy?url=${encodeURIComponent(botdata.botavatar+"?size=512")}`} width={256} height={256}/><br/>
                    {botdata.botname} 추천하기<br/>
                    추천을 하여 봇 개발자를 응원해주세요!
                </Typography>
                <div style={{textAlign:'center'}}>
                    <Button variant="contained" color='error' sx={{minWidth:'20em'}} onClick={()=>{
                        fetch('/api/bots/'+botdata.botid+'/vote', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest',
                                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                            },
                        }).then(res=>res.json()).then(res=>{
                            if(res.success){
                                alert('추천이 완료되었습니다!')
                            }else{
                                alert(res.message)
                            }
                        })
                    }}>추천하기</Button>
                </div>
            </main>
            <StickyFooter/>
        </div>
    )
}
export default BotVotePage;
