import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiscord, faGithub} from "@fortawesome/free-brands-svg-icons";
import styles from '../styles/Footer.module.css';
import Link from "next/link"

export default function StickyFooter() {
    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: 300,
                    backgroundColor: 'primary.dark',
                    display: 'flex',paddingLeft:'1.2em',paddingRight:'1.2em',justifyContent:'center',
                    alignItems:'center',
                    marginRight:'auto',
                    marginLeft:'auto',
                    overflowX:'hidden',

                }}
            >
                <div style={{display: 'flex',alignItems:'flex-start'}}>
                    <div style={{display:'grid',marginTop:'1.5em'}}>
                        <Typography variant="h4" component="div"
                                    sx={{ mr: 2,fontFamily: 'Do Hyeon',color:'#ffffff'}}>
                            다양한 봇과 서버가 모여 만들어진 공간.
                        </Typography>
                        <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center'}}>
                            <div style={{marginRight:'auto'}}>
                                <Link href="https://github.com/UniverseGroup" passHref><a target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGithub} size="2x" color="#ffffff" style={{cursor:'pointer'}}/></a></Link>
                                <Link href="/discord" passHref><FontAwesomeIcon icon={faDiscord} size="2x" color="#ffffff" style={{marginLeft:'0.3em',cursor:'pointer'}}/></Link>
                            </div>
                        </div>
                        <Typography variant="body2" component="div"
                                    sx={{ mr: 2, display: 'flex' ,fontFamily: 'Do Hyeon',color:'#ffffff',gap:'0.3em'}}>
                            {'Copyright © '}
                            <Link color="inherit" href="https://universelist.kr/">
                                UNIVERSE
                            </Link>
                            {new Date().getFullYear()}
                            {'.'}
                        </Typography>
                    </div>
                    <div style={{display:'grid',marginTop:'1.5em'}}>
                        <Typography variant="h6" component="div"
                                    sx={{ mr: 2, display: 'flex',fontFamily: 'Do Hyeon',color:'#ffffff'}}>
                            UNIVERSE Informations
                        </Typography>
                        <Typography variant="h6" component="div"
                                    sx={{fontFamily: 'Do Hyeon',color:'#ffffff',lineHeight:'1'}}>
                            <Link href="/about" passHref><li className={styles.link}>소개</li></Link>
                            <Link href="https://career-univerlist.vercel.app/" passHref><a target="_blank" rel="noopener noreferrer"><li className={styles.link}>채용</li></a></Link>
                            <li className={styles.link}>문서</li>
                            <Link href="/bugreport" passHref><li className={styles.link}>버그제보</li></Link>
                        </Typography>
                    </div>
                    <div style={{display:'grid',marginTop:'1.5em'}}>
                        <Typography variant="h6" component="div"
                                    sx={{ mr: 2, display: 'flex',fontFamily: 'Do Hyeon',color:'#ffffff'}}>
                            UNIVERSE Policy
                        </Typography>
                        <Typography variant="h6" component="div"
                                    sx={{fontFamily: 'Do Hyeon',color:'#ffffff',lineHeight:'1'}}>
                            <Link href="/tos" passHref><li className={styles.link}>서비스 이용약관</li></Link>
                            <Link href="/privacy" passHref><li className={styles.link}>개인정보취급방침</li></Link>
                            <Link href="/guidelines" passHref><li className={styles.link}>가이드라인</li></Link>
                        </Typography>
                    </div>
                </div>

            </Box>
        </>
    );
}
