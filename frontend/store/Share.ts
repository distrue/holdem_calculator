import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Share {
    constructor(props) {
        this.card = [null, null, null, null, null];
        this.valid = [false, false, false, false, false];
        this.onChange = -1; // 안변하고 있으면 -1, 이외에는 현재 변하고 있는 값의 index
        this.colorFlg = 1;
    }
    @observable card:string[];
    @observable valid:Boolean[];
    @observable onChange:number;
    @observable colorFlg:number;
};

export default createContext(new Share({}));
