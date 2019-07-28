import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Block {
    constructor(props) {
        if(props.labelRange !== undefined) {
            console.log(props.labelRange);
            this.label = {};
            this.color = {};
            this.left = {};
            for(let tar in props.target) {
                for(let idx in props.labelRange[tar]) {
                    let blockName = props.labelRange[tar][idx].blockName;
                    let pct = props.labelRange[tar][idx].pct;
                    this.color[blockName] = "#f46500";
                    if(this.label[blockName] === undefined) {
                        this.label[blockName] = [];
                    }
                    this.label[blockName].push({label:idx, pct:pct});
                    if(this.left[blockName] === undefined) {
                        this.left[blockName] = 100;
                    }
                    this.left[blockName] -= pct;
                }   
            }
        }
        else {
            console.log("clear");
            this.label = {};
            this.left = {};
            this.color = {};
        }
    }
    @observable label:object;
    @observable left:object;
    @observable color:object;
    get clear() {
        return 0;
    }
    set clear(props) {
        this.constructor();
    }
};

export default createContext(new Block({}));
