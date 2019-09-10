import * as blockPatcher from "../dispatcher/block";

export const ColorBox = ["#CD5C5C", "#2F4F4F", "#E0FFFF", "#D02090", "#FFD700", "#7B68EE",
    "#1E90FF", "#87CEFA", "#CD853F", "#40E0D0", "#3CB371", "#FF7F50"];


export const addLabel = (player, labelStore) => {
    if (player == "") {
        alert("choose player first!");
        return;
    }
    if (labelStore.playerLabel[player] === undefined) {
        labelStore.playerLabel[player] = [];
    }
    labelStore.playerLabel[player].push(labelStore.total + 1);
    labelStore.total = labelStore.total + 1;
    labelStore.cardRange[labelStore.total] = [];
    labelStore.displayTotal[player] += 1;
    labelStore.displayMatch[labelStore.total] = labelStore.displayTotal[player];
    labelStore.color[labelStore.total] = ColorBox[labelStore.displayTotal[player]-1];
}

import { patternCount } from './block';
import { shareChange } from './share';
export const addRange = (pct, pattern, blockName, blockStore, labelStore, cacheStore, shareStore, playerStore, change) => {
    let cacheName = blockName[2] === undefined ? "p" : blockName[2];
    cacheStore.range[cacheName] = { blockName: blockName, pct: pct, pattern: pattern };
    cacheStore.blockEnv[cacheName] = Object.assign(cacheStore.blockEnv[cacheName], blockStore.label[blockName]);

    let initCombo = patternCount(blockName, pattern[0], pattern[1]) * pct / 100;
    blockStore.label[blockName].push({ label: labelStore.now, pct: pct, color: labelStore.color[labelStore.now], pattern: pattern, combo: initCombo });
    blockStore.totalCombo += initCombo;
    labelStore.cardRange[labelStore.now].push({ blockName: blockName, pct: pct, pattern: pattern });
    blockStore.left[blockName] -= initCombo;
    shareChange(shareStore, playerStore, labelStore, blockStore);
    change(false);
}

import { checkEnv } from './cache';
import { registerInterceptor } from "mobx/lib/internal";
export const addLabelRange = (e, labelStore, blockName, blockStore, cacheStore, shareStore, playerStore, rangeView, onDrag) => {
    if (labelStore.now === undefined) {
        return;
    }
    if (blockStore.left[blockName] <= 0) {
        return;
    }
    if (blockStore.label[blockName] === undefined) {
        blockStore.label[blockName] = [];
    }
    if (blockStore.label[blockName].findIndex((item) => item.label === labelStore.now) >= 0) { // 현재 label의 range가 이미 존재하는지 확인    
        return;
    }
    let cacheName = blockName[2] === undefined ? "p" : blockName[2];
    if (cacheStore.available | e.shiftKey) {
        if (cacheStore.range[cacheName].pct !== undefined) { // cache가 존재하는지
            console.log(cacheStore.range[cacheName].blockName, cacheStore.range[cacheName].pattern, cacheStore.range[cacheName].pct);
            if (checkEnv(blockStore.label[blockName], cacheStore.blockEnv[cacheName]) === false) { return; } // blockEnv가 일치하는지
            addRange(cacheStore.range[cacheName].pct, cacheStore.range[cacheName].pattern, blockName, blockStore, labelStore, cacheStore, shareStore, playerStore, rangeView);
        }
    }
    else {
        if (onDrag === true) { return; }
        rangeView({ blockName: blockName, existing: blockStore.label[blockName] });
    }
}

export const manValid = (e, val, blockStore, blockName, labelStore, target) => {
    const fval = parseInt(val);
    if (e.key === 'Enter') {
        if (fval !== undefined) {
            if (fval <= 100 && fval >= 0) {
                updateLabelPct(fval, labelStore, blockStore, blockName, target.label);
            }
        }
    }
}

export const updateLabelPct = (pct:number, labelStore, blockStore, blockName, labelName) => {
    // console.log(blockName, labelName);
    // console.log(JSONtoString(labelStore.cardRange));
    let cut = labelStore.cardRange[labelName].findIndex(i => i.blockName === blockName);
    let Lcut = blockStore.label[blockName].findIndex(i => i.label === labelName);
    let now = pct;
    let deltaCombo = blockStore.label[blockName][Lcut].combo;
    let tmpCombo = blockStore.label[blockName][Lcut].combo / labelStore.cardRange[labelName][cut].pct;
    tmpCombo *= now;
    deltaCombo -= tmpCombo;
    if( blockStore.left[blockName] + deltaCombo < 0) { 
        alert("Percentage 범위를 벗어났습니다.");
        return; 
    }
    blockStore.label[blockName][Lcut].combo = tmpCombo;
    blockStore.totalCombo -= deltaCombo;
    blockStore.left[blockName] += deltaCombo;
    labelStore.cardRange[labelName][cut].pct = now;
    blockStore.label[blockName][Lcut].pct = now;
    // console.log(JSONtoString(labelStore.cardRange));
}

export const deleteLabelRange = (labelStore, blockStore, labelName, blockName, visibleSet, Out) => {
    if (labelStore.cardRange[labelName] === undefined) { return; }
    let cut = labelStore.cardRange[labelName].findIndex(i => i.blockName === blockName);
    let Lcut = blockStore.label[blockName].findIndex(i => i.label === labelName);

    if (cut < 0) { return; }
    blockStore.left[blockName] += blockPatcher.patternCount(blockName, blockStore.label[blockName][Lcut].pattern[0], blockStore.label[blockName][Lcut].pattern[1]) * blockStore.label[blockName][Lcut].pct / 100;
    blockStore.totalCombo -= blockPatcher.patternCount(blockName, blockStore.label[blockName][Lcut].pattern[0], blockStore.label[blockName][Lcut].pattern[1]) * blockStore.label[blockName][Lcut].pct / 100;
    labelStore.cardRange[labelName].splice(cut, 1);
    if (visibleSet !== false) { visibleSet.setVisible(false); }
    blockStore.label[blockName].splice(Lcut, 1);
    if (Out !== false) { Out[1]("F"); }
}

export const deleteLabel = (labelStore, blockStore, labelName, player) => {
    let nowBlock, x;
    console.log(labelName, labelStore.cardRange[labelName]);
    for (let _nowBlock in labelStore.cardRange[labelName]) {
        nowBlock = labelStore.cardRange[labelName][_nowBlock];
        x = blockStore.label[nowBlock.blockName].findIndex(item => item.label === labelName);
        blockStore.left[nowBlock.blockName] += blockStore.label[nowBlock.blockName][x].combo;
        blockStore.totalCombo -= blockStore.label[nowBlock.blockName][x].combo;
        blockStore.label[nowBlock.blockName].splice(x, 1);
    }
    labelStore.cardRange[labelName] = [];
    let y = labelStore.playerLabel[player].findIndex(item => item === labelName);
    labelStore.playerLabel[player].splice(y, 1);
}

export const calLabelCombo = (labelNum, labelStore, blockStore) => {
    // labelNum = 1 ~ 12 / 13 ~ 24 / 25 ~ 36 / 37 ~ 48
    let labelCombo = 0;

    labelNum--; // 0 ~ 11 / 12 ~ 23 / 24 ~ 35 / 36 ~ 47
    // labelNum / 12 + 1 -> playerNum, labelNum % 12 -> label

    let labelVal = labelStore.playerLabel[parseInt(String(labelNum / 12)) + 1][labelNum % 12];
    for (let item in labelStore.cardRange[labelVal]) {
        let cal = labelStore.cardRange[labelVal][item];
        if (blockStore.label[cal.blockName] != undefined) {
            let N = blockStore.label[cal.blockName].length;
            let idx;
            for (idx = 0; idx < N; idx++) {
                if (blockStore.label[cal.blockName][idx].label == labelVal) break;
            }
            labelCombo += idx == N ? 0 : blockStore.label[cal.blockName][idx].combo;
        }
    }
    labelStore.labelCombo[labelNum+1] = labelCombo;
    // return labelCombo;
}

export const calLabelPercentage = (playerNum, labelStore) => {
    
    let playerTotalLabelCombo = 0;
    let N = playerNum * 12;

    for(let i = N; i < N + 12; i++){
        if(labelStore.labelSelected[i] == true){
            playerTotalLabelCombo += labelStore.labelCombo[i];
        }
    }
    
    for(let i = N; i < N + 12; i++){
        if(labelStore.labelSelected[i] == true){
            labelStore.labelComboRatio[i] = labelStore.labelCombo[i] / playerTotalLabelCombo;
        }
    }
}