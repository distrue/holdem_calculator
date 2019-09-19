import * as React from 'react';
import {useState, useContext} from 'react';
import {observer} from 'mobx-react-lite';
import useContextMenu from 'react-use-context-menu';
import styled from 'styled-components';

import {share, player} from '../../store';
import * as LabelPatcher from '../../dispatcher/label';
import * as BlockPatcher from '../../dispatcher/block';

interface Props {
    com: number[];
    keyV: string;
    rangeView: any;
    labelStore: any;
    blockStore: any;
    cacheStore: any;
}

const PctBar = observer(({target, blockName, labelStore, blockStore, bindMenuItems}) => {
    const manPct = useState(0);
    const pct_range = [25, 50, 75, 100];
    
    return(<>
    <div {...bindMenuItems}> 
        pct:
        <input style={{width:"30px"}} 
            onChange={e => manPct[1](e.target.value)} 
            onKeyPress={e => LabelPatcher.manValid(e, manPct[0], blockStore, blockName, labelStore, target)} 
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
        return(<div {...bindMenuItems}>
        pattern(p)<br/>
        {blockName[0]}:{Object.keys(pattern).map(item => {
        let bckcol = "white"; if(blockStore.label[blockName][idx].pattern[0].indexOf(pattern[item])>=0) { bckcol = "black"; }
        let col = "black"; if(blockStore.label[blockName][idx].pattern[0].indexOf(pattern[item])>=0) { col = "white"; }
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
                let bckcol = "white"; if(blockStore.label[blockName][idx].pattern[0].indexOf(pattern[item])>=0) { bckcol = "black"; }
                let col = "black"; if(blockStore.label[blockName][idx].pattern[0].indexOf(pattern[item])>=0) { col = "white"; }        
                return(<button style={{backgroundColor: bckcol, color: col}}
                    onClick={e => {
                        BlockPatcher.patternChange(0, blockStore, labelStore, idx, target, item, blockName)
                    }}>{item}</button>);
            })}<br/>
            {blockName[1]}:{Object.keys(pattern).map(item => {
                let bckcol = "white"; if(blockStore.label[blockName][idx].pattern[1].indexOf(pattern[item])>=0) { bckcol = "black"; }
                let col = "black"; if(blockStore.label[blockName][idx].pattern[1].indexOf(pattern[item])>=0) { col = "white"; }        
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
        let bckcol = "white"; if(blockStore.label[blockName][idx].pattern[0].indexOf(pattern[item])>=0) { bckcol = "black"; }
        let col = "black"; if(blockStore.label[blockName][idx].pattern[0].indexOf(pattern[item])>=0) { col = "white"; }
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
    return(
    <div style={{maxHeight: "40vh", overflow:"scroll", paddingBottom:"10px", marginBottom:"10px", borderBottom:"2px solid black"}}>
        {blockStore.label[blockName]?
        blockStore.label[blockName].map((item, idx) => {
            // console.log(idx);
            return(<>
                <div {...bindMenuItems} style={{position: "relative"}}>
                    Label{labelStore.displayMatch[item.label]}: {item.pct}% 
                    <img onClick={e => {
                        LabelPatcher.deleteLabelRange(labelStore, blockStore, item.label, blockName, visibleSet, Out)
                    }} style={{position:"absolute", right:"0%", cursor:"pointer", width:"20px"}} src="/static/bin.png" />
                </div>
                <PctBar target={item} blockName={blockName} labelStore={labelStore} blockStore={blockStore} bindMenuItems={bindMenuItems}/>
                <PatternBar target={item.label} labelStore={labelStore} bindMenuItems={bindMenuItems} blockStore={blockStore} idx={idx} blockName={blockName}/>
                Combos: {item.combo}
                <hr/>
            </>);
        })    
    :""}</div>);
});
const LabelBox = observer(({bindMenu, bindMenuItems, labelStore, blockName, visibleSet, blockStore, Out}) => {
    const playerStore = useContext(player);
    return(<nav {...bindMenu} className="menu">
        <LabelSet {...bindMenuItems} labelStore={labelStore} playerStore={playerStore}
        visibleSet={visibleSet} Out={Out} blockStore={blockStore} blockName={blockName} bindMenuItems={bindMenuItems}/>
        <div {...bindMenuItems}>
            Left: {blockStore.left[blockName]} Combo
        </div>
    </nav>);
    // items.splice(items.indexOf('c'), 1);
});
const RangeBlock = observer((props: Props) => {
    const ghost = useState("");
    const labelStore = props.labelStore; 
    const blockStore = props.blockStore;
    const cacheStore = props.cacheStore;
    const shareStore = useContext(share);
    const playerStore = useContext(player);

    const [bindMenu, bindMenuItems, useContextTrigger, visibleSet] = useContextMenu();
    const [bindTrigger] = useContextTrigger({});    
    let blockName, opacity=1, dead, maB;
    const combiBase = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
    
    if(props.com[0] < props.com[1]) {
        blockName = combiBase[props.com[0]] + combiBase[props.com[1]] + "s";
        dead = 4; maB = 4;
    }
    else if(props.com[0] == props.com[1]) {
        blockName = combiBase[props.com[0]] + combiBase[props.com[1]];
        dead = 6; maB = 6;
    }
    else {
        blockName = combiBase[props.com[1]] + combiBase[props.com[0]] + "o";
        dead = 12; maB = 12;
    }
    if(blockStore.label[blockName] === undefined) {
        blockStore.label[blockName] = []; 
    }
    if(blockStore.left[blockName] === 0 && blockStore.label[blockName].length === 0) {
        opacity = 0.5;
    }
        // console.log("blockStore.left[blockName]: " + blockStore.left[blockName]);
    dead -= blockStore.left[blockName];

    return(<div key={props.keyV} >
        <StyledBlock draggable={true} {...bindTrigger} className="Block" onClick={e => LabelPatcher.addLabelRange(e, labelStore, blockName, blockStore, cacheStore, shareStore, playerStore, props.rangeView, false)} onMouseOver={e => LabelPatcher.addLabelRange(e, labelStore, blockName, blockStore, cacheStore, shareStore, playerStore, props.rangeView, true)} onDragStart={e => LabelPatcher.addLabelRange(e, labelStore, blockName, blockStore, cacheStore, shareStore, playerStore, props.rangeView, true)} style={{cursor: "pointer", border: "1px solid #cccccc",  position:"relative", opacity: opacity}}>
            <div className="blockName">{blockName}</div>
            <div className="backColor">
                {blockStore.label[blockName].map(item => 
                {
                    let nColor = item.color || "#cccccc";
                    dead -= item.combo;
                    return(<div style={{display: "block", width:`${36*item.combo/maB}px`, backgroundColor:nColor}}>{item.combo}</div>);
                })}
                <div style={{display: "block", width:`${36*blockStore.left[blockName]/maB}px`, backgroundColor:"#ffffff"}}></div>
                <div style={{display: "block", width:`${36*dead/maB}px`, backgroundColor:"#444444"}}></div>
            </div>
        </StyledBlock>
        <LabelBox bindMenu={bindMenu} bindMenuItems={bindMenuItems} labelStore={labelStore} blockName={blockName} visibleSet={visibleSet} blockStore={blockStore} Out={ghost}/>
    </div>);
});

export default RangeBlock;

const StyledBlock = styled.div`
    display: block; width: 36px; height: 36px;
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
