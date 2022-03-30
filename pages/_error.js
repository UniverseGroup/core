import dynamic from "next/dynamic";
import HeadTag from "../components/headtag";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "../styles/Home.module.css";
import StickyFooter from "../components/Footer";
import { useRouter } from "next/router";
import {RiArrowGoBackFill} from "react-icons/ri";
const ResponsiveAppBar = dynamic(() => import("../components/navbar"));
const NotFound = ({data})=>{
    const user = data;
    const router = useRouter();
    return(
        <>
            <div>
                <ResponsiveAppBar userdata={user}/>
                <HeadTag title="Unknown Error." img={process.env.NORMAL_IMG} description="Unknown Error."/>
                <main className={styles.main}>
                    <Typography variant="h3" sx={{fontFamily: 'Do Hyeon'}} className={styles.title}>
                        Unknown Error.<br/>
                        알수 없는 오류가 발생했어요.
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
