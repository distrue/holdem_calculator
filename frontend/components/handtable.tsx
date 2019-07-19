import * as React from 'react';
import {SelectCard} from '../components';

const HandTable = (props) => {
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
    <div style={{display:"block", width:"100%", height:"10vh"}}>Preflop WinRate</div>
    <div style={{display:"block", width:"100%", height:"10vh"}}>Flop WinRate<br/><div style={{display:"flex"}}><SelectCard/><SelectCard/><SelectCard/></div></div>
    <div style={{display:"block", width:"100%", height:"10vh"}}>Turn WinRate<br/><SelectCard/></div>
    <div style={{display:"block", width:"100%", height:"10vh"}}>River WinRate<br/><SelectCard/></div>
    
    </div>);
}

export default HandTable;