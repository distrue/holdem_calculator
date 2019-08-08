import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

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

        const prevPhase = {"preflop": null, "flop": "preflop", "turn":"flop", "river":"turn"};
        if(props.labelStore !== undefined && props.labelStore.data[props.newPlayer] !== undefined) {
            // clear Left blocks
            const NumRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            let blockName, combiBase = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
            let initPct, maxPct;
            for(let idx_f in NumRange) {
                for(let idx_s in NumRange) {
                    if(Number(idx_f) < Number(idx_s)) {
                        maxPct = 4;
                    }
                    else if(Number(idx_f) === Number(idx_s)) {
                        maxPct = 6;
                    }
                    else {
                        maxPct = 12;
                    }
                    if(Number(idx_f) < Number(idx_s)) {
                        blockName = combiBase[idx_f] + combiBase[idx_s] + "s";
                    }
                    else if(Number(idx_f) === Number(idx_s)) {
                        blockName = combiBase[idx_f] + combiBase[idx_s];
                    }
                    else {
                        blockName = combiBase[idx_s] + combiBase[idx_f] + "o";
                    }
                    if(prevPhase[props.newPhase] !== null) {
                        initPct = 0;
                    }
                    else {
                        initPct = maxPct;
                    }
                    this.left[blockName] = initPct;
                }
            }
            let nCombo;
            // PrevState Coloring
            if(prevPhase[props.newPhase] !== null) {
                for(let nLabel in props.labelStore.data[props.newPlayer][prevPhase[props.newPhase]]) {
                    let val = props.labelStore.data[props.newPlayer][prevPhase[props.newPhase]][nLabel];
                    for(let item in props.labelStore.cardRange[val]) {
                        let cal = props.labelStore.cardRange[val][item];
                        if(cal.blockName[2] === undefined) {
                            nCombo = cal.pattern[0].length * (cal.pattern[0].length-1) / 2;
                        }
                        if(cal.blockName[2] === 's') {
                            nCombo = cal.pattern[0].length;
                        }
                        if(cal.blockName[2] === 'o') {
                            nCombo = cal.pattern[0].length * cal.pattern[1].length;
                        }
                        console.log(cal.blockName[2], nCombo);
                        nCombo *= cal.pct / 100;
                        this.left[cal.blockName] += nCombo;
                    }
                }
            }
            // NewState update
            for(let nLabel in props.labelStore.data[props.newPlayer][props.newPhase]) {
                let val = props.labelStore.data[props.newPlayer][props.newPhase][nLabel];
                // console.log(props.labelStore.cardRange[nLabel].toString());
                for(let item in props.labelStore.cardRange[val]) {
                    let cal = props.labelStore.cardRange[val][item];
                    console.log(cal.blockName, cal.pct, props.labelStore.color[val]);
                    if(this.label[cal.blockName] === undefined) {
                        this.label[cal.blockName] = [];
                    }
                    if(cal.blockName[2] === undefined) {
                        nCombo = cal.pattern[0].length * (cal.pattern[0].length-1) / 2;
                    }
                    if(cal.blockName[2] === 's') {
                        nCombo = cal.pattern[0].length;
                    }
                    if(cal.blockName[2] === 'o') {
                        nCombo = cal.pattern[0].length * cal.pattern[1].length;
                    }
                    console.log(cal.blockName[2], nCombo);
                    nCombo *= cal.pct / 100;
                    this.label[cal.blockName].push({label: val, pct: cal.pct, color: props.labelStore.color[val], pattern: cal.pattern, combo: nCombo});
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
