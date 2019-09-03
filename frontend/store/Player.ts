import {createContext} from 'react';
import { observable } from 'mobx';

export class Player {
    constructor(props) {
        this.list = [];
        this.now = "";
        this.ownLabel = {};
    }
    @observable list:string[];
    @observable now:string;   
    @observable ownLabel:object;
    // useLabel[playerNum] = [LabelNum];
};

export default createContext(new Player({}));
