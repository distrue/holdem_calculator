import * as React from 'react';
import {SelectCard} from '../components';
import {useContext} from 'react';
import phase from '../store/Phase';
import {observer} from 'mobx-react-lite';
import block from '../store/Block';
import label from '../store/Label';
import player from '../store/Player';

const HandTable = observer((props) => {
    const blockStore = useContext(block);
    const labelStore = useContext(label);
    const phaseStore = useContext(phase);
    const playerStore = useContext(player);

    let style = {display:"flex", width:"30vw", flexDirection:"column", ...props.style};
    return(<div style={style}>
    <div style={{display:"block", width:"100%", height:"7vh", fontWeight:"bold", fontSize:"3vh"}}>HandSetting</div>
    <div style={{display:"flex", flexDirection:"column", width:"100%", height:"20vh"}}>
        <div style={{fontWeight:"bold"}}>Players Decision</div>
        <div>Player 1: select label</div>
        <div>Player 2: select label</div>
        <div>Player 3: select label</div>
    </div>
    <div style={{display:"block", width:"100%", height:"10vh"}}>My Card<br/><div style={{display:"flex"}}><SelectCard/><SelectCard/></div></div>
    <div>Now Phase</div>
    <div style={{display:"block", width:"100%", height:"10vh"}} style={{color: phaseStore.pnow==="preflop"?"green":"black", cursor:"pointer"}} onClick={e => {phaseStore.pnow="preflop"; blockStore.constructor({labelRange: labelStore.labelRange, target:labelStore.data[playerStore.now][phaseStore.pnow]});}}>Preflop</div>
    <div style={{display:"block", width:"100%", height:"10vh"}} style={{color: phaseStore.pnow==="flop"?"green":"black", cursor:"pointer"}} onClick={e => {phaseStore.pnow="flop"}}>Flop<br/><div style={{display:"flex"}}><SelectCard/><SelectCard/><SelectCard/></div></div>
    <div style={{display:"block", width:"100%", height:"10vh"}} style={{color: phaseStore.pnow==="turn"?"green":"black", cursor:"pointer"}} onClick={e => {phaseStore.pnow="turn"}}>Turn<br/><SelectCard/></div>
    <div style={{display:"block", width:"100%", height:"10vh"}} style={{color: phaseStore.pnow==="river"?"green":"black", cursor:"pointer"}} onClick={e => {phaseStore.pnow="river"}}>River<br/><SelectCard/></div>
    
    </div>);
});

export default HandTable;