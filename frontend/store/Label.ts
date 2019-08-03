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
    // labelStore.data[User][Phase] = [(labels),];
    @observable labelRange:object;
    // labelRange[labelNum] = [{blockName: blockName, pct:50}, ];
    @observable total:number;
    @observable now:number;
    @observable color:object;
};

export default createContext(new Label({}));
