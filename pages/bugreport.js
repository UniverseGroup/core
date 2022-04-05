import Typography from '@mui/material/Typography';
import styles from '../styles/Home.module.css'
import dynamic from "next/dynamic";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import HeadTag from '../components/headtag';
import Divider from '@mui/material/Divider';
import StickyFooter from '../components/Footer';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLocationArrow} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
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

const about = ({ ...data }) => {
    const user = data.user
    return (
        <div className={styles.container}>
            <ResponsiveAppBar userdata={user} />
            <HeadTag title='BugReport' img={process.env.NORMAL_IMG} description='다양한 봇과 서버가 모여 만들어진 공간, Universe' url={process.env.BASE_URL + 'bugreport'} />
            <main className={styles.main} style={{ marginBottom: '8em' }}>
                <section>
                    <Typography variant="h3" sx={{ fontFamily: 'Do Hyeon', marginTop: '2em' }}>
                        버그제보
                    </Typography>
                    <Typography variant="h4" sx={{ fontFamily: 'Do Hyeon' }}>
                        UNIVERSE에 존재하는 버그를 찾아 보안에 기여해주세요. <br/>제보가 채택되신분들께는 소정의 보상을 드립니다.
                    </Typography>
                </section>
                <Divider style={{ marginTop: '1rem' }}></Divider>
                <section style={{ marginTop: '2em' }}>
                    <Typography variant="h3" sx={{ fontFamily: 'Do Hyeon' }}>
                        주의사항
                    </Typography>
                    <Typography variant="h5" sx={{ fontFamily: 'Do Hyeon' }}>
                        <li>자신이 소유하고 있는 계정과 봇에서만 테스트해야합니다. 절대로 다른 유저에게 영향을 주어서는 안됩니다.</li>
                        <li>UNIVERSE의 서비스에 피해를 끼치는 활동을 해서는 안됩니다. 예) 무차별 대입, DDoS, DoS 등</li>
                        <li>취약점을 찾기 위해 스캐너와 같은 자동화 도구는 사용하지 마세요.</li>
                        <li>발견한 문제에 대한 모든 정보는 보안팀이 완벽하게 조사하고 해결하기 전까지는 절대로 제3자에게 공개/공유해서는 안됩니다.</li>
                        <li>제보된 문제에 관한 모든 정보를 공개할 권한을 가집니다.</li>
                    </Typography>
                    <Typography variant="h3" sx={{ fontFamily: 'Do Hyeon' , marginTop: '0.5em'}}>
                        범위
                    </Typography>
                    <Typography variant="h4" sx={{ fontFamily: 'Do Hyeon', marginTop: '0.5em' }}>
                        <li>universelist.kr</li>
                    </Typography>
                    <Typography variant="h3" sx={{ fontFamily: 'Do Hyeon', marginTop: '0.5em'  }}>
                        취약점에 포함되지 않는 사항
                    </Typography>
                    <Typography variant="h4" sx={{ fontFamily: 'Do Hyeon', marginTop: '0.5em' }}>
                        <li>이미 팀 내부에서 해당 취약점을 인지하고 있는 경우</li>
                        <li>Brute force 공격</li>
                        <li>Clickjacking</li>
                        <li>DoS 공격</li>
                        <li>본인에게만 영향이 미치는 취약점(Self XSS 등)</li>
                    </Typography>
                </section>
                <section style={{ display:'flex',justifyContent:'center',marginTop: '2em' }}>
                    <div style={{margin:'auto'}}>
                        <Link passHref href="https://discord.com/users/281566165699002379"><a target="_blank" rel="noopener noreferrer"><Button variant="contained" color="primary"
                                            size='large' >
                                                <FontAwesomeIcon icon={faLocationArrow} style={{marginRight: '0.2em'}} />제보하기
                        </Button></a></Link>
                    </div>
                    
                </section>
            </main>
            <StickyFooter />
        </div>
    )
}
export default about;