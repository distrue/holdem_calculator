import * as React from 'react';
import {useState, useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {share, block, label, player} from '../../store';
import * as SharePatcher from '../../dispatcher/share';

const looker = {'a': 12, 'A': 12, 'k':11, 'K':11, 'q':10, 'Q':10, 'j':9, 'J':9, 't':8, 'T':8, 
'9':7, '8':6, '7':5, '6':4, '5':3, '4':2, '3':1, '2':0};
const backLooker = "23456789TJQKA";
const pattern = {'s': 0, 'S': 0, 'c': 1, 'C': 1, 'h': 2, 'H': 2, 'd': 3, 'D': 3};
const backPattern = {0: 's', 1: 'c', 2: 'h', 3: 'd'};

const setCard = (e, colorChange, changeNum, shareStore, blockStore, labelStore, playerStore) => {
// 요약 -> 공유 카드의 숫자가 특정 Block 에 포함될 경우, 해당 Block 에서는 공유 카드를 포함하는 Block combo 가 제거되어야 한다.
    // 현재 바꾸고 있는 공유 카드 순서
    shareStore.onChange = changeNum;

// Validation
    if(e.target.value.length !== 2) {
        colorChange("black");
    }
    else{
        let x = e.target.value[0];
        let xc = looker[x];
        let y = e.target.value[1];
        let yc = pattern[y];

        if(looker.hasOwnProperty(x) && pattern.hasOwnProperty(y)){ // 정상적으로 신규 공유 카드가 등록되는 상황
            colorChange("green"); // valid shared Card

            // 0. shareStore 에 신규 카드 입력
            shareStore.card[changeNum] = xc + yc * 13;
            shareStore.valid[changeNum] = true;
            shareStore.onChange++; // onChange 번째가 정상적으로 입력된 상황은 onChange+1 번째를 바꾸고 있는 상황과 같다.
        }
        else{ // 정상적이지 못한 상황
            colorChange("red");
        }
    }
    // console.log(shareStore.onChange);
    console.log(shareStore.card);
    SharePatcher.shareChange(shareStore, playerStore, labelStore, blockStore);
}

const SelectcardBlock = observer((props) => {
    const blockStore = useContext(block);
    const shareStore = useContext(share);
    const labelStore = useContext(label);
    const playerStore = useContext(player);
    const color = useState('black');

    const border = "1px solid black";
    return(
    <div style={{display:"block", width:"80px", border:border, marginRight:"1vw"}}>
        <input style={{color: color[0], width:"50px", border:"0px solid black"}} 
        onChange={e => 
            setCard(e, color[1], props.num, shareStore, blockStore, labelStore, playerStore)
        } placeholder={shareStore.card[props.num] !== Number? "" : backLooker[shareStore.card[props.num] % 13] + backPattern[ shareStore.card[props.num] / 13 ]} />
    </div>);
});

export default SelectcardBlock;