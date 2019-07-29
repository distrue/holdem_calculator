import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Label {
    constructor(props) {
        this.data = {};
        this.labelRange = {};
        this.total = 0;
        this.color = {};
    }
    @observable data:object;
    @observable labelRange:object;
    @observable total:number;
    @observable now:number;
    @observable color:object;
};

export default createContext(new Label({}));
