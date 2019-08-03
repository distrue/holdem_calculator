import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Player {
    constructor(props) {
        this.list = [];
        this.now = "";
        this.useLabel = {};
    }
    @observable list:string[];
    @observable now:string;   
    @observable useLabel:object;
    // useLabel[playerNum] = [LabelNum];
};

export default createContext(new Player({}));
