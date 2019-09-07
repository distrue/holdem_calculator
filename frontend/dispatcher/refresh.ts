import {shareChange} from './share';
export const refresh = (newPlayer, labelStore, playerStore, blockStore, shareStore) => {
    labelStore.now = undefined;
    playerStore.now = newPlayer;
    blockStore.constructor({labelStore:labelStore, newPlayer:newPlayer});
    shareChange(shareStore, playerStore, labelStore, blockStore);
}
