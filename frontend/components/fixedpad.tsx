import * as React from 'react';
import {SelectcardBlock} from '.';
import {observer} from 'mobx-react-lite';
import {useContext} from 'react';
import {player, label} from '../store';
import styled from 'styled-components';

const FixedPad = observer((props) => {
    let playerStore = useContext(player);
    let labelStore = useContext(label);
    return(<FixedPadStyle>
        <div className="select">
            <div className="title">Board </div>
            <div style={{display:"flex", marginLeft:"3vh"}}>
                <SelectcardBlock />
            </div>
        </div>
        <div className="status">
            <div className="title">Status</div>
            <div style={{border: "1px solid black", marginBottom:"4vh"}}>
                <div>Player: {playerStore.now}</div>
                <div>Label: {labelStore.displayMatch[labelStore.now]}</div>
            </div>
        </div>
    </FixedPadStyle>);
});

export default FixedPad;

const FixedPadStyle = styled.div`
    display:flex; flex-direction: row; position: relative; width: 40vmax;
    .select {
        display: block; width: 15vmax; height: 10vh; padding-bottom: 2vh; cursor: pointer; z-index: 2;
    }
    .status {
        display: flex; width: 15vmax; flex-direction: column;
        margin-left: 4vw;
    }
    .title {
        font-size: 3vh; font-weight: bold; margin-bottom: 1vh;
    }
`;