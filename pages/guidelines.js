import Typography from '@mui/material/Typography';
import styles from '../styles/Home.module.css'
import dynamic from "next/dynamic";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import HeadTag from '../components/headtag';
import Divider from '@mui/material/Divider';
import StickyFooter from '../components/Footer';
import Image from "next/image"
const ResponsiveAppBar = dynamic(() => import("../components/navbar"));
const Markdownviewer = dynamic(
    () => import("../components/markdownviewer"), {
        ssr: false
    }
);
export async function getServerSideProps(ctx) {
    let key = null;
    try {
      const cookies = cookie.parse(ctx.req.headers.cookie);
      const user = cookies.token;
      key = jwt.verify(user, process.env.JWT_KEY);
    } catch {
      key = null;
    }
    const url1 = 'https://raw.githubusercontent.com/UniverseGroup/terms/master/guide-line.md'
    const response = await fetch(url1);
    const data = await response.text();
    return {
      props: {
        user: key,
        tos:data
      }
    }
  }

  const guidelines = ({...data}) => {
      const user = data.user
      const tos=data.tos
      return (
        <div className={styles.container}>
            <ResponsiveAppBar userdata={user}/>
            <HeadTag title='GuideLines' img={process.env.NORMAL_IMG} description='다양한 봇과 서버가 모여 만들어진 공간, Universe
    ' url={process.env.BASE_URL+'guidelines'}/>
            <main className={styles.main} style={{marginBottom:'8em'}}>
                <Markdownviewer value={tos}/>
            </main>
            <StickyFooter/>
        </div>
      )
  }
  export default guidelines;