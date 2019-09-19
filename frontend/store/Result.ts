import {createContext} from 'react';
import { observable } from 'mobx';

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
        this.sendStatus = "";
    }
    @observable submitted: string;
    @observable playerRange: playerRange;
    @observable sendStatus: string;
};

export default createContext(new Result({}));
