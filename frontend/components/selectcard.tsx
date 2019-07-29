import * as React from 'react';

const selectCard = () => {
    return(<div style={{display:"block", width:"35px", border:"1px solid black"}}>
        <input style={{width:"25px", border:"0px solid black"}} onChange={e => console.log("change")} onKeyPress={e => console.log("press")} />
    </div>);
}

export default selectCard;
