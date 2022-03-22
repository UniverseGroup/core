// import ResponsiveAppBar from "../../components/navbar";
// import StickyFooter from "../../components/Footer";
import PendBot from "../../models/pendbot";
import dbConnect from "../../lib/dbConnect";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import styles from "../../styles/Users.module.css";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {GoReport} from "react-icons/go";
import {Divider} from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Box from "@mui/material/Box";
import {useRouter} from "next/router";
import User from "../../models/user";
import HeadTag from "../../components/headtag";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
const BotCard = dynamic(() => import("../../components/BotCard"));
const ResponsiveAppBar = dynamic(() => import("../../components/navbar"));
const StickyFooter = dynamic(() => import("../../components/Footer"));
const Mypage = ({...data}) => {
    // console.log('pend',JSON.stringify(data.pendbot));
    const userdata=data.user
    const userinfo=data.userinfo
    const pendbots=data.pendbot
    console.log('pends',pendbots)
    const useravatar =userinfo&&userinfo.useravatar
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
            <HeadTag title={userinfo.username+'#'+userinfo.discriminator} img={userinfo.useravatar+"?size=256"} url={process.env.BASE_URL+"users/"+userinfo.userid} description='다양한 봇과 서버가 모여 만들어진 공간, Universe'/>
            <main className={styles.form} style={{marginBottom: '5em',minHeight:'100%',overflow:'hidden'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{display:'flex',justifyContent:'flex-start',alignItems:'center',marginBottom:'1em',marginTop:'1em',columnGap:"1em"}}>
                        <Image quality={100} width={256} height={256} src={`/api/imageproxy?url=${encodeURIComponent(useravatar+"?size=512")}`}/>
                        <div style={{flexGrow:'1',textAlign:'left',paddingLeft:'1.25em',paddingRight:'1.25em',paddingBottom:'3em',paddingTop:'3em'}}>
                            <Typography variant="h4" style={{fontWeight:'bold'}}>{userinfo.username}#{userinfo.discriminator}</Typography>
                            {/*<Typography variant="h6" style={{fontWeight:'bold'}}>{botdata.slug}</Typography>*/}
                        </div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column'}}>
                        <a><Button variant="contained" color="error" style={{width:'15em',gap:'0.4em'}} size="large"><GoReport/>유저 신고하기</Button></a>
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
                    <BotCard bot={userinfo.bots} manage={Boolean(pendbots)}/>
                    {/*{*/}
                    {/*    userinfo.bots.map((bot,index)=>{*/}
                    {/*        console.log(bot)*/}
                    {/*        return(*/}
                    {/*            <Card key={index} className={styles.Card}>*/}
                    {/*                <Image quality={100} width={256} height={256} src={`/api/imageproxy?url=${encodeURIComponent(bot.botavatar+"?size=512")}`}/>*/}
                    {/*                <CardContent>*/}
                    {/*                    <Typography gutterBottom variant="h5" component="h2">*/}
                    {/*                        {bot.botname}*/}
                    {/*                    </Typography>*/}
                    {/*                    <Typography variant="body2" color="textSecondary" component="p">*/}
                    {/*                        {bot.slug}*/}
                    {/*                    </Typography>*/}
                    {/*                </CardContent>*/}
                    {/*                <CardActions style={{justifyContent:'center'}}>*/}
                    {/*                    <Button size="small" color="primary" fullWidth={true} className={styles.CardBtn} onClick={()=>GotoPage('/bots/'+bot.botid)}>*/}
                    {/*                        상세페이지*/}
                    {/*                    </Button>*/}
                    {/*                    <Button size="small" color="primary" fullWidth={true} className={styles.CardBtn} onClick={()=>GotoPage(bot.invite)}>*/}
                    {/*                        초대*/}
                    {/*                    </Button>*/}
                    {/*                </CardActions>*/}
                    {/*            </Card>*/}
                    {/*        )*/}
                    {/*    })*/}
                    {/*}*/}
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
                    ):null
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
    console.log(key)
    // const botinfo = pendbots?await getUserData(bot.botid).then(()=>console.log('fetch success')):null
    if(key?.id===query.id){
        pendbot = await PendBot.find({ownerid: query.id},{_id:0}).lean()
    }
    console.log(pendbot)
    return {
        props: {
            userinfo: userdb,
            pendbot: pendbot?pendbot:null,
            user: key,
        }
    }
}
export default Mypage;
