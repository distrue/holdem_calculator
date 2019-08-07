import * as React from 'react';
import {useContext} from 'react';
import {observer, useObservable} from 'mobx-react-lite';
import player from '../store/Player';
import phase from '../store/Phase';
import share from '../store/Share';
import result from '../store/Result';
import Axios from 'axios';
import querystring from 'querystring';


const askPct = (playerStore, phaseStore, shareStore, resultStore, Board) => {
    // 1. Check share cards
    let phaseMatch = {0: "preflop", 1:"flop", 2:"turn", 3:"river", "preflop": [0, 0], "flop": [1, 3], "turn": [2, 1], "river": [3, 1]};
    let nVal = phaseMatch[phaseStore.now];
    for(let idx in [...Array(nVal[0]+1).keys()]) {
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
    let SendData = {};
    
    // 3-1. input play time
    SendData["playTime"]= String(1);
    // 3-2. input player number
    SendData["playernum"]= String(3);
    // 3-3. input share card #, cards
    SendData["fixedSharedCardnum"] = String(3);
    SendData["fixedSharedCard[0]"] = String(0);
    SendData["fixedSharedCard[0]"] = String(3);
    SendData["fixedSharedCard[0]"] = String(12);
    // 3-4. input (range #, ranges) of each User
    SendData["playerRangenum[0]"] = String(0);
    SendData["playerRangenum[1]"] = String(0); 
    SendData["playerRangenum[2]"] = String(0);
    //     -> range# is 0 if you cover all
    /*SendData["playerRange"] =  
    String([ 
        [ [0, 12], [0, 12], [0, 12] ],
        [ [0, 12], [0, 12], [0, 12], [0, 12], [0, 12], [0, 12] ],
        []
    ]);*/
    //     -> Should cut user label data with percentage
    
    function JSONtoString(object) {
        var results = [];
        for (var property in object) {
            var value = object[property];
            if (value)
                if(typeof value === "object") {
                    value = JSONtoString(value);
                }
                results.push(property.toString() + ': ' + value);
            }
                    
            return '{' + results.join(', ') + '}';
    }

    // 4. wait for post response -> put Pending event on it
    Axios.post("http://127.0.0.1:3000/normal/equity", querystring.stringify(SendData), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    .then(res => {
        alert("sended"); 
        Axios.get("http://127.0.0.1:3000/normal/equity", {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(res => Board.string = JSONtoString(res.data));
    })
    .catch(err => console.log(err));
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
    
    const res = useObservable({
        string: "",
    }); 

    let style = {...props.style};

    return(<div style={style}>
        <div style={{display: resultStore.submitted===undefined?"none":"block"}}>
            {res.string}
            <button onClick={e => {resultStore.submitted = undefined;
    }}>New Result</button>
        </div>
        <div style={{display: resultStore.submitted===undefined?"block":"none"}}>
            <button onClick={e => askPct(playerStore, phaseStore, shareStore, resultStore, res)}>Get Percentage</button>
        </div>
    </div>);
});

export default HandTable;

