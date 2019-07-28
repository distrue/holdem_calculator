import {createContext} from 'react';
import {action, observable, computed } from 'mobx';

export class Player {
    constructor(props) {
        this.list = [];
        this.now = "";
    }
    @observable list:string[];
    @observable now:string;   
};

export default createContext(new Player({}));
