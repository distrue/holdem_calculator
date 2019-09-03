import * as React from 'react';
import {useState, useContext} from 'react';
import {observer} from 'mobx-react-lite';
import share from '../../store/Share';

const looker = {'a': 12, 'A': 12, 'k':11, 'K':11, 'q':10, 'Q':10, 'j':9, 'J':9, 't':8, 'T':8, 
'9':7, '8':6, '7':5, '6':4, '5':3, '4':2, '3':1, '2':0};
const backLooker = "23456789TJQKA";
const pattern = {'s': 0, 'S': 0, 'c': 1, 'C': 1, 'h': 2, 'H': 2, 'd': 3, 'D': 3};
const backPattern = {0: 's', 1: 'c', 2: 'h', 3: 'd'};

const setCard = (e, colorChange) => {
    // Validation
    if(e.target.value.length !== 2) {
        colorChange("black"); 
        return;
    }
    let x = e.target.value[0];
    if(!looker.hasOwnProperty(x)) { colorChange("red"); return; }
    let xc = looker[x];
    let y = e.target.value[1];
    if(!pattern.hasOwnProperty(y)) { colorChange("red"); return; }
    let yc = pattern[y];
    console.log(xc + yc * 13);
    colorChange("green"); 
}
const SelectcardBlock = observer((props) => {
    const shareStore = useContext(share);
    const color = useState('black');
    const border = "1px solid black";
    return(
    <div style={{display:"block", width:"80px", border:border, marginRight:"1vw"}}>
        <input style={{color: color[0], width:"50px", border:"0px solid black"}} 
        onChange={e => 
            setCard(e, color[1])
        } placeholder={shareStore.card[props.num] !== Number? "" : backLooker[shareStore.card[props.num] % 13] + backPattern[ shareStore.card[props.num] / 13 ]} />
    </div>);
});

export default SelectcardBlock;
