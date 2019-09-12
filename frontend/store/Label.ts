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
        this.labelCombo = [...Array(121).keys()];
        this.labelComboRatio = [...Array(121).keys()];
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
    @observable labelCombo:Number[];
    // labelCombo[labelNum] = label Combo 수
    @observable labelComboRatio:Number[];
    // labelComboRatio[labelNum] = 플레이어 라벨 콤보 선택 비율 (해당 라벨 콤보 수 / 전체 라벨 콤보 수)   

    // 명세에 포함 x
    // @observable labelSelected:Boolean[];
    // labelSelected[labelNum] = 해당 라벨이 선택되어 있는지 여부 (controlled by result dispatcher)
};

export default createContext(new Label({}));
