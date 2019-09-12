import {addLabel} from './label';

export const addUser = (labelStore, playerStore) => {
    playerStore.list.push((playerStore.list.length+1).toString());
    playerStore.ownLabel[(playerStore.list.length).toString()] = [];
    labelStore.playerLabel[(playerStore.list.length).toString()] = [];
    labelStore.displayTotal[(playerStore.list.length).toString()] = 0;

    for(let idx in [...Array(12).keys()]) {
        addLabel((playerStore.list.length).toString(), labelStore);
    }
}
