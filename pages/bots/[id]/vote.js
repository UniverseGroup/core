import dbConnect from "../../../lib/dbConnect";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Bot from "../../../models/bot";
import User from "../../../models/user"
import discordUrls from "../../../lib/DiscordTool";
import ResponsiveAppBar from "../../../components/navbar";
import StickyFooter from "../../../components/Footer";
import styles from "../../../styles/Home.module.css";
import HeadTag from "../../../components/headtag";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Image from "next/image"
import {getToken} from "../../../lib/Csrf";
import {useRouter} from "next/router";
import {useRef, useState} from "react";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
import Link from "next/link";
import { setNextUrl } from "../../../lib/_nextUrl";
export async function getServerSideProps({ req, res, query }) {
    let key = null;
    await dbConnect()
    try {
        const cookies = cookie.parse(req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY)
    } catch {
        // key = null;
        setNextUrl(req, res, '/bots/'+query.id+'/vote')
        res.writeHead(302, { Location: discordUrls.login })
        return res.end()
    }
    const csrf = getToken(req,res);
    const bot = await Bot.findOne({ botid: query.id }, { _id: 0, __v: 0 }).lean()
    const user = await User.findOne({userid:key?.id},{_id:0}).lean()
    return {
        props: {
            user: key,
            bot: bot,
            csrf: csrf,
            votes:user.hearts
        }
    }
}

const BotVotePage = ({...data}) => {
    console.log(data)
    const userdata = data.user
    const botdata = data.bot
    const csrf = data.csrf
    const votes = data.votes
    const router = useRouter()
    const [hcaptcha, setHcaptcha] = useState('')
    const [touchedhcaptcha, setTouchedHcaptcha] = useState(false)
    let captchalef = useRef(null)
    return (
        <div className={styles.container}>
            <ResponsiveAppBar userdata={userdata}/>
            <HeadTag title={`${botdata.botname} 추천페이지`} img={botdata.botavatar}
                     description={`${botdata.botname} 추천하기`}
                     url={process.env.BASE_URL+'/bots/'+botdata.botid+'/vote'}/>
            <main className={styles.main}>
                <Link href={`/bots/${botdata.botid}`} passHref={true}><Typography variant="h4" component="h2"  color='blue' style={{display:'flex',alignItems:'center',
                    position:'relative',top:'2.5em',fontFamily:'Do Hyeon',cursor:'pointer'}}>
                    <MdOutlineKeyboardBackspace size={55} /> {botdata.botname} 으로 돌아가기
                </Typography></Link>
                {/*<div style={{textAlign:'center'}}>*/}
                {/*    <Image src={`/api/imageproxy?url=${encodeURIComponent(botdata.botavatar+"?size=512")}`} width={128} height={128}/>*/}
                {/*</div>*/}
                {
                    botdata.banned?(
                        <Typography variant="h4" component="h2" className={styles.title} color='red'>
                            <Image alt='botimg' src={`/api/imageproxy?url=${encodeURIComponent(botdata.botavatar+"?size=512")}`} width={256} height={256}/><br/>
                            <strong>{botdata.botname} 은 정지된 봇입니다.</strong><br/>
                            정지사유: {botdata.bannedreason}
                        </Typography>
                    ):(
                        <>
                            <Typography variant="h3" sx={{fontFamily: 'Do Hyeon'}} className={styles.title} style={{marginBottom:'1em'}}>
                                <Image alt='botimg' src={`/api/imageproxy?url=${encodeURIComponent(botdata.botavatar+"?size=512")}`} width={256} height={256}/><br/>
                                {botdata.botname} 추천하기<br/>
                                추천을 하여 봇 개발자를 응원해주세요!
                            </Typography>
                            <div style={{textAlign:'center'}}>
                                <Typography variant="h3" sx={{fontFamily: 'Do Hyeon'}} style={{marginBottom:'1em'}}>👍 : {botdata.hearts}</Typography>
                                <HCaptcha sitekey={process.env.HCAPTCHA_SITE_KEY} ref={captchalef} onVerify={(token) => {
                                    setHcaptcha(token)
                                    setTouchedHcaptcha(true)
                                }}/>
                                {
                                    votes.includes(botdata.botid) ? (
                                        <Button variant="contained" color='primary' size="large" sx={{minWidth:'20em'}} onClick={()=>{
                                            if(!touchedhcaptcha)return alert('캡챠인증을 해주세요.')
                                            captchalef.current?.resetCaptcha()
                                            fetch('/api/bots/'+botdata.botid+'/vote', {
                                                method: 'DELETE',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json',
                                                    'X-Requested-With': 'XMLHttpRequest',
                                                    'X-CSRF-TOKEN': csrf
                                                },
                                                body: JSON.stringify({
                                                    hcaptcha: hcaptcha
                                                })
                                            }).then(res=>{
                                                if(res.status===200){
                                                    router.reload()
                                                }else{
                                                    alert(res.message)
                                                }
                                            })
                                        }}>이미 추천하셨습니다</Button>
                                    ) : (
                                        <Button variant="contained" color='primary' size="large" sx={{minWidth:'20em'}} onClick={()=>{
                                            if(!touchedhcaptcha)return alert('캡챠인증을 해주세요.')
                                            captchalef.current?.resetCaptcha()
                                            fetch('/api/bots/'+botdata.botid+'/vote', {
                                                method: 'PUT',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json',
                                                    'X-Requested-With': 'XMLHttpRequest',
                                                    'X-CSRF-TOKEN': csrf
                                                },
                                                body: JSON.stringify({
                                                    hcaptcha: hcaptcha
                                                })
                                            }).then(res=>{
                                                if(res.status===200){
                                                    router.reload()
                                                }else{
                                                    alert(res.message)
                                                }
                                            })
                                        }}>👍 추천하기 👍</Button>
                                    )
                                }
                            </div>
                        </>

                            )
                        }

            </main>
            <StickyFooter/>
        </div>
    )
}
export default BotVotePage;
