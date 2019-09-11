import {shareChange} from './share';
export const refresh = (newPlayer, labelStore, playerStore, blockStore, shareStore) => {
    playerStore.now = newPlayer;
    labelStore.now = 1 + 12 * (playerStore.now - 1);
    blockStore.constructor({labelStore:labelStore, newPlayer:newPlayer});
    shareChange(shareStore, playerStore, labelStore, blockStore);
}