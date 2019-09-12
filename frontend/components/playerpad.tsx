import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {player, label, block, share, cache} from '../store';
import * as userPatcher from '../dispatcher/user';
import * as Refresh from '../dispatcher/refresh';
import styled from 'styled-components';


const PlayerSelectLabel = observer(({playerStore, labelStore, blockStore, shareStore, Nplayer}) => {
    const cacheStore = useContext(cache);
    return(
    <PlayerSelectLabelStyle
        style={{color:playerStore.now===Nplayer?"green":"black"}}
        onClick={e => {Refresh.refresh(Nplayer, labelStore, playerStore, blockStore, shareStore, cacheStore);}}>
        {playerStore.now.toString() === Nplayer?
        <><img src="/static/user_selected.png"/>
        <div className="num" style={{color: "black", fontWeight:"bold"}}>{Nplayer}</div>
        </>
        :<><img src="/static/user.jpg"/><div className="num">{Nplayer}</div>
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
        if(isRow[0] === false && document.documentElement.clientWidth < document.documentElement.clientHeight) {
            isRow[1](true);
        }
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
            {playerStore.list.length <= 9?
                <PlusStyle isRow={isRow[0]} src="/static/plus.png" onClick={e => userPatcher.addUser(labelStore, playerStore)}/>
            :""}
        </div>
    </PlayerPadStyle>);
});

export default PlayerPad;

const PlayerPadStyle = styled.div`
    display: "flex"; flex-direction:"column";
    .conts {
        display: flex;
        flex-direction: ${props => props.isRow?"row":"column"};
        ${props => props.isRow?"":"width: 60px;"}
        ${props => props.isRow?"height: 60px;":""}
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

const PlusStyle = styled.img`
    ${props => props.isRow?"height: 30px;":"width: 30px;"}
    ${props => props.isRow?"padding-top: 15px;":"padding-left: 15px;"};
`;
