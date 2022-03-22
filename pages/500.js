import dynamic from "next/dynamic";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import HeadTag from "../components/headtag";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "../styles/Home.module.css";
const ResponsiveAppBar = dynamic(() => import("../components/navbar"));
const StickyFooter = dynamic(() => import("../components/footer"));
const NotFound = ({data})=>{
    const user = data;
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
                <StickyFooter/>
            </div>
        </>
    )
}
export default NotFound;
