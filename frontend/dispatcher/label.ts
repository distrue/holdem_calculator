export const addLabel = (props) => {
    if(props.player == "") {
        alert("choose player first!");
        return;
    }
    if(props.labelStore.data[props.player] === undefined) {
        props.labelStore.data[props.player] = {};
    }
    if(props.labelStore.data[props.player][props.phase] === undefined) {
        props.labelStore.data[props.player][props.phase] = [];
    }
    props.labelStore.data[props.player][props.phase].push(props.labelStore.total + 1);
    console.log(props.labelStore.labelRange);
    props.labelStore.total = props.labelStore.total + 1;
    props.labelStore.labelRange[props.labelStore.total] = [];
    props.labelStore.labelCombi[props.labelStore.total] = [];
}
export const updateLabelPct = (pct:number, labelStore, blockStore, blockName) => {
    let cut = labelStore.labelRange[labelStore.now].findIndex(i => i.blockName === blockName);
    let Lcut = blockStore.label[blockName].findIndex(i => i.label === labelStore.now);
    let now = pct;
    let delta = now - labelStore.labelRange[labelStore.now][cut].pct;
    blockStore.left[blockName] -= delta;
    labelStore.labelRange[labelStore.now][cut].pct = now;
    blockStore.label[blockName][Lcut].pct = now;
}
export const deleteLabelRange = (labelStore, blockStore, blockName, visibleSet, Out) => {
    if(labelStore.labelRange[labelStore.now] === undefined) { return; }
    let cut = labelStore.labelRange[labelStore.now].findIndex(i => i.blockName === blockName);
    let Lcut = blockStore.label[blockName].findIndex(i => i.label === labelStore.now);
    
    if(cut < 0) { return; }
    blockStore.left[blockName] += labelStore.labelRange[labelStore.now][cut].pct;
    labelStore.labelRange[labelStore.now].splice(cut, 1);
    visibleSet.setVisible(false);
    blockStore.color[blockName] = "#ffffff";
    console.log(Out[0]);
    blockStore.label[blockName].splice(Lcut, 1);
    Out[1]("F");
    console.log(Out[0]);
}
export const addLabelRange = (e, labelStore, blockName, playerStore, phaseStore, blockStore) => {  
    if(labelStore.now === undefined) {
        alert("choose label first!");
        return;
    }
    if(blockStore.left[blockName] <= 0) {
        return;
    }
    if(labelStore.labelRange[labelStore.now].indexOf(blockName) < 0) {
        labelStore.labelRange[labelStore.now].push({blockName: blockName, pct: 100});
        if(blockStore.label[blockName] === undefined) {
            blockStore.label[blockName] = [];
        }
        blockStore.label[blockName].push({label:labelStore.now, pct:100});
        blockStore.color[blockName] = "#f46500";
        blockStore.left[blockName] -= 100;
    }
}
