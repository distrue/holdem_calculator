import * as React from 'react';
import {SelectCard} from '../components';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import * as Refresh from '../dispatcher/refresh';
import player from '../store/Player';
import phase from '../store/Phase';
import label from '../store/Label';
import block from '../store/Block';
import share from '../store/Share';


const askPct = (playerStore, phaseStore, shareStore) => {
    // 1. Check share cards
    let phaseMatch = {0: "preflop", 1:"flop", 2:"turn", 3:"river", "preflop": [0, 0], "flop": [1, 3], "turn": [2, 1], "river": [3, 1]};
    let nVal = phaseMatch[phaseStore.now];
    for(let idx in [...Array(nVal[0]+1).keys()]) {
        console.log(phaseMatch[phaseMatch[idx]]);
        for(let id2 in [...Array(phaseMatch[phaseMatch[idx]][1]).keys()]) {
            if(shareStore[phaseMatch[idx]] === undefined) {
                if(typeof shareStore[phaseMatch[idx]][id2] === "number") { 
                    if(shareStore[phaseMatch[idx]][id2] >= 0 && shareStore[phaseMatch[idx]][id2] < 52) {
                        continue;
                    }
                }
                alert("We need table range of " + phaseMatch[idx] + id2 + ":" + shareStore[phaseMatch[idx]][id2]); return;
            }
        }
    }
    // 2. Check player labels
    for(let Nplayer in playerStore.list) {
        if(playerStore.ownLabel[playerStore.list[Nplayer]].length === 0) {
            alert("No selected lael for User " + playerStore.list[Nplayer]);
            return;
        }
        // Sum player's label range to send - TBD
    }
    // 3. Send input
    // 3-1. input play time
    // 3-2. input player number
    // 3-3. input share card #, cards
    // 3-4. input (range #, ranges) of each User
    //     -> Should cut user label data with percentage
    //     -> range# is 0 if you cover all

    // 4. wait for post response -> put Pending event on it

    // 5. completed -> ask percentage data by get

    // 6. view complete data
    alert("Percentage!");
}
const HandTable = observer((props) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    const shareStore = useContext(share);
    
    let style = {display:"flex", width:"30vw", flexDirection:"column", ...props.style};
    let phaseName = [["preflop",0], ["flop",3], ["turn",1], ["river", 1]];

    return(<div style={style}>
        <div style={{display:"block", width:"10vw", marginBottom:"2vh", fontSize:"3vh", fontWeight: "bold"}}>Status</div>
        <div style={{border: "1px solid black", marginBottom:"4vh"}}>
        <div>Now Player: {playerStore.now}</div>
        <div>Now Phase: {phaseStore.now}</div>
        <div>Now Label: {labelStore.now}</div>
        </div>
        
        <div style={{display:"block", width:"100%", paddingBottom:"2vh", fontWeight:"bold", fontSize:"3vh"}}>Phase Setting</div>
        {phaseName.map((idx, ni) => {
            const ncolor = phaseStore.now===idx[0]?"green":"black";
            const pnowVal = phaseName.findIndex(item => item[0] === phaseStore.now);
            return(<div 
                    style={{display:"block", width:"100%", paddingBottom:"2vh", color: ncolor, cursor:"pointer"}} onClick={e => {
                        Refresh.refresh(playerStore.now, idx[0], labelStore, playerStore, phaseStore, blockStore);
                        }}>
                {idx[0]}
                <div style={{display:"flex"}}>
                    {[...Array(idx[1]).keys()].map(item => <SelectCard need={ni <= pnowVal} phase={idx[0]} num={item}/>)}
                </div>
                <hr/>
            </div>);
        })}
        <button onClick={e => askPct(playerStore, phaseStore, shareStore)}>Get Percentage</button>
    </div>);
});

export default HandTable;
