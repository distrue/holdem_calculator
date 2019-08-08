import * as React from 'react';
import {RangeTable, LabelTable, HandTable, ResultTable} from '../components';

export default () => {
    return(<>
    <div style={{position: "absolute", left:"5vw", top: "3vh", fontSize:"3vh", fontWeight:"bold"}}>Range Calculator</div>
    <div style={{position:"absolute", top:"10%", left:"10%", display:"flex", flexDirection:"row", width:"80vw", flexWrap: "wrap"}}>
        <div style={{display:"flex", flexDirection:"column"}}>
            <LabelTable style={{display:"block", width:"200px"}}/>
            <ResultTable style={{display:"block", width:"200px", marginTop:"5vh"}}/>
        </div>
        <RangeTable style={{display:"block", paddingLeft:"5vw", width:"550px", paddingBottom:"30px"}}/>
        <HandTable style={{display:"block", paddingLeft:"5vw", width:"200px"}}/>
    </div>
    </>);
};
