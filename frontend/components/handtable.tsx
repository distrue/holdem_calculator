import * as React from 'react';
import {SelectCard} from '../components';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import * as Refresh from '../dispatcher/refresh';
import player from '../store/Player';
import phase from '../store/Phase';
import label from '../store/Label';
import block from '../store/Block';


const HandTable = observer((props) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    
    let style = {display:"flex", width:"30vw", flexDirection:"column", ...props.style};
    let phaseName = [["preflop",0], ["flop",3], ["turn",1], ["river", 1]];

    return(<div style={style}>
        <div style={{display:"block", width:"100%", height:"7vh", fontWeight:"bold", fontSize:"3vh"}}>Now Phase</div>
        {phaseName.map(idx => {
            const ncolor = phaseStore.pnow===idx[0]?"green":"black";
            return(<div 
                    style={{display:"block", width:"100%", height:"10vh", color: ncolor, cursor:"pointer"}} onClick={e => {
                        Refresh.refresh(playerStore.now, idx[0], labelStore, playerStore, phaseStore, blockStore);
                        }}>
                {idx[0]}
                <div style={{display:"flex"}}>
                    {[...Array(idx[1]).keys()].map(item => <SelectCard/>)}
                </div>
            </div>);
        })}
    </div>);
});

export default HandTable;
