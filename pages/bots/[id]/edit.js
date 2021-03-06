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
            .required('?????? ???????????? ??????????????????.'),
        siteurl: Yup.string()
            .url('????????? URL??? ??????????????????.'),
        opensource: Yup.string()
            .url('????????? URL??? ??????????????????.'),
        serverurl: Yup.string()
            .url('????????? URL??? ??????????????????.'),
        shortdesc: Yup.string()
            .min(10, '????????? 10????????? ??????????????????.')
            .max(60, '?????? 60????????? ?????????????????????.')
            .required('??? ?????? ????????? ??????????????????.'),
        longdesc: Yup.string()
            .min(50, '????????? 50????????? ??????????????????.')
            .max(1000, '?????? 1000????????? ?????????????????????.')
            .required('??? ???????????? ????????? ??????????????????.'),
        acceptTerms: Yup.bool()
            .oneOf([true], '??? ??????????????? ??????????????????.'),
        captcha: Yup.string()
            .required('????????? ?????? ????????? ??????????????????.'),
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
            return setalertmessage({ err: true, type: 'error', title: '?????????????????? ??????!', message: '????????? ?????????????????????.' })
        }
        if (categoryerr) {
            setCategoryErr(true)
            return setalertmessage({ err: true, type: 'error', title: '?????????????????? ??????!', message: '??????????????? ??????????????????????????????!' })
        }
        values.category = category.selectedOptions
        if (libraryerr) {
            setLibraryErr(true)
            return setalertmessage({ err: true, type: 'error', title: '?????????????????? ??????!', message: '?????????????????? ??????????????????????????????!' })
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
                    setalertmessage({ err: true, type: 'success', title: '????????????!', message: '??????????????? ??? ????????? ?????? ???????????????! ????????? ??? ???????????? ???????????????.' })
                    CaptchaRef?.current?.resetCaptcha()
                    setTimeout(() => {
                        router.push('/bots/' + router.query.id)
                    }, 3000)
                } else {
                    setalertmessage({ err: true, type: 'error', title: '????????????!', message: data.message })
                }

            })
            .catch(e => console.log(e))
    }
    function EditOwners(values) {
        //alert(JSON.stringify(values))
        CaptchaRef?.current?.resetCaptcha()
        // if (!isValid) {
        //     trigger(Object.keys(errors)[0], {shouldFocus: true})
        //     return setalertmessage({err: true, type: 'error', title: '?????????????????? ??????!', message: '????????? ?????????????????????.'})
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
                    setalertmessage({ err: true, type: 'success', title: '????????????!', message: '??????????????? ??? ????????? ?????? ???????????????! ????????? ??? ???????????? ???????????????.' })
                    setTimeout(() => {
                        router.push('/bots/' + router.query.id)
                    }, 3000)
                } else {
                    setalertmessage({ err: true, type: 'error', title: '????????????!', message: data.message })
                }

            })
            .catch(e => console.log(e))
    }
    function EditOwnerShip(values) {
        //alert(JSON.stringify(values))
        CaptchaRef?.current?.resetCaptcha()
        // if (!isValid) {
        //     trigger(Object.keys(errors)[0], {shouldFocus: true})
        //     return setalertmessage({err: true, type: 'error', title: '?????????????????? ??????!', message: '????????? ?????????????????????.'})
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
                    setalertmessage({ err: true, type: 'success', title: '????????????!', message: '??????????????? ??? ????????? ?????? ???????????????! ????????? ??? ???????????? ???????????????.' })
                    setTimeout(() => {
                        router.push('/bots/' + router.query.id)
                    }, 3000)
                } else {
                    setalertmessage({ err: true, type: 'error', title: '????????????!', message: data.message })
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
                    setalertmessage({ err: true, type: 'success', title: '????????????!', message: '??????????????? ?????? ?????? ???????????????! ????????? ?????? ???????????? ???????????????.' })
                    setTimeout(() => {
                        router.push('/')
                    }, 3000)
                } else {
                    setalertmessage({ err: true, type: 'error', title: '????????????!', message: data.message })
                }

            })
            .catch(e => console.log(e))
    }
    const SelectCategoryOption = [
        { value: 'manage', label: '??????' },
        { value: 'music', label: '??????' },
        { value: 'util', label: '????????????' },
        { value: 'game', label: '??????' },
        { value: 'matchhistory', label: '??????' },
        { value: 'search', label: '??????' },
        { value: 'school', label: '??????' },
        { value: 'cov19', label: '?????????' },
        { value: 'etc', label: '??????' }
    ]
    const SelectLibraryOption = [
        { value: 'discord.py', label: 'discord.py' },
        { value: 'discord.js', label: 'discord.js' },
        { value: 'py-cord', label: 'py-cord' },
        { value: 'next-cord', label: 'next-cord' },
        { value: 'DiscordGo', label: 'DiscordGo' },
        { value: 'dico', label: 'dico' },
        { value: 'etc', label: '??????' },
        { value: 'hidden', label: '?????????' },
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
            <HeadTag title="?????????"
                img={bot.botavatar}
                url={process.env.BASE_URL + "bots/" + data.botid + '/edit'}
                description='????????? ?????? ????????? ?????? ???????????? ??????, Universe' />
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
                    <strong>( {bot.botname} ) ????????????</strong>
                </Typography>
                {/*handleSubmit(()=>Submit(getValues()))*/}
                <form onSubmit={(event) => {
                    event.preventDefault()
                    setSubmit(true)
                }} autoComplete='false'>
                    <Divider style={{ marginTop: '1rem' }}><strong>??? ?????? ??????</strong></Divider>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>?????????</strong><span
                                style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                            <p style={{ margin: '0' }}>??? ????????? ??? ?????? ?????? ?????? ?????? ????????? ???????????????. (Prefix).</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="!" name="botprefix" id="botprefix"
                            {...register("botprefix")}
                            error={errors.botprefix} helperText={errors.botprefix?.message} />
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>???????????????</strong><span
                                style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                            <p style={{ margin: '0' }}>???????????? ????????? ?????????????????? ???????????????.(??????????????? ???????????? {'??????'}??? ??????????????????.)</p>
                        </div>
                        <div style={{ marginTop: '0.3em' }}>
                            <Select options={SelectLibraryOption} defaultValue={bot.library === 'etc' && {
                                value: 'etc',
                                label: '??????'
                            } || bot.library === 'hidden' && { value: 'hidden', label: '?????????' } || {
                                value: bot.library,
                                label: bot.library
                            }} onChange={HandleLibrary} placeholder="?????????????????? ???????????????." ref={ref => {
                                libraryselectRef = ref
                            }}
                                components={makeAnimated()} />
                            {
                                libraryerr ? (
                                    <p style={{ margin: '0', color: 'red' }}>?????????????????? ??????????????????.</p>
                                ) : null
                            }
                        </div>
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>????????????</strong><span
                                style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                            <p style={{ margin: '0' }}>?????? ????????? ???????????????.</p>
                        </div>
                        <div style={{ marginTop: '0.3em' }}>
                            <Select options={SelectCategoryOption} isMulti ref={ref => {
                                categoryselectRef = ref
                            }} onChange={HandleCategory} defaultValue={bot.category} placeholder="??????????????? ???????????????." closeMenuOnSelect={false}
                                components={makeAnimated()} />
                            {
                                categoryerr ? (
                                    <p style={{ margin: '0', color: 'red' }}>??????????????? ?????? 1????????? ??????????????????. ??????, ????????? ??????????????????.</p>
                                ) : null
                            }
                        </div>
                    </div>
                    <Divider style={{ marginTop: '1rem' }}><strong>??? ???????????? ??????</strong></Divider>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>??? ????????? URL</strong></Typography>
                            <p style={{ margin: '0' }}>??? ?????????????????? ?????? URL??? ???????????????.</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="https://example.com" name="siteurl" id="siteurl"
                            {...register("siteurl")}
                            error={errors.siteurl} helperText={errors.siteurl?.message} />
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>???????????? URL</strong></Typography>
                            <p style={{ margin: '0' }}>?????? ????????? ?????????????????? URL??? ???????????????.(Github, Gist??????)</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="https://github.com/popop098/spacebots"
                            name="opensource" id="opensource"
                            {...register('opensource')}
                            error={errors.opensource} helperText={errors.opensource?.message} />
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>????????? ?????? URL</strong></Typography>
                            <p style={{ margin: '0' }}>?????? ?????? ????????? ?????? ??? ?????? ????????? ?????? URL??? ???????????????.</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="https://discord.gg/ABCDEFG" name="serverurl" id="serverurl"
                            {...register('serverurl')}
                            error={errors.serverurl} helperText={errors.serverurl?.message} />
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>??? ?????? URL</strong></Typography>
                            <p style={{ margin: '0' }}>?????? ?????????????????? URL??? ???????????????. ???????????? ???????????? ???????????????.(permission=0)</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="https://discord.com/oauth2/authorize?client_id=953110159247433758&scope=bot&permissions=0"
                            name="inviteurl" id="inviteurl"
                            {...register('inviteurl')}
                            error={errors.inviteurl} helperText={errors.inviteurl?.message} />
                    </div>
                    <Divider style={{ marginTop: '1rem' }}><strong>??? ???????????? ??????</strong></Divider>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>??? ??????</strong><span
                                style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                            <p style={{ margin: '0' }}>?????? ???????????? ????????? ????????? ??????????????????.(?????? 60???)</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="????????? ????????? ?????? ????????????!" name="shortdesc" id="shortdesc"
                            {...register('shortdesc')}
                            error={errors.shortdesc} helperText={errors.shortdesc?.message} />
                    </div>
                    <div style={{ display: 'grid', marginTop: '1.5em' }}>
                        <div>
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>??? ????????????</strong><span
                                style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                            <p style={{ margin: '0' }}>?????? ?????? ????????? ?????? ??????????????????.(?????? 1000???) <br />???????????? ????????? ???????????????.<br />Tip.
                                ???????????? {'<img src="IMG_URL" alt="IMG_NAME" width="X%"/>'}??? ??????????????? ????????????.</p>
                        </div>
                        <TextField style={{ gridColumn: 'span 1/span 1', marginTop: '0.5em' }} variant="outlined"
                            placeholder="????????? ????????? ?????? ????????????!" multiline
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
                            <Typography variant="h5" style={{ color: 'blue' }}><strong>??? ???????????? ????????????</strong></Typography>
                            <p style={{ margin: '0' }}>??????????????? ??????????????? ???????????? ???????????????.</p>
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
                                <Divider style={{ marginTop: '1rem', color: 'red' }}><strong>?????? ??????</strong></Divider>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FiAlertTriangle color='#f04747' size={30} />
                                    <Typography variant="h5" style={{ color: 'red' }}>
                                        <strong>??? ????????? ????????? ????????? ?????????????????????. ??????????????????.</strong>
                                    </Typography>
                                </div>
                                <div style={{ display: 'grid', marginTop: '1.5em' }}>
                                    <div>
                                        <Typography variant="h5" style={{ color: 'blue' }}><strong>?????? ?????? ??????</strong><span
                                            style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                                        <p>?????? ????????? ?????? ????????? ???????????????.(??????????????? ????????????????????????. ????????? ????????? ??????????????????.)</p>
                                        <p style={{ color: '#e32020' }}>????????? ????????? ????????? ???????????? ????????? ?????? ??????????????????.</p>
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
                                                            if (getValues('owners').find(x => x.id === dummyuser)) return alert('?????? ????????? ???????????????.')
                                                            if (dummyuser !== "") {
                                                                fetch('/api/users/' + dummyuser, {
                                                                    method: 'GET',
                                                                }).then(res => {
                                                                    if (res.status === 200) {
                                                                        res.json().then(data => {
                                                                            // if([...getValues('owners')].find(element=>element.id===data.userid))  return alert('?????? ????????? ???????????????.')
                                                                            setValue('owners', [...getValues('owners'), { id: data.userid, username: data.username, discriminator: data.discriminator, avatar: data.useravatar }])
                                                                        })
                                                                    } else {
                                                                        alert('????????? ????????? ????????????.')
                                                                    }
                                                                })
                                                            } else {
                                                                alert('??????ID??? ??????????????????.')
                                                            }

                                                        }}>
                                                        <IoMdPersonAdd />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            placeholder="????????? ??????ID??? ???????????????."
                                        />
                                    </FormControl>
                                    <HCaptcha sitekey={process.env.HCAPTCHA_SITE_KEY} size="invisible" onVerify={(token) => {
                                        setValue('captcha', token)
                                        EditOwners(getValues())
                                    }} ref={CaptchaRef} onError={(err) => {
                                        CaptchaRef?.current?.resetCaptcha()
                                        setalertmessage({ err: true, type: 'error', title: '????????????!', message: err })
                                    }}
                                        onExpire={() => {
                                            CaptchaRef?.current?.resetCaptcha()
                                            setalertmessage({
                                                err: true,
                                                type: 'error',
                                                title: '????????????!',
                                                message: "????????? ?????????????????????. ?????? ??????????????????."
                                            })
                                        }} />
                                    <Button color="error" variant="contained" style={{ marginTop: '1em' }} onClick={() => { CaptchaRef?.current?.execute() }}>????????????</Button>
                                </div>
                                <div style={{ display: 'grid', marginTop: '1.5em' }}>
                                    <div>
                                        <Typography variant="h5" style={{ color: 'blue' }}><strong>????????? ??????</strong><span
                                            style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                                        <p style={{ color: '#e32020' }}>?????? ???????????? ???????????????. ????????? ????????????????????? ??????????????????.</p>
                                        <p style={{ color: '#e32020' }}>???????????? ??????????????? ????????? ID??? ????????? <RiUserSearchLine />???????????? ????????? ???????????? ???????????? ??????????????? ????????????.</p>
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
                                                            if (dummyuser === data.id) return alert('??????????????? ???????????????????????????.')
                                                            fetch('/api/users/' + dummyuser, {
                                                                method: 'GET',
                                                            }).then(res => {
                                                                if (res.status === 200) {
                                                                    res.json().then(data => {
                                                                        // if([...getValues('owners')].find(element=>element.id===data.userid))  return alert('?????? ????????? ???????????????.')
                                                                        setDummynewowner({ id: dummynewowner, vaild: true })
                                                                        alert('?????????????????????. ??????: ' + data.username + '#' + data.discriminator)
                                                                    })
                                                                } else {
                                                                    alert('????????? ????????? ????????????.')
                                                                }
                                                            })

                                                        }}>
                                                        <RiUserSearchLine />
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            placeholder="????????? ??????ID??? ???????????????."
                                        />
                                        <p style={{ color: '#e32020', marginTop: '1em' }}>?????? ???????????? ????????? <strong>{bot.botname}</strong>??? ???????????????.</p>
                                        <TextField style={{ marginTop: '1em' }} variant="outlined" onChange={(e) => {
                                            if (e.target.value === bot.botname) return setDummynewowner({ id: dummynewowner.id, vaild: true, namevaild: true });
                                            if (e.target.value !== bot.botname) return setDummynewowner({ id: dummynewowner.id, vaild: true, namevaild: false });
                                        }} placeholder={`????????? ????????? ( ${bot.botname} ) ??????`} />
                                    </FormControl>
                                    <HCaptcha sitekey={process.env.HCAPTCHA_SITE_KEY} size="invisible" onVerify={(token) => {
                                        setValue('captcha', token)
                                        EditOwnerShip(getValues())
                                    }} ref={CaptchaRef} onError={(err) => {
                                        CaptchaRef?.current?.resetCaptcha()
                                        setalertmessage({ err: true, type: 'error', title: '????????????!', message: err })
                                    }}
                                        onExpire={() => {
                                            CaptchaRef?.current?.resetCaptcha()
                                            setalertmessage({
                                                err: true,
                                                type: 'error',
                                                title: '????????????!',
                                                message: "????????? ?????????????????????. ?????? ??????????????????."
                                            })
                                        }} />
                                    <Button color="error" variant="contained" disabled={!(dummynewowner.vaild && dummynewowner.namevaild)} style={{ marginTop: '1em' }} onClick={() => { CaptchaRef?.current?.execute() }}>????????????</Button>
                                </div>
                                <div style={{ display: 'grid', marginTop: '1.5em' }}>
                                    <div>
                                        <Typography variant="h5" style={{ color: 'blue' }}><strong>?????????</strong><span
                                            style={{ verticalAlign: 'top', color: 'red' }}>*</span></Typography>
                                        <p style={{ color: '#e32020' }}>?????? ???????????????. ????????? ????????????????????? ??????????????????.</p>
                                    </div>
                                    <TextField style={{ marginTop: '1em' }} onChange={(e) => {
                                        if (e.target.value === bot.botname) return setdeletevailed(true);
                                        if (e.target.value !== bot.botname) return setdeletevailed(false);
                                    }} variant="outlined" placeholder={`????????? ????????? ( ${bot.botname} ) ??????`} />
                                    <HCaptcha sitekey={process.env.HCAPTCHA_SITE_KEY} size="invisible" onVerify={(token) => {
                                        setValue('captcha', token)
                                        DeleteBot()
                                    }} ref={CaptchaRef} onError={(err) => {
                                        CaptchaRef?.current?.resetCaptcha()
                                        setalertmessage({ err: true, type: 'error', title: '????????????!', message: err })
                                    }}
                                        onExpire={() => {
                                            CaptchaRef?.current?.resetCaptcha()
                                            setalertmessage({
                                                err: true,
                                                type: 'error',
                                                title: '????????????!',
                                                message: "????????? ?????????????????????. ?????? ??????????????????."
                                            })
                                        }} />
                                    <Button color="error" variant="contained" disabled={!(deletevailed)} style={{ marginTop: '1em' }} onClick={() => { CaptchaRef?.current?.execute() }}>????????????</Button>
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
                            ???????????????????????????.</p>
                        {
                            submit ? <HCaptcha sitekey={process.env.HCAPTCHA_SITE_KEY} onVerify={(token) => {
                                setValue('captcha', token)
                                Submit(getValues())
                            }} ref={CaptchaRef} onError={(err) => {
                                CaptchaRef?.current?.resetCaptcha()
                                setalertmessage({ err: true, type: 'error', title: '????????????!', message: err })
                            }}
                                onExpire={() => {
                                    CaptchaRef?.current?.resetCaptcha()
                                    setalertmessage({
                                        err: true,
                                        type: 'error',
                                        title: '????????????!',
                                        message: "????????? ?????????????????????. ?????? ??????????????????."
                                    })
                                }} /> : (
                                <>
                                    <Button type="submit" variant="contained" color="primary"
                                        style={{ marginLeft: '1em' }}
                                        size='large'><FontAwesomeIcon icon={faLocationArrow}
                                            style={{ marginRight: '0.2em' }} />????????????</Button>
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
