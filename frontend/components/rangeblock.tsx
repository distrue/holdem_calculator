import * as React from 'react';
import {useState} from 'react';
import useContextMenu from 'react-use-context-menu';

interface Props {
    com: number[];
    keyV: string;
}
const combiBase = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const Con = ({bindMenu, bindMenuItems, Label}) => {
    return(<nav {...bindMenu} className="menu">
        <div {...bindMenuItems}>Label1: 50%</div>
        <div {...bindMenuItems}>Percentage setup</div>
        <hr/>
        <div {...bindMenuItems}>Left: 50%</div>
        <div onClick={e => Label[1]([])} style={{cursor:"pointer"}}>clear</div>
    </nav>);
}

const Color = (e, Label) => {   
    if(Label[0].length == 0 || false) { /* mobx로 cursor pointer 줘서 선택 시킬 것 */ 
        Label[1](Label[0].push("A"));
    }
    console.log(Label); 
}
const RangeBlock = (props: Props) => {
    const [
        bindMenu,
        bindMenuItems,
        useContextTrigger
      ] = useContextMenu();
    const [bindTrigger] = useContextTrigger({});    
    
    let Label = useState([]);
    // Click 하고 있으면 rangetable에서 mobx state update
    // click 하고 있는 상태에서 hover되면 drag 처리
    if(props.com[0] < props.com[1]) {
        return(<div key={props.keyV}>
        <div {...bindTrigger} className="Block" onClick={e => Color(e, Label)} style={{backgroundColor: Label[0].length!==0?"#f46500":"#cccccc", cursor: "pointer"}}>
            {combiBase[props.com[0]]}{combiBase[props.com[1]]}s
        </div>
        <Con bindMenu={bindMenu} bindMenuItems={bindMenuItems} Label={Label}/>
        </div>);
    }
    else if(props.com[0] == props.com[1]) {
        return(<div key={props.keyV}>
        <div {...bindTrigger} className="Block" style={{backgroundColor: "#bbbbbb"}}>
            {combiBase[props.com[0]]}{combiBase[props.com[1]]}
        </div>
        <Con bindMenu={bindMenu} bindMenuItems={bindMenuItems}  Label={Label}/>
        </div>);
    }
    else {
        return(<div key={props.keyV}>
        <div {...bindTrigger} className="Block" style={{backgroundColor: "#aaaaaa"}}>
            {combiBase[props.com[1]]}{combiBase[props.com[0]]}o
        </div>
        <Con bindMenu={bindMenu} bindMenuItems={bindMenuItems}  Label={Label}/>
        </div>);
    }
}

export default RangeBlock;
