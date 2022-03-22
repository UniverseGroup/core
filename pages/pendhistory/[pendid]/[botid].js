import cookie from "cookie";
import jwt from "jsonwebtoken";
import Bot from "../../../models/bot";
import PendBot from "../../../models/pendbot";
import User from "../../../models/user";
import dbConnect from "../../../lib/dbConnect";
import HeadTag from "../../../components/headtag";
import styles from "../../../styles/Addbot.module.css";
import Typography from "@mui/material/Typography";
import dynamic  from "next/dynamic";
import PermissionError from "../../403";
import Image from "next/image";
import Button from "@mui/material/Button";
import {Alert, AlertTitle, Divider} from "@mui/material";
import Box from "@mui/material/Box";
import {BiBadgeCheck} from "react-icons/bi";
import cdstyles from "../../../styles/Users.module.css";
import {IoMdCopy} from "react-icons/io";
import StickyFooter from "../../../components/Footer";
import useCopyClipboard from "react-use-clipboard";
import {useRouter} from "next/router";
import {BsCheck2Circle} from "react-icons/bs";
import Link from "next/link";
import {discordUrls} from "../../../lib/DiscordTool"
const ResponsiveAppBar = dynamic(() => import("../../../components/navbar"));
const Markdownviewer = dynamic(() => import("../../../components/markdownviewer"));
export async function getServerSideProps({req, res, query}) {
    let key = null;
    await dbConnect();
    try {
        const cookies = cookie.parse(req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY)
    } catch {
        // key = null;
        res.writeHead(302, { Location: discordUrls.login })
        return res.end()
    }
    const PendBotDB = await PendBot.findOne({id:query.pendid},{_id:0}).lean() || null
    const BotDB = await Bot.findOne({botid:query.botid},{_id:0}).lean() || null
    const ownerdata = await User.findOne({userid:PendBotDB.ownerid},{bots:0,_id:0}).lean()

    return {
        props: {
            user: key,
            pendbot: PendBotDB,
            bot: BotDB,
            owner: ownerdata
        }
    }
}
const PendBotPage = ({...data}) => {
    const user = data.user;
    const pendbot = data.pendbot;
    const botdata = data.bot;
    const owner = data.owner;
    const router = useRouter();
    if(pendbot===null||botdata===null||owner===null) {
        const userdata ={
            id:user?.id,
            username:user?.username,
            discriminator:user?.discriminator,
            avatar:user?.avatar
        }
        return <PermissionError data={userdata}/>
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [copied,setCopied] = useCopyClipboard(pendbot.botdescription,{
        successDuration: 1000
    })
    console.log(owner)
    return(
        <div style={{padding:'0'}}>
            <ResponsiveAppBar userdata={user}/>
            <HeadTag title={botdata.botname+"'s Pend history"} img={botdata.botavatar+"?size=256"} description={botdata.slug} url={process.env.BASE_URL}/>
            <main className={styles.form} style={{marginBottom: '5em',minHeight:'100%',overflowX:'hidden'}}>
                {
                    pendbot.deny ? (
                        <Alert severity='error' style={{marginTop:'2em'}}>
                            <AlertTitle>해당봇은 심사에서 반려되었습니다. 사유는 아래와 같습니다.</AlertTitle>
                            <strong>{pendbot.denyReason}</strong>
                        </Alert>
                    ) : pendbot.pending ? (
                        <Alert severity='error' style={{marginTop:'2em'}}>
                            <AlertTitle>해당봇은 심사대기중입니다.</AlertTitle>
                        </Alert>
                    ) : pendbot.approved?(
                        <Alert severity='success' style={{marginTop:'2em'}}>
                            <AlertTitle>해당봇은 심사에서 승인되었습니다.</AlertTitle>
                            <Link href={'/bots/'+botdata.botid}>
                                <Button variant="contained" color="primary" style={{marginTop:'1em'}}>
                                    봇 페이지로 이동
                                </Button>
                            </Link>
                        </Alert>
                    ) : (
                        <Alert severity='error' style={{marginTop:'2em'}}>
                            <AlertTitle>현재 상태를 알수없습니다.</AlertTitle>
                        </Alert>
                    )
                }
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginBottom:'1em',marginTop:'1em',columnGap:"1em"}}>
                        <Image quality={100} width={256} height={256} src={`/api/imageproxy?url=${encodeURIComponent(botdata.botavatar+"?size=512")}`}/>
                        <div style={{flexGrow:'1',textAlign:'left',paddingLeft:'1.25em',paddingRight:'1.25em',paddingBottom:'3em',paddingTop:'3em'}}>
                            <Typography variant="h4" style={{fontWeight:'bold'}}>{botdata.botname}</Typography>
                            <Typography variant="h6" style={{fontWeight:'bold'}}>{pendbot.slug}</Typography>
                        </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Button variant="contained" color={copied?"success":"primary"} style={{width:'15em'}} size="large" onClick={setCopied}>{copied?(<><BsCheck2Circle/>복사됨</>):(<><IoMdCopy/> 상세정보 복사하기</>)}</Button>
                    </div>
                </div>
                <Divider style={{marginTop: '1rem'}}/>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'1em',marginTop:'1em',columnGap:"1em"}}>
                    <Box sx={{
                        width: 'auto',
                        minHeight: '150vh',
                        minWidth:'70%',
                        height: 'auto',
                        backgroundColor: 'white',
                        borderRadius: '0.5em',
                        border: '1px solid #6e6d6d',
                        padding: '0.8em',
                        overflow: 'auto'
                    }}><Markdownviewer value={pendbot.botdescription}/></Box>
                    <div style={{marginLeft:'0.5em',width:'100%'}}>
                        <p>정보</p>
                        <Box sx={{
                            width: 'auto',
                            minHeight: '7em',
                            minWidth:'20em',
                            height: 'auto',
                            backgroundColor: 'white',
                            borderRadius: '0.5em',
                            border: '1px solid #6e6d6d',
                            padding: '1em',
                            overflow: 'auto',
                        }}>
                            <div style={{display:'flex',justifyContent:'space-between',alignContent:'center'}}>
                                <p style={{fontSize:'1.3em',margin:'0'}}><strong>접두사</strong></p>
                                <p style={{fontSize:'1.3em',margin:'0'}}>{botdata.prefix}</p>
                            </div>
                            {
                                botdata.discordVerified?(
                                    <>
                                        <div style={{display:'flex',justifyContent:'space-between',alignContent:'center',marginTop:'0.7em'}}>
                                            <p style={{fontSize:'1.3em',margin:'0'}}><strong>디스코드에서 인증됨</strong></p>
                                            <p style={{fontSize:'1.3em',margin:'0'}}><BiBadgeCheck size="1.2em" color="#7289da"/></p>
                                        </div>
                                    </>
                                ):null
                            }
                        </Box>
                        <p>카테고리</p>
                        <Box sx={{
                            display:'flex',
                            flexWrap:'wrap',
                            columnGap:'0.3em',
                        }}>
                            {
                                botdata.category.map((category,index)=>{
                                    return(
                                        <>
                                            <div style={{backgroundColor:'#6b6b6b',padding:'1em',borderRadius:'0.8em',height:'1.3em',display:'flex',justifyContent:'flex-start',alignItems:'center',columnGap:'0.2em'}}>
                                                <strong>{category.label}</strong>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </Box>
                        <p>신청자</p>
                        <Box sx={{
                            display:'flex',
                            flexWrap:'wrap',
                            columnGap:'0.3em',
                        }}>
                            <div onClick={()=>router.push('/users/'+pendbot.ownerid)} className={cdstyles.Card} style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginBottom:'1em',marginTop:'1em',columnGap:"1em",backgroundColor:'gray',borderRadius:'8px',padding:'5px',width:'100%',height:'6.2em',color:'inherit'}}>
                                <Image quality={100} width={80} height={80} src={`/api/imageproxy?url=${encodeURIComponent(owner.useravatar+"?size=512")}`}/>
                                <div style={{flexGrow:'1',textAlign:'left',paddingLeft:'1.25em',paddingRight:'1.25em',paddingBottom:'3em',paddingTop:'3em'}}>
                                    <Typography variant="h6" style={{fontWeight:'bold'}}>{owner.username}#{owner.discriminator}</Typography>
                                </div>
                            </div>
                        </Box>
                    </div>
                </div>

            </main>
            <StickyFooter/>
        </div>
    )
}
export default PendBotPage;
