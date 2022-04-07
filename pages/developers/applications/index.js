import cookie from 'cookie'
import jwt from "jsonwebtoken";
import Bot from "../../../models/bot";
import dbConnect from "../../../lib/dbConnect";
import HeadTag from "../../../components/headtag";
import dynamic from "next/dynamic";
import StickyFooter from "../../../components/Footer";
import Typography from '@mui/material/Typography';
import { discordUrls } from '../../../lib/DiscordTool';
import Button from "@mui/material/Button";
import Link from 'next/link'
import { setNextUrl } from "../../../lib/_nextUrl";
const ResponsiveAppBar = dynamic(() => import("../../../components/navbar"));
import styles from '../../../styles/Home.module.css'
export async function getServerSideProps({req,res,query}) {
    let key=null;
    await dbConnect();
    try {
        const cookies = cookie.parse(req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY)
    } catch(e) {
        setNextUrl(req, res, '/developers')
        res.writeHead(302, { Location: discordUrls.login })
        res.end()
    }
    const botdata = await Bot.find({owners: {'$elemMatch':{'id':key?.id}}}, {_id: 0, __v: 0,token:0}).lean()
    // const botdata = await Bot.find({}, {_id: 0, __v: 0,token:0}).lean()

    return {
        props: {
            bots: botdata||null,
            user: key,
        }
    }
}
const Application = ({...data}) =>{
    const userdata = data.user
    const botdata = data.bots
    return(
        <div className={styles.container}>
            <ResponsiveAppBar userdata={userdata}/>
            <HeadTag title='Applications' img={process.env.NORMAL_IMG} description='다양한 봇과 서버가 모여 만들어진 공간, Universe'
                url={process.env.BASE_URL+'applications'}/>
            
            <main style={{minHeight:'100vh'}}>
                <div style={{display:'flex'}}>
                    <div style={{position:'relative',width:'15em',minHeight:'100vh',backgroundColor:'#4c80ba'}}>
                        <div style={{alignItems:'center',justifyContent:'center',padding:'1em',width:'100%'}}>
                            <Button variant="contained" fullWidth>
                                리스트
                            </Button>
                            <Button variant="text" fullWidth sx={{marginTop:'1em',color:'#ffffff'}}>
                                Docs
                            </Button>
                        </div>
                    </div>
                    <div style={{padding:'1em'}}>
                        <Typography variant="h3" sx={{fontFamily: 'Do Hyeon',marginTop:'1em'}}>
                            나의 봇
                        </Typography>
                        <Typography variant="h5" sx={{color:'#c2c2c2'}}>
                            UNIVERSE에서 제공하는 다양한 API를 사용해보세요.
                        </Typography>
                        <div style={{marginTop:'1em',display:'grid',gridTemplateColumns:'repeat(6,minmax(0,1fr))',gridGap:'1rem',gap:'1rem'}}>
                            {
                                botdata?botdata.map((item,index)=>{
                                    return(
                                        <Link key={index} passHref href={'/developers/applications/bots/'+item.botid}><div style={{width:'10em',minHeight:'13em',borderRadius:'5px',padding:'1em',backgroundColor:'#1565c0',
                                        justifyContent:'center',position:'relative',alignContent:'center',overflow:'hidden',cursor:'pointer'}} className='appcard'>
                                            <img src={'/api/imageproxy?url='+item.botavatar} style={{borderRadius:'5px'}}/>
                                            <p style={{textAlign:'center',color:'#ffffff',fontSize:'1.5em'}}><strong>{item.botname}</strong></p>
                                        </div></Link>
                                    )
                                }) : <p>소유한 봇이 없습니다.</p>
                            }
                        </div>
                        
                    </div>
                </div>
            </main>
            <StickyFooter/>
        </div>

    )

}
export default Application;