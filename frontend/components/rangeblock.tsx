import * as React from 'react';
import {useState, useContext} from 'react';
import {observer} from 'mobx-react-lite';
import label from '../store/Label';
import phase from '../store/Phase';
import player from '../store/Player';
import useContextMenu from 'react-use-context-menu';
import block from '../store/Block';
import styled from 'styled-components';
import * as LabelPatcher from '../dispatcher/label';
import * as BlockPatcher from '../dispatcher/block';

interface Props {
    com: number[];
    keyV: string;
}
const combiBase = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const manValid = (e, val, idx, blockStore, blockName, labelStore, target) => {
    const fval = parseInt(val);
    if(e.key === 'Enter') {
        if(fval !== undefined) {
            if(fval <= 100 && fval >= 0) {
                LabelPatcher.updateLabelPct(fval, labelStore, blockStore, blockName, target.label);
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
            onKeyPress={e => manValid(e, manPct[0], idx, blockStore, blockName, labelStore, target)} 
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
const PatternBar = observer(({bindMenuItems, target, blockStore, labelStore, idx, blockName}) => {
    const pattern = {'S': 0, 'C': 1, 'H': 2, 'D': 3};            

    if(blockName[2] === undefined) {
        return(<div>
        pattern(p)<br/>
        {blockName[0]}:{Object.keys(pattern).map(item => {
        console.log(blockStore.label[blockName][idx].pattern[0].length);
        let bckcol = "white"; if(blockStore.label[blockName][idx].pattern[0].findIndex(ic => ic === pattern[item])>=0) { bckcol = "black"; }
        let col = "black"; if(blockStore.label[blockName][idx].pattern[0].findIndex(ic => ic === pattern[item])>=0) { col = "white"; }
        return(<button 
            style={{backgroundColor: bckcol,
                    color: col}}
            onClick={e => {
                BlockPatcher.patternChange(0, blockStore, labelStore, idx, target, item, blockName)
            }}>
                {item}
        </button>);
        })}
        </div>);
    }
    if(blockName[2] === 'o') {
        return(<div>
            pattern(o)<br/>
            {blockName[0]}:{Object.keys(pattern).map(item => {
                let bckcol = "white"; if(blockStore.label[blockName][idx].pattern[0].findIndex(ic => ic === pattern[item])>=0) { bckcol = "black"; }
                let col = "black"; if(blockStore.label[blockName][idx].pattern[0].findIndex(ic => ic === pattern[item])>=0) { col = "white"; }        
                return(<button style={{backgroundColor: bckcol, color: col}}
                    onClick={e => {
                        BlockPatcher.patternChange(0, blockStore, labelStore, idx, target, item, blockName)
                    }}>{item}</button>);
            })}<br/>
            {blockName[1]}:{Object.keys(pattern).map(item => {
                let bckcol = "white"; if(blockStore.label[blockName][idx].pattern[1].findIndex(ic => ic === pattern[item])>=0) { bckcol = "black"; }
                let col = "black"; if(blockStore.label[blockName][idx].pattern[1].findIndex(ic => ic === pattern[item])>=0) { col = "white"; }        
                return(<button style={{backgroundColor: bckcol, color: col}}
                    onClick={e => {
                        BlockPatcher.patternChange(1, blockStore, labelStore, idx, target, item, blockName)
                    }}>{item}</button>);
            })}<br/>
        </div>);
    }
    if(blockName[2] === 's') {
        return(<div>
        pattern(s)<br/>
        {blockName[0]}{blockName[1]}:{Object.keys(pattern).map(item => {
        let bckcol = "white"; if(blockStore.label[blockName][idx].pattern[0].findIndex(ic => ic === pattern[item])>=0) { bckcol = "black"; }
        let col = "black"; if(blockStore.label[blockName][idx].pattern[0].findIndex(ic => ic === pattern[item])>=0) { col = "white"; }
        return(<button 
            style={{backgroundColor: bckcol,
                    color: col}}
            onClick={e => {
                BlockPatcher.patternChange(0, blockStore, labelStore, idx, target, item, blockName)
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
                <PatternBar target={item.label} labelStore={labelStore} bindMenuItems={bindMenuItems} blockStore={blockStore} idx={idx} blockName={blockName}/>
                Combos: {item.combo}
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
            Left: {blockStore.left[blockName]} Combo
        </div>
    </nav>);
    // items.splice(items.indexOf('c'), 1);
});
const RangeBlock = observer((props: Props) => {
    const ghost = useState("");
    const labelStore = useContext(label); 
    const blockStore = useContext(block);
    const [bindMenu, bindMenuItems, useContextTrigger, visibleSet] = useContextMenu();
    const [bindTrigger] = useContextTrigger({});    
    let blockName, border, opacity=1, dead, maB;

    if(props.com[0] < props.com[1]) {
        border = "1px solid green"; blockName = combiBase[props.com[0]] + combiBase[props.com[1]] + "s";
        dead = 4; maB = 4;
    }
    else if(props.com[0] == props.com[1]) {
        border="1px solid blue"; blockName = combiBase[props.com[0]] + combiBase[props.com[1]];
        dead = 6; maB = 6;
    }
    else {
        border="1px solid purple"; blockName = combiBase[props.com[1]] + combiBase[props.com[0]] + "o";
        dead = 16; maB = 16;
    }
    if(blockStore.label[blockName] === undefined) {
        blockStore.label[blockName] = []; 
    }
    if(blockStore.left[blockName] === 0 && blockStore.label[blockName].length === 0) {
        opacity = 0.5;
    }
    dead -= blockStore.left[blockName];

    return(<div key={props.keyV} >
        <StyledBlock draggable={true} {...bindTrigger} className="Block" onClick={e => LabelPatcher.addLabelRange(e, labelStore, blockName, blockStore)} onDragLeave={e => LabelPatcher.addLabelRange(e, labelStore, blockName, blockStore)} style={{cursor: "pointer",border: border,  position:"relative", opacity: opacity}}>
            <div className="blockName">{blockName}</div>
            <div className="backColor">
                {blockStore.label[blockName].map(item => 
                {
                    let nColor = item.color || "#cccccc";
                    dead -= item.pct;
                    return(<div style={{display: "block", width:`${40*item.combo/maB}px`, backgroundColor:nColor}}>{item.combo}</div>);
                })}
                <div style={{display: "block", width:`${40*blockStore.left[blockName]/maB}px`, backgroundColor:"#ffffff"}}></div>
                <div style={{display: "block", width:`${40*dead/maB}px`, backgroundColor:"#444444"}}></div>
            </div>
        </StyledBlock>
        <LabelBox bindMenu={bindMenu} bindMenuItems={bindMenuItems} labelStore={labelStore} blockName={blockName} visibleSet={visibleSet} blockStore={blockStore} Out={ghost}/>
    </div>);
});

export default RangeBlock;

const StyledBlock = styled.div`
    display: block; width: 40px; height: 40px;
    border: 1px solid black;
    text-align: center;
    .blockName {
        position: absolute; left: 20%; top: 40%; z-index:1;
    }
    .backColor {
        position: absolute; top: 0%; left: 0%; width: 100%; height: 100%; 
        display: flex; flexDirection: row;
    }
`;
