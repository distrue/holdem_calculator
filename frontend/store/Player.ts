import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Player {
    constructor(props) {
        this.list = [];
        this.now = "";
        this.ownLabel = {};
    }
    @observable list:string[];
    @observable now:string;   
    @observable ownLabel:object;
    // useLabel[playerNum][phaseName] = [LabelNum];
};

export default createContext(new Player({}));
