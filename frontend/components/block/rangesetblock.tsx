import * as React from 'react';
import {useState, useContext} from 'react';
import {observer, useObservable} from 'mobx-react-lite';
import jts from '../../tools/JSONtoString';
import styled from 'styled-components';
import {block, label} from '../../store';
import {patternCount} from '../../dispatcher/block';

const flop = (sendStore, line, target) => {
    const pattern = {'S': 0, 'C': 1, 'H': 2, 'D': 3};
    let change = sendStore.pattern;
    let idx = change[line].indexOf(pattern[target]);
    if(idx >= 0) { change[line].splice(idx, 1); }
    else { change[line].push(pattern[target]); }
    console.log(change);
    sendStore.change(change);
}
const addRange = (pct, pattern, blockName, blockStore, labelStore) => {
    let initCombo = patternCount(blockName, pattern[0], pattern[1]) * pct / 100;
    blockStore.label[blockName].push({label:labelStore.now, pct:pct, color:labelStore.color[labelStore.now], pattern:pattern, combo: initCombo});
    blockStore.totalCombo += initCombo;
    labelStore.cardRange[labelStore.now].push({blockName: blockName, pct: pct, pattern:pattern});
    blockStore.left[blockName] -= initCombo;
}
const rangeSetBlock = observer(({view, change}) => {
    const manPct = useState(0);
    const pattern = {'S': 0, 'C': 1, 'H': 2, 'D': 3};
    const pct_range = [25, 50, 75, 100];
    const blockStore = useContext(block);
    const labelStore = useContext(label);
    const sendStore = useObservable({
        pattern: [[0, 1, 2, 3], [0, 1, 2, 3]],
        change(res) {
            sendStore.pattern = res;
        }
    });

    let Using;
    const patternView = "SCHD";
    if(view.blockName[2] === 'o') {
        Using = [[100, 100, 100, 100], [100, 100, 100, 100]];
    }
    else {
        Using = [[100, 100, 100, 100]];
    }
    for(let idx in view.existing) {
        let pLabel = view.existing[idx];
        console.log(idx, jts(pLabel.pattern));
        for(let pidx in pLabel.pattern[0]) {
            let pNow = pLabel.pattern[0][pidx];
            Using[0][pNow] -= pLabel.pct;
        }
        if(view.blockName[2] === 'o') {
            for(let pidx in pLabel.pattern[1]) {
                let pNow = pLabel.pattern[1][pidx];
                Using[1][pNow] -= pLabel.pct;
            }
        }
    }
    return(<RangeSetBlockStyle>
        <div style={{display:"block", width:"100%", fontWeight:"bold", textAlign:"center"}}>{view.blockName}</div>
        Left: <div className="item">{Using[0].map((item,idx) => <div>{patternView[idx]}: {item}</div>)}</div>
        {Using.length >= 2?<>Left-2: <div className="item">{Using[1].map((item,idx) => <div>{patternView[idx]}: {item}</div>)}</div></>:<><br/><br/></>}
        
        <SetterStyle>
            <div>
                {view.blockName[2] === undefined?
                    <div>
                    pattern(p)<br/>
                    {view.blockName[0]}:{Object.keys(pattern).map(item => {
                        return(<button 
                        style={{backgroundColor: sendStore.pattern[0].indexOf(pattern[item]) >= 0? "black": "white", color: sendStore.pattern[0].indexOf(pattern[item]) >= 0? "white": "black"}} 
                        onClick={() => flop(sendStore, 0, item)}>
                            {item}
                        </button>);
                    })}
                    </div>
                :""}
                {view.blockName[2] === 'o'?<>
                    <div>
                    pattern(o)<br/>
                    {view.blockName[0]}:{Object.keys(pattern).map(item => {
                        return(<button 
                        style={{backgroundColor: sendStore.pattern[0].indexOf(pattern[item]) >= 0? "black": "white", color: sendStore.pattern[0].indexOf(pattern[item]) >= 0? "white": "black"}} 
                        onClick={() => flop(sendStore, 0, item)}>
                            {item}
                        </button>);
                    })}
                    </div>
                    <div>
                    {view.blockName[0]}:{Object.keys(pattern).map(item => {
                        return(<button 
                        style={{backgroundColor: sendStore.pattern[0].indexOf(pattern[item]) >= 0? "black": "white", color: sendStore.pattern[0].indexOf(pattern[item]) >= 0? "white": "black"}} 
                        onClick={() => flop(sendStore, 0, item)}>
                            {item}
                        </button>);
                    })}
                    </div>
                </>:""}
                {view.blockName[2] === 's'?
                    <div>
                    pattern(s)<br/>
                    {view.blockName[0]}:{Object.keys(pattern).map(item => {
                        return(<button 
                        style={{backgroundColor: sendStore.pattern[0].indexOf(pattern[item]) >= 0? "black": "white", color: sendStore.pattern[0].indexOf(pattern[item]) >= 0? "white": "black"}} 
                        onClick={() => flop(sendStore, 0, item)}>
                            {item}
                        </button>);
                    })}
                    </div>
                :""}
                <div style={{display:"none"}}>{sendStore.pattern[0]}</div> {/* design update 위해서 */}
            </div>

            <div>
                <div> pct: <input style={{width:"30px"}} placeholder={manPct[0]} onChange={e => manPct[1](e.target.value)}/>% </div>
                <div> {pct_range.map(pct => <button onClick={() => manPct[1](pct)}>{pct}</button>)} </div>
            </div>
        </SetterStyle>
        <button style={{position:"absolute", right:"5%", top:"17%", width:"15%", height:"15%"}} onClick={() => addRange(manPct[0], sendStore.pattern, view.blockName, blockStore, labelStore)}>제출</button>
        <div style={{position:"absolute", right:"2%", top:"5%", cursor:"pointer"}} onClick={() => {change(false);}}>X</div>
    </RangeSetBlockStyle>);
});

export default rangeSetBlock;

const RangeSetBlockStyle = styled.div`
    display: block;
    width: 300px; height: 200px; position: absolute;
    z-index: 2; top: 50%; left: 50%; transform: translate(-50%, -50%);
    border: 1px solid black;
    background-color: white;
    .item {
        display: flex;
        div{
            padding-left: 10px;
        }
    }
`;

const SetterStyle = styled.div`
    display: flex;
    div {
        border: 1px solid #707070;
        padding: 5px;
    }
`;
