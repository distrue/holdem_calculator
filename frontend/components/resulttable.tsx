import * as React from 'react';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import player from '../store/Player';
import phase from '../store/Phase';
import share from '../store/Share';
import result from '../store/Result';


const askPct = (playerStore, phaseStore, shareStore, resultStore) => {
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
    resultStore.submitted = "ok";
    alert("Percentage!" + resultStore.submitted);
}

const HandTable = observer((props) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    const shareStore = useContext(share);
    const resultStore = useContext(result);
    
    let style = {...props.style};

    return(<div style={style}>
        <div style={{display: resultStore.submitted===undefined?"none":"block"}}>
            Result
            <button onClick={e => {resultStore.submitted = undefined;
    }}>New Result</button>
        </div>
        <div style={{display: resultStore.submitted===undefined?"block":"none"}}>
            <button onClick={e => askPct(playerStore, phaseStore, shareStore, resultStore)}>Get Percentage</button>
        </div>
    </div>);
});

export default HandTable;

