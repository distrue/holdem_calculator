import * as React from 'react';
import {useContext, useEffect} from 'react';
import {observer, useObservable} from 'mobx-react-lite';
import {player, share, result, label, block} from '../store';
import Axios from 'axios';
import querystring from 'querystring';
import * as Refresh from '../dispatcher/refresh';
import jsonExistChecker from '../tools/jsonExistChecker';
import styled from 'styled-components';

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
const makeRequest = (playerStore, phaseStore, shareStore, resultStore, labelStore, Board) => {
    let SendData = {};
    // input play time
    SendData["playTime"]= String(3);
    
    // 1. Check share cards
    let phaseMatch = {0: "preflop", 1:"flop", 2:"turn", 3:"river", "preflop": [0, 0], "flop": [1, 3], "turn": [2, 1], "river": [3, 1]};
    let nVal = phaseMatch[phaseStore.now];
    let shareCount = 0;
    resultStore.phase = {name: phaseStore.now, shared:[]};
    for(let idx in [...Array(nVal[0]+1).keys()]) {
        for(let id2 in [...Array(phaseMatch[phaseMatch[idx]][1]).keys()]) {
            if(shareStore[phaseMatch[idx]] !== undefined) {
                if(typeof shareStore[phaseMatch[idx]][id2] === "number") { 
                    if(shareStore[phaseMatch[idx]][id2] >= 0 && shareStore[phaseMatch[idx]][id2] < 52) {
                        SendData[`fixedSharedCard[${shareCount}]`] = String(shareStore[phaseMatch[idx]][id2]);
                        shareCount += 1;
                        resultStore.phase.shared.push(String(shareStore[phaseMatch[idx]][id2]));
                        continue;
                    }
                }
            }
            alert("We need table range of " + phaseMatch[idx] + id2 + ":" + shareStore[phaseMatch[idx]][id2]); return;
        }
    }
    SendData["fixedSharedCardnum"]= String(shareCount);
    
    // 2. Check player labels
    SendData["playernum"]= String(playerStore.list.length);
    let Nplayer, Nlabel, Nblock, Nf, Ns, pf, ps;
    const looker = {'a': 12, 'A': 12, 'k':11, 'K':11, 'q':10, 'Q':10, 'j':9, 'J':9, 't':8, 'T':8, 
    '9':7, '8':6, '7':5, '6':4, '5':3, '4':2, '3':1, '2':0};
    for(let _Nplayer in playerStore.list) {
        Nplayer = playerStore.list[_Nplayer];
        if(!playerStore.ownLabel[Nplayer][phaseStore.now] || playerStore.ownLabel[Nplayer][phaseStore.now].length === 0) {
            alert("No selected lael for User " + Nplayer);
            return;
        }
        resultStore.playerRange[Nplayer] = undefined;
        for(let _Nlabel in playerStore.ownLabel[Nplayer][phaseStore.now]) {
            Nlabel = playerStore.ownLabel[Nplayer][phaseStore.now][_Nlabel];
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
    
    // 3-4. input (range #, ranges) of each User
    for(let _Nplayer in playerStore.list) {
        Nplayer = playerStore.list[_Nplayer];
        let cnt = 0;
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
    
    // 4. wait for post response -> put Pending event on it
    
    resultStore.submitted = "calculating";
    Axios.post("http://www.rangeq.com/api/normal/equity", {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: querystring.stringify(SendData),
    })
    .then(res => {
        resultStore.submitted = "downloading";
        // 5. completed -> ask percentage data by get
        Axios.get(`http://www.rangeq.com/api/normal/equity?GameId=${res.data.key}`, {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
        .then(res => {
            resultStore.submitted = "received";
            Board.string = JSONtoString(res.data);
            Board.json = res.data;
            console.log(Board.string);
        })
        .catch(err => {
            console.log("get Method", err);
        })
    })
    .catch(err => console.log(err));
}

const PlayerSelectLabel = observer(({playerStore, labelStore, blockStore, Nplayer}) => {
    return(
    <div style={{display:"flex", flexDirection:"row"}}>
        <div style={{margin: "10px"}}>{Nplayer}:</div>
        <PlayerSelectLabelStyle 
            style={{color:playerStore.now===Nplayer?"green":"black"}}
            onClick={e => {Refresh.refresh(Nplayer, labelStore, playerStore, blockStore);}}
        >
            <div className="playerLabel">
                <div className="Chosen">
                    {jsonExistChecker(labelStore.playerLabel, [Nplayer])?
                        labelStore.playerLabel[Nplayer].map(Nlabel => {
                            const isChosen = playerStore.ownLabel[Nplayer].findIndex(idx => idx === Nlabel);
                            if(isChosen >= 0) {
                                return (<button style={{fontWeight:"bold", backgroundColor: labelStore.color[Nlabel], color:"#ffffff"}} onClick={e => playerStore.ownLabel[Nplayer].splice(isChosen, 1)}>{labelStore.displayMatch[Nlabel]}</button>);
                            }
                            else {
                                return (<button style={{backgroundColor:labelStore.color[Nlabel]}} onClick={e => playerStore.ownLabel[Nplayer].push(Nlabel)}>{labelStore.displayMatch[Nlabel]}</button>);
                            }
                        })
                    :""}
                </div>
            </div>
        </PlayerSelectLabelStyle>
    </div>);
});
const ResultPad = observer((props) => {
    const playerStore = useContext(player);
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    const resultStore = useContext(result);

    return(
    <div style={{flexDirection: "column", ...props.style, display: resultStore.submitted===undefined?"flex":"none"}}>
        <div style={{display:"block", width:"5vw", fontSize:"3vh", fontWeight: "bold"}}>
            Result
        </div>
        <div style={{overflow:"scroll", padding:"10px"}}>
            {playerStore.list.map(Nplayer => 
                <PlayerSelectLabel playerStore={playerStore} labelStore={labelStore} blockStore={blockStore} Nplayer={Nplayer}/>
            )}
        </div>
    </div>);
});

const PlayerSelectLabelStyle = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    border: 1px solid black;
    margin-bottom: 10px;
    margin-top: 10px;
    .playerLabel {
        display: flex;
        flex-direction: column;
        div {
            margin-left: 10px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
    }
`;

export default ResultPad;
