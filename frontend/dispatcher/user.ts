export const addUser = (labelStore, playerStore) => {
    playerStore.list.push((playerStore.list.length+1).toString());
    playerStore.ownLabel[(playerStore.list.length).toString()] = [];
    labelStore.data[(playerStore.list.length).toString()] = {};
}
