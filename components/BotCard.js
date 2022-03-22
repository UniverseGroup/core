import Card from "@mui/material/Card";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import {useRouter} from "next/router";
import Link from "next/link";
const BotCard = ({manage=false,bot})=>{
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
                    console.log(bot)
                    if(bot.approved){
                        return(
                            <Card key={index} className={styles.Card}>
                                <Image quality={100} width={256} height={256} src={`/api/imageproxy?url=${encodeURIComponent(bot.botavatar+"?size=512")}`}/>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {bot.botname}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {bot.slug}
                                    </Typography>
                                </CardContent>
                                <CardActions style={{justifyContent:'center'}}>
                                    <Button size="small" color="primary" fullWidth={true} className={styles.CardBtn} onClick={()=>GotoPage('/bots/'+bot.botid)}>
                                        상세페이지
                                    </Button>
                                    {
                                        manage?(
                                            <Button size="small" color="primary" fullWidth={true} className={styles.CardBtn} onClick={()=>GotoPage(`/bots/${bot.botid}/edit`)}>
                                                수정하기
                                            </Button>
                                        ):(
                                            <Link href={bot.invite} style={{margin:0}}>
                                                <a target="_blank" style={{margin:0,width:'100%'}}>
                                                    <Button size="small" color="primary" fullWidth={true} className={styles.CardBtn}>
                                                        초대하기
                                                    </Button>
                                                </a>
                                            </Link>
                                        )
                                    }

                                </CardActions>
                            </Card>
                        )
                    }

                })
            }
        </>
    )
}
export default BotCard;
