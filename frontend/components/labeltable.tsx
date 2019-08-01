import * as React from 'react';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import player from '../store/Player';
import phase from '../store/Phase';
import label from '../store/Label';
import block from '../store/Block';
import * as LabelPatcher from '../dispatcher/label';
import * as Refresh from '../dispatcher/refresh';

const LabelTable = observer((props) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    const labelStore = useContext(label);
    const blockStore = useContext(block);

    const style = {display:"flex", flexDirection: "column", ...props.style};
    let phaselist = ["preflop", "flop", "turn", "river"];
    return(<div style={style}>
        <div style={{display:"block", width:"10vw", height:"10vh", fontSize:"3vh", paddingTop:"3vh", fontWeight: "bold"}}>Player</div>
        {playerStore.list.map(item => 
            <div onClick={e => {
                Refresh.refresh(item, phaseStore.pnow, labelStore, playerStore, phaseStore, blockStore);
            }}
            style={{color:playerStore.now===item?"green":"black"}}
            >
                Player {item}
            </div>
        )}
        <button onClick={e => {
            playerStore.list.push((playerStore.list.length+1).toString());
            labelStore.data[(playerStore.list.length).toString()] = {};
            console.log((playerStore.list.length).toString(), playerStore.list.toString());
        }}>New User</button>
        <hr/>
        
        <div>Now Player: {playerStore.now}</div>
        {phaselist.map(Iphase => {
            return(<> 
                {Iphase}:
                {(labelStore.data[playerStore.now] && labelStore.data[playerStore.now][Iphase])?
                labelStore.data[playerStore.now][Iphase].map(item => <>
                    <div onClick={e => labelStore.now = item} style={{border:"1px solid black"}}>
                        {item}
                    </div>
                </>)
                :""}<br/>
            </>);
        })}

        <div style={{display:"block", width:"10vw", height:"5vh", paddingTop:"3vh",fontSize:"3vh", fontWeight: "bold"}}>Label</div>
        <div style={{border: "1px solid black"}}>
        <div>Now Player: {playerStore.now}</div>
        <div>Now Phase: {phaseStore.pnow}</div>
        <div>Now Label: {labelStore.now}</div>
        </div>
        <button onClick={e => LabelPatcher.addLabel({player:playerStore.now, phase:phaseStore.pnow, labelStore: labelStore})}>New label</button>
    </div>);
});
export default LabelTable;
