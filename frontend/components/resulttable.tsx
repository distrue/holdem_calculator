import * as React from 'react';
import {useContext} from 'react';
import {observer, useObservable} from 'mobx-react-lite';
import player from '../store/Player';
import phase from '../store/Phase';
import share from '../store/Share';
import result from '../store/Result';
import label from '../store/Label';
import block from '../store/Block';
import Axios from 'axios';
import querystring from 'querystring';
import * as Refresh from '../dispatcher/refresh';


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
function addResult(resultStore, Nplayer, Nf, Ns, Nblock) {
    if(resultStore.playerRange[Nplayer] === undefined) {
        resultStore.playerRange[Nplayer] = {};
    }
    if(resultStore.playerRange[Nplayer][String(Nf)] === undefined) {
        resultStore.playerRange[Nplayer][String(Nf)] = {};
    }
    if(resultStore.playerRange[Nplayer][String(Nf)][String(Ns)] === undefined) {
        resultStore.playerRange[Nplayer][String(Nf)][String(Ns)] = {pct: 0};
    }
    resultStore.playerRange[Nplayer][String(Nf)][String(Ns)].pct +=  Nblock.pct / 100;
}
const askPct = (playerStore, phaseStore, shareStore, resultStore, labelStore, Board) => {
    let SendData = {};
    // input play time
    SendData["playTime"]= String(1);
    
    // 1. Check share cards
    let phaseMatch = {0: "preflop", 1:"flop", 2:"turn", 3:"river", "preflop": [0, 0], "flop": [1, 3], "turn": [2, 1], "river": [3, 1]};
    let nVal = phaseMatch[phaseStore.now];
    let shareCount = 0;
    for(let idx in [...Array(nVal[0]+1).keys()]) {
        for(let id2 in [...Array(phaseMatch[phaseMatch[idx]][1]).keys()]) {
            if(shareStore[phaseMatch[idx]] === undefined) {
                if(typeof shareStore[phaseMatch[idx]][id2] === "number") { 
                    if(shareStore[phaseMatch[idx]][id2] >= 0 && shareStore[phaseMatch[idx]][id2] < 52) {
                        SendData[`fixedSharedCard[${shareCount}]`] = String(shareStore[phaseMatch[idx]][id2]);
                        shareCount += 1;
                        continue;
                    }
                }
                alert("We need table range of " + phaseMatch[idx] + id2 + ":" + shareStore[phaseMatch[idx]][id2]); return;
            }
        }
    }
    SendData["fixedSharedCardnum"]= String(shareCount);
    
    // 2. Check player labels
    SendData["playernum"]= String(playerStore.list.length);
    let Nplayer, Nlabel, Nblock, Nf, Ns, pf, ps;
    const looker = {'a': 0, 'A': 0, 'k':1, 'K':1, 'q':2, 'Q':2, 'j':3, 'J':3, 't':4, 'T':4, 
    '9':5, '8':6, '7':7, '6':8, '5':9, '4':10, '3':11, '2':12};
    for(let _Nplayer in playerStore.list) {
        Nplayer = playerStore.list[_Nplayer];
        if(!playerStore.ownLabel[Nplayer] || playerStore.ownLabel[Nplayer].length === 0) {
            alert("No selected lael for User " + Nplayer);
            return;
        }
        resultStore.playerRange[Nplayer] = undefined;
        for(let _Nlabel in playerStore.ownLabel[Nplayer]) {
            Nlabel = playerStore.ownLabel[Nplayer][_Nlabel];
            for(let _Nblock in labelStore.cardRange[Nlabel]) {
                Nblock = labelStore.cardRange[Nlabel][_Nblock];
                console.log(JSONtoString(Nblock), Nlabel);
                if(Nblock.blockName[2] === 'o') {
                    for(let _pf in Nblock.pattern[0]) {
                        pf = Nblock.pattern[0][_pf];
                        Nf = pf * 13 + Number(looker[Nblock.blockName[0]]);
                        for(let _ps in Nblock.pattern[1]) {
                            ps = Nblock.pattern[1][_ps];
                            Ns = ps * 13 + Number(looker[Nblock.blockName[1]]);
                            addResult(resultStore, Nplayer, Nf, Ns, Nblock);
                        }
                    }
                }
                if(Nblock.blockName[2] === undefined) {
                    for(let _pf in Nblock.pattern[0]) {
                        console.log("call");
                        pf = Nblock.pattern[0][_pf];
                        Nf = pf * 13 + Number(looker[Nblock.blockName[0]]);
                        for(let _ps in Nblock.pattern[0]) {
                            if(_ps <= _pf) { continue; }
                            ps = Nblock.pattern[0][_ps];
                            Ns = ps * 13 + Number(looker[Nblock.blockName[1]]);
                            addResult(resultStore, Nplayer, Nf, Ns, Nblock);
                        }
                    }
                }
                if(Nblock.blockName[2] === 's') {
                    for(let _pf in Nblock.pattern[0]) {
                        pf = Nblock.pattern[0][_pf];
                        Nf = pf * 13 + Number(looker[Nblock.blockName[0]]);
                        Ns = pf * 13 + Number(looker[Nblock.blockName[1]]);
                        addResult(resultStore, Nplayer, Nf, Ns, Nblock);
                    }
                }
                // {blockName: blockName, pct:50, pattern: [[0, 1, 2, 3], [0, 1]]}
            }
        }
    }
    
    console.log(JSONtoString(resultStore.playerRange));
    // 3-4. input (range #, ranges) of each User
    for(let _Nplayer in playerStore.list) {
        Nplayer = playerStore.list[_Nplayer];
        let cnt = 0;
        console.log(JSONtoString(resultStore.playerRange[Nplayer]));
        for(let _Nf in resultStore.playerRange[Nplayer]) {
            for(let _Ns in resultStore.playerRange[Nplayer][_Nf]) {
                SendData[`playerRange[${_Nplayer}][${cnt}][0]`] = _Nf;
                SendData[`playerRange[${_Nplayer}][${cnt}][1]`] = _Ns;
                SendData[`playerRange[${_Nplayer}][${cnt}][2]`] = resultStore.playerRange[Nplayer][_Nf][_Ns].pct;
                cnt += 1;
            }
        }
        SendData[`playerRangenum[${Nplayer}]`] = String(cnt);
    }
    console.log(JSONtoString(SendData));
    
    // 4. wait for post response -> put Pending event on it
    Axios.post("http://127.0.0.1:3000/normal/equity", querystring.stringify(SendData), {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    .then(res => {
        alert("POST req sended"); 
        // 5. completed -> ask percentage data by get
        Axios.get("http://127.0.0.1:3000/normal/equity", {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(res => {
            Board.string = JSONtoString(res.data);
            Board.json = res.data;
        });
    })
    .catch(err => console.log(err));
    
    // 6. view complete data
    resultStore.submitted = "ok";
    alert("Percentage!" + resultStore.submitted);
}

const HandTable = observer((props) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    const shareStore = useContext(share);
    const resultStore = useContext(result);
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    
    const res = useObservable({
        string: "",
        json: null
    }); 

    return(<div style={{...props.style}}>
        <div style={{display: resultStore.submitted===undefined?"none":"block"}}>
            {res.json && res.json.playerResult? 
                res.json.playerResult.map((item, idx) => {
                    return(
                    <div style={{cursor: "pointer", color:playerStore.now===Number(idx)+1?"green":"black", border:"1px solid black"}} 
                    onClick={e => {
                        Refresh.refresh(Number(idx)+1, phaseStore.now, labelStore, playerStore, phaseStore, blockStore);
                    }}>
                        Player {Number(idx)+1}<br/>
                        Solowin: {item.soloWin}<br/>
                        Drawwin: {item.drawWin}<br/>
                    </div>);
                })
            : ""}
            <button onClick={e => resultStore.submitted = undefined}>
                New Result
            </button>
        </div>
        <div style={{display: resultStore.submitted===undefined?"block":"none"}}>
            <button onClick={e => askPct(playerStore, phaseStore, shareStore, resultStore, labelStore, res)}>
                Get Percentage
            </button>
        </div>
    </div>);
});

export default HandTable;

