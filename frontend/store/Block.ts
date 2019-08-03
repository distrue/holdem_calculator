import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

type labelContent = {
    label: string;
    pct: number;
    color: string;
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
        if(props.labelStore !== undefined && props.labelStore.data[props.newPlayer] !== undefined) {
            for(let nLabel in props.labelStore.data[props.newPlayer][props.newPhase]) {
                let val = props.labelStore.data[props.newPlayer][props.newPhase][nLabel];
                // console.log(props.labelStore.labelRange[nLabel].toString());
                for(let item in props.labelStore.labelRange[val]) {
                    let cal = props.labelStore.labelRange[val][item];
                    console.log(cal.blockName, cal.pct, props.labelStore.color[val]);
                    if(this.label[cal.blockName] === undefined) {
                        this.label[cal.blockName] = [];
                    }
                    this.label[cal.blockName].push({label: val, pct: cal.pct, color: props.labelStore.color[val]});
                    if(this.left[cal.blockName] === undefined) {
                        this.left[cal.blockName] = 100;
                    }
                    this.left[cal.blockName] -= cal.pct;
                }
            }
            // update
        }
        else {
            console.log("No Player data");
        }
    }
    @observable label:blockLabel;
    @observable left:blockLeft;
};

export default createContext(new Block({}));
