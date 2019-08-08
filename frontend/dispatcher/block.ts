export const patternChange = (fd, blockStore, labelStore, idx, target, item, blockName) => {
    const pattern = {'S': 0, 'C': 1, 'H': 2, 'D': 3};            
    const match = {2: 1, 3:3, 4:6};
    let deltaCombo;

    const y = labelStore.cardRange[target].findIndex(ic => ic.blockName === blockName);
    deltaCombo = blockStore.label[blockName][idx].combo;
    if(blockName[2] === 'o') {
        blockStore.label[blockName][idx].combo /= labelStore.cardRange[target][y].pattern[0].length * labelStore.cardRange[target][y].pattern[1].length;
    }
    if(blockName[2] === 's') {
        blockStore.label[blockName][idx].combo /= labelStore.cardRange[target][y].pattern[0].length;
    }
    if(blockName[2] === undefined) {
        blockStore.label[blockName][idx].combo /= match[labelStore.cardRange[target][y].pattern[0].length];
    }

    const z = labelStore.cardRange[target][y].pattern[fd].findIndex(ic => ic === pattern[item]) // [_Nblock]
    if(blockName[2] === undefined && z >= 0 && labelStore.cardRange[target][y].pattern[fd].length === 2) {
        alert("you should choose at least two patterns");
        blockStore.label[blockName][idx].combo *= match[labelStore.cardRange[target][y].pattern[0].length];
        return;
    }
    if(z >= 0) { labelStore.cardRange[target][y].pattern[fd].splice(z, 1); }
    else { labelStore.cardRange[target][y].pattern[fd].push(pattern[item]); }

    if(blockName[2] === 'o') {
        blockStore.label[blockName][idx].combo *= labelStore.cardRange[target][y].pattern[0].length * labelStore.cardRange[target][y].pattern[1].length;
    }
    if(blockName[2] === 's') {
        blockStore.label[blockName][idx].combo *= labelStore.cardRange[target][y].pattern[0].length; 
    }
    if(blockName[2] === undefined) {
        blockStore.label[blockName][idx].combo *= match[labelStore.cardRange[target][y].pattern[0].length];
    }
    deltaCombo -= blockStore.label[blockName][idx].combo;
    
    const x = blockStore.label[blockName][idx].pattern[fd].findIndex(ic => ic === pattern[item]);
    if(x >= 0) { blockStore.label[blockName][idx].pattern[fd].splice(x, 1); }
    else { blockStore.label[blockName][idx].pattern[fd].push(pattern[item]); }

    blockStore.totalCombo -= deltaCombo;
    blockStore.left[blockName] += deltaCombo;
}
