import * as React from 'react';
import {SelectCard} from '../components';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import phase from '../store/Phase';


const HandTable = observer((props) => {
    const phaseStore = useContext(phase);
    let style = {display:"flex", width:"30vw", flexDirection:"column", ...props.style};
    let phaseName = [["preflop",0], ["flop",3], ["turn",1], ["river", 1]];

    return(<div style={style}>
        <div style={{display:"block", width:"100%", height:"7vh", fontWeight:"bold", fontSize:"3vh"}}>Now Phase</div>
        {phaseName.map(idx => {
            const ncolor = phaseStore.pnow===idx[0]?"green":"black";
            return(<div 
                    style={{display:"block", width:"100%", height:"10vh", color: ncolor, cursor:"pointer"}} onClick={e => {phaseStore.pnow=idx[0];}}>
                {idx[0]}
                <div style={{display:"flex"}}>
                    {[...Array(idx[1]).keys()].map(item => <SelectCard/>)}
                </div>
            </div>);
        })}
    </div>);
});

export default HandTable;
