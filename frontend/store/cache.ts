import {createContext} from 'react';
import { observable } from 'mobx';

export class Result {
    constructor(props) {
        this.range = {'o':{}, 's':{}, 'p':{}};
        this.blockEnv = {'o':[], 's':[], 'p':[]};
        this.available = false;
    }
    @observable range: any;
    @observable blockEnv: any;
    @observable available: boolean;
};

// cacheStore.range[blockName[2]] = {blockName: blockName, pct: pct, pattern:pattern};
// cacheStore.env[blockName[2]] = blockStore[blockName];

export default createContext(new Result({}));
