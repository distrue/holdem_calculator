import * as React from 'react';
import {SelectcardBlock} from '.';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {player, label} from '../store';


const FixedPad = observer((props) => {
    const playerStore = useContext(player);
    const labelStore = useContext(label);
    
    return(<div style={{display:"flex", width:"30vw", flexDirection:"column", ...props.style}}>
        <div style={{display:"block", width:"100%", paddingBottom:"2vh", cursor:"pointer"}}>
            <div style={{fontSize:"3vh", fontWeight:"bold", marginBottom:"1vh"}}>Board</div>
            <div style={{display:"flex", marginLeft:"3vh"}}>
                {[...Array(5).keys()].map(item => <SelectcardBlock num={item}/>)}
            </div>
        </div>
    </div>);
});

export default FixedPad;
