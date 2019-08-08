import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

type submitted = "calculating" | "downloading" | "received" | undefined;
type detailRange = {
    pct: number;
};
interface sndRange {
    [key: string]: detailRange;
}
interface fstRange {
    [key: string]: sndRange[];
}
interface playerRange {
    [key: number]: fstRange[];
}
export class Result {
    constructor(props) {
        this.submitted = undefined;
        this.playerRange = {};
    }
    @observable submitted: string;
    @observable playerRange: playerRange;
    @observable phase: object;
};

export default createContext(new Result({}));
