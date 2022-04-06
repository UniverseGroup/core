import cookie from 'cookie'
import jwt from "jsonwebtoken";
import Bot from "../../../../models/bot";
import dbConnect from "../../../../lib/dbConnect";
import HeadTag from "../../../../components/headtag";
import dynamic from "next/dynamic";
import StickyFooter from "../../../../components/Footer";
import Typography from '@mui/material/Typography';
import { discordUrls, getUserData } from '../../../../lib/DiscordTool';
import Button from "@mui/material/Button";
import Image from "next/image";
import { useState } from 'react';
import useCopyClipboard from "react-use-clipboard";
import { BsCheck2Circle } from "react-icons/bs";
import { IoMdCopy } from "react-icons/io";
import { getToken } from "../../../../lib/Csrf";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Link from "next/link";
import PermissionError from "../../../403";
import {MdOutlineKeyboardBackspace} from "react-icons/md";
const ResponsiveAppBar = dynamic(() => import("../../../../components/navbar"));
import styles from '../../../../styles/Home.module.css'
export async function getServerSideProps({ req, res, query }) {
    let key = null;
    await dbConnect();
    try {
        const cookies = cookie.parse(req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY)
    } catch (e) {
        res.writeHead(302, { Location: discordUrls.login })
        res.end()
    }
    const csrf = getToken(req, res);
    // const botdata = await Bot.find({owners: {'$elemMatch':{'id':key?.id}}}, {_id: 0, __v: 0,token:0}).lean()
    const botdata = await Bot.findOne({ botid: query.id }, { _id: 0, __v: 0 }).lean()
    const userdata = await getUserData(query.id)
    botdata.discriminator = userdata.discriminator
    return {
        props: {
            bots: botdata,
            user: key,
            csrf: csrf
        }
    }
}
const application = ({ ...data }) => {
    const userdata = data.user
    const [botdata,setBotdata] = useState(data.bots)
    const csrf = data.csrf
    const [show, setShow] = useState(false)
    const [isopen, setIsopen] = useState(false)
    const [copied, setCopied] = useCopyClipboard(botdata.token, {
        successDuration: 2000
    })
    const [alert, setAlert] = useState({ show: false, type: 'info', title: '', message: '' })
    const reset = async () => {
        const res = await fetch('/api/bots/' + botdata.botid + '/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrf
            },
            body: JSON.stringify({
                token: botdata.token
            })
        })
        const data = await res.json()
        if (res.ok) {
            setBotdata(data.data)
            setIsopen(false)
            setShow(false)
            setAlert({ show: true, type: 'success', title: '토큰 재발급됨', message: '성공적으로 토큰을 재발급하였습니다.' })
            setTimeout(() => {
                setAlert({ show: false, type: 'info', title: '', message: '' })
            }, 4000)
        } else {
            setAlert({ show: true, type: 'error', title: '토큰 재발급 실패', message: data.message })
        }
    }
    if (!(botdata.owners.find(x => x.id === userdata.id)) && !(userdata.permission === 1)) return <PermissionError data={userdata} />
    return (
        <div className={styles.container}>
            <ResponsiveAppBar userdata={userdata} />
            <HeadTag title='Applications' img={process.env.NORMAL_IMG} description='다양한 봇과 서버가 모여 만들어진 공간, Universe'
                url={process.env.BASE_URL + 'applications'} />

            <main style={{ minHeight: '100vh' }}>
                <Dialog open={isopen} onClose={() => setIsopen(false)}>
                    <DialogTitle>정말로 토큰을 재발급하시겠습니까?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            재발급되면 현재 토큰은 무효로 바뀌며 새로운 토큰이 발급됩니다.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsopen(false)}>Cancel</Button>
                        <Button onClick={async () => await reset()}>재발급</Button>
                    </DialogActions>
                </Dialog>
                <div style={{ display: 'flex' }}>
                    <div style={{ position: 'relative', width: '15em', minHeight: '100vh', backgroundColor: '#4c80ba' }}>
                        <div style={{ alignItems: 'center', justifyContent: 'center', padding: '1em', width: '100%' }}>
                            <Link passHref href='/developers/applications'><Button variant="contained" fullWidth>
                                리스트
                            </Button></Link>
                            <Button variant="text" fullWidth sx={{ marginTop: '1em', color: '#ffffff' }}>
                                Docs
                            </Button>
                        </div>
                    </div>
                    <div style={{ padding: '1em' }}>
                        <Link href={`/developers/applications`} passHref><Typography variant="h4" component="h2" color='blue' style={{
                            display: 'flex', alignItems: 'center',
                            fontFamily: 'Do Hyeon', cursor: 'pointer'
                        }}>
                            <MdOutlineKeyboardBackspace size={35} /> 리스트로 돌아가기
                        </Typography></Link>
                        {
                            alert.show && (
                                <Alert severity={alert.type}>
                                    <AlertTitle>{alert.title}</AlertTitle>
                                    {alert.message}
                                </Alert>
                            )
                        }
                        <Typography variant="h3" sx={{ fontFamily: 'Do Hyeon', marginTop: '1em' }}>
                            봇 정보
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#c2c2c2' }}>
                            UNIVERSE에서 제공하는 다양한 API를 사용해보세요.
                        </Typography>
                        <div style={{ marginTop: '1em', display: 'flex', alignItems: 'center' }}>
                            <Image src={'/api/imageproxy?url=' + botdata.botavatar + '?size=512'} width={256} height={256} quality={100} />
                            <div style={{ marginLeft: '1em' }}>
                                <Typography variant="h4" sx={{ fontFamily: 'Do Hyeon' }}>
                                    {botdata.botname}#{botdata.discriminator}( {botdata.botid} )
                                </Typography>
                                <Typography variant="h5" sx={{ fontFamily: 'Do Hyeon' }}>
                                    토큰
                                </Typography>
                                <pre style={{ marginTop: '1em', width: '35em', height: '2em', overflowX: 'scroll' }}>
                                    {show ? botdata.token : '***************'}
                                </pre>
                                <Button variant="contained" onClick={() => setShow(!show)}>
                                    {show ? '숨기기' : '보이기'}
                                </Button>
                                <Button variant="contained" onClick={() => setIsopen(true)} sx={{ marginLeft: '0.5em' }}>
                                    토큰 재발급
                                </Button>
                                <Button variant="contained" color={copied ? "success" : "primary"} sx={{ marginLeft: '0.5em' }} onClick={setCopied}>
                                    {copied ? (<><BsCheck2Circle />복사됨</>) : (<><IoMdCopy /> 토큰 복사하기</>)}
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <StickyFooter />
        </div>

    )

}
export default application;