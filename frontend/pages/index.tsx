import * as React from 'react';
import {RangePad, PlayerPad, FixedPad, ResultPad, LabelPad} from '../components';

export default () => {
    return(<>
    <div style={{position: "absolute", left:"5vw", top: "3vh", fontSize:"4vh", fontWeight:"bold"}}>Range Calculator</div>
    <PlayerPad style={{position: "absolute", left:"5vw", top: "12vh", display:"block", width:"100px"}}/>
    <div style={{position:"absolute", top:"8%", left:"10%", display:"flex", flexDirection:"row", width:"80vw", flexWrap: "wrap"}}>
        <div style={{display:"block", paddingLeft:"5vw", width:"500px", flexDirection: "row"}}>
            <RangePad style={{display:"block", width:"550px", paddingBottom:"20px"}}/>
            <LabelPad style={{display:"block", width:"550px", paddingBottom:"30px"}}/>
        </div>
        <div style={{display:"block", paddingLeft:"5vw", width:"200px", flexDirection: "row"}}>
            <FixedPad style={{display:"block", width:"200px", paddingBottom:"20px"}}/>
            <ResultPad style={{display:"block", width:"400px"}}/>
        </div>
    </div>
    </>);
};
