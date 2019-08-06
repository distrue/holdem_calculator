import * as React from 'react';
import {SelectCard} from '../components';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import * as Refresh from '../dispatcher/refresh';
import player from '../store/Player';
import phase from '../store/Phase';
import label from '../store/Label';
import block from '../store/Block';
import share from '../store/Share';


const HandTable = observer((props) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    
    let style = {display:"flex", width:"30vw", flexDirection:"column", ...props.style};
    let phaseName = [["preflop",0], ["flop",3], ["turn",1], ["river", 1]];

    return(<div style={style}>
        <div style={{display:"block", width:"10vw", marginBottom:"2vh", fontSize:"3vh", fontWeight: "bold"}}>Status</div>
        <div style={{border: "1px solid black", marginBottom:"4vh"}}>
        <div>Now Player: {playerStore.now}</div>
        <div>Now Phase: {phaseStore.now}</div>
        <div>Now Label: {labelStore.now}</div>
        </div>
        
        <div style={{display:"block", width:"100%", paddingBottom:"2vh", fontWeight:"bold", fontSize:"3vh"}}>Phase Setting</div>
        {phaseName.map((idx, ni) => {
            const ncolor = phaseStore.now===idx[0]?"green":"black";
            const pnowVal = phaseName.findIndex(item => item[0] === phaseStore.now);
            return(<div 
                    style={{display:"block", width:"100%", paddingBottom:"2vh", color: ncolor, cursor:"pointer"}} onClick={e => {
                        Refresh.refresh(playerStore.now, idx[0], labelStore, playerStore, phaseStore, blockStore);
                        }}>
                {idx[0]}
                <div style={{display:"flex"}}>
                    {[...Array(idx[1]).keys()].map(item => <SelectCard need={ni <= pnowVal} phase={idx[0]} num={item}/>)}
                </div>
                <hr/>
            </div>);
        })}
    </div>);
});

export default HandTable;
