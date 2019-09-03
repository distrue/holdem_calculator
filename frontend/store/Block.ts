import {createContext} from 'react';
import {action, observable, computed } from 'mobx';
import * as blockPatcher from '../dispatcher/block';

type labelContent = {
    label: string;
    pct: number;
    color: string;
    pattern: any[];
    combo: number;
};
interface blockLabel {
    [key: string]: labelContent[];
}
interface blockLeft {
    [key: string]: number;
}
export class Block {
    constructor(props) {
        this.label = {};
        this.left = {};
        this.totalCombo = 0;

        if(props.labelStore !== undefined && props.labelStore.playerLabel[props.newPlayer] !== undefined) {
            // clear Left blocks
            const NumRange = [...Array(13).keys()];
            let blockName, combiBase = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
            let initPct, maxPct;
            for(let idx_f in NumRange) {
                for(let idx_s in NumRange) {
                    if(Number(idx_f) < Number(idx_s)) {
                        maxPct = 4;
                        blockName = combiBase[idx_f] + combiBase[idx_s] + "s";
                    }
                    else if(Number(idx_f) === Number(idx_s)) {
                        maxPct = 6;
                        blockName = combiBase[idx_f] + combiBase[idx_s];
                    }
                    else {
                        maxPct = 12;
                        blockName = combiBase[idx_s] + combiBase[idx_f] + "o";
                    }
                    initPct = maxPct;
                    this.left[blockName] = initPct;
                }
            }
            let nCombo;
            // NewState update
            for(let nLabel in props.labelStore.playerLabel[props.newPlayer]) {
                let labelVal = props.labelStore.playerLabel[props.newPlayer][nLabel];
                // console.log(props.labelStore.cardRange[nLabel].toString());
                for(let item in props.labelStore.cardRange[labelVal]) {
                    let cal = props.labelStore.cardRange[labelVal][item];
                    if(this.label[cal.blockName] === undefined) {
                        this.label[cal.blockName] = [];
                    }
                    if(cal.blockName[2] === undefined) {
                        nCombo = blockPatcher.patternCount(cal.blockName, cal.pattern[0], []);
                    }
                    if(cal.blockName[2] === 's') {
                        nCombo = blockPatcher.patternCount(cal.blockName, cal.pattern[0], []);
                    }
                    if(cal.blockName[2] === 'o') {
                        nCombo = blockPatcher.patternCount(cal.blockName, cal.pattern[0], cal.pattern[1]);
                    }
                    nCombo *= cal.pct / 100;
                    this.label[cal.blockName].push({label: labelVal, pct: cal.pct, color: props.labelStore.color[labelVal], pattern: cal.pattern, combo: nCombo});
                    this.totalCombo += nCombo;
                    this.left[cal.blockName] -= nCombo;
                }
            }
        }
        else {
            console.log("No Player data");
        }
    }
    @observable label:blockLabel;
    @observable left:blockLeft;
    @observable totalCombo:number;
};

export default createContext(new Block({}));
