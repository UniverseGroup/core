import cookie from "cookie";
import jwt from "jsonwebtoken";
import styles from '../styles/Addbot.module.css'
// import 'emoji-mart/css/emoji-mart.css'
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import {
    Alert, AlertTitle,
    Divider,
    IconButton,
    TextField
} from "@mui/material";
import {useState,useRef} from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Box from "@mui/material/Box";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";
import {EmojiEmotions} from "@mui/icons-material";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationArrow} from "@fortawesome/free-solid-svg-icons/faLocationArrow";
import Button from "@mui/material/Button";
import * as Yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm,useFormState} from "react-hook-form";
import HeadTag from "../components/headtag";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import StickyFooter from "../components/Footer";
import {discordUrls} from "../lib/DiscordTool"
// const Picker = dynamic(
//     () => import("emoji-mart").then(({ Picker }) => Picker),
//     { ssr: false }
// );
const Markdownviewer = dynamic(
    () => import("../components/markdownviewer"), {
        ssr: false
    }
);
const ResponsiveAppBar = dynamic(() => import("../components/navbar"));
export async function getServerSideProps(ctx) {
    let key = null;
    try {
        const cookies = cookie.parse(ctx.req.headers.cookie);
        const user = cookies.token;
        key = jwt.verify(user, process.env.JWT_KEY)
    } catch {
        // key = null;
        ctx.res.writeHead(302, { Location: discordUrls.login })
        ctx.res.end()
    }
    return {
        props: {
            user: key
        }
    }
}

export default function Addbot({...key}) {
    const data = key.user;
    const [ableemojipicker, setableemojipicker] = useState(false);
    const [category, setCategory] = useState(undefined);
    const [library, setLibrary] = useState(null);
    const [categoryerr, setCategoryErr] = useState(true);
    const [libraryerr, setLibraryErr] = useState(true);
    const [token, setToken] = useState(null)
    const [submit, setSubmit] = useState(false)
    const [alertmessage, setalertmessage] = useState({})
    const validationSchema = Yup.object().shape({
        botid: Yup.string()
            .matches(/^[0-9]{17,}$/, '숫자만 기입해주세요.')
            .required('봇의 ID를 입력해주세요.'),
        botprefix: Yup.string()
            .required('봇의 접두사를 입력해주세요.'),
        siteurl: Yup.string()
            .url('올바른 URL을 입력해주세요.'),
        opensource: Yup.string()
            .url('올바른 URL을 입력해주세요.'),
        serverurl: Yup.string()
            .url('올바른 URL을 입력해주세요.'),
        shortdesc: Yup.string()
            .min(10,'최소한 10자이상 입력해주세요.')
            .max(60,'최대 60자까지 입력가능합니다.')
            .required('봇 소개 문구를 기입해주세요.'),
        longdesc: Yup.string()
            .min(50,'최소한 50자이상 입력해주세요.')
            .max(1000,'최대 1000자까지 입력가능합니다.')
            .required('봇 상세설명 문구를 기입해주세요.'),
        acceptTerms:Yup.bool()
            .oneOf([true],'위 체크박스에 체크해주세요.'),
        captcha:Yup.string()
            .required('캡차로 봇이 아님을 증명해주세요.')
    })
    let libraryselectRef = null
    let categoryselectRef = null
    const CaptchaRef = useRef(null)
    const formOptions = { resolver: yupResolver(validationSchema),defaultValues:{
        longdesc:'## 봇의 이름은 무엇인가요? 🧐\n\n## 이 봇의 특징들은요? 🤪\n\n- 아주 멋진기능?\n\n- 어디서도 보지못한 기능??'
        },mode: "all" };
    const { register, reset, formState:{errors,isValid},watch,getValues,setValue,trigger,setFocus } = useForm(formOptions);
    //const { errors } = formState;
    const router = useRouter();
    const Topto = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // for smoothly scrolling
        });
    }
    function Submit(values){
        //alert(JSON.stringify(values))
        setalertmessage({err:false})
        setSubmit(false)
        CaptchaRef?.current?.resetCaptcha()
        if(!isValid && Object.keys(errors) !==[]){
            console.log(Object.keys(errors))
            trigger(Object.keys(errors)[0],{shouldFocus:true})
            //setFocus(String(),{ shouldSelect: true })
            return setalertmessage({err:true,type:'error',title:'필수기입필드 누락!',message:'무언가 누락되었습니다.'})
        }
        if(categoryerr){
            setCategoryErr(true)
            console.log(0)
            return setalertmessage({err:true,type:'error',title:'필수기입필드 누락!',message:'카테고리를 설정하지않으셨습니다!'})
        }
        values.category = category.selectedOptions
        if(libraryerr){
            setLibraryErr(true)
            console.log(1)
            return setalertmessage({err:true,type:'error',title:'필수기입필드 누락!',message:'라이브러리를 설정하지않으셨습니다!'})
        }
        values.library = library
        Topto()
        // CaptchaRef.current.execute()
        // alert(JSON.stringify(values,null,4))
        fetch(process.env.BASE_URL+'/api/bots/'+values.botid+'/submit',{
            method:'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body:JSON.stringify(values)
        })
            .then(async (res)=>{
                const data = await res.json()
                console.log(data)
                if(res.ok&&res.status===200){
                    console.log(data)
                    reset()
                    // setLibrary(undefined)
                    // setCategory(undefined)
                    // libraryselectRef.clearValue()
                    // categoryselectRef.clearValue()
                    setalertmessage({err:true,type:'success',title:'신청완료!',message:'성공적으로 봇 심사요청을 하였습니다!'})
                    setTimeout(()=>{
                        router.push('/bots/'+values.botid)
                    },2000)
                }else {
                    setalertmessage({err:true,type:'error',title:'에러발생!',message:data.message})
                }

            })
            .catch(e=>console.log(e))
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
        { value: 'slash', label: '빗금명령어' },
        { value: 'etc', label: '기타' }
    ]
    const SelectLibraryOption = [
        {value: 'discord.py', label: 'discord.py'},
        {value: 'discord.js', label: 'discord.js'},
        {value: 'py-cord', label: 'py-cord'},
        {value: 'next-cord', label: 'next-cord'},
        {value: 'DiscordGo', label: 'DiscordGo'},
        {value: 'dico', label: 'dico'},
        {value: 'etc', label: '기타'},
        {value: 'hidden', label: '비공개'},
    ]

    function HandleCategory(selectedOptions) {
        console.log(category);
        if(selectedOptions.length === 0){
            setCategoryErr(true)
        }
        if(categoryerr){
            setCategoryErr(false)
        }
        setCategory({selectedOptions});
    }
    function HandleLibrary(selectedOptions) {
        console.log(library);
        if(selectedOptions){
            setLibraryErr(false)
        }
        setLibrary(selectedOptions?.value);
    }

    const HandleEmoji = (emoji,event) => {
        console.log(event)
        setValue('longdesc',getValues('longdesc')+emoji.native)
        setableemojipicker(!ableemojipicker)
    }
    return (
        <div style={{padding: '0rem',overflowX:'hidden'}}>
            <ResponsiveAppBar userdata={data}/>
            <HeadTag title="봇등록"
                     img={process.env.NORMAL_IMG}
                     url={process.env.BASE_URL+"addbot"}
                     description='다양한 봇과 서버가 모여 만들어진 공간, Universe'/>
            <main className={styles.form} style={{marginBottom: '5em'}}>
                {
                    alertmessage.err ?
                        (
                            <>
                                <Alert severity={alertmessage.type} style={{marginTop:'2em'}}>
                                    <AlertTitle>{alertmessage.title}</AlertTitle>
                                    {alertmessage.message}
                                </Alert>
                            </>
                        )
                        :
                        null
                }

                <Typography variant="h4" style={{marginTop: '2rem'}}>
                    <strong>새로운 봇 추가하기</strong>
                </Typography>
                <Typography variant="h6" style={{marginTop: '1rem'}}>
                    환영합니다, {data.username}#{data.discriminator}님! <Link href="/api/logout">혹시 본인계정이 아니신가요?</Link>
                </Typography>
                <div style={{marginTop: '2rem'}}>
                    <Alert icon={false} severity="warning">
                        <Typography variant="h6">
                            <strong>추가신청하시기전에 이 곳을 꼭 확인해주세요.</strong>
                        </Typography>
                        <Typography variant="h6" style={{marginLeft: '1rem'}}>
                            <li><Link href="/discord">디스코드서버</Link>에 참여하셨나요?</li>
                            <li>신청하시려는 봇이 <Link href="/discord">가이드라인</Link>을 준수하고있나요?</li>
                            <li>봇 개발자가 두명이상인경우 승인을 받으신뒤 추가하실 수 있습니다.</li>
                            <li>신청하시려는 봇이 자신이 만든 봇임이 증명되어야합니다, 증명하실려면 아래의 가이드라인을 따라주세요.</li>
                            다음 명령어(접두사로 시작하는) 중 하나 이상에 소유자를 표시하셔야 합니다.<br/>
                            <strong>빗금 명령어(Slash Command)</strong> 봇인 경우에도 적용됩니다. 빗금 명령어가 아닌 다음 일반 명령어가 작동해야합니다. (심사시에
                            빗금 명령어 권한이 따로 부여되지 않습니다.)<br/>
                            - 도움 명령어: 도움, 도움말, 명령어, help, commands<br/>
                            - 도움 명령어에 소유자임을 나타내고 싶지 않으시다면, 아래 명령어를 만들어주세요<br/>
                            명령어(맨션형일 경우 양식을 지키지않은것으로 간주합니다.): [접두사]owner 또는 [접두사]주인 또는 [접두사]개발자<br/>응답: 유저#태그(아이디)<br/>응답예: gawi#9537(281566165699002379)
                            <li>또한 등록하시게되면 모든 정보가 웹과 API에 공개되며 등록심사중에는 수정 및 취소하실수없습니다.</li>
                            <p style={{fontSize: '0.8em', margin: '0'}}>위 내용은 <Link href="https://koreanbots.dev">한국
                                디스코드 리스트</Link>를 참고하였습니다.</p>
                        </Typography>
                    </Alert>
                </div>
                {/*handleSubmit(()=>Submit(getValues()))*/}
                <form onSubmit={(event)=> {
                    event.preventDefault()
                    setSubmit(true)
                }} autoComplete='off'>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <input type="checkbox" name="acceptTerms" id="acceptTerms" {...register('acceptTerms')}/>
                        <p style={{margin: '0'}}>해당 내용을 숙지하였으며, 모두 이행하였고 위 내용에 해당하는 거부 사유는 답변받지 않는다는 점을 이해합니다.</p>
                    </div>
                    {
                        errors.acceptTerms && <p style={{color:'red'}}>{errors.acceptTerms.message}</p>
                    }

                    <Divider style={{marginTop: '1rem'}}><strong>봇 정보 섹션</strong></Divider>
                    <div style={{display: 'grid', marginTop: '0.8em'}}>
                        <div>
                            <Typography variant="h5" style={{color: 'blue'}}><strong>봇 ID</strong><span
                                style={{verticalAlign: 'top', color: 'red'}}>*</span></Typography>
                            <p style={{margin: '0'}}>신청하시려는 봇의 ID를 의미합니다.</p>
                        </div>
                        <TextField style={{gridColumn: 'span 1/span 1', marginTop: '0.5em'}} variant="outlined"
                                   placeholder='953110159247433758' name="botid" id="botid" {...register('botid')}
                                    error={errors?.botid} helperText={errors?.botid?.message}/>
                    </div>
                    <div style={{display: 'grid', marginTop: '1.5em'}}>
                        <div>
                            <Typography variant="h5" style={{color: 'blue'}}><strong>접두사</strong><span
                                style={{verticalAlign: 'top', color: 'red'}}>*</span></Typography>
                            <p style={{margin: '0'}}>봇 사용시 앞 쪽에 붙은 기호 또는 글자를 의미합니다. (Prefix).</p>
                        </div>
                        <TextField style={{gridColumn: 'span 1/span 1', marginTop: '0.5em'}} variant="outlined"
                                   placeholder="!" name="botprefix" id="botprefix"
                                   {...register("botprefix")}
                                   error={errors.botprefix} helperText={errors.botprefix?.message}/>
                    </div>
                    <div style={{display: 'grid', marginTop: '1.5em'}}>
                        <div>
                            <Typography variant="h5" style={{color: 'blue'}}><strong>라이브러리</strong><span
                                style={{verticalAlign: 'top', color: 'red'}}>*</span></Typography>
                            <p style={{margin: '0'}}>봇제작에 사용된 라이브러리를 의미합니다.(해당사항이 없을경우 {'기타'}를 선택해주세요.)</p>
                        </div>
                        <div style={{marginTop: '0.3em'}}>
                            <Select options={SelectLibraryOption} onChange={HandleLibrary} placeholder="라이브러리를 선택하세요." ref={ref=>{libraryselectRef=ref}}
                                    components={makeAnimated()}/>
                            {
                                libraryerr ? (
                                    <p style={{margin:'0',color:'red'}}>라이브러리를 선택해주세요.</p>
                                ) : null
                            }
                        </div>
                    </div>
                    <div style={{display: 'grid', marginTop: '1.5em'}}>
                        <div>
                            <Typography variant="h5" style={{color: 'blue'}}><strong>카테고리</strong><span
                                style={{verticalAlign: 'top', color: 'red'}}>*</span></Typography>
                            <p style={{margin: '0'}}>봇의 종류를 의미합니다.</p>
                        </div>
                        <div style={{marginTop: '0.3em'}}>
                            <Select options={SelectCategoryOption} isMulti ref={ref=>{categoryselectRef=ref}} onChange={HandleCategory} placeholder="카테고리를 선택하세요." closeMenuOnSelect={false}
                                    components={makeAnimated()}/>
                            {
                                categoryerr ? (
                                    <p style={{margin:'0',color:'red'}}>카테고리를 최소 1개이상 선택해주세요. 또한, 정확히 선택해주세요.</p>
                                ) : null
                            }
                        </div>
                    </div>
                    <Divider style={{marginTop: '1rem'}}><strong>봇 부가정보 섹션</strong></Divider>
                    <div style={{display: 'grid', marginTop: '1.5em'}}>
                        <div>
                            <Typography variant="h5" style={{color: 'blue'}}><strong>봇 사이트 URL</strong></Typography>
                            <p style={{margin: '0'}}>봇 소개사이트와 같은 URL을 의미합니다.</p>
                        </div>
                        <TextField style={{gridColumn: 'span 1/span 1', marginTop: '0.5em'}} variant="outlined"
                                   placeholder="https://example.com" name="siteurl" id="siteurl"
                                   {...register("siteurl")}
                                   error={errors.siteurl} helperText={errors.siteurl?.message}/>
                    </div>
                    <div style={{display: 'grid', marginTop: '1.5em'}}>
                        <div>
                            <Typography variant="h5" style={{color: 'blue'}}><strong>오픈소스 URL</strong></Typography>
                            <p style={{margin: '0'}}>봇의 소스가 공개되어있는 URL을 의미합니다.(Github, Gist등등)</p>
                        </div>
                        <TextField style={{gridColumn: 'span 1/span 1', marginTop: '0.5em'}} variant="outlined"
                                   placeholder="https://github.com/popop098/spacebots"
                                   name="opensource" id="opensource"
                                    {...register('opensource')}
                                   error={errors.opensource} helperText={errors.opensource?.message}/>
                    </div>
                    <div style={{display: 'grid', marginTop: '1.5em'}}>
                        <div>
                            <Typography variant="h5" style={{color: 'blue'}}><strong>서포트 서버 URL</strong></Typography>
                            <p style={{margin: '0'}}>봇에 대한 지원을 받을 수 있는 서버의 초대 URL을 의미합니다.</p>
                        </div>
                        <TextField style={{gridColumn: 'span 1/span 1', marginTop: '0.5em'}} variant="outlined"
                                   placeholder="https://discord.gg/ABCDEFG" name="serverurl" id="serverurl"
                                    {...register('serverurl')}
                                   error={errors.serverurl} helperText={errors.serverurl?.message}/>
                    </div>
                    <div style={{display: 'grid', marginTop: '1.5em'}}>
                        <div>
                            <Typography variant="h5" style={{color: 'blue'}}><strong>봇 초대 URL</strong></Typography>
                            <p style={{margin: '0'}}>봇을 초대할수있는 URL을 의미합니다. 비워둘시 자동으로 생성합니다.(permission=0)</p>
                        </div>
                        {
                            Boolean(category?.selectedOptions.find(x=> x.value==="slash" && x.label==="빗금명령어")) &&
                                (
                                    <>
                                        <Alert severity="warning" style={{marginTop:'2em'}}>
                                            <AlertTitle>주의하세요.</AlertTitle>
                                            '빗금명령어'를 선택하셨습니다. 기입하지않을시 빗금명령어권한이 있지않은 일반 초대URL로 생성됩니다. 직접 초대URL을 입력해주세요.
                                        </Alert>
                                    </>
                                )
                        }
                        <TextField style={{gridColumn: 'span 1/span 1', marginTop: '0.5em'}} variant="outlined"
                                   placeholder="https://discord.com/oauth2/authorize?client_id=953110159247433758&scope=bot&permissions=0"
                                   name="inviteurl" id="inviteurl"
                                    {...register('inviteurl')}
                                   error={errors.inviteurl} helperText={errors.inviteurl?.message}/>
                    </div>
                    <Divider style={{marginTop: '1rem'}}><strong>봇 상세정보 섹션</strong></Divider>
                    <div style={{display: 'grid', marginTop: '1.5em'}}>
                        <div>
                            <Typography variant="h5" style={{color: 'blue'}}><strong>봇 소개</strong><span
                                style={{verticalAlign: 'top', color: 'red'}}>*</span></Typography>
                            <p style={{margin: '0'}}>봇을 소개하는 문구를 간단히 기입해보세요.(최대 60자)</p>
                        </div>
                        <TextField style={{gridColumn: 'span 1/span 1', marginTop: '0.5em'}} variant="outlined"
                                   placeholder="엄청난 다기능 봇을 이곳에서!" name="shortdesc" id="shortdesc"
                                    {...register('shortdesc')}
                                   error={errors.shortdesc} helperText={errors.shortdesc?.message}/>
                    </div>
                    <div style={{display: 'grid', marginTop: '1.5em'}}>
                        <div>
                            <Typography variant="h5" style={{color: 'blue'}}><strong>봇 상세설명</strong><span
                                style={{verticalAlign: 'top', color: 'red'}}>*</span></Typography>
                            <p style={{margin: '0'}}>봇에 대한 자세한 설명 기입해보세요.(최대 1000자) <br/>마크다운 문법도 지원합니다.<br/>Tip.
                                이미지는 {'<img src="IMG_URL" alt="IMG_NAME" width="X%"/>'}로 사용하시면 좋습니다.</p>
                        </div>
                        <TextField style={{gridColumn: 'span 1/span 1', marginTop: '0.5em'}} variant="outlined"
                                   placeholder="엄청난 다기능 봇을 이곳에서!" multiline
                                   rows={10} name="longdesc"
                                   {...register('longdesc')}
                                   error={errors.longdesc} helperText={errors.longdesc?.message}/>
                        {/* <IconButton onClick={() => setableemojipicker(!ableemojipicker)} style={{
                            position: 'relative',
                            top: '-40px',
                            width: '1.5em',
                            height: '1.5em'
                        }}><EmojiEmotions color={ableemojipicker ? ('primary') : ('default')}/></IconButton>
                        {
                            ableemojipicker && (
                                <div style={{display: 'flex', justifyContent: 'left', position: 'relative', top: '-40px'}}>
                                    <Picker set='twitter' useButton={false} sheetSize={16} onClick={HandleEmoji}
                                            title="이모지를 선택하세요." enableFrequentEmojiSort theme="auto" showSkinTones={false}
                                            i18n={{
                                                search: '검색',
                                                notfound: '검색 결과가 없습니다.',
                                                categories: {
                                                    search: '검색 결과',
                                                    recent: '최근 사용',
                                                    people: '사람',
                                                    nature: '자연',
                                                    foods: '음식',
                                                    activity: '활동',
                                                    places: '장소',
                                                    objects: '사물',
                                                    symbols: '기호',
                                                    flags: '국기',
                                                    custom: '커스텀'
                                                }}}/>
                                </div>
                            )
                        } */}
                    </div>
                    <div style={{display: 'grid', marginTop: '1.5em'}}>
                        <div>
                            <Typography variant="h5" style={{color: 'blue'}}><strong>봇 상세설명 미리보기</strong></Typography>
                            <p style={{margin: '0'}}>상세설명이 유저들에게 보여지는 모습입니다.</p>
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
                        }}><Markdownviewer value={watch("longdesc")}/></Box>
                    </div>
                    <Divider style={{marginTop: '1rem'}}/>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'baseline',
                        textAlign: 'right'
                    }}>
                        <span style={{verticalAlign: 'top', color: 'red', fontSize: '1.5em'}}>*</span><p>=
                        필수입력사항입니다.</p>
                        {
                            submit ? <HCaptcha sitekey={process.env.HCAPTCHA_SITE_KEY} onVerify={(token)=> {
                                setValue('captcha', token)
                                Submit(getValues())
                            }} ref={CaptchaRef} onError={(err)=>{CaptchaRef?.current?.resetCaptcha()
                                setalertmessage({err:true,type:'error',title:'캡챠에러!',message:err})}}
                                                onExpire={()=> {
                                CaptchaRef?.current?.resetCaptcha()
                                setalertmessage({
                                    err: true,
                                    type: 'error',
                                    title: '캡챠에러!',
                                    message: "캡챠가 만료되었습니다. 다시 시도해주세요."
                                })
                            }}/> : (
                                <>
                                    <Button type="submit" variant="contained" color="primary" style={{marginLeft: '1em'}}
                                            size='large' ><FontAwesomeIcon icon={faLocationArrow} style={{marginRight: '0.2em'}} />신청하기</Button>
                                </>
                            )
                        }
                    </div>
                </form>

            </main>
            <StickyFooter/>
        </div>
    )
}
