export const patternChange = (fd, blockStore, labelStore, idx, target, item, blockName) => {
    const pattern = {'S': 0, 'C': 1, 'H': 2, 'D': 3};            
    const match = {2: 1, 3:3, 4:6};
    let deltaCombo;

    const x = blockStore.label[blockName][idx].pattern[fd].findIndex(ic => ic === pattern[item]);
    console.log("pattern Done", blockStore.label[blockName][idx].pattern[fd].toString(), x, pattern[item]);
    if(x >= 0) { blockStore.label[blockName][idx].pattern[fd].splice(x, 1); }
    else { blockStore.label[blockName][idx].pattern[fd].push(pattern[item]); }
    const ch = blockStore.label[blockName][idx].pattern[fd].length;
    
    const y = labelStore.cardRange[target].findIndex(ic => ic.blockName === blockName);
    deltaCombo = blockStore.label[blockName][idx].combo;

    const z = labelStore.cardRange[target][y].pattern[fd].findIndex(ic => ic === pattern[item]) // [_Nblock]
    if(blockName[2] === undefined && z >= 0 && labelStore.cardRange[target][y].pattern[fd].length === 2) {
        alert("you should choose at least two patterns");
        blockStore.label[blockName][idx].combo *= match[labelStore.cardRange[target][y].pattern[0].length];
        return;
    }
    console.log("pattern Done", blockStore.label[blockName][idx].pattern[fd].toString(), pattern[item], z);
    if(z >= 0) { labelStore.cardRange[target][y].pattern[fd].splice(z, 1); 
        if(ch !== blockStore.label[blockName][idx].pattern[fd].length) {
            if(x >= 0) { blockStore.label[blockName][idx].pattern[fd].splice(x, 1); }
            else { blockStore.label[blockName][idx].pattern[fd].push(pattern[item]); }
        }
    }
    else { labelStore.cardRange[target][y].pattern[fd].push(pattern[item]); 
        if(ch !== blockStore.label[blockName][idx].pattern[fd].length) {
            if(x >= 0) { blockStore.label[blockName][idx].pattern[fd].splice(x, 1); }
            else { blockStore.label[blockName][idx].pattern[fd].push(pattern[item]); }
        }
    }

    console.log("pattern Done", blockStore.label[blockName][idx].pattern[fd].toString(), pattern[item]);

    blockStore.label[blockName][idx].combo = patternCount(blockName, labelStore.cardRange[target][y].pattern[0], labelStore.cardRange[target][y].pattern[1]) * blockStore.label[blockName][idx].pct / 100;
    deltaCombo -= blockStore.label[blockName][idx].combo;
    
    blockStore.totalCombo -= deltaCombo;
    blockStore.left[blockName] += deltaCombo;
    console.log("pattern Done", blockName, idx, blockStore.label[blockName][idx].pattern[fd].length);
}

export const patternCount = (blockName, pattern_1, pattern_2) => {
    if(blockName[2] === 'o') {
        let pat1, pat2, cnt = 0;
        for(let _pat1 in pattern_1) {
            pat1 = pattern_1[_pat1];
            for(let _pat2 in pattern_2) {
                pat2 = pattern_2[_pat2];
                if(pat1 !== pat2) {
                    cnt += 1;
                }
            }
        }
        return cnt;
    }
    if(blockName[2] === 's') {
        return pattern_1.length;
    }
    if(blockName[2] === undefined) {
        if(pattern_1.length === 2) {
            return 1;
        }
        if(pattern_1.length === 3) {
            return 3;
        }
        if(pattern_1.length === 4) {
            return 6;
        }
    }
}
