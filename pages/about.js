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
export async function getServerSideProps(ctx) {
    let key = null;
    try {
      const cookies = cookie.parse(ctx.req.headers.cookie);
      const user = cookies.token;
      key = jwt.verify(user, process.env.JWT_KEY);
    } catch {
      key = null;
    }
    return {
      props: {
        user: key,
      }
    }
  }

  const about = ({...data}) => {
      const user = data.user
      return (
        <div className={styles.container}>
            <ResponsiveAppBar userdata={user}/>
            <HeadTag title='About' img={process.env.NORMAL_IMG} description='다양한 봇과 서버가 모여 만들어진 공간, Universe
    ' url={process.env.BASE_URL+'about'}/>
            <main className={styles.main} style={{marginBottom:'8em'}}>
                <section>
                    <Typography variant="h3" sx={{fontFamily: 'Do Hyeon',marginTop:'2em'}}>
                        "{"다양한 봇과 서버가 모여 만들어진 공간."}"
                    </Typography>
                    <Typography variant="h4" sx={{fontFamily: 'Do Hyeon'}}>
                        이 공간에서 다양한 봇과 서버를 찾아보세요!
                    </Typography>
                </section>
                <Divider style={{marginTop: '1rem'}}></Divider>
                <section style={{marginTop:'2em'}}>
                    <Typography variant="h3" sx={{fontFamily: 'Do Hyeon'}}>
                        소개
                    </Typography>
                    <Typography variant="h5" sx={{fontFamily: 'Do Hyeon'}}>
                        UNIVERSE는 서버를 찾아보고, 봇을 찾아보는 공간입니다.
                    </Typography>
                </section>
                <Divider style={{marginTop: '1rem'}}></Divider>
                <section style={{marginTop:'2em'}}>
                    <Typography variant="h3" sx={{fontFamily: 'Do Hyeon'}}>
                        특징
                    </Typography>
                    <Typography variant="h4" sx={{fontFamily: 'Do Hyeon',marginTop:'0.5em'}}>
                        <strong>🔰 배지시스템</strong>
                    </Typography>
                    <Typography variant="h5" sx={{fontFamily: 'Do Hyeon'}}>
                        심층적인 심사로 부여되는 다양한 배지로 봇의 신뢰도를 높힙니다.
                    </Typography>
                    <Typography variant="h4" sx={{fontFamily: 'Do Hyeon',marginTop:'0.5em'}}>
                        <strong>📡 다양한 API</strong>
                    </Typography>
                    <Typography variant="h5" sx={{fontFamily: 'Do Hyeon'}}>
                        UNIVERSE에서 제공하는 다양한 API를 통해 써드파티에 적용하실 수 있습니다.
                    </Typography>
                    <Typography variant="h4" sx={{fontFamily: 'Do Hyeon',marginTop:'0.5em'}}>
                        <strong>📊 봇/서버 스텟</strong>
                    </Typography>
                    <Typography variant="h5" sx={{fontFamily: 'Do Hyeon'}}>
                        봇 또는 서버의 스텟을 UNIVERSE에서 확인해보세요. 다양한 정보를 대시보드에서 확인 하실 수 있습니다.
                    </Typography>
                </section>
                <Divider style={{marginTop: '1rem'}}></Divider>
                <section style={{marginTop:'2em'}}>
                    <Typography variant="h3" sx={{fontFamily: 'Do Hyeon'}}>
                        브랜드
                    </Typography>
                    <Typography variant="h4" sx={{fontFamily: 'Do Hyeon',marginTop:'0.5em'}}>
                        <strong>슬로건</strong>
                    </Typography>
                    <Typography variant="h4" sx={{fontFamily: 'Do Hyeon',textAlign:'center'}}>
                        "{"다양한 봇과 서버가 모여 만들어진 공간."}"
                    </Typography>
                    <Typography variant="h4" sx={{fontFamily: 'Do Hyeon',marginTop:'0.5em'}}>
                        <strong>로고</strong>
                    </Typography>
                    <Typography variant="h5" sx={{fontFamily: 'Do Hyeon',marginTop:'0.5em'}}>
                        ⚠ 로고를 허락없이 무단으로 수정하거나 변경, 왜곡등 기타 방법으로 수정하는 것을 금지합니다.
                    </Typography>
                    <Image src={'/api/imageproxy?url='+process.env.NORMAL_IMG} width={200} height={200} quality={100} alt="logo"/>
                    <Typography variant="h4" sx={{fontFamily: 'Do Hyeon',marginTop:'0.5em'}}>
                        글꼴
                    </Typography>
                    <Typography variant="h5" sx={{fontFamily: 'Do Hyeon'}}>
                        Do Hyeon
                    </Typography>
                    <Typography variant="h4" sx={{fontFamily: 'Do Hyeon',marginTop:'0.5em'}}>
                        <strong>색상</strong>
                    </Typography>
                    <div style={{width:'17em',height:'8em',borderRadius:'8px',backgroundColor:'#1565c0',color:'#ffffff',display:'flex',justifyContent:'center'}}>
                        <p style={{margin:'auto',fontSize:'1.3em'}}><strong>파랑</strong><br/>
                        rgb(18,101,192)<br/>
                        #1565c0</p>
                    </div>
                </section>
            </main>
            <StickyFooter/>
        </div>
      )
  }
  export default about;