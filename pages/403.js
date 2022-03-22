import dynamic from "next/dynamic";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import HeadTag from "../components/headtag";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "../styles/Home.module.css";
// import StickyFooter from "../components/f";
import { useRouter } from "next/router";
import {RiArrowGoBackFill} from "react-icons/ri";
const ResponsiveAppBar = dynamic(() => import("../components/navbar"));
const StickyFooter = dynamic(() => import("../components/Footer"));
// export async function getServerSideProps({req,res}){
//     let key = null;
//     try {
//         const cookies = cookie.parse(req.headers.cookie);
//         const user = cookies.token;
//         key = jwt.verify(user, process.env.JWT_KEY)
//     } catch {
//         key = null;
//         // res.writeHead(302, { Location: `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=guilds%20guilds.join%20identify%20email` })
//         // return res.end()
//     }
//     return {
//         props: {
//             user: key,
//         }
//     }
// }
const PermissionError = ({data})=>{
    const user = data;
    console.log(data)
    const router = useRouter();
    return(
        <>
            <div>
                <ResponsiveAppBar userdata={user}/>
                <HeadTag title="403 PermissionError" img={process.env.NORMAL_IMG} description="PermissionError"/>
                <main className={styles.main}>
                    <Typography variant="h3" sx={{fontFamily: 'Do Hyeon'}} className={styles.title}>
                        403 Error<br/>
                        어라라..? 우주선에 탑승할 권한이 없어요.
                    </Typography>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem'}}>
                        <Button size="large" style={{display:'flex',alignItems:'center',gap:'0.5em'}} variant="contained" color="primary" onClick={()=>router.push('/')}>
                            <RiArrowGoBackFill/>되돌아가기
                        </Button>
                    </div>
                </main>
                <StickyFooter/>
            </div>
        </>
    )
}
export default PermissionError;
