import * as React from 'react';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import player from '../store/Player';
import phase from '../store/Phase';
import label from '../store/Label';
import block from '../store/Block';
import result from '../store/Result';
import * as LabelPatcher from '../dispatcher/label';
import * as Refresh from '../dispatcher/refresh';

const LabelTable = observer((props) => {
    const playerStore = useContext(player);
    const phaseStore = useContext(phase);
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    const resultStore = useContext(result);

    let astyle = {flexDirection: "column", ...props.style};
    let phaselist = ["preflop", "flop", "turn", "river"];
    return(<div style={{...astyle, display: resultStore.submitted===undefined?"flex":"none"}}>
        <div style={{display:"block", width:"10vw", marginBottom:"2vh", fontSize:"3vh", fontWeight: "bold"}}>Player</div>
        <div style={{height:"150px", overflow:"scroll", border:"2px solid black", padding:"10px"}}>
        {playerStore.list.map(Nplayer => 
            <div onClick={e => {
                    Refresh.refresh(Nplayer, phaseStore.now, labelStore, playerStore, phaseStore, blockStore);
                }}
            style={{cursor: "pointer", color:playerStore.now===Nplayer?"green":"black", display: "flex", flexDirection:"row", border:"1px solid black"}}
            >
                Player {Nplayer}
                <div style={{ display: "flex", flexDirection:"column"}}>
                <div style={{marginLeft:"10px", display: "flex", flexDirection:"row", flexWrap:"wrap"}}>
                    {labelStore.data[Nplayer]!==undefined && 
                    labelStore.data[Nplayer][phaseStore.now] !== undefined ?
                        labelStore.data[Nplayer][phaseStore.now].map(Nlabel => {
                            if(playerStore.ownLabel[Nplayer] === undefined) {
                                return(<>{Nlabel} undefined</>);
                            }
                            const val = playerStore.ownLabel[Nplayer].findIndex(idx => idx === Nlabel);
                            if(val >= 0) {
                                return (<button style={{fontWeight:"bold", backgroundColor: labelStore.color[Nlabel], color:"#ffffff"}} onClick={e => playerStore.ownLabel[Nplayer].splice(val, 1)}>{Nlabel}-</button>);
                            }
                            else {
                                return(<></>);
                            }
                        })
                    :""}
                </div>
                <hr style={{width:"100%", border:"0.5px solid black"}}/>
                <div style={{marginLeft:"10px", display: "flex", flexDirection:"row", flexWrap:"wrap"}}>
                    {labelStore.data[Nplayer]!==undefined && 
                    labelStore.data[Nplayer][phaseStore.now] !== undefined ?
                        labelStore.data[Nplayer][phaseStore.now].map(Nlabel => {
                            if(playerStore.ownLabel[Nplayer] === undefined) {
                                return(<>{Nlabel} undefined</>);
                            }
                            const val = playerStore.ownLabel[Nplayer].findIndex(idx => idx === Nlabel);
                            if(val >= 0) {
                                return(<></>);
                            }
                            else {
                                return (<button style={{backgroundColor:labelStore.color[Nlabel]}} onClick={e => playerStore.ownLabel[Nplayer].push(Nlabel)}>{Nlabel}+</button>);
                            }
                        })
                    :""}
                </div>
                </div>
            </div>
        )}</div>
        <button onClick={e => {
            playerStore.list.push((playerStore.list.length+1).toString());
            playerStore.ownLabel[(playerStore.list.length).toString()] = [];
            labelStore.data[(playerStore.list.length).toString()] = {};
            console.log((playerStore.list.length).toString(), playerStore.list.toString());
        }}>New User</button>
        
        <div style={{display:"block", width:"10vw", marginTop:"2vh", marginBottom:"2vh",fontSize:"3vh", fontWeight: "bold"}}>Choose Label</div>
        <div>Now Player: {playerStore.now}</div>
        <div style={{height:"150px", overflow:"scroll", border:"2px solid black", padding:"10px"}}>
        {phaselist.map(Iphase => {
            return(<div style={{border:Iphase === phaseStore.now?"1px solid black":"0px solid black"}}> 
                {Iphase}:
                <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
                {(labelStore.data[playerStore.now] && labelStore.data[playerStore.now][Iphase])?
                labelStore.data[playerStore.now][Iphase].map(item => {
                    if(Iphase === phaseStore.now) {
                        const Ncolor = labelStore.color[item];
                        return(<div onClick={e => labelStore.now = item} style={{backgroundColor: Ncolor, cursor: "pointer", border:"1px solid black", width:"50px"}}>
                            {item}
                        </div>);
                    }
                    else {
                        return(<div style={{backgroundColor: "#444444", border:"1px solid black", width:"50px"}}>
                            {item}
                        </div>);
                    }
                })
                :""}</div><br/>
            </div>);
        })}</div>
        <button onClick={e => LabelPatcher.addLabel({player:playerStore.now, phase:phaseStore.now, labelStore: labelStore})}>New label</button>
    </div>);
});
export default LabelTable;
