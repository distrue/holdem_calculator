import * as React from 'react';
import {useContext, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {player, share, result, label, block, cache} from '../store';
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
const makeRequest = (playerStore, shareStore, labelStore, resultStore, Board) => {
    let SendData = {};
    // input play time
    SendData["playTime"]= String(3);
    console.log("Hello");
    resultStore.sendStatus = "validate input";
    
    // 1. Check share cards
    let shareCount = 0;
    if(shareStore.colorFlg !== 1) {
        alert("Check board card!");
    }
    for(let idx in shareStore.valid) {
        if(shareStore.valid[idx] === false) {
            break;
        }
        SendData[`fixedSharedCard[${shareCount}]`] = String(shareStore.card[idx]);
        shareCount += 1;
    }
    SendData["fixedSharedCardnum"]= String(shareCount);
    
    // 2. Check player labels
    SendData["playernum"]= String(playerStore.list.length);
    let Nplayer, Nlabel, Nblock, Nf, Ns, pf, ps;
    const looker = {'a': 12, 'A': 12, 'k':11, 'K':11, 'q':10, 'Q':10, 'j':9, 'J':9, 't':8, 'T':8, 
    '9':7, '8':6, '7':5, '6':4, '5':3, '4':2, '3':1, '2':0};
    for(let _Nplayer in playerStore.list) {
        Nplayer = playerStore.list[_Nplayer];
        if(!playerStore.ownLabel[Nplayer] || playerStore.ownLabel[Nplayer].length === 0) {
            alert("No selected label for User " + Nplayer);
            return;
        }
        resultStore.playerRange[Nplayer] = undefined;
        for(let _Nlabel in playerStore.ownLabel[Nplayer]) {
            Nlabel = playerStore.ownLabel[Nplayer][_Nlabel];
            for(let _Nblock in labelStore.cardRange[Nlabel]) {
                Nblock = labelStore.cardRange[Nlabel][_Nblock];
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
    resultStore.sendStatus = "calculating...";
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
            console.log(res.data.playerResult[0].soloWin, res.data.playerResult[0].drawWin, res.data.winNum);
            let Record = [];
            for(let idx in res.data.playerResult) {
                let tmp = (Number(res.data.playerResult[idx].soloWin) + Number(res.data.playerResult[idx].drawWin)) / Number(res.data.winNum);
                tmp *= 10000; tmp = Math.round(tmp); tmp /= 100;
                Record.push(tmp);
            }
            Board[1](Record);
            console.log(JSONtoString(res.data));
            resultStore.sendStatus = "";
        })
        .catch(err => {
            console.log("get Method", err);
            resultStore.sendStatus = "error occured";
        })
    })
    .catch(err => console.log(err));
}
const PlayerSelectLabel = observer(({Board, playerStore, labelStore, blockStore, shareStore, Nplayer}) => {
    const cacheStore = useContext(cache);
    return(
    <div style={{display:"flex", flexDirection:"row"}}>
        <div style={{margin: "10px", fontSize:"18px"}}>{Nplayer}</div>
        <PlayerSelectLabelStyle 
            style={{color:playerStore.now===Nplayer?"green":"black"}}
            onClick={e => {Refresh.refresh(Nplayer, labelStore, playerStore, blockStore, shareStore, cacheStore);}}
        >
            <div className="playerLabel">
                <div className="Chosen">
                    {jsonExistChecker(labelStore.playerLabel, [Nplayer])?
                        labelStore.playerLabel[Nplayer].map(Nlabel => {
                            const isChosen = playerStore.ownLabel[Nplayer].findIndex(idx => idx === Nlabel);
                            if(isChosen >= 0) {
                                return (<button style={{fontWeight:"bold", backgroundColor: labelStore.color[Nlabel], color:"#ffffff", height:"18px", width:"24px", paddingLeft:"3px"}} onClick={e => playerStore.ownLabel[Nplayer].splice(isChosen, 1)}>{"V"}</button>);
                            }
                            else {
                                return (<button style={{backgroundColor:labelStore.color[Nlabel], height:"18px", width:"24px", paddingLeft:"3px"}} onClick={e => playerStore.ownLabel[Nplayer].push(Nlabel)}></button>);
                            }
                        })
                    :""}
                </div>
            </div>
        </PlayerSelectLabelStyle>
        <ResultStyle target={Nplayer}>{Board[0][Nplayer-1]}%</ResultStyle>
    </div>);
});
const ResultPad = observer((props) => {
    const Board = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const playerStore = useContext(player);
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    const resultStore = useContext(result);
    const shareStore = useContext(share);

    return(
    <div style={{flexDirection: "column", width:"420px", display: "flex"}}>
        <div style={{display:"block", width:"5vw", fontSize:"3vh", fontWeight: "bold"}}>
            Result
        </div>
        <div style={{padding:"10px"}}>
            {playerStore.list.map(Nplayer => 
                <PlayerSelectLabel Board={Board} playerStore={playerStore} labelStore={labelStore} blockStore={blockStore} shareStore={shareStore} Nplayer={Nplayer}/>
            )}
        </div>
        <ResultGoStyle onClick={() => makeRequest(playerStore, shareStore, labelStore, resultStore, Board)}>Show Result</ResultGoStyle>
        {resultStore.sendStatus}
    </div>);
});

export default ResultPad;

const ResultGoStyle = styled.div`
    width: 100px; height: 20px;
    padding: 7px; z-index: 5; border: 1px solid black; cursor: pointer;
    text-align: center; border-radius: 10px; font-weight: bold;
`;
const ResultStyle = styled.div`
    padding: 10px 0px 0px 10px;
`;

const PlayerSelectLabelStyle = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    border: 1px solid black;
    margin-bottom: 10px;
    margin-top: 10px;
    z-index: 3;
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
