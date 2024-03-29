import cookie from "cookie";
import jwt from "jsonwebtoken";
//import ResponsiveAppBar from "../components/navbar";
import styles from '../../../styles/Addbot.module.css'
import 'emoji-mart/css/emoji-mart.css'
import Typography from "@mui/material/Typography";
import User from "../../../models/user";
import {
    Alert, AlertTitle,
    Divider,
    IconButton,
    TextField
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
// import Markdownviewer from "../components/markdownviewer";
import Box from "@mui/material/Box";
import { useRouter } from "next/router";
//import StickyFooter from "../components/Footer";
import dynamic from "next/dynamic";
import { EmojiEmotions } from "@mui/icons-material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons/faLocationArrow";
import Button from "@mui/material/Button";
import * as Yup from 'yup';
import { Picker } from 'emoji-mart'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import HeadTag from "../../../components/headtag";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import StickyFooter from "../../../components/Footer";
import { discordUrls } from "../../../lib/DiscordTool"
import Bot from "../../../models/bot";
import dbConnect from "../../../lib/dbConnect";
import { FiAlertTriangle } from "react-icons/fi";
import cdstyles from "../../../styles/Users.module.css";
import Image from "next/image";
import { TiDeleteOutline } from "react-icons/ti";
import FormControl from "@mui/material/FormControl";
import FilledInput from "@mui/material/FilledInput";
import InputAdornment from "@mui/material/InputAdornment";
import { IoMdPersonAdd } from "react-icons/io";
import { RiUserSearchLine } from "react-icons/ri";
import PermissionError from "../../403";
import { setNextUrl } from "../../../lib/_nextUrl";
// const Picker = dynamic(
//     () => import("emoji-mart")
// );
const Markdownviewer = dynamic(
    () => import("../../../components/markdownviewer"), {
    loading: () => null,
}
);
const ResponsiveAppBar = dynamic(() => import("../../../components/navbar"));
// const StickyFooter = dynamic(() => import("../components/Footer"));
// const makeAnimated = dynamic(
//     () => import("react-select/animated")
// );
export async function getServerSideProps({ req, res, query }) {
    let key = null;
    await dbConnect()
    try {
        const cookies = cookie.parse(req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY)
    } catch {
        // key = null;
        setNextUrl(req,res, "/bots/"+query.id+"/edit")
        res.writeHead(302, { Location: discordUrls.login })
        res.end()
    }
    const bot = await Bot.findOne({ botid: query.id }, { _id: 0, __v: 0 }).lean()
    const userdata = await User.findOne({ bots: { '$elemMatch': { 'botid': bot?.botid } } }, { _id: 0, __v: 0}).lean()
    return {
        props: {
            user: key,
            bot: bot,
            owner: userdata.bots
        }
    }
}

export default function Addbot({ ...key }) {
    const data = key.user;
    const bot = key.bot;
    const owner = key.owner;
    const [ableemojipicker, setableemojipicker] = useState(false);
    const [category, setCategory] = useState(undefined);
    const [library, setLibrary] = useState(null);
    const [categoryerr, setCategoryErr] = useState(false);
    const [libraryerr, setLibraryErr] = useState(false);
    const [submit, setSubmit] = useState(false)
    const [alertmessage, setalertmessage] = useState({})
    const [dummyuser, setDummyuser] = useState('')
    const [dummynewowner, setDummynewowner] = useState('')
    const router = useRouter()
    const validationSchema = Yup.object().shape({
        botprefix: Yup.string()
            .required('봇의 접두사를 입력해주세요.'),
        siteurl: Yup.string()
            .url('올바른 URL을 입력해주세요.'),
        opensource: Yup.string()
            .url('올바른 URL을 입력해주세요.'),
        serverurl: Yup.string()
            .url('올바른 URL을 입력해주세요.'),
        shortdesc: Yup.string()
            .min(10, '최소한 10자이상 입력해주세요.')
            .max(60, '최대 60자까지 입력가능합니다.')
            .required('봇 소개 문구를 기입해주세요.'),
        longdesc: Yup.string()
            .min(50, '최소한 50자이상 입력해주세요.')
            .max(1000, '최대 1000자까지 입력가능합니다.')
            .required('봇 상세설명 문구를 기입해주세요.'),
        acceptTerms: Yup.bool()
            .oneOf([true], '위 체크박스에 체크해주세요.'),
        captcha: Yup.string()
            .required('캡차로 봇이 아님을 증명해주세요.'),
        owners: Yup.array(),
        oldowner: Yup.string(),
        newowner: Yup.string(),
        botid: Yup.string()

    })
    let libraryselectRef = null
    let categoryselectRef = null
    const CaptchaRef = useRef(null)
    const [deletevailed, setdeletevailed] = useState(false)
    const formOptions = {
        resolver: yupResolver(validationSchema), defaultValues: {
            longdesc: bot.botdescription,
            botprefix: bot.prefix,
            siteurl: bot.website,
            opensource: bot.github,
            serverurl: bot.support,
            inviteurl: bot.invite,
            shortdesc: bot.slug,
            owners: bot.owners,
            botid: router.query.id,
            oldowner: data.id,
        }, mode: "all"
    };
    const { register, reset, formState: { errors, isValid }, watch, getValues, setValue, trigger, control, resetField } = useForm(formOptions);
    //const { errors } = formState;
    const Topto = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // for smoothly scrolling
        });
    }

    function Submit(values) {
        //alert(JSON.stringify(values))
        setSubmit(false)
        CaptchaRef?.current?.resetCaptcha()
        if (!isValid&& Object.keys(errors) !==[]) {
            trigger(Object.keys(errors)[0], { shouldFocus: true })
            return setalertmessage({ err: true, type: 'error', title: '필수기입필드 누락!', message: '무언가 누락되었습니다.' })
        }
        if (categoryerr) {
            setCategoryErr(true)
            return setalertmessage({ err: true, type: 'error', title: '필수기입필드 누락!', message: '카테고리를 설정하지않으셨습니다!' })
        }
        values.category = category.selectedOptions
        if (libraryerr) {
            setLibraryErr(true)
            return setalertmessage({ err: true, type: 'error', title: '필수기입필드 누락!', message: '라이브러리를 설정하지않으셨습니다!' })
        }
        values.library = library
        Topto()
        fetch(process.env.BASE_URL + 'api/bots/' + router.query.id, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })
            .then(async (res) => {
                const data = await res.json()
                console.log(data)
                setalertmessage({ err: false })
                if (res.ok && res.status === 200) {
                    console.log(data)
                    reset()
                    // libraryselectRef.clearValue()
                    // categoryselectRef.clearValue()
                    setalertmessage({ err: true, type: 'success', title: '수정완료!', message: '성공적으로 봇 정보를 수정 하였습니다! 잠시후 봇 페이지로 이동합니다.' })
                    CaptchaRef?.current?.resetCaptcha()
                    setTimeout(() => {
                        router.push('/bots/' + router.query.id)
                    }, 3000)
                } else {
                    setalertmessage({ err: true, type: 'error', title: '에러발생!', message: data.message })
                }

            })
            .catch(e => console.log(e))
    }
    function EditOwners(values) {
        //alert(JSON.stringify(values))
        CaptchaRef?.current?.resetCaptcha()
        // if (!isValid) {
        //     trigger(Object.keys(errors)[0], {shouldFocus: true})
        //     return setalertmessage({err: true, type: 'error', title: '필수기입필드 누락!', message: '무언가 누락되었습니다.'})
        // }
        Topto()
        console.log(values)
        fetch(process.env.BASE_URL + 'api/bots/' + router.query.id, {
            method: 'PATCH',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })
            .then(async (res) => {
                const data = await res.json()
                console.log(data)
                setalertmessage({ err: false })
                if (res.ok && res.status === 200) {
                    console.log(data)
                    setalertmessage({ err: true, type: 'success', title: '수정완료!', message: '성공적으로 봇 정보를 수정 하였습니다! 잠시후 봇 페이지로 이동합니다.' })
                    setTimeout(() => {
                        router.push('/bots/' + router.query.id)
                    }, 3000)
                } else {
                    setalertmessage({ err: true, type: 'error', title: '에러발생!', message: data.message })
                }

            })
            .catch(e => console.log(e))
    }
    function EditOwnerShip(values) {
        //alert(JSON.stringify(values))
        CaptchaRef?.current?.resetCaptcha()
        // if (!isValid) {
        //     trigger(Object.keys(errors)[0], {shouldFocus: true})
        //     return setalertmessage({err: true, type: 'error', title: '필수기입필드 누락!', message: '무언가 누락되었습니다.'})
        // }
        Topto()
        console.log(values)
        fetch(process.env.BASE_URL + 'api/users/' + dummynewowner.id, {
            method: 'PATCH',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        })
            .then(async (res) => {
                const data = await res.json()
                console.log(data)
                setalertmessage({ err: false })
                if (res.ok && res.status === 200) {
                    console.log(data)
                    setalertmessage({ err: true, type: 'success', title: '수정완료!', message: '성공적으로 봇 정보를 수정 하였습니다! 잠시후 봇 페이지로 이동합니다.' })
                    setTimeout(() => {
                        router.push('/bots/' + router.query.id)
                    }, 3000)
                } else {
                    setalertmessage({ err: true, type: 'error', title: '에러발생!', message: data.message })
                }

            })
            .catch(e => console.log(e))
    }
    function DeleteBot() {
        CaptchaRef?.current?.resetCaptcha()
        Topto()
        fetch(process.env.BASE_URL + 'api/bots/' + router.query.id, {
            method: 'DELETE',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                captcha: getValues('captcha')
            })
        })
            .then(async (res) => {
                const data = await res.json()
                console.log(data)
                setalertmessage({ err: false })
                if (res.ok && res.status === 200) {
                    console.log(data)
                    setalertmessage({ err: true, type: 'success', title: '삭제완료!', message: '성공적으로 봇을 삭제 하였습니다! 잠시후 메인 페이지로 이동합니다.' })
                    setTimeout(() => {
                        router.push('/')
                    }, 3000)
                } else {
                    setalertmessage({ err: true, type: 'error', title: '에러발생!', message: data.message })
                }

            })
            .catch(e => console.log(e))
    }
    const SelectCategoryOption = [
        { value: 'manage', label: '관리' },
        { value: 'music', label: '뮤직' },
        { value: 'util', label: '유틸리티' },
        { value: 'game', label: '게임' },
        { value: 'matchhistory', label: '전적' },
        { value: 'search', label: '검색' },
        { value: 'school', label: '학교' },
        { value: 'cov19', label: '코로나' },
        { value: 'etc', label: '기타' }
    ]
    const SelectLibraryOption = [
        { value: 'discord.py', label: 'discord.py' },
        { value: 'discord.js', label: 'discord.js' },
        { value: 'py-cord', label: 'py-cord' },
        { value: 'next-cord', label: 'next-cord' },
        { value: 'DiscordGo', label: 'DiscordGo' },
        { value: 'dico', label: 'dico' },
        { value: 'etc', label: '기타' },
        { value: 'hidden', label: '비공개' },
    ]

    function HandleCategory(selectedOptions) {
        console.log(category);
        if (selectedOptions.length === 0) {
            setCategoryErr(true)
        }
        if (categoryerr) {
            setCategoryErr(false)
        }
        setCategory({ selectedOptions });
    }

    function HandleLibrary(selectedOptions) {
        console.log(library);
        if (selectedOptions) {
            setLibraryErr(false)
        }
        setLibrary(selectedOptions?.value);
    }

    const HandleEmoji = (emoji, event) => {
        console.log(event)
        setValue('longdesc', getValues('longdesc') + emoji.native)
        setableemojipicker(!ableemojipicker)
    }
    useEffect(() => {
        setLibrary(bot.library)
        setCategory({
            selectedOptions: bot.category
        })
    }, [])
    if (!(bot.owners.find(x => x.id === data.id)) && !(data.permission === 1)) return <PermissionError data={data} />
    return (
        <div style={{ padding: '0rem', overflowX: 'hidden' }}>
            <ResponsiveAppBar userdata={data} />
            <HeadTag title="봇수정"
                img={bot.botavatar}
                url={process.env.BASE_URL + "bots/" + data.botid + '/edit'}
                description='다양한 봇과 서버가 모여 만들어진 공간, Universe' />
            <main className={styles.form} style={{ marginBottom: '5em' }}>
                {
                    alertmessage.err ?
                        (
                            <>
                                <Alert severity={alertmessage.type} style={{ marginTop: '2em' }}>
                                    <AlertTitle>{alertmessage.title}</AlertTitle>
                                    {alertmessage.message}
                                </Alert>
                            </>
                        )
                        :
                        null
                }

                <Typography variant="h4" style={{ marginTop: '2rem' }}>
                    <strong>( {bot.botname} ) 수정하기</strong>
                </Typography>
                {/*handleSubmit(()=>Submit(getValues()))*/}
                <form onSubmit={(event) => {
                    event.preventDefault()
                    setSubmit(true)
                }} autoComplete='false'>
                    <Divider style={{ marginTop: '1rem' }}><strong>봇 정보 섹션</strong></Divider>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>접두사</strong><span
                                style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                            <p style={{ margin: '0' }}>봇 사용시 앞 쪽에 붙은 기호 또는 글자를 의미합니다. (Prefix).</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="!" name="botprefix" id="botprefix"
                            {...register("botprefix")}
                            error={errors.botprefix} helperText={errors.botprefix?.message} />
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>라이브러리</strong><span
                                style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                            <p style={{ margin: '0' }}>봇제작에 사용된 라이브러리를 의미합니다.(해당사항이 없을경우 {'기타'}를 선택해주세요.)</p>
                        </div>
                        <div style={{ marginTop: '0.3em' }}>
                            <Select options={SelectLibraryOption} defaultValue={bot.library === 'etc' && {
                                value: 'etc',
                                label: '기타'
                            } || bot.library === 'hidden' && { value: 'hidden', label: '비공개' } || {
                                value: bot.library,
                                label: bot.library
                            }} onChange={HandleLibrary} placeholder="라이브러리를 선택하세요." ref={ref => {
                                libraryselectRef = ref
                            }}
                                components={makeAnimated()} />
                            {
                                libraryerr ? (
                                    <p style={{ margin: '0', color: 'red' }}>라이브러리를 선택해주세요.</p>
                                ) : null
                            }
                        </div>
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>카테고리</strong><span
                                style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                            <p style={{ margin: '0' }}>봇의 종류를 의미합니다.</p>
                        </div>
                        <div style={{ marginTop: '0.3em' }}>
                            <Select options={SelectCategoryOption} isMulti ref={ref => {
                                categoryselectRef = ref
                            }} onChange={HandleCategory} defaultValue={bot.category} placeholder="카테고리를 선택하세요." closeMenuOnSelect={false}
                                components={makeAnimated()} />
                            {
                                categoryerr ? (
                                    <p style={{ margin: '0', color: 'red' }}>카테고리를 최소 1개이상 선택해주세요. 또한, 정확히 선택해주세요.</p>
                                ) : null
                            }
                        </div>
                    </div>
                    <Divider style={{ marginTop: '1rem' }}><strong>봇 부가정보 섹션</strong></Divider>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>봇 사이트 URL</strong></Typography>
                            <p style={{ margin: '0' }}>봇 소개사이트와 같은 URL을 의미합니다.</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="https://example.com" name="siteurl" id="siteurl"
                            {...register("siteurl")}
                            error={errors.siteurl} helperText={errors.siteurl?.message} />
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>오픈소스 URL</strong></Typography>
                            <p style={{ margin: '0' }}>봇의 소스가 공개되어있는 URL을 의미합니다.(Github, Gist등등)</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="https://github.com/popop098/spacebots"
                            name="opensource" id="opensource"
                            {...register('opensource')}
                            error={errors.opensource} helperText={errors.opensource?.message} />
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>서포트 서버 URL</strong></Typography>
                            <p style={{ margin: '0' }}>봇에 대한 지원을 받을 수 있는 서버의 초대 URL을 의미합니다.</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="https://discord.gg/ABCDEFG" name="serverurl" id="serverurl"
                            {...register('serverurl')}
                            error={errors.serverurl} helperText={errors.serverurl?.message} />
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>봇 초대 URL</strong></Typography>
                            <p style={{ margin: '0' }}>봇을 초대할수있는 URL을 의미합니다. 비워둘시 자동으로 생성합니다.(permission=0)</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="https://discord.com/oauth2/authorize?client_id=953110159247433758&scope=bot&permissions=0"
                            name="inviteurl" id="inviteurl"
                            {...register('inviteurl')}
                            error={errors.inviteurl} helperText={errors.inviteurl?.message} />
                    </div>
                    <Divider style={{ marginTop: '1rem' }}><strong>봇 상세정보 섹션</strong></Divider>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>봇 소개</strong><span
                                style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                            <p style={{ margin: '0' }}>봇을 소개하는 문구를 간단히 기입해보세요.(최대 60자)</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="엄청난 다기능 봇을 이곳에서!" name="shortdesc" id="shortdesc"
                            {...register('shortdesc')}
                            error={errors.shortdesc} helperText={errors.shortdesc?.message} />
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>봇 상세설명</strong><span
                                style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                            <p style={{ margin: '0' }}>봇에 대한 자세한 설명 기입해보세요.(최대 1000자) <br />마크다운 문법도 지원합니다.<br />Tip.
                                이미지는 {'<img src="IMG_URL" alt="IMG_NAME" width="X%"/>'}로 사용하시면 좋습니다.</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="엄청난 다기능 봇을 이곳에서!" multiline
                            rows={10} name="longdesc"
                            {...register('longdesc')}
                            error={errors.longdesc} helperText={errors.longdesc?.message} />
                        {/* <IconButton onClick={() => setableemojipicker(!ableemojipicker)} style={{
                            position: 'relative',
                            top: '-40px',
                            width: '1.5em',
                            height: '1.5em'
                        }}><EmojiEmotions color={ableemojipicker ? ('primary') : ('default')} /></IconButton>
                        {
                            ableemojipicker && (
                                <div style={{ display: 'flex', justifyContent: 'left', position: 'relative', top: '-40px' }}>
                                    <Picker set='facebook' useButton={false} sheetSize={16} onClick={HandleEmoji} />
                                </div>
                            )
                        } */}
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>봇 상세설명 미리보기</strong></Typography>
                            <p style={{ margin: '0' }}>상세설명이 유저들에게 보여지는 모습입니다.</p>
                        </div>
                        <Box sx={{
                            width: 'auto',
                            minHeight: 300,
                            height: 'auto',
                            backgroundColor: 'white',
                            borderRadius: '0.5em',
                            border: '1px solid #6e6d6d',
                            padding: '0.8em',
                            overflow: 'auto'
                        }}><Markdownviewer value={watch("longdesc")} /></Box>
                    </div>
                    {
                        (data.permission === '1' || owner !== []) && (
                            <>
                                <Divider style={{ marginTop: '1rem', color: 'red' }}><strong>위험 구역</strong></Divider>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FiAlertTriangle color='#f04747' size={30} />
                                    <Typography variant="h5" style={{ color: 'red' }}>
                                        <strong>이 섹션은 민감한 정보를 다루고있습니다. 주의해주세요.</strong>
                                    </Typography>
                                </div>
                                <div style={{ display: 'grid', marginTop: '1.5em' }}>
                                    <div>
                                        <Typography variant="h5" style={{ color: 'blue' }}><strong>공동 오너 설정</strong><span
                                            style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                                        <p>공동 개발자 혹은 오너를 등록합니다.(자기자신은 삭제할수없습니다. 소유권 이전을 이용해주세요.)</p>
                                        <p style={{ color: '#e32020' }}>수정후 반드시 아래의 적용하기 버튼을 통해 적용해주세요.</p>
                                    </div>
                                    <Box sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        columnGap: '0.3em',
                                    }}>
                                        <Controller render={({ field: { onChange } }) => (
                                            getValues('owners').map((owner, index) => {
                                                return (
                                                    <>
                                                        <div className={cdstyles.Card} style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: '1em', marginTop: '1em', columnGap: "1em", backgroundColor: 'gray', borderRadius: '8px', padding: '5px', minWidth: '14em', height: '4.2em', color: 'inherit' }}>
                                                            <Image quality={100} width='50px' height='50px' src={`/api/imageproxy?url=${encodeURIComponent(owner.avatar + "?size=512")}`} />
                                                            <div style={{ flexGrow: '1', textAlign: 'left' }}>
                                                                <Typography variant="h6" style={{ fontWeight: 'bold' }}>{owner.username}#{owner.discriminator}</Typography>
                                                            </div>
                                                            {
                                                                owner.id !== data.id && (
                                                                    <IconButton aria-label="delete" sx={{ padding: 0 }} onClick={() => {
                                                                        function findindex(element) {
                                                                            if (element.id === owner.id) {
                                                                                return true;
                                                                            }
                                                                        }
                                                                        const vl = getValues('owners').filter(el => !(el.id === owner.id));
                                                                        onChange(vl)
                                                                        console.log(getValues('owners'))
                                                                    }}>
                                                                        <TiDeleteOutline size={20} color='red' />
                                                                    </IconButton>
                                                                )
                                                            }

                                                        </div>
                                                    </>
                                                )
                                            })
                                        )} name='owners' control={control} defaultValue={bot.owners} />

                                    </Box>
                                    <FormControl variant="outlined" style={{ marginTop: '1em' }}>
                                        <FilledInput
                                            type="text"
                                            onChange={(e) => { setDummyuser(e.target.value) }}
                                            value={dummyuser}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton edge="end"
                                                        onClick={() => {
                                                            setDummyuser('')
                                                            if (getValues('owners').find(x => x.id === dummyuser)) return alert('이미 추가된 유저입니다.')
                                                            if (dummyuser !== "") {
                                                                fetch('/api/users/' + dummyuser, {
                                                                    method: 'GET',
                                                                }).then(res => {
                                                                    if (res.status === 200) {
                                                                        res.json().then(data => {
                                                                            // if([...getValues('owners')].find(element=>element.id===data.userid))  return alert('이미 추가된 유저입니다.')
                                                                            setValue('owners', [...getValues('owners'), { id: data.userid, username: data.username, discriminator: data.discriminator, avatar: data.useravatar }])
                                                                        })
                                                                    } else {
                                                                        alert('유저를 찾을수 없습니다.')
                                                                    }
                                                                })
                                                            } else {
                                                                alert('유저ID를 입력해주세요.')
                                                            }

                                                        }}>
                                                        <IoMdPersonAdd />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            placeholder="이곳에 유저ID를 입력하세요."
                                        />
                                    </FormControl>
                                    <HCaptcha sitekey={process.env.HCAPTCHA_SITE_KEY} size="invisible" onVerify={(token) => {
                                        setValue('captcha', token)
                                        EditOwners(getValues())
                                    }} ref={CaptchaRef} onError={(err) => {
                                        CaptchaRef?.current?.resetCaptcha()
                                        setalertmessage({ err: true, type: 'error', title: '캡챠에러!', message: err })
                                    }}
                                        onExpire={() => {
                                            CaptchaRef?.current?.resetCaptcha()
                                            setalertmessage({
                                                err: true,
                                                type: 'error',
                                                title: '캡챠에러!',
                                                message: "캡챠가 만료되었습니다. 다시 시도해주세요."
                                            })
                                        }} />
                                    <Button color="error" variant="contained" style={{ marginTop: '1em' }} onClick={() => { CaptchaRef?.current?.execute() }}>적용하기</Button>
                                </div>
                                <div style={{ display: 'grid', marginTop: '1.5em' }}>
                                    <div>
                                        <Typography variant="h5" style={{ color: 'blue' }}><strong>소유권 이전</strong><span
                                            style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                                        <p style={{ color: '#e32020' }}>봇의 소유권을 이전합니다. 이전후 되돌릴수없으니 주의바랍니다.</p>
                                        <p style={{ color: '#e32020' }}>소유권을 이전하고픈 유저의 ID를 입력후 <RiUserSearchLine />아이콘을 클릭해 유효성을 체크한뒤 적용하시기 바랍니다.</p>
                                    </div>
                                    <FormControl variant="outlined" style={{ marginTop: '1em' }}>
                                        <FilledInput
                                            type="text"
                                            onChange={(e) => { setDummynewowner(e.target.value) }}
                                            value={dummynewowner.id}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton edge="end"
                                                        disabled={dummynewowner === ''}
                                                        onClick={() => {
                                                            setDummynewowner('')
                                                            const dummyuser = dummynewowner
                                                            if (dummyuser === data.id) return alert('자기자신을 기입하실수없습니다.')
                                                            fetch('/api/users/' + dummyuser, {
                                                                method: 'GET',
                                                            }).then(res => {
                                                                if (res.status === 200) {
                                                                    res.json().then(data => {
                                                                        // if([...getValues('owners')].find(element=>element.id===data.userid))  return alert('이미 추가된 유저입니다.')
                                                                        setDummynewowner({ id: dummynewowner, vaild: true })
                                                                        alert('확인되었습니다. 유저: ' + data.username + '#' + data.discriminator)
                                                                    })
                                                                } else {
                                                                    alert('유저를 찾을수 없습니다.')
                                                                }
                                                            })

                                                        }}>
                                                        <RiUserSearchLine />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            placeholder="이곳에 유저ID를 입력하세요."
                                        />
                                        <p style={{ color: '#e32020', marginTop: '1em' }}>계속 하시려면 아래에 <strong>{bot.botname}</strong>을 입력하세요.</p>
                                        <TextField style={{ marginTop: '1em' }} variant="outlined" onChange={(e) => {
                                            if (e.target.value === bot.botname) return setDummynewowner({ id: dummynewowner.id, vaild: true, namevaild: true });
                                            if (e.target.value !== bot.botname) return setDummynewowner({ id: dummynewowner.id, vaild: true, namevaild: false });
                                        }} placeholder={`이곳에 봇이름 ( ${bot.botname} ) 입력`} />
                                    </FormControl>
                                    <HCaptcha sitekey={process.env.HCAPTCHA_SITE_KEY} size="invisible" onVerify={(token) => {
                                        setValue('captcha', token)
                                        EditOwnerShip(getValues())
                                    }} ref={CaptchaRef} onError={(err) => {
                                        CaptchaRef?.current?.resetCaptcha()
                                        setalertmessage({ err: true, type: 'error', title: '캡챠에러!', message: err })
                                    }}
                                        onExpire={() => {
                                            CaptchaRef?.current?.resetCaptcha()
                                            setalertmessage({
                                                err: true,
                                                type: 'error',
                                                title: '캡챠에러!',
                                                message: "캡챠가 만료되었습니다. 다시 시도해주세요."
                                            })
                                        }} />
                                    <Button color="error" variant="contained" disabled={!(dummynewowner.vaild && dummynewowner.namevaild)} style={{ marginTop: '1em' }} onClick={() => { CaptchaRef?.current?.execute() }}>적용하기</Button>
                                </div>
                                <div style={{ display: 'grid', marginTop: '1.5em' }}>
                                    <div>
                                        <Typography variant="h5" style={{ color: 'blue' }}><strong>봇삭제</strong><span
                                            style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                                        <p style={{ color: '#e32020' }}>봇을 삭제합니다. 삭제후 되돌릴수없으니 주의바랍니다.</p>
                                    </div>
                                    <TextField style={{ marginTop: '1em' }} onChange={(e) => {
                                        if (e.target.value === bot.botname) return setdeletevailed(true);
                                        if (e.target.value !== bot.botname) return setdeletevailed(false);
                                    }} variant="outlined" placeholder={`이곳에 봇이름 ( ${bot.botname} ) 입력`} />
                                    <HCaptcha sitekey={process.env.HCAPTCHA_SITE_KEY} size="invisible" onVerify={(token) => {
                                        setValue('captcha', token)
                                        DeleteBot()
                                    }} ref={CaptchaRef} onError={(err) => {
                                        CaptchaRef?.current?.resetCaptcha()
                                        setalertmessage({ err: true, type: 'error', title: '캡챠에러!', message: err })
                                    }}
                                        onExpire={() => {
                                            CaptchaRef?.current?.resetCaptcha()
                                            setalertmessage({
                                                err: true,
                                                type: 'error',
                                                title: '캡챠에러!',
                                                message: "캡챠가 만료되었습니다. 다시 시도해주세요."
                                            })
                                        }} />
                                    <Button color="error" variant="contained" disabled={!(deletevailed)} style={{ marginTop: '1em' }} onClick={() => { CaptchaRef?.current?.execute() }}>삭제하기</Button>
                                </div>
                            </>
                        )
                    }

                    <Divider style={{ marginTop: '1rem' }} />
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'baseline',
                        textAlign: 'right',
                        marginTop: '1.5em'
                    }}>
                        <span style={{ verticalAlign: 'top', color: 'red', fontSize: '1.5em' }}>*</span><p>=
                            필수입력사항입니다.</p>
                        {
                            submit ? <HCaptcha sitekey={process.env.HCAPTCHA_SITE_KEY} onVerify={(token) => {
                                setValue('captcha', token)
                                Submit(getValues())
                            }} ref={CaptchaRef} onError={(err) => {
                                CaptchaRef?.current?.resetCaptcha()
                                setalertmessage({ err: true, type: 'error', title: '캡챠에러!', message: err })
                            }}
                                onExpire={() => {
                                    CaptchaRef?.current?.resetCaptcha()
                                    setalertmessage({
                                        err: true,
                                        type: 'error',
                                        title: '캡챠에러!',
                                        message: "캡챠가 만료되었습니다. 다시 시도해주세요."
                                    })
                                }} /> : (
                                <>
                                    <Button type="submit" variant="contained" color="primary"
                                        style={{ marginLeft: '1em' }}
                                        size='large'><FontAwesomeIcon icon={faLocationArrow}
                                            style={{ marginRight: '0.2em' }} />수정하기</Button>
                                </>
                            )
                        }
                    </div>
                </form>

            </main>
            <StickyFooter />
        </div>
    )
}
