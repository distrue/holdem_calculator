import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Share {
    constructor(props) {
        this.card = [null, null, null, null, null];
    }
    @observable card:string[];
};

export default createContext(new Share({}));
