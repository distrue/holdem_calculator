export const refresh = (newPlayer, labelStore, playerStore, blockStore) => {
    labelStore.now = undefined;
    playerStore.now = newPlayer;
    blockStore.constructor({labelStore:labelStore, newPlayer:newPlayer});
}