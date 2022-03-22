import dynamic from "next/dynamic";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import HeadTag from "../components/headtag";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "../styles/Home.module.css";
const ResponsiveAppBar = dynamic(() => import("../components/navbar"));
const footer = dynamic(() => import("../components/footer"));
export async function getServerSideProps({req,res}){
    let key = null;
    try {
        const cookies = cookie.parse(req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY)
    } catch {
        key = null;
        // res.writeHead(302, { Location: `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=guilds%20guilds.join%20identify%20email` })
        // return res.end()
    }
    return {
        props: {
            user: key,
        }
    }
}
const NotFound = ({...data})=>{
    const user = data.user;
    return(
        <>
            <div>
                <ResponsiveAppBar userdata={user}/>
                <HeadTag title="404 Not Found" img={process.env.NORMAL_IMG} description="Not Found Error"/>
                <main className={styles.main}>
                    <Typography variant="h3" sx={{fontFamily: 'Do Hyeon'}} className={styles.title}>
                        404 Error<br/>
                        어..어라? 우주 미아가 되었어요.
                    </Typography>
                </main>
            </div>
        </>
    )
}
export default NotFound;
