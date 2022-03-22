import dynamic from "next/dynamic";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import HeadTag from "../components/headtag";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "../styles/Home.module.css";
import {RiArrowGoBackFill} from "react-icons/ri";
import StickyFooter from "../components/Footer";
import {useRouter} from "next/router";
const ResponsiveAppBar = dynamic(() => import("../components/navbar"));
const NotFound = ({data})=>{
    const user = data;
    const router = useRouter();
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
export default NotFound;
