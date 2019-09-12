import * as React from 'react';
import {useEffect, useContext} from 'react';
import {RangePad, PlayerPad, FixedPad, ResultPad, LabelPad, CacheChecker} from '../components';
import {refresh} from '../dispatcher/refresh'
import {player, label, cache, block, share} from '../store';

export default () => {
    const playerStore = useContext(player);
    const labelStore = useContext(label);
    const cacheStore = useContext(cache);
    const blockStore = useContext(block);
    const shareStore = useContext(share);
    
    useEffect(() => {        
        refresh(1, labelStore, playerStore, blockStore, shareStore, cacheStore);
        playerStore.now = 1;
        labelStore.now = 1;
    });

    return(<>
    <div style={{position: "absolute", left:"5vw", top: "3vh", fontSize:"4vh", fontWeight:"bold"}}>Range Calculator</div>
    <div style={{position:"absolute", top:"10%", left:"5%", display:"flex", flexDirection:"row", width:"80vw", flexWrap: "wrap"}}>
        <PlayerPad/>
        <div style={{display:"block", paddingLeft:"2vw", width:"500px", flexDirection: "row"}}>
            <RangePad style={{display:"block", width:"550px", paddingBottom:"20px"}}/>
            <LabelPad style={{display:"block", width:"550px", paddingBottom:"30px"}}/>
        </div>
        <div style={{display:"block", paddingLeft:"5vw", width:"200px", flexDirection: "row"}}>
            <FixedPad/>
            <ResultPad/>
        </div>
        <CacheChecker/>
    </div>
    </>);
};
