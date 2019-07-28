import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Label {
    constructor(props) {
        this.data = {};
        this.labelRange = {};
        this.labelCombi = {};
        this.total = 0;
    }
    @observable data:object;
    @observable labelRange:object;
    @observable labelCombi:object;
    @observable total:number;
    @observable now:number;
};

export default createContext(new Label({}));
