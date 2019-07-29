import * as React from 'react';

const selectCard = () => {
    return(<div style={{display:"block", width:"3vw", border:"1px solid black"}}>
        <input onChange={e => console.log("change")} onKeyPress={e => console.log("press")} />
    </div>);
}

export default selectCard;
