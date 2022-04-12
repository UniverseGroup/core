import Card from "@mui/material/Card";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import {useRouter} from "next/router";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import {BiBadgeCheck} from "react-icons/bi";
import Box from "@mui/material/Box";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons/faCircle";
const statusColor = {
    'online':'#00bfa5',
    'idle':'#faa61a',
    'dnd':'#f04747',
    'offline':'#747f8d',
    'streaming':'#643da7'
}
const BotCard = ({manage=false,bot,mode=undefined})=>{
    const router = useRouter();
    const Topto = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // for smoothly scrolling
        });
    }
    const GotoPage = (url) => {

        router.push(url).then(()=>{Topto()})
    };
    return(
        <>
            {
                bot.map((bot,index)=>{
                    return(
                        <Link passHref href={`/bots/${bot.botid}`} key={index}>
                            <div className="botcard">
                                <div className="botcard__image">
                                    {/* {
                                bot.banner && <Image quality={100} src={`/api/imageproxy?url=${encodeURIComponent(bot.botbanner+"?size=512")}`}/>
                            } */}
                                    <img src='http://placeimg.com/640/480/nature' />
                                </div>
                                <div className="botcard__profile">
                                    <Image quality={100} width={256} height={256} src={`/api/imageproxy?url=${encodeURIComponent(bot.botavatar+"?size=512")}`}/>
                                </div>
                                <div className="botcard__body">
                                    <div style={{display:'flex',alignContent:'center'}}>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {bot.botname}
                                        </Typography>
                                        <FontAwesomeIcon icon={faCircle} size='sm' style={{color:statusColor[bot.status],border:'2px #000000 solid',borderRadius:'100%'}}/>
                                    </div>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {bot.slug}
                                    </Typography>
                                    <div style={{display:'flex',justifyContent:'flex-start',alignItems:'baseline'}}>
                                        {
                                            mode==="EarlyBot" && bot.badges.includes('EarlyBot')&&(
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
                                            bot.discordVerified&&(
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
                                    <Box sx={{
                                                    display:'flex',
                                                    flexWrap:'wrap',
                                                    columnGap:'0.3em',
                                                }}>
                                            {
                                                bot.category.slice(0,2).map((item,index)=>{
                                                    return(
                                                        <>
                                                            <Link href={`/bots/category/${item.label}`} key={index} passHref scroll={false}>
                                                                <div className="category">
                                                                    <strong>{item.label}</strong>
                                                                </div>
                                                            </Link>
                                                        </>
                                                    
                                                    )
                                                    
                                                })
                                            }
                                            {
                                                bot.category.length>2&&(
                                                    <>
                                                        <div className="category">
                                                            <strong>
                                                               +{bot.category.length-2}
                                                            </strong>
                                                        </div>
                                                    </>
                                                )
                                            }
                                            
                                    </Box>
                                </div>
                                <Divider style={{marginTop: '1rem', marginBottom: '1rem'}}/>
                                <div className="botcard_action">
                                    <Link href={'/bots/'+bot.botid}>
                                        <Button size="large" color="primary" className={styles.CardBtn}>
                                            상세페이지
                                        </Button>
                                    </Link>
                                    {
                                        manage?(
                                            <Link href={`/bots/${bot.botid}/edit`}>
                                                <Button size="large" color="primary" className={styles.CardBtn}>
                                                    수정하기
                                                </Button>
                                            </Link>
                                        ):(
                                            <Link href={bot.invite} style={{margin:0}}>
                                                <a target="_blank">
                                                    <Button size="large" color="primary" className={styles.CardBtn}>
                                                        초대하기
                                                    </Button>
                                                </a>
                                            </Link>
                                        )
                                    }
                                </div>
                            </div>
                        </Link>
                    )

                })
            }
        </>
    )

}
export default BotCard;
