import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Share {
    constructor(props) {
        this.flop = ["", "", ""];
        this.turn = [""];
        this.river = [""];
    }
    @observable flop:string[];
    @observable turn:string[];
    @observable river:string[];   
};

export default createContext(new Share({}));
