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

const PctBar = observer(({labelStore, playerStore, phaseStore, blockStore, blockName, bindMenuItems}) => {
    return(<>{blockStore.label[blockName]?
        blockStore.label[blockName].map(item => {
            const pct_range = [25, 50, 75, 100];
            return(<>
                <div {...bindMenuItems}>Label{item.label}: {item.pct}%</div>
                <div {...bindMenuItems}>Pct: 
                    {pct_range.map(pct => 
                        <button onClick={e => LabelPatcher.updateLabelPct(pct, labelStore, blockStore, blockName)}>
                            {pct}
                        </button>
                    )}
                </div>
                <hr/>
            </>);
        })    
    :""}</>);
});

const LabelBox = observer(({bindMenu, bindMenuItems, labelStore, blockName, visibleSet, blockStore, Out}) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    return(<nav {...bindMenu} className="menu">
        <PctBar labelStore={labelStore} playerStore={playerStore} phaseStore={phaseStore} blockStore={blockStore} blockName={blockName} bindMenuItems={bindMenuItems}/>
        <div {...bindMenuItems}>Left: {blockStore.left[blockName]}%</div>
        <div onClick={e => {
            LabelPatcher.deleteLabelRange(labelStore, blockStore, blockName, visibleSet, Out)
        }} style={{cursor:"pointer"}}>clear</div>
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
        <StyledBlock draggable={true} {...bindTrigger} className="Block" onClick={e => LabelPatcher.addLabelRange(e, labelStore, blockName, blockStore)} onDragLeave={e => LabelPatcher.addLabelRange(e, labelStore, blockName, blockStore)} style={{cursor: "move",border: border,  position:"relative"}}>
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
