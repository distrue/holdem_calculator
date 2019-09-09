import * as React from 'react';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {label, player} from '../store';
import {ColorBox} from '../dispatcher/label';
import styled from 'styled-components';

const LabelPad = observer(() => {
    const tmpLabel = [...Array(12).keys()];
    const labelStore = useContext(label);
    const playerStore = useContext(player);
    return(<LabelPadStyle>
        {tmpLabel.map((item,idx) => {
            return(
            <LabelStyle color={ColorBox[idx]}
            onClick={() => { if(playerStore.now !== "") labelStore.now = labelStore.playerLabel[playerStore.now][item]; }}>
                {item+1}
            </LabelStyle>);
        })}
    </LabelPadStyle>);
});

export default LabelPad;

const LabelPadStyle = styled.div`
    display: flex; flex-direction: row; flex-wrap: wrap;
`;
const LabelStyle = styled.div`
    cursor: pointer;
    width: 80px; text-align: center; padding: 10px 0px 10px 0px; border: 1px solid black;
    background-color: ${props => props.color ? props.color : "white"}; 
`;
