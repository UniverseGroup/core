// import ResponsiveAppBar from "../../components/navbar";
// import StickyFooter from "../../components/Footer";
import PendBot from "../../models/pendbot";
import Bot from "../../models/bot";
import dbConnect from "../../lib/dbConnect";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import styles from "../../styles/Users.module.css";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {GoReport} from "react-icons/go";
import {Divider} from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Box from "@mui/material/Box";
import {useRouter} from "next/router";
import User from "../../models/user";
import HeadTag from "../../components/headtag";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {useState} from "react";
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';
// const UserReport = dynamic(() => import("../../components/UserReport"));
import {getUserData} from "../../lib/DiscordTool"
// import defaultimg from './default.png";
const BotCard = dynamic(() => import("../../components/BotCard"));
const ResponsiveAppBar = dynamic(() => import("../../components/navbar"));
const StickyFooter = dynamic(() => import("../../components/Footer"));
const Mypage = ({...data}) => {
    // console.log('pend',JSON.stringify(data.pendbot));
    const userdata=data.user
    const userinfo=data.userinfo
    const pendbots=data.pendbot
    const bots=data.bots
    console.log(data)
    // const useravatar =userinfo&&userinfo.useravatar
    const router = useRouter()
    const [isopen,setIsopen]=useState(false)
    const Topto = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // for smoothly scrolling
        });
    }
    return(
        <div style={{padding:'0'}}>
            <ResponsiveAppBar userdata={userdata}/>
            <HeadTag title={userinfo.username+'#'+userinfo.discriminator} img={userinfo.useravatar+"?size=256"} url={process.env.BASE_URL+"users/"+userinfo.userid} description='다양한 봇과 서버가 모여 만들어진 공간, Universe'/>
            <main className={styles.form} style={{marginBottom: '5em',minHeight:'100%',overflow:'hidden'}}>
                <Dialog open={isopen} onClose={()=>setIsopen(false)}>
                    <DialogTitle>Subscribe</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                        </DialogContentText>
                        <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setIsopen(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginBottom:'1em',marginTop:'1em',columnGap:"1em"}}>
                        <Image quality={100} width={256} height={256} src={`/api/imageproxy?url=${encodeURIComponent(userinfo.useravatar + "?size=512")}`}/>
                        <div style={{flexGrow:'1',textAlign:'left',paddingLeft:'1.25em',paddingRight:'1.25em',paddingBottom:'3em',paddingTop:'3em'}}>
                            <Typography variant="h4" style={{fontWeight:'bold'}}>{userinfo.username}#{userinfo.discriminator}</Typography>
                            <div style={{display:'flex',justifyContent:'flex-start',alignItems:'baseline'}}>
                                {
                                    userinfo.badges.includes('EarlyTester')&&(
                                        <>
                                            <Tooltip title='초기 테스터' arrow placement='bottom'>
                                                <div style={{width:'32px',height:'32px'}}>
                                                    <Image src='/earlytester.png' alt='earlytester' width={32} height={32}/>
                                                </div>
                                            </Tooltip>
                                        </>
                                    )
                                }
                                {
                                    userinfo.permissions === 1 && (
                                        <>
                                            <Tooltip title='스테프' arrow placement='bottom'>
                                                <div style={{width:'32px',height:'32px'}}>
                                                    <Image src='/staff.png' alt='staff' width={32} height={32}/>
                                                </div>
                                            </Tooltip>
                                        </>
                                    )
                                }
                            </div>

                        </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <Button variant="contained" color="error" disabled={true} style={{width:'15em',gap:'0.4em'}} size="large" onClick={()=>setIsopen(!isopen)}><GoReport/>유저 신고하기</Button>
                    </div>
                </div>
                <Divider style={{marginTop: '1rem'}}/>
                <Typography variant="h4" style={{fontWeight:'bold',marginTop:'1.4em',marginBottom:'0.5em'}}>🤖 소유한 봇</Typography>
                <Box sx={{
                    display:'flex',
                    flexWrap:'wrap',
                    columnGap:'0.3em',
                    marginBottom:'5em'
                }}>
                    {
                        Boolean(bots) ?<BotCard bot={bots} manage={userinfo.id===router.query.id} mode="all"/>:(
                            <Typography variant="h6" style={{fontWeight:'bold',marginTop:'1.4em',marginBottom:'0.5em'}}>소유한 봇이 없습니다.</Typography>
                        )
                    }

                </Box>
                {
                    pendbots ? (
                        <>
                            <Divider style={{marginTop: '1rem'}}/>
                            <Typography variant="h4" style={{fontWeight: 'bold', marginTop: '1.4em', marginBottom: '0.5em'}}>심사기록</Typography>
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                columnGap: '0.7em',
                                marginBottom: '5em',
                                rowGap: '0.7em'
                            }}>
                                {
                                    pendbots&&pendbots.map((bot, index) => {
                                        console.log(bot)
                                        const color = bot.approved&&('#00bfa5')||bot.deny&&('#f04747')||bot.pending&&('#faa61a')
                                        const statues = bot.approved&&('승인됨')||bot.deny&&('반려됨')||bot.pending&&('심사중')
                                        return (
                                            <>
                                                <Card key={index} className={styles.Card}>
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                            {bot.botid}
                                                        </Typography>
                                                        <div style={{backgroundColor:'#6b6b6b',padding:'1em',borderRadius:'0.8em',width:'7em',height:'1.3em',display:'flex',justifyContent:'center',alignItems:'center',columnGap:'0.2em'}}>
                                                            <FontAwesomeIcon icon={faCircle} style={{color: color,border:'2px #000000 solid',borderRadius:'100%'}}/><strong>{statues}</strong>
                                                        </div>
                                                    </CardContent>
                                                    {/*{*/}
                                                    {/*    !bot.approved?(*/}
                                                    {/*        <CardActions style={{justifyContent: 'center'}}>*/}
                                                    {/*            <Link href={'/pendhistory/'+bot.id+'/'+bot.botid} shallow={true} scroll={true} prefetch={true}><Button size="small" color="primary" fullWidth={true} className={styles.CardBtn}*/}
                                                    {/*             >*/}
                                                    {/*                상세페이지*/}
                                                    {/*            </Button></Link>*/}
                                                    {/*        </CardActions>*/}
                                                    {/*    ) : null*/}
                                                    {/*}*/}
                                                    <CardActions style={{justifyContent: 'center'}}>
                                                        <Link href={'/pendhistory/'+bot.id+'/'+bot.botid} shallow={true} scroll={true} prefetch={true}><Button size="small" color="primary" fullWidth={true} className={styles.CardBtn}
                                                        >
                                                            상세페이지
                                                        </Button></Link>
                                                    </CardActions>

                                                </Card>
                                            </>

                                        )
                                    })
                                }
                            </Box>
                        </>
                    ) : null
                }

            </main>
            <StickyFooter/>
        </div>
    )
}

export async function getServerSideProps({req,res,query}) {
    let key=null;
    await dbConnect();
    try {
        const cookies = cookie.parse(req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY)
    } catch(e) {
        key = null;
    }
    let pendbot = null
    const userdb = await User.findOne({userid:query.id},{_id:0,'bots._id':0}).lean()
    const botdata = await Bot.find({owners: {'$elemMatch':{'id':query.id}}}, {_id: 0, __v: 0,token:0}).lean()||null
    if(key?.id===query.id){
        pendbot = await PendBot.find({ownerid: query.id},{_id:0}).lean()
    }
    const fetchuser = await getUserData(query.id)
    const useravatar_format = fetchuser&&fetchuser.avatar.startsWith("a_") ? "gif" : "webp"
    userdb.useravatar = fetchuser && `https://cdn.discordapp.com/avatars/${query.id}/${fetchuser.avatar}.${useravatar_format}`
    return {
        props: {
            userinfo: userdb,
            pendbot: pendbot?pendbot:null,
            bots: botdata,
            user: key,
        }
    }
}
export default Mypage;
