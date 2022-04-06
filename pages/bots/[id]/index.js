import cookie from "cookie";
import jwt from "jsonwebtoken";
import Bot from "../../../models/bot";
import dbConnect from "../../../lib/dbConnect";
import styles from "../../../styles/Addbot.module.css";
import cdstyles from "../../../styles/Users.module.css";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
import {BiBadgeCheck} from "react-icons/bi";
import Button from "@mui/material/Button";
import {Alert, AlertTitle, Divider} from "@mui/material";
import Box from "@mui/material/Box";
import HeadTag from "../../../components/headtag";
import Image from "next/image";
import dynamic from "next/dynamic";
import StickyFooter from "../../../components/Footer";
import {AiFillGithub} from "react-icons/ai";
import {RiDiscordFill} from "react-icons/ri";
import Link from "next/link";
import Tooltip from "@mui/material/Tooltip";
const Markdownviewer = dynamic(
    () => import("../../../components/markdownviewer")
);
const statuskr = {
    'online':'온라인',
    'idle':'자리비움',
    'dnd':'다른 용무중',
    'offline':'오프라인',
    'streaming':'스트리밍'
}
const statusColor = {
    'online':'#00bfa5',
    'idle':'#643da7',
    'dnd':'#643da7',
    'offline':'#643da7',
    'streaming':'#643da7'
}
const ResponsiveAppBar = dynamic(() => import("../../../components/navbar"));
const Botpage = ({...data}) => {
    console.log(data);
    const botdata =data.bot
    const userdata=data.user
    return(
        <div style={{padding:'0'}}>
            <ResponsiveAppBar userdata={userdata}/>
            <HeadTag title={botdata.botname} img={botdata.botavatar+"?size=256"} description={botdata.slug} url={process.env.BASE_URL+"bots/"+botdata.botid}/>
            <main className={styles.form} style={{marginBottom: '5em',minHeight:'100%',overflowX:'hidden'}}>
                {
                    botdata.banned ? (
                        <Alert severity='error' style={{marginTop:'2em'}}>
                            <AlertTitle>해당봇은 등록취소가 된 봇입니다. 사유는 아래와 같습니다.</AlertTitle>
                            <strong>{pendbot.bannedreason}</strong>
                        </Alert>
                    ) : !botdata.approved ? (
                        <Alert severity='error' style={{marginTop:'2em'}}>
                            <AlertTitle>해당봇은 심사대기 혹은 반려된 상태입니다.</AlertTitle>
                        </Alert>
                    ) : null
                }
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginBottom:'1em',marginTop:'1em',columnGap:"1em"}}>
                        <Image quality={100} width={256} height={256} src={`/api/imageproxy?url=${encodeURIComponent(botdata.botavatar+"?size=512")}`}/>
                        <div style={{flexGrow:'1',textAlign:'left',paddingLeft:'1.25em',paddingRight:'1.25em',paddingBottom:'3em',paddingTop:'3em'}}>
                            <div style={{padding:'1em',border:'2px #00bfa5 solid',borderRadius:'0.8em',minWidth:'7em',height:'1.3em',display:'flex',justifyContent:'flex-start',alignItems:'center',columnGap:'0.2em'}}>
                                <FontAwesomeIcon icon={faCircle} style={{color:statusColor[botdata.status],border:'2px #000000 solid',borderRadius:'100%'}}/><strong>{statuskr[botdata.status]}</strong>
                            </div>
                            <Typography variant="h4" style={{fontWeight:'bold'}}>{botdata.botname}</Typography>
                            <Typography variant="h6" style={{fontWeight:'bold'}}>{botdata.slug}</Typography>
                            <div style={{display:'flex',justifyContent:'flex-start',alignItems:'baseline'}}>
                                {
                                    botdata.badges.includes('EarlyBot')&&(
                                        <>
                                            <Tooltip title='초기 등록봇' arrow placement='bottom'>
                                                <div style={{width:'32px',height:'32px'}}>
                                                    <Image src='/earlytester.png' alt='earlytester' width={32} height={32}/>
                                                </div>
                                            </Tooltip>
                                        </>
                                    )
                                }
                                {
                                    botdata.discordVerified&&(
                                        <>
                                            <Tooltip title='디스코드 인증봇' arrow placement='bottom'>
                                                <div style={{width:'32px',height:'32px'}}>
                                                    <BiBadgeCheck size="2em" color="#7289da"/>
                                                </div>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                   <div style={{display:'flex',flexDirection:'column'}}>
                        <a href={botdata.invite} target='_blank' rel="noreferrer"><Button variant="contained" color="primary" style={{width:'15em'}} size="large">📥 초대하기</Button></a>
                        <Link  passHref href={`/bots/${botdata.botid}/vote`}><Button variant="contained" color="primary" style={{marginTop:'1em',width:'15em',gap:'0.2em'}} size="large">❤ 추천하기 | {botdata.hearts}</Button></Link>
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
                }}><Markdownviewer value={botdata.botdescription}/></Box>
                    <div style={{marginLeft:'0.5em',width:'100%'}}>
                        <p>정보</p>
                        <Box sx={{
                                width: 'auto',
                                minHeight: '5em',
                                minWidth:'20em',
                                height: 'auto',
                                backgroundColor: 'white',
                                borderRadius: '0.5em',
                                border: '1px solid #6e6d6d',
                                padding: '1em',
                                overflow: 'auto',
                                lineHeight:'2.5em'
                            }}>
                            <div style={{display:'flex',justifyContent:'space-between',alignContent:'center'}}>
                                <p style={{fontSize:'1.3em',margin:'0'}}><strong>접두사</strong></p>
                                <p style={{fontSize:'1.3em',margin:'0'}}>{botdata.prefix}</p>
                            </div>
                            <div style={{display:'flex',justifyContent:'space-between',alignContent:'center'}}>
                                <p style={{fontSize:'1.3em',margin:'0'}}><strong>서버수</strong></p>
                                <p style={{fontSize:'1.3em',margin:'0'}}>{botdata.guilds}</p>
                            </div>
                        </Box>
                        <p style={{marginTop:'1em'}}>카테고리</p>
                        <Box sx={{
                            display:'flex',
                            flexWrap:'wrap',
                            columnGap:'0.3em',
                        }}>
                            {
                                botdata.category.map((category,index)=>{
                                    return(
                                        <>
                                            <div style={{border:'2px #00bfa5 solid',padding:'1em',borderRadius:'0.8em',height:'1.3em',display:'flex',justifyContent:'flex-start',alignItems:'center',columnGap:'0.2em'}}>
                                                <strong>{category.label}</strong>
                                            </div>
                                        </>
                                    )
                                })
                            }
                        </Box>
                        <p style={{marginTop:'1em'}}>소유자</p>
                        <Box sx={{
                            display:'flex',
                            flexWrap:'wrap',
                            columnGap:'0.3em',
                        }}>
                            {
                                botdata.owners.map((owner,index)=>{
                                    return(
                                        <>
                                            <Link href={'/users/'+owner.id} passHref>
                                                <div className={cdstyles.Card} style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginTop:'0.5em',columnGap:"1em",border:'2px #00bfa5 solid',borderRadius:'8px',padding:'5px',width:'100%',height:'6.2em',color:'inherit'}}>
                                                    <Avatar sx={{ width: 80, height: 80,borderRadius:'50' }} src={owner.avatar+"?size=256"}/>
                                                    <div style={{flexGrow:'1',textAlign:'left',paddingLeft:'1.25em',paddingRight:'1.25em',paddingBottom:'3em',paddingTop:'3em'}}>
                                                        <Typography variant="h6" style={{fontWeight:'bold'}}>{owner.username}#{owner.discriminator}</Typography>
                                                    </div>
                                                </div>
                                            </Link>
                                        </>
                                    )
                                })
                            }
                        </Box>
                        <Box sx={{
                            display:'flex',
                            flexWrap:'wrap',
                            columnGap:'0.3em',
                            alignItems:'center',
                            marginTop:'1em',
                        }}>
                           {
                            botdata.website && (
                                <>
                                    <a href={botdata.website} rel="noreferrer" target="_blank" style={{color:'blue'}}>🌐 Website</a>
                                </>
                            )
                            }
                            {
                                botdata.github && (
                                    <>
                                        <a rel="noreferrer" href={botdata.github} target="_blank" style={{color:'blue'}}><AiFillGithub/> Github</a>
                                    </>
                                )
                            }
                            {
                                botdata.support && (
                                    <>
                                        <a rel="noreferrer" href={botdata.support} target="_blank" style={{color:'blue'}}><RiDiscordFill/> Support</a>
                                    </>
                                )
                            }
                        </Box>

                    </div>
                </div>

            </main>
            <StickyFooter/>
        </div>
    )
}
export async function getServerSideProps({query,req}){
    let key = null;
    await dbConnect();
    try {
        const cookies = cookie.parse(req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY)
    } catch(e) {
        console.log(e.message)
        key = null;
    }
    const bot=await Bot.findOne({botid: query.id},{_id:0,token:0}).lean()
    return {
        props: {
            bot: bot,
            user: key,
        }
    }
}
export default Botpage;
