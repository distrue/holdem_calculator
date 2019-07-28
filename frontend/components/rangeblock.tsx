import * as React from 'react';
import {useState, useContext} from 'react';
import {observer} from 'mobx-react-lite';
import label from '../store/Label';
import phase from '../store/Phase';
import player from '../store/Player';
import useContextMenu from 'react-use-context-menu';
import block from '../store/Block';
import styled from 'styled-components';

const Astyle = styled.div`
    display: block; width: 40px; height: 40px;
    border: 1px solid black;
    text-align: center;
`;
interface Props {
    com: number[];
    keyV: string;
}
const change = (e) => {
    console.dir(e.target.value);
}
const al = (e, labelStore, blockStore, blockName) => {
    if(e.charCode === 13){
        console.log("Submit", e.target.value);
        let cut = labelStore.labelRange[labelStore.now].findIndex(i => i.blockName === blockName);
        let Lcut = blockStore.label[blockName].findIndex(i => i.label === labelStore.now);
        if(!Number(e.target.value)) {
            return;
        }
        let now = Number(e.target.value);
        let delta = now - labelStore.labelRange[labelStore.now][cut].pct;
        blockStore.left[blockName] -= delta;
        labelStore.labelRange[labelStore.now][cut].pct = now;
        blockStore.label[blockName][Lcut].pct = now;
    }
}
const combiBase = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const Con = observer(({bindMenu, bindMenuItems, labelStore, blockName, visibleSet, blockStore, Out}) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    return(<nav {...bindMenu} className="menu">
        {labelStore.data[playerStore.now] !== undefined && labelStore.data[playerStore.now] [phaseStore.pnow]!== undefined? 
        labelStore.data[playerStore.now][phaseStore.pnow].map(item => {
            if(labelStore.labelRange[item] === undefined) { return(<></>)}
            let ans = labelStore.labelRange[item].findIndex(i => i.blockName === blockName);
            if(ans < 0) { return(<></>)}
            return(<>
                <div {...bindMenuItems}>Label{item}: {labelStore.labelRange[item][ans].pct}%</div>
                <div {...bindMenuItems}>Percentage setup<input style={{width:"40px"}}onKeyPress={e => al(e, labelStore, blockStore, blockName)} onChange={change}/></div>
                <hr/>
            </>);
        })
        :""}
        <div {...bindMenuItems}>Left: {blockStore.left[blockName]}%</div>
        <div onClick={e => {
            if(labelStore.labelRange[labelStore.now] === undefined) { return; }
            let cut = labelStore.labelRange[labelStore.now].findIndex(i => i.blockName === blockName);
            let Lcut = blockStore.label[blockName].findIndex(i => i.label === labelStore.now);
            
            if(cut < 0) { return; }
            blockStore.left[blockName] += labelStore.labelRange[labelStore.now][cut].pct;
            labelStore.labelRange[labelStore.now].splice(cut, 1);
            visibleSet.setVisible(false);
            blockStore.color[blockName] = "#ffffff";
            console.log(Out[0]);
            blockStore.label[blockName].splice(Lcut, 1);
            Out[1]("F");
            console.log(Out[0]);
        }} style={{cursor:"pointer"}}>clear</div>
    </nav>);
    // items.splice(items.indexOf('c'), 1);
});

const Color = (e, labelStore, blockName, playerStore, phaseStore, blockStore) => {  
    if(labelStore.now === undefined) {
        alert("choose label first!");
        return;
    }
    if(blockStore.left[blockName] <= 0) {
        return;
    }
    if(labelStore.labelRange[labelStore.now].indexOf(blockName) < 0) {
        labelStore.labelRange[labelStore.now].push({blockName: blockName, pct: 100});
        if(blockStore.label[blockName] === undefined) {
            blockStore.label[blockName] = [];
        }
        blockStore.label[blockName].push({label:labelStore.now, pct:100});
        blockStore.color[blockName] = "#f46500";
        blockStore.left[blockName] -= 100;
    }
}

const RangeBlock = observer((props: Props) => {
    const ghost = useState("");
    const playerStore = useContext(player);
    const phaseStore = useContext(phase); 
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    const [
        bindMenu,
        bindMenuItems,
        useContextTrigger,
        visibleSet
      ] = useContextMenu();
    const [bindTrigger] = useContextTrigger({});    
    let blockName, border;

    if(props.com[0] < props.com[1]) {
        border = "1px solid green";
        blockName = combiBase[props.com[0]] + combiBase[props.com[1]] + "s";
    }
    else if(props.com[0] == props.com[1]) {
        border="1px solid blue";
        blockName = combiBase[props.com[0]] + combiBase[props.com[1]];
    }
    else {
        border="1px solid red";
        blockName = combiBase[props.com[0]] + combiBase[props.com[1]] + "o";
    }

    if(blockStore.left[blockName] === undefined) {
        blockStore.left[blockName] = 100;
    }
    console.log(ghost[0]);
    if(blockStore.label[blockName] === undefined) {
        return(<div key={props.keyV} >
            <Astyle {...bindTrigger} className="Block" onClick={e => Color(e, labelStore, blockName, playerStore, phaseStore, blockStore)} style={{cursor: "pointer",border: border,  position:"relative"}}>
                <div style={{position:"absolute", "left":"20%", "top":"20%", zIndex:"1"}}>{blockName}</div>
                <div style={{position:"absolute", top:"0%", left:"0%", width:"100%", height:"100%", display:"flex", flexDirection:"row"}}>
                    <div style={{display: "block", width:`${40}px`, backgroundColor:"#ffffff"}}></div>
                </div>
            </Astyle>
            <Con bindMenu={bindMenu} bindMenuItems={bindMenuItems} labelStore={labelStore} blockName={blockName} visibleSet={visibleSet} blockStore={blockStore} Out={ghost}/>
            </div>);    
    }
    return(<div key={props.keyV} >
    <Astyle {...bindTrigger} className="Block" onClick={e => Color(e, labelStore, blockName, playerStore, phaseStore, blockStore)} style={{cursor: "pointer",border: border,  position:"relative"}}>
        <div style={{position:"absolute", "left":"20%", "top":"20%", zIndex:"1"}}>{blockName}</div>
        <div style={{position:"absolute", top:"0%", left:"0%", width:"100%", height:"100%", display:"flex", flexDirection:"row"}}>
            {blockStore.label[blockName].map(item => <div style={{display: "block", width:`${0.4*item.pct}px`, backgroundColor:"#cccccc"}}>{item.pct}</div>)}<div style={{display: "block", width:`${0.4*blockStore.left[blockName]}px`, backgroundColor:"#ffffff"}}></div>
        </div>
    </Astyle>
    <Con bindMenu={bindMenu} bindMenuItems={bindMenuItems} labelStore={labelStore} blockName={blockName} visibleSet={visibleSet} blockStore={blockStore} Out={ghost}/>
    </div>);
});

export default RangeBlock;
