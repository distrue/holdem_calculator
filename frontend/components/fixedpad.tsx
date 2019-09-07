import * as React from 'react';
import {SelectcardBlock} from '.';
import {observer} from 'mobx-react-lite';


const FixedPad = observer((props) => {
    return(<div style={{display:"flex", width:"30vw", flexDirection:"column", ...props.style}}>
        <div style={{display:"block", width:"100%", paddingBottom:"2vh", cursor:"pointer"}}>
            <div style={{fontSize:"3vh", fontWeight:"bold", marginBottom:"1vh"}}>Board </div>
            <div style={{display:"flex", marginLeft:"3vh"}}>
                <SelectcardBlock />
            </div>
        </div>
    </div>);
});

export default FixedPad;
