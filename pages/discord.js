import dynamic from "next/dynamic";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import HeadTag from "../components/headtag";
import styles from '../styles/Home.module.css'
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import {CircularProgress} from "@mui/material/CircularProgress";
const ResponsiveAppBar = dynamic(() => import("../components/navbar"));
const StickyFooter = dynamic(() => import("../components/Footer"));
// const CircularProgress = dynamic(() => import('@mui/material/CircularProgress'));
// import {useState,useEffect} from "react";
import {JoinServer} from "../lib/DiscordTool";
// import fetch from "isomorphic-fetch";
import {useRouter} from "next/router";
export async function getServerSideProps(ctx) {
    let key = null;
    let joinstate = null;
    try {
        const cookies = cookie.parse(ctx.req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY)
    } catch {
        // key = null;
        ctx.res.writeHead(302, { Location: `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=guilds%20guilds.join%20identify%20email` })
        ctx.res.end()
    }
    try {
        // await fetch('/api/invite/'+process.env.OFFICIAL_GUILDID,{
        //     method: 'GET',
        // }).then(res => console.log(res.json()))
        await JoinServer({guildId:process.env.OFFICIAL_GUILDID, userId:key?.id, accessToken:key?.access_token})
        joinstate = true;
    } catch {
        joinstate = false;
    }

    return {
        props: {
            user: key,
            isJoin:joinstate
        }
    }
}
const Discord = ({...data}) => {
    const user = data.user;
    const joinstate = data.isJoin;
    const router = useRouter();
    // const [join,setJoin] = useState({err:false,isjoin:false,msg:null});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // const JoinToServer= async ()=>{
    //     try {
    //         // const stat = JoinServer({guildId:process.env.OFFICIAL_GUILDID, userId:user.id, accessToken:user.access_token});
    //         // const stat = fetch(`https://discord.com/api/guilds/${process.env.OFFICIAL_GUILDID}/members/${user.id}`, {
    //         //     method: 'PUT',
    //         //     headers: {
    //         //         Authorization: `Bot ${process.env.BOT_TOKEN}`,
    //         //         "Content-Type": "application/json",
    //         //     },
    //         //     body: JSON.stringify({
    //         //         access_token: user.access_token
    //         //     })
    //         // }).then(res => res.header("Access-Control-Allow-Origin", "*"))
    //         await fetch('/api/invite/'+process.env.OFFICIAL_GUILDID,{
    //             method: 'GET',
    //         }).then(res => console.log(res.json()))
    //         setJoin({err:false,isjoin:true,msg:"Successfully Joined"})
    //     } catch (e) {
    //         console.log(e);
    //         setJoin({err:true,isjoin:false,msg:e.message})
    //     }
    // }
    // useEffect(()=>{
    //     setTimeout(async ()=>{
    //         await JoinToServer()
    //     },1000)
    // },[])

    return (
        <div>
            <ResponsiveAppBar userdata={user}/>
            <HeadTag title="공식서버" img={process.env.NORMAL_IMG} description="공식서버 접속페이지입니다." url={process.env.BASE_URL+'discord'}/>
            <main className={styles.main}>
                <Typography variant="h3" sx={{fontFamily: 'Do Hyeon'}} className={styles.title}>
                    다양한 봇과 서버가 모여 만들어진 공간.<br/>
                    이곳{" "}<strong>UNIVERSE</strong>에서 다양한 봇과 서버를 찾아보세요!
                </Typography>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center",textAlign:'center'}}>
                    <div style={{margin:'auto'}}>
                        {
                            joinstate ?(
                                <>
                                    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                        <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                                        <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                    </svg>
                                    <Typography variant="h5" sx={{fontFamily: 'Do Hyeon',color:'green'}}>
                                        Successfully Joined
                                    </Typography>
                                </>
                                )

                                :
                                (
                                    <>
                                        <Typography variant="h5" sx={{fontFamily: 'Do Hyeon',color:'red'}}>
                                            Failed to Join or Already Joined
                                        </Typography>
                                        <Button variant="contained" color="warning" style={{width:'15em',marginTop:'1em'}} size="large" onClick={()=>router.reload()}>Retry?</Button>
                                    </>
                                )

                        }
                        <br/>
                        <Button variant="contained" color="primary" style={{width:'15em',marginTop:'1em'}} size="large" onClick={()=>router.back()}>Back</Button>
                    </div>
                </div>
            </main>
            <StickyFooter/>
        </div>
    )
}
export default Discord;
