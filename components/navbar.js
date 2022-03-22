import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import {discordUrls} from "../lib/DiscordTool"
const pages = ['Products', 'Pricing', 'Blog'];
const settings = [{name:'Profile',url:'/users/',as:undefined,color:null}, {name:'AddBot',url:'/addbot',as:undefined,color:null}, {name:'Logout',url:discordUrls.logout,as:undefined,color:'red'}];
const ResponsiveAppBar = ({userdata}) => {
    console.log(userdata);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const router = useRouter();
    const authurl = discordUrls.login
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const GotoPage = (url) => {
        router.replace(url, url, { shallow: false });
    };
    const useravatar_format = userdata&&userdata.avatar.startsWith("a_") ? "gif" : "png"
    const useravatar =userdata&&`https://cdn.discordapp.com/avatars/${userdata.id}/${userdata.avatar}.${useravatar_format}`
    const login_status = ()=>{
        return(
            (!userdata)?(
                <>
                    <a onClick={()=>router.replace(authurl,authurl,{shallow:false})} style={{cursor:'pointer'}}>Login</a>
                </>
            ):(
                <>
                    <Tooltip title="Open menu">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} style={{gap: '0.3rem'}}>

                            <Avatar alt={userdata.username} src={useravatar}/>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                color={'white'}
                            >
                                {userdata.username}#{userdata.discriminator}
                            </Typography>
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        {settings.map((setting,index) =>{
                            if(setting.url==='/users/'){
                                return (
                                    <Link href={setting.url+userdata.id} shallow={true} ><MenuItem key={index} >
                                        <Typography textAlign="center" color={setting.color}>{setting.name}</Typography>
                                    </MenuItem></Link>
                                )
                            }
                            return(
                                <Link key={index} href={setting.url} shallow={true} ><MenuItem key={index}>
                                        <Typography textAlign="center" color={setting.color}>{setting.name}</Typography>
                                </MenuItem></Link>
                                )

                        })}
                    </Menu>
                </>
            )
        )
    }
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link href="/" shallow={true}><Typography
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' },fontFamily: 'Do Hyeon',cursor:'pointer' }}
                    >
                        <strong>UNIVERSE</strong>
                    </Typography></Link>

                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <a onClick={()=>GotoPage('/')} style={{margin:'auto'}}><Typography
                        variant="h6"
                        component="div"
                        sx={{ display: { xs: 'flex', md: 'none' },fontFamily: 'Do Hyeon',cursor:'pointer',justifyContent:'center',alignItems:'center' }}
                    >
                        <strong>UNIVERSE</strong>
                    </Typography></a>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block',fontFamily: 'Do Hyeon' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {login_status()}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default ResponsiveAppBar;
