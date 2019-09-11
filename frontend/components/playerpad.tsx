import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {player, label, block, share} from '../store';
import * as userPatcher from '../dispatcher/user';
import * as Refresh from '../dispatcher/refresh';
import styled from 'styled-components';


const PlayerSelectLabel = observer(({playerStore, labelStore, blockStore, shareStore, Nplayer}) => {
    console.log(playerStore.now, Nplayer);
    return(
    <PlayerSelectLabelStyle
        style={{color:playerStore.now===Nplayer?"green":"black"}}
        onClick={e => {Refresh.refresh(Nplayer, labelStore, playerStore, blockStore, shareStore);}}>
        {playerStore.now.toString() === Nplayer?
        <><img src="/static/user_selected.png"/>
        <div className="num" style={{color: "black", fontWeight:"bold"}}>{Nplayer}</div>
        </>
        :<><img src="/static/user.jpg"/>
        <div className="num">{Nplayer}</div>
        </>}
        
    </PlayerSelectLabelStyle>);
});
const PlayerPad = observer((props) => {
    const playerStore = useContext(player);
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    const shareStore = useContext(share);
    let isRow = useState(false);

    useEffect(() => {
        if(playerStore.list.length === 0) {
            userPatcher.addUser(labelStore, playerStore);
            userPatcher.addUser(labelStore, playerStore);
        }
        // console.log("DOM", document.documentElement.clientWidth, document.documentElement.clientHeight);
        if(isRow[0] === false && document.documentElement.clientWidth < document.documentElement.clientHeight) {
            isRow[1](true);
        }
        // console.log(isRow[0]);
    });
    return(
    <PlayerPadStyle isRow={isRow[0]}>
        <div style={{display:"block", width:"5vw", marginBottom:"2vh", fontSize:"3vh", fontWeight: "bold"}}>
            Player
        </div>
        <div className="conts">
            {playerStore.list.map(Nplayer => 
                <PlayerSelectLabel playerStore={playerStore} labelStore={labelStore} blockStore={blockStore} shareStore={shareStore} Nplayer={Nplayer}/>
            )}
        </div>
        {playerStore.list.length <= 9?
                <img style={{width: "30px", paddingLeft:"30%"}} src="/static/plus.png" onClick={e => userPatcher.addUser(labelStore, playerStore)}/>
        :""}
    </PlayerPadStyle>);
});

export default PlayerPad;

const PlayerPadStyle = styled.div`
    display: "flex"; flex-direction:"column";
    .conts {
        display: flex;
        flex-direction: ${props => props.isRow?"row":"column"};
        width: ${props => props.isRow?"100vw":"60px"};
        height: ${props => props.isRow?"60px":"70vh"};
    }
`;

const PlayerSelectLabelStyle = styled.div`
    cursor: pointer;
    overflow: visible;
    position: relative;
    width: 10vh; height: 8vh;
    .num {
        position: absolute; top: 40%; left: 40%; color: white;
        transform: translate(-50%, -50%);
    }
    img {
        width: 80%;
    }
`;
