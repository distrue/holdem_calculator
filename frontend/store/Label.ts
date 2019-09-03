import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Label {
    constructor(props) {
        this.playerLabel = {};
        this.cardRange = {};
        this.total = 0;
        this.color = {};
        this.displayMatch = {};
        this.displayTotal = {};
    }
    @observable playerLabel:object;
    // labelStore.playerLabel[User] = [(labels),];
    @observable cardRange:object;
    // cardRange[labelNum] = [{blockName: blockName, pct:50, pattern: [[0, 1, 2, 3], [0, 1]]}, ];
    @observable total:number;
    @observable now:number;
    @observable color:object;
    @observable displayMatch:object;
    // displayMatch[labelNum] = []
    // 실제 labelnum -> display의 labelnum
    @observable displayTotal:object;
    // displayTotal[User] = number
};

export default createContext(new Label({}));
