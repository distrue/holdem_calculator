export const patternChange = (fd, blockStore, labelStore, idx, target, item, blockName) => {
    const pattern = {'S': 0, 'C': 1, 'H': 2, 'D': 3};            

    const x = blockStore.label[blockName][idx].pattern[fd].findIndex(ic => ic === pattern[item]);
    if(x >= 0) { blockStore.label[blockName][idx].pattern[fd].splice(x, 1); }
    else { blockStore.label[blockName][idx].pattern[fd].push(pattern[item]); }
    
    const y = labelStore.cardRange[target].findIndex(ic => ic.blockName === blockName);
    const z = labelStore.cardRange[target][y].pattern[fd].findIndex(ic => ic === pattern[item]) // [_Nblock]
    if(z >= 0) { labelStore.cardRange[target][y].pattern[fd].splice(z, 1); }
    else { labelStore.cardRange[target][y].pattern[fd].push(pattern[item]); }
}
