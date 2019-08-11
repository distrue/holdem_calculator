import * as React from 'react';
import {useState, useContext} from 'react';
import {observer} from 'mobx-react-lite';
import share from '../store/Share';

const looker = {'a': 12, 'A': 12, 'k':11, 'K':11, 'q':10, 'Q':10, 'j':9, 'J':9, 't':8, 'T':8, 
'9':7, '8':6, '7':5, '6':4, '5':3, '4':2, '3':1, '2':0};
// const looker = {'a': 0, 'A': 0, 'k':1, 'K':1, 'q':2, 'Q':2, 'j':3, 'J':3, 't':4, 'T':4, 
//v '9':5, '8':6, '7':7, '6':8, '5':9, '4':10, '3':11, '2':12};
const backLooker = "23456789TJQKA";
// const backLooker = "AKQJT98765432";
const pattern = {'s': 0, 'S': 0, 'c': 1, 'C': 1, 'h': 2, 'H': 2, 'd': 3, 'D': 3};
const backPattern = {0: 's', 1: 'c', 2: 'h', 3: 'd'};
const setCard = (e, phase, num, shareStore, colorChange) => {
    // Validation
    if(e.target.value.length !== 2) {
        colorChange("black"); 
        if(phase === "flop") {
            shareStore.flop[num] = undefined;
        }
        else if(phase === "turn") {
            shareStore.turn = undefined;
        }
        else if(phase === "river") {
            shareStore.river = undefined;
        }
        return;
    }
    let x = e.target.value[0];
    if(!looker.hasOwnProperty(x)) { colorChange("red"); return; }
    let xc = looker[x];
    let y = e.target.value[1];
    if(!pattern.hasOwnProperty(y)) { colorChange("red"); return; }
    let yc = pattern[y];
    console.log(xc + yc * 13);
    const res = xc + yc * 13;
    colorChange("green"); 
    if(phase === "flop") {
        shareStore.flop[num] = res;
    }
    else if(phase === "turn") {
        shareStore.turn[num] = res;
    }
    else if(phase === "river") {
        shareStore.river[num] = res;
    }
}
const selectCard = observer((props) => {
    const shareStore = useContext(share);
    const color = useState('black');
    const border = props.need? "2px solid black": "1px solid black";
    return(
    <div style={{display:"block", width:"35px", border:border}}>
        <input style={{color: color[0], width:"25px", border:"0px solid black"}} 
        onChange={e => 
            setCard(e, props.phase, props.num, shareStore, color[1])
        } placeholder={shareStore[props.phase][props.num] !== Number? "" : backLooker[shareStore[props.phase][props.num] % 13] + backPattern[ shareStore[props.phase][props.num] / 13 ]} />
    </div>);
});

export default selectCard;
