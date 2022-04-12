import styles from '../../styles/Home.module.css'
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Typography from "@mui/material/Typography";
import Bot from "../../models/bot";
import dbConnect from "../../lib/dbConnect";
import HeadTag from "../../components/headtag";
import dynamic from "next/dynamic";
import StickyFooter from "../../components/Footer";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {useRouter} from 'next/router';
import { useEffect } from 'react';
const BotCard = dynamic(() => import("../../components/BotCard"));
const ResponsiveAppBar = dynamic(() => import("../../components/navbar"));
const SearchBar = dynamic(() => import("../../components/Search"));
export async function getServerSideProps(ctx) {
    let key = null;
    await dbConnect();
    try {
        const cookies = cookie.parse(ctx.req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY);
    } catch {
        key = null;
    }
    const page = ctx.query.page || 1;
    const limit = 8
    const bot_list = await Bot.find({ approved: true }, { _id: 0, token: 0 }).skip((page - 1) * limit).limit(limit).lean();
    const total = await Bot.find({ approved: true }).countDocuments();
    const lastPage = Math.ceil(total / limit);
    return {
        props: {
            user: key,
            list: bot_list,
            lastPage: lastPage,
            page: page
        }
    }
}
export default function Home({ ...key }) {
    console.log(key)
    const data = key.user;
    const botlist = key.list;
    const lastPage = key.lastPage;
    const page = key.page;
    const router = useRouter();
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // for smoothly scrolling
        });
    }, [])
    const handleChange = (event, value) => {
        //router.push({url:`/bots`,query: {page: value},shallow:true,asPath:`/bots?page=${value}`,scroll:false});
        router.push(`/bots?page=${value}`,undefined,{scroll:true,scrollTo:0});
    }
    return (
        <div className={styles.container}>
            <ResponsiveAppBar userdata={data} />
            <HeadTag title='메인' img={process.env.NORMAL_IMG} description='다양한 봇과 서버가 모여 만들어진 공간, Universe
' url={process.env.BASE_URL} />
            <main className={styles.main}>
                <Typography variant="h3" sx={{ fontFamily: 'Do Hyeon' }} className={styles.title}>
                    다양한 봇과 서버가 모여 만들어진 공간.<br />
                    이곳{" "}<strong>UNIVERSE</strong>에서 다양한 봇과 서버를 찾아보세요!
                </Typography>
                {/*<section style={{display:'flex',flexWrap:'wrap',justifyContent:'center',position:'relative'}}>*/}
                {/*  <SearchBar/>*/}
                {/*</section>*/}
                <SearchBar />
                <div style={{ display: 'inline-grid', marginTop: '2rem', marginBottom: '2rem' }}>
                    <Typography variant="h4" sx={{ fontFamily: 'Do Hyeon', marginTop: '3em' }}>
                        🤖 봇 리스트
                    </Typography>
                    <div className={styles.grid} style={{ gap: '1em' }}>
                        <BotCard bot={botlist.sort((a,b)=>b.hearts - a.hearts)} />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                    <Stack spacing={2}>
                        <Pagination count={lastPage} page={page} size='large' onChange={handleChange} showFirstButton showLastButton hidePrevButton hideNextButton />
                    </Stack>
                </div>
            </main>
            <StickyFooter />
        </div>
    )
}
