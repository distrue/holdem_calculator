import * as React from 'react';
import {useEffect, useContext} from 'react';
import {RangePad, PlayerPad, FixedPad, ResultPad, LabelPad, CacheChecker} from '../components';
import {player, label, cache} from '../store';

export default () => {
    const playerStore = useContext(player);
    const labelStore = useContext(label);
    const cacheStore = useContext(cache);
    useEffect(() => {
        playerStore.now = 1;
        labelStore.now = 1;
        cacheStore.range = {'o':{ blockName: 'AKo', pct: 100, pattern: [[0, 1, 2, 3], [0, 1, 2, 3]] }, 's':{ blockName: 'AKs', pct: 100, pattern: [[0, 1, 2, 3]] }, 'p':{ blockName: 'AA', pct: 100, pattern: [[0, 1, 2, 3]] }};
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
            <ResultPad style={{display:"block", width:"400px"}}/>
        </div>
        <CacheChecker/>
    </div>
    </>);
};
