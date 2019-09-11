import * as React from 'react';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {label, player} from '../store';
import {ColorBox} from '../dispatcher/label';
import styled from 'styled-components';

const LabelPad = observer(() => {
    const labelStore = useContext(label);
    const playerStore = useContext(player);
    
    let tmpLabel = [];
    let j = 0;
    let N = playerStore.now * 12;
    for(let i = N - 11; i <= N; i++) tmpLabel[j++] = i;
    
    return(<LabelPadStyle>
        {tmpLabel.map((item,idx) => {
            return(
            <LabelStyle color={ColorBox[idx]}
            onClick={() => { if(playerStore.now !== "") labelStore.now = labelStore.playerLabel[playerStore.now][item]; }}>
                {(labelStore.labelComboRatio[item] * 100).toFixed(1)}%
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
