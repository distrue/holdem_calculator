import * as React from 'react';
import {useEffect, useContext, useState} from 'react';
import {RangePad, PlayerPad, FixedPad, ResultPad, LabelPad} from '../components';
import {refresh} from '../dispatcher/refresh'
import {player, label, cache, block, share} from '../store';
import Head from 'next/head';


declare global {
    interface Window { dataLayer: any; }
}
export default () => {
    const playerStore = useContext(player);
    const labelStore = useContext(label);
    const cacheStore = useContext(cache);
    const blockStore = useContext(block);
    const shareStore = useContext(share);
    const Coming = useState("yet");
    
    function gtag(arg1:any, arg2:any){
        window.dataLayer.push(arg1, arg2);
    }

    useEffect(() => {        
        refresh(1, labelStore, playerStore, blockStore, shareStore, cacheStore);
        playerStore.now = 1;
        labelStore.now = 1;
        if(Coming[0] === "yet") {
            window.dataLayer = window.dataLayer || [];
            gtag('js', new Date());

            gtag('config', 'UA-148366931-1');
        }
    });

    return(<>
    <Head>    
        <meta name="viewport" content="width=device-width, initial-scale=0.3 ,minimum-scale=0.3" />
    </Head>
    <div style={{position: "absolute", left:"5vw", top: "3vh", fontSize:"35px", fontWeight:"bold"}}>Range Calculator</div>
    <div style={{position:"absolute", top:"10%", left:"5%", display:"flex", flexDirection:"row"}}>
        <PlayerPad/>
        <div style={{display:"block", paddingLeft:"2vw", width:"500px", flexDirection: "row"}}>
            <RangePad style={{display:"block", width:"550px", paddingBottom:"20px"}}/>
            <LabelPad style={{display:"block", width:"550px", paddingBottom:"30px"}}/>
        </div>
        <div style={{display:"block", paddingLeft:"5vw", width:"200px", flexDirection: "row"}}>
            <FixedPad/>
            <ResultPad/>
        </div>
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-148366931-1"></script>
    </div>
    </>);
};
