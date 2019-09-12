import {shareChange} from './share';
export const refresh = (newPlayer, labelStore, playerStore, blockStore, shareStore, cacheStore) => {
    playerStore.now = newPlayer;
    labelStore.now = 1 + 12 * (playerStore.now - 1);
    blockStore.constructor({labelStore:labelStore, newPlayer:newPlayer});
    shareChange(shareStore, playerStore, labelStore, blockStore);
    cacheStore.range = {'o':{ blockName: 'AKo', pct: 100, pattern: [[0, 1, 2, 3], [0, 1, 2, 3]] }, 's':{ blockName: 'AKs', pct: 100, pattern: [[0, 1, 2, 3]] }, 'p':{ blockName: 'AA', pct: 100, pattern: [[0, 1, 2, 3]] }};
}