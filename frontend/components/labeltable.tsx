import * as React from 'react';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {player, phase, label, block, result} from '../store';
import * as LabelPatcher from '../dispatcher/label';
import * as userPatcher from '../dispatcher/user';
import * as Refresh from '../dispatcher/refresh';
import jsonExistChecker from '../tools/jsonExistChecker';

const PlayerSelectLabel = observer(({playerStore, phaseStore, labelStore, blockStore, Nplayer}) => {
    return(
    <div style={{cursor: "pointer", color:playerStore.now===Nplayer?"green":"black", display: "flex", flexDirection:"row", border:"1px solid black"}}
    onClick={e => {
        Refresh.refresh(Nplayer, phaseStore.now, labelStore, playerStore, phaseStore, blockStore);
    }}>
        Player {Nplayer}
        <div style={{ display: "flex", flexDirection:"column"}}>
            <div style={{marginLeft:"10px", display: "flex", flexDirection:"row", flexWrap:"wrap"}}>
                {jsonExistChecker(labelStore.data, [Nplayer, phaseStore.now])?
                    labelStore.data[Nplayer][phaseStore.now].map(Nlabel => {
                        const val = playerStore.ownLabel[Nplayer].findIndex(idx => idx === Nlabel);
                        if(val >= 0) {
                            return (<button style={{fontWeight:"bold", backgroundColor: labelStore.color[Nlabel], color:"#ffffff"}} onClick={e => playerStore.ownLabel[Nplayer].splice(val, 1)}>{Nlabel}</button>);
                        }
                        else {
                            return(<></>);
                        }
                    })
                :""}
            </div>
            <hr style={{width:"100%", border:"0.5px solid black"}}/>
            <div style={{marginLeft:"10px", display: "flex", flexDirection:"row", flexWrap:"wrap"}}>
                {jsonExistChecker(labelStore.data, [Nplayer, phaseStore.now])?
                    labelStore.data[Nplayer][phaseStore.now].map(Nlabel => {
                        const val = playerStore.ownLabel[Nplayer].findIndex(idx => idx === Nlabel);
                        if(val >= 0) {
                            return(<></>);
                        }
                        else {
                            return (<button style={{backgroundColor:labelStore.color[Nlabel]}} onClick={e => playerStore.ownLabel[Nplayer].push(Nlabel)}>{Nlabel}</button>);
                        }
                    })
                :""}
            </div>
        </div>
    </div>);
});
const PhaseSelectLabel = observer(({phaseStore, labelStore, playerStore, Iphase}) => {
    return(<div style={{border:Iphase === phaseStore.now?"1px solid black":"0px solid black"}}> 
        {Iphase}:
        <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
        {jsonExistChecker(labelStore.data, [playerStore.now, Iphase])?
            labelStore.data[playerStore.now][Iphase].map(item => {
                if(Iphase === phaseStore.now) {
                    const Ncolor = labelStore.color[item];
                    return(<div onClick={e => labelStore.now = item}
                    style={{backgroundColor: Ncolor, cursor: "pointer", border:"1px solid black", width:"50px", textAlign:"center"}}>
                        {item}
                    </div>);
                }
                else {
                    return(<div style={{backgroundColor: "#444444", border:"1px solid black", width:"50px"}}>
                        {item}
                    </div>);
                }
            })
        :""}
        </div>
    </div>);
});
const LabelTable = observer((props) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    const resultStore = useContext(result);

    let phaselist = ["preflop", "flop", "turn", "river"];
    return(
    <div style={{flexDirection: "column", ...props.style, display: resultStore.submitted===undefined?"flex":"none"}}>
        <div style={{display:"block", width:"10vw", marginBottom:"2vh", fontSize:"3vh", fontWeight: "bold"}}>
            Player
        </div>
        <div style={{height:"150px", overflow:"scroll", border:"2px solid black", padding:"10px"}}>
            {playerStore.list.map(Nplayer => 
                <PlayerSelectLabel playerStore={playerStore} phaseStore={phaseStore} labelStore={labelStore} blockStore={blockStore} Nplayer={Nplayer}/>
            )}
        </div>
        <button onClick={e => userPatcher.addUser(labelStore, playerStore)}>
            New User
        </button>
        
        <div style={{display:"block", width:"10vw", marginTop:"2vh", marginBottom:"2vh",fontSize:"3vh", fontWeight: "bold"}}>
            Choose Label
        </div>
        Now Player: {playerStore.now}
        <div style={{height:"150px", overflow:"scroll", border:"2px solid black", padding:"10px"}}>
            {phaselist.map(Iphase => 
                <PhaseSelectLabel phaseStore={phaseStore} labelStore={labelStore} playerStore={playerStore} Iphase={Iphase}/>
            )}
        </div>
        <button onClick={e => LabelPatcher.addLabel({player:playerStore.now, phase:phaseStore.now, labelStore: labelStore})}>
            New label
        </button>
    </div>);
});
export default LabelTable;
