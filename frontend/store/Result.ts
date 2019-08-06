import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Result {
    constructor(props) {
        this.submitted = undefined;
    }
    @observable submitted: string;
};

export default createContext(new Result({}));
