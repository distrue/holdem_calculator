import * as React from 'react';
import {useState, useContext} from 'react';
import {observer, useObservable} from 'mobx-react-lite';
import label from '../store/Label';
import phase from '../store/Phase';
import player from '../store/Player';
import useContextMenu from 'react-use-context-menu';
import block from '../store/Block';
import styled from 'styled-components';
import * as LabelPatcher from '../dispatcher/label';

const StyledBlock = styled.div`
    display: block; width: 40px; height: 40px;
    border: 1px solid black;
    text-align: center;
    .blockName {
        position: absolute; left: 20%; top: 20%; z-index:1;
    }
    .backColor {
        position: absolute; top: 0%; left: 0%; width: 100%; height: 100%; 
        display: flex; flexDirection: row;
    }
`;
interface Props {
    com: number[];
    keyV: string;
}
const combiBase = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const manValid = (e, val, idx, blockStore, blockName) => {
    const fval = parseInt(val);
    if(e.key === 'Enter') {
        if(fval !== undefined) {
            if(fval <= 100 && fval >= 0) {
                blockStore.label[blockName][idx].pct = fval;
            }
        }
    }
}
const PctBar = observer(({target, blockName, labelStore, idx, blockStore, bindMenuItems}) => {
    const manPct = useState(0);
    const pct_range = [25, 50, 75, 100];
    
    return(<>
    <div {...bindMenuItems}> 
        pct:
        <input style={{width:"30px"}} 
            onChange={e => manPct[1](e.target.value)} 
            onKeyPress={e => manValid(e, manPct[0], idx, blockStore, blockName)} 
        placeholder={target.pct}/>%
    </div>
    <div {...bindMenuItems}> 
        {pct_range.map(pct => 
            <button onClick={e => LabelPatcher.updateLabelPct(pct, labelStore, blockStore, blockName, target.label)}>
                {pct}
            </button>
        )}
    </div>
    </>);
});
const PatternBar = observer(({bindMenuItems, blockName}) => {
    const pattern = {'S': 0, 'C': 1, 'H': 2, 'D': 3};            

    if(blockName[2] === undefined) {
        const store = useObservable({
            one: [0, 1, 2, 3],
        });
        return(<div>
        pattern(p)<br/>
        {blockName[0]}:{Object.keys(pattern).map(item => {
        let bckcol = "white"; if(store.one.findIndex(ic => ic === pattern[item])>=0) { bckcol = "black"; }
        let col = "black"; if(store.one.findIndex(ic => ic === pattern[item])>=0) { col = "white"; }
        return(<button 
            style={{backgroundColor: bckcol,
                    color: col}}
            onClick={e => {
                const x = store.one.findIndex(ic => ic === pattern[item]);
                if(x >= 0) { store.one.splice(x, 1); }
                else { store.one.push(pattern[item]); }
            }}>
                {item}
        </button>);
        })}
        </div>);
    }
    if(blockName[2] === 'o') {
        const store = useObservable({
            one: [0, 1, 2, 3],
            two: [0, 1, 2, 3]
        });
        return(<div>
            pattern(o)<br/>
            {blockName[0]}:{Object.keys(pattern).map(item => {
                let bckcol = "white"; if(store.one.findIndex(ic => ic === pattern[item])>=0) { bckcol = "black"; }
                let col = "black"; if(store.one.findIndex(ic => ic === pattern[item])>=0) { col = "white"; }        
                return(<button style={{backgroundColor: bckcol, color: col}}
                    onClick={e => {
                        const x = store.one.findIndex(ic => ic === pattern[item]);
                        if(x >= 0) { store.one.splice(x, 1); }
                        else { store.one.push(pattern[item]); }
                    }}>{item}</button>);
            })}<br/>
            {blockName[1]}:{Object.keys(pattern).map(item => {
                let bckcol = "white"; if(store.two.findIndex(ic => ic === pattern[item])>=0) { bckcol = "black"; }
                let col = "black"; if(store.two.findIndex(ic => ic === pattern[item])>=0) { col = "white"; }        
                return(<button style={{backgroundColor: bckcol, color: col}}
                    onClick={e => {
                        const x = store.two.findIndex(ic => ic === pattern[item]);
                        if(x >= 0) { store.two.splice(x, 1); }
                        else { store.two.push(pattern[item]); }
                    }}>{item}</button>);
            })}<br/>
        </div>);
    }
    if(blockName[2] === 's') {
        const store = useObservable({
            one: [0, 1, 2, 3],
        });
        return(<div>
        pattern(s)<br/>
        {blockName[0]}:{Object.keys(pattern).map(item => {
        let bckcol = "white"; if(store.one.findIndex(ic => ic === pattern[item])>=0) { bckcol = "black"; }
        let col = "black"; if(store.one.findIndex(ic => ic === pattern[item])>=0) { col = "white"; }
        return(<button 
            style={{backgroundColor: bckcol,
                    color: col}}
            onClick={e => {
                const x = store.one.findIndex(ic => ic === pattern[item]);
                if(x >= 0) { store.one.splice(x, 1); }
                else { store.one.push(pattern[item]); }
            }}>
                {item}
        </button>);
        })}
        </div>);
    }
});
const LabelSet = observer(({labelStore, blockStore, blockName, bindMenuItems, visibleSet, Out}) => {
    return(<>{blockStore.label[blockName]?
        blockStore.label[blockName].map((item, idx) => {
            return(<>
                <div {...bindMenuItems}>
                    Label{item.label}: {item.pct}% 
                    <img onClick={e => {
                        LabelPatcher.deleteLabelRange(labelStore, blockStore, item.label, blockName, visibleSet, Out)
                    }} style={{position:"absolute", right:"0%", cursor:"pointer", width:"20px"}} src="/static/bin.png" />
                </div>
                <PctBar idx={idx} target={item} blockName={blockName} labelStore={labelStore} blockStore={blockStore} bindMenuItems={bindMenuItems}/>
                <PatternBar bindMenuItems={bindMenuItems} blockName={blockName}/>
                <hr/>
            </>);
        })    
    :""}</>);
});

const LabelBox = observer(({bindMenu, bindMenuItems, labelStore, blockName, visibleSet, blockStore, Out}) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    return(<nav {...bindMenu} className="menu">
        <LabelSet labelStore={labelStore} playerStore={playerStore} phaseStore={phaseStore}
        visibleSet={visibleSet} Out={Out} blockStore={blockStore} blockName={blockName} bindMenuItems={bindMenuItems}/>
        <div {...bindMenuItems}>
            Left: {blockStore.left[blockName]}%
        </div>
    </nav>);
    // items.splice(items.indexOf('c'), 1);
});

const RangeBlock = observer((props: Props) => {
    const ghost = useState("");
    const playerStore = useContext(player); const phaseStore = useContext(phase); const labelStore = useContext(label); const blockStore = useContext(block);
    const [bindMenu, bindMenuItems, useContextTrigger, visibleSet] = useContextMenu();
    const [bindTrigger] = useContextTrigger({});    
    let blockName, border;

    if(props.com[0] < props.com[1]) {
        border = "1px solid green"; blockName = combiBase[props.com[0]] + combiBase[props.com[1]] + "s";
    }
    else if(props.com[0] == props.com[1]) {
        border="1px solid blue"; blockName = combiBase[props.com[0]] + combiBase[props.com[1]];
    }
    else {
        border="1px solid red"; blockName = combiBase[props.com[1]] + combiBase[props.com[0]] + "o";
    }
    if(blockStore.left[blockName] === undefined) {
        blockStore.left[blockName] = 100;
    }
    if(blockStore.label[blockName] === undefined) {
        blockStore.label[blockName] = []; 
    }
    
    return(<div key={props.keyV} >
        <StyledBlock draggable={true} {...bindTrigger} className="Block" onClick={e => LabelPatcher.addLabelRange(e, labelStore, blockName, blockStore)} onDragLeave={e => LabelPatcher.addLabelRange(e, labelStore, blockName, blockStore)} style={{cursor: "pointer",border: border,  position:"relative"}}>
            <div className="blockName">{blockName}</div>
            <div className="backColor">
                {blockStore.label[blockName].map(item => 
                {
                    let nColor = item.color || "#cccccc";
                    return(<div style={{display: "block", width:`${0.4*item.pct}px`, backgroundColor:nColor}}>{item.pct}</div>);
                })}
                <div style={{display: "block", width:`${0.4*blockStore.left[blockName]}px`, backgroundColor:"#ffffff"}}></div>
            </div>
        </StyledBlock>
        <LabelBox bindMenu={bindMenu} bindMenuItems={bindMenuItems} labelStore={labelStore} blockName={blockName} visibleSet={visibleSet} blockStore={blockStore} Out={ghost}/>
    </div>);
});

export default RangeBlock;
