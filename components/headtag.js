import React, { Component } from "react";
import Head from "next/head";
import theme from "../src/theme";
import {NextSeo} from 'next-seo';
export default function HeadTag({ title,img,description,url }) {
    console.log(title,img,description,url);
    //const imgurl = ;
    //const descriptiontext = ;
    //const urltext = ;
    // console.log(imgurl);
    return (
        <Head>

            <link rel="icon" href="/favicon.ico" />
            <title>{title} : Universe</title>
            <meta name="description" content="봇/서버 스텟을 융합한 홍보 서비스, Universe" />
            <meta name="viewport" content="initil-sacle=1.0, width=deivce-width" />
            <meta name="theme-color" content={theme.palette.primary.main} />
            {title&&<meta name="og:title" content={title} />}
            {url&&<meta  name="og:url" content={url} />}
            {description&&<meta  name="og:description"
                   content={description}/>}
            <meta  name="og:site_name" content="Universe" />
            {img&&<meta
                name="og:image"
                content={img}
            />}
            {/*<NextSeo*/}
            {/*    title={title+" : Universe"}*/}
            {/*    description="봇/서버 스텟을 융합한 홍보 서비스, Universe"*/}
            {/*    openGraph={{*/}
            {/*        url: url ? url : "http://beta.universe.c01.kr:3000",*/}
            {/*        title: title,*/}
            {/*        description: description ? description : "다양한 봇과 서버가 모여 만들어진 공간, Universe",*/}
            {/*        images: [*/}
            {/*            {*/}
            {/*                url: img ? img : "https://i.imgur.com/HVICXv3.png",*/}
            {/*            },*/}
            {/*        ],*/}
            {/*        site_name: "Universe",*/}
            {/*    }}/>*/}
        </Head>
    );
}
