import * as React from 'react';

const LabelTable = (props) => {
    const style = {display:"flex", flexDirection: "column", ...props.style};
    return(<div style={style}>
        <div style={{display:"block", width:"10vw", height:"10vh", fontSize:"3vh", fontWeight: "bold"}}>Label</div>
        <div style={{display:"block", width:"10vw"}}>Each Label should include
        <br/>1. Hand Rangetable <br/>2. Occured Combination(ex: Flush, Pair) <br/> 3. Each Range also includes percentage </div>
        <br/><br/>
        <div style={{display:"block", width:"10vw"}}>Label are colored, numbered</div>
    </div>);
}
export default LabelTable;