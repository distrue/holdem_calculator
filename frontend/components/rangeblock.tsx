import * as React from 'react';
import {useState} from 'react';

interface Props {
    com: number[];
}
const combiBase = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const RangeBlock = (props: Props) => {
    let Label = useState([]);
    // Click 하고 있으면 rangetable에서 mobx state update
    // click 하고 있는 상태에서 hover되면 drag 처리
    if(props.com[0] < props.com[1]) {
        return(<div className="Block" onClick={e => {
            if(Label[0].length == 0 || false) { /* mobx로 cursor pointer 줘서 선택 시킬 것 */ 
                Label[1](Label[0].push("A"));
            } 
            console.log(Label); 
        }} onContextMenu={e => {
            e.preventDefault();
            // callbox State 설정
            Label[1]([]); // For example
        }} style={{backgroundColor: Label[0].length!==0?"#f46500":"#cccccc", cursor: "pointer"}}>{combiBase[props.com[0]]}{combiBase[props.com[1]]}s</div>);
    }
    else if(props.com[0] == props.com[1]) {
        return(<div className="Block" style={{backgroundColor: "#bbbbbb"}}>{combiBase[props.com[0]]}{combiBase[props.com[1]]}</div>);
    }
    else {
        return(<div className="Block" style={{backgroundColor: "#aaaaaa"}}>{combiBase[props.com[1]]}{combiBase[props.com[0]]}o</div>);
    }
}

export default RangeBlock;
