import * as React from 'react';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import player from '../store/Player';
import phase from '../store/Phase';
import label from '../store/Label';
import block from '../store/Block';
import {CombiBox} from '../components';

const AddLabel = (props) => {
    if(props.player == "") {
        alert("choose player first!");
        return;
    }
    if(props.labelStore.data[props.player] === undefined) {
        props.labelStore.data[props.player] = {};
    }
    if(props.labelStore.data[props.player][props.phase] === undefined) {
        props.labelStore.data[props.player][props.phase] = [];
    }
    props.labelStore.data[props.player][props.phase].push(props.labelStore.total + 1);
    console.log(props.labelStore.labelRange);
    props.labelStore.total = props.labelStore.total + 1;
    props.labelStore.labelRange[props.labelStore.total] = [];
    props.labelStore.labelCombi[props.labelStore.total] = [];
}
const LabelTable = observer((props) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    const labelStore = useContext(label);
    const blockStore = useContext(block);

    const style = {display:"flex", flexDirection: "column", ...props.style};
    let phaselist = ["preflop", "flop", "turn", "river"];
    return(<div style={style}>
        <div style={{display:"block", width:"10vw", height:"10vh", fontSize:"3vh", paddingTop:"3vh", fontWeight: "bold"}}>Player</div>
        <div>Now Player: {playerStore.now}</div>
        {playerStore.list.map(item => 
            <div>{
                phaselist.map(Iphase => 
                    <div onClick={e => {
                        playerStore.now=item;
                        blockStore.constructor({labelRange: labelStore.labelRange, target:labelStore.data[playerStore.now][phaseStore.pnow]});
                    }}>
                        Player {item}: <br/>
                        {Iphase} -> {
                            (labelStore.data[item] && labelStore.data[item][Iphase])?
                            labelStore.data[item][Iphase].map(item => <>
                            <div onClick={e => labelStore.now = item}style={{border:"1px solid black"}}>{item}</div>
                            <CombiBox/>
                            </>):
                             ""}
                    </div>)
            }</div>
        )}
        <button onClick={e => {
            playerStore.list.push((playerStore.list.length+1).toString());
            labelStore.data[(playerStore.list.length).toString()] = {};
            console.log((playerStore.list.length).toString(), playerStore.list.toString());
        }}>New User</button>
        <hr/>
        
        <div style={{display:"block", width:"10vw", height:"5vh", paddingTop:"3vh",fontSize:"3vh", fontWeight: "bold"}}>Label</div>
        <div style={{border: "1px solid black"}}>
        <div>Now Player: {playerStore.now}</div>
        <div>Now Phase: {phaseStore.pnow}</div>
        <div>Now Label: {labelStore.now}</div>
        </div>
        <button onClick={e => AddLabel({player:playerStore.now, phase:phaseStore.pnow, labelStore: labelStore})}>New label</button>
    </div>);
});
export default LabelTable;
