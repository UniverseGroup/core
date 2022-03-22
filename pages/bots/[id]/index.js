// import ResponsiveAppBar from "../../../components/navbar";
// import StickyFooter from "../../../components/Footer";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Bot from "../../../models/bot";
import dbConnect from "../../../lib/dbConnect";
import {useRouter} from "next/router";
import styles from "../../../styles/Addbot.module.css";
import cdstyles from "../../../styles/Users.module.css";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
import {BiBadgeCheck} from "react-icons/bi";
import Button from "@mui/material/Button";
import {Alert, AlertTitle, Divider} from "@mui/material";
// import Markdownviewer from "../../../components/markdownviewer";
import Box from "@mui/material/Box";
import {AiOutlineHeart} from "react-icons/ai";
import HeadTag from "../../../components/headtag";
import Image from "next/image";
import dynamic from "next/dynamic";
import StickyFooter from "../../../components/Footer";
import Link from "next/link";
const Markdownviewer = dynamic(
    () => import("../../../components/markdownviewer")
);
const ResponsiveAppBar = dynamic(() => import("../../../components/navbar"));
// const StickyFooter = dynamic(() => import("../../../components/Footer"));
const Botpage = ({...data}) => {
    console.log(data);
    const botdata =data.bot
    const userdata=data.user
    const router = useRouter()
    const Topto = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // for smoothly scrolling
        });
    }
    const GotoPage = (url) => {

        router.push(url, url, { shallow: true }).then(()=>{Topto()})
    };
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
                            <div style={{backgroundColor:'#6b6b6b',padding:'1em',borderRadius:'0.8em',width:'7em',height:'1.3em',display:'flex',justifyContent:'flex-start',alignItems:'center',columnGap:'0.2em'}}>
                                <FontAwesomeIcon icon={faCircle} style={{color:'#00bfa5',border:'2px #000000 solid',borderRadius:'100%'}}/><strong>온라인</strong>
                            </div>
                            <Typography variant="h4" style={{fontWeight:'bold'}}>{botdata.botname}</Typography>
                            <Typography variant="h6" style={{fontWeight:'bold'}}>{botdata.slug}</Typography>
                        </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <a href={botdata.invite} target='_blank' rel="noreferrer"><Button variant="contained" color="primary" style={{width:'15em'}} size="large">📥 초대하기</Button></a>
                        <Button variant="contained" color="primary" style={{marginTop:'1em',width:'15em',gap:'0.2em'}} size="large"><AiOutlineHeart/>추천하기</Button>
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
                            <div style={{display:'flex',justifyContent:'space-between',alignContent:'center',marginTop:'0.7em'}}>
                                <p style={{fontSize:'1.3em',margin:'0'}}><strong>서버수</strong></p>
                                <p style={{fontSize:'1.3em',margin:'0'}}>{botdata.guilds}</p>
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
                        <p>소유자</p>
                        <Box sx={{
                            display:'flex',
                            flexWrap:'wrap',
                            columnGap:'0.3em',
                        }}>
                            {
                                botdata.owners.map((owner,index)=>{
                                    return(
                                        <>
                                            <div onClick={()=>GotoPage('/users/'+owner.id)} className={cdstyles.Card} style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginBottom:'1em',marginTop:'1em',columnGap:"1em",backgroundColor:'gray',borderRadius:'8px',padding:'5px',width:'100%',height:'6.2em',color:'inherit'}}>
                                                <Avatar sx={{ width: 80, height: 80,borderRadius:'50' }} src={owner.avatar+"?size=256"}/>
                                                <div style={{flexGrow:'1',textAlign:'left',paddingLeft:'1.25em',paddingRight:'1.25em',paddingBottom:'3em',paddingTop:'3em'}}>
                                                    <Typography variant="h6" style={{fontWeight:'bold'}}>{owner.username}#{owner.discriminator}</Typography>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
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
    // const pendbot = await PendBot.findOne({botid: query.id},{_id:0}).lean()
    // console.log(pendbot)
    return {
        props: {
            bot: bot,
            user: key,
        }
    }
}
export default Botpage;
