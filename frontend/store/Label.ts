import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Label {
    constructor(props) {
        this.data = {};
        this.cardRange = {};
        this.total = 0;
        this.color = {};
        this.displayMatch = {};
        this.displayTotal = {};
    }
    @observable data:object;
    // labelStore.data[User][Phase] = [(labels),];
    @observable cardRange:object;
    // cardRange[labelNum] = [{blockName: blockName, pct:50, pattern: [[0, 1, 2, 3], [0, 1]]}, ];
    @observable total:number;
    @observable now:number;
    @observable color:object;
    @observable displayMatch:object;
    // displayMatch[labelNum] = []
    @observable displayTotal:object;
    // displayMatch[User][Phase] = number
};

export default createContext(new Label({}));
