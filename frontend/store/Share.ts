import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Share {
    constructor(props) {
        this.flop = [null, null, null];
        this.turn = [null];
        this.river = [null];
    }
    @observable flop:string[];
    @observable turn:string[];
    @observable river:string[];   
};

export default createContext(new Share({}));
