// import * as Share from '../../dispatcher/share'; // <- 이용법

const looker = {'a': 12, 'A': 12, 'k':11, 'K':11, 'q':10, 'Q':10, 'j':9, 'J':9, 't':8, 'T':8, 
'9':7, '8':6, '7':5, '6':4, '5':3, '4':2, '3':1, '2':0};
const backLooker = "23456789TJQKA";
const pattern = {'s': 0, 'S': 0, 'c': 1, 'C': 1, 'h': 2, 'H': 2, 'd': 3, 'D': 3};
const backPattern = {0: 's', 1: 'c', 2: 'h', 3: 'd'};

import {calLabelCombo} from './label';
export const shareChange = (shareStore, playerStore, labelStore, blockStore) => {
    
    // 0. 현재 존재하는 공유 카드 확인
    let sharedCard = [];
    let sharedCardNum = shareStore.onChange;
    // console.log(sharedCardNum);
    for(let i = 0; i < sharedCardNum; i++){
        sharedCard[i] = shareStore.card[i];
    }

    // 1. 전체 block 돌면서 shareStore 안에 들어가 있는 카드 있는지 확인
    let playerNum = playerStore.list.length;
    // console.log(playerNum);
    for(let nowPlayer = 1; nowPlayer <= playerNum; nowPlayer++){ // 모든 플레이어의 totalCombo 변경 필요
        let nCombo = 0;

        // 해당 플레이어의 block 확인하는 과정
        for(let nLabel in labelStore.playerLabel[nowPlayer]) {
            let labelVal = labelStore.playerLabel[nowPlayer][nLabel];

            for(let item in labelStore.cardRange[labelVal]) {
                let cal = labelStore.cardRange[labelVal][item];
                // console.log(labelVal, item, cal.blockName);
                // console.log(blockStore.label[cal.blockName]);

                if(blockStore.label[cal.blockName] != undefined){
                    let N = blockStore.label[cal.blockName].length;
                    let idx;
                    for(idx = 0; idx < N; idx++){
                        if(blockStore.label[cal.blockName][idx].label == labelVal) break;
                    }
                    if(idx != N){
                        let deltaCombo = blockStore.label[cal.blockName][idx].combo;
                        // console.log(nowPlayer);
                        // console.log(cal.blockName);

                        if(cal.blockName[2] === undefined) { // 페어 (6)
                            nCombo = blockComboCount(sharedCard, sharedCardNum, cal.blockName, cal.pattern[0], []);
                        }
                        if(cal.blockName[2] === 's') { // 같은 문양 (4)
                            nCombo = blockComboCount(sharedCard, sharedCardNum, cal.blockName, cal.pattern[0], []);
                        }
                        if(cal.blockName[2] === 'o') { // 다른 문양 (12)
                            nCombo = blockComboCount(sharedCard, sharedCardNum, cal.blockName, cal.pattern[0], cal.pattern[1]);
                        }
                        nCombo *= cal.pct / 100;
                        blockStore.label[cal.blockName][idx].combo = nCombo;
                        deltaCombo -= blockStore.label[cal.blockName][idx].combo;
                        blockStore.totalCombo -= deltaCombo;
                        blockStore.left[cal.blockName] += deltaCombo;
                    }
                }
            }
        }
    }
    let mul = playerStore.list.length;
    for(let i = 1; i <= 12 * mul; i++){
        calLabelCombo(i, labelStore, blockStore);
    }
}

export const setCard = (e, colorChange, changeNum, shareStore, blockStore, labelStore, playerStore) => {
    // 요약 -> 공유 카드의 숫자가 특정 Block 에 포함될 경우, 해당 Block 에서는 공유 카드를 포함하는 Block combo 가 제거되어야 한다.
    // 현재 바꾸고 있는 공유 카드 순서
    shareStore.onChange = changeNum;

    const looker = {'a': 12, 'A': 12, 'k':11, 'K':11, 'q':10, 'Q':10, 'j':9, 'J':9, 't':8, 'T':8, '9':7, '8':6, '7':5, '6':4, '5':3, '4':2, '3':1, '2':0};
    const pattern = {'s': 0, 'S': 0, 'c': 1, 'C': 1, 'h': 2, 'H': 2, 'd': 3, 'D': 3};

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
    // console.log(shareStore.card);
    shareChange(shareStore, playerStore, labelStore, blockStore);
}

// 공유 카드를 고려한 Block combo를 구하는 함수
export const blockComboCount = (shareCard, shareCardNum, blockName, pattern_1, pattern_2) => {
    let cnt = 0;
    let blockNum0 = looker[blockName[0]];
    let blockNum1 = looker[blockName[1]];

    if(blockName[2] === 's') { // 같은 문양
        let pat1;
        for(let _pat1 in pattern_1){
            pat1 = pattern_1[_pat1];
            let cmp1 = pat1 * 13 + blockNum0;
            let cmp2 = pat1 * 13 + blockNum1;
            if(!blockComboCheck(shareCard, shareCardNum, cmp1, cmp2)) cnt++;
        }
        return cnt;
    }
    else if(blockName[2] === 'o') { // 다른 문양
        let pat1, pat2;
        for(let _pat1 in pattern_1) {
            pat1 = pattern_1[_pat1];
            let cmp1 = pat1 * 13 + blockNum0;
            for(let _pat2 in pattern_2) {
                pat2 = pattern_2[_pat2];
                if(pat1 === pat2) continue;
                let cmp2 = pat2 * 13 + blockNum1;
                if(!blockComboCheck(shareCard, shareCardNum, cmp1, cmp2)) cnt++;
            }
        }
        return cnt;
    }
    else if(blockName[2] === undefined) { // 페어
        let pat1, pat2;
        for(let _pat1 in pattern_1){
            pat1 = pattern_1[_pat1];
            let cmp1 = pat1 * 13 + blockNum0;
            for(let _pat2 in pattern_1){
                pat2 = pattern_1[_pat2];
                if(pat1 >= pat2) continue;
                let cmp2 = pat2 * 13 + blockNum1;
                if(!blockComboCheck(shareCard, shareCardNum, cmp1, cmp2)) cnt++;
            }
        }
        return cnt;
    }
    else console.log("[Error] blockName error");
}

// 공유 카드가 특정 Block 의 Block combo 에 포함되는지 확인하는 함수
export const blockComboCheck = (shareCard, shareCardNum, blockHand1, blockHand2) => {
    for(let i = 0; i <= shareCardNum; i++){
        if(shareCard[i] == blockHand1 || shareCard[i] == blockHand2) return true;
    }
    return false;
}