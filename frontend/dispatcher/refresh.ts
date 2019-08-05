export const refresh = (newPlayer, newPhase, labelStore, playerStore, phaseStore, blockStore) => {
    labelStore.now = undefined;
    playerStore.now = newPlayer;
    phaseStore.now = newPhase;
    blockStore.constructor({labelStore:labelStore, newPlayer:newPlayer, newPhase: newPhase});
}
