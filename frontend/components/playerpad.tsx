import * as React from 'react';
import {useContext, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {player, label, block, result} from '../store';
import * as userPatcher from '../dispatcher/user';
import * as Refresh from '../dispatcher/refresh';
import styled from 'styled-components';


const PlayerSelectLabel = observer(({playerStore, labelStore, blockStore, Nplayer}) => {
    return(
    <PlayerSelectLabelStyle 
        style={{color:playerStore.now===Nplayer?"green":"black"}}
        onClick={e => {Refresh.refresh(Nplayer, labelStore, playerStore, blockStore);}}>
        {Nplayer}
    </PlayerSelectLabelStyle>);
});
const PlayerPad = observer((props) => {
    const playerStore = useContext(player);
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    const resultStore = useContext(result);

    useEffect(() => {
        if(playerStore.list.length === 0) {
            userPatcher.addUser(labelStore, playerStore);
            userPatcher.addUser(labelStore, playerStore);
        }
    });
    return(
    <div style={{flexDirection: "column", ...props.style, display: resultStore.submitted===undefined?"flex":"none"}}>
        <div style={{display:"block", width:"5vw", marginBottom:"2vh", fontSize:"3vh", fontWeight: "bold"}}>
            Player
        </div>
        <div style={{overflow:"scroll", padding:"10px"}}>
            {playerStore.list.map(Nplayer => 
                <PlayerSelectLabel playerStore={playerStore} labelStore={labelStore} blockStore={blockStore} Nplayer={Nplayer}/>
            )}
        </div>
        {playerStore.list.length <= 9?
            <button onClick={e => userPatcher.addUser(labelStore, playerStore)}>
                New User
            </button>
        :""}
        <div style={{display:"block", width:"10vw", marginBottom:"2vh", marginTop:"6vh", fontSize:"3vh", fontWeight: "bold"}}>
            Status
        </div>
        <div style={{border: "1px solid black", marginBottom:"4vh"}}>
            <div>Now Player: {playerStore.now}</div>
            <div>Now Label: {labelStore.displayMatch[labelStore.now]}</div>
        </div>
    </div>);
});

export default PlayerPad;

const PlayerSelectLabelStyle = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    border: 1px solid black;
    margin-bottom: 10px;
    .playerLabel {
        display: flex;
        flex-direction: column;
        div {
            margin-left: 10px;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
    }
`;
