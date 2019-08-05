import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

type PhaseType = "preflop" | "flop" | "turn" | "river";
export class Phase {
    constructor(props) {
        this.now = "preflop";
    }
    @observable now: PhaseType;
};

export default createContext(new Phase({}));
