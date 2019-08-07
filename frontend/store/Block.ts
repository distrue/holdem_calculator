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

        const prevPhase = {"preflop": null, "flop": "preflop", "turn":"flop", "river":"turn"};
        if(props.labelStore !== undefined && props.labelStore.data[props.newPlayer] !== undefined) {
            // clear Left blocks
            const NumRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            let blockName, combiBase = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
            const initPct = prevPhase[props.newPhase] !== null? 0: 100;
            for(let idx_f in NumRange) {
                for(let idx_s in NumRange) {
                    if(Number(idx_f) < Number(idx_s)) {
                        blockName = combiBase[idx_f] + combiBase[idx_s] + "s";
                    }
                    else if(Number(idx_f) === Number(idx_s)) {
                        blockName = combiBase[idx_f] + combiBase[idx_s];
                    }
                    else {
                        blockName = combiBase[idx_s] + combiBase[idx_f] + "o";
                    }
                    this.left[blockName] = initPct;
                }
            }
            // PrevState Coloring
            if(prevPhase[props.newPhase] !== null) {
                for(let nLabel in props.labelStore.data[props.newPlayer][prevPhase[props.newPhase]]) {
                    let val = props.labelStore.data[props.newPlayer][prevPhase[props.newPhase]][nLabel];
                    for(let item in props.labelStore.cardRange[val]) {
                        let cal = props.labelStore.cardRange[val][item];
                        this.left[cal.blockName] += cal.pct;
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
                    this.label[cal.blockName].push({label: val, pct: cal.pct, color: props.labelStore.color[val], pattern: cal.pattern, combo: cal.combo});
                    this.left[cal.blockName] -= cal.pct;
                }
            }
        }
        else {
            console.log("No Player data");
        }
    }
    @observable label:blockLabel;
    @observable left:blockLeft;
};

export default createContext(new Block({}));
