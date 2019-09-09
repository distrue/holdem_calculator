import * as React from 'react';
import {useState, useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {share, block, label, player} from '../../store';
import * as SharePatcher from '../../dispatcher/share';
import styled from 'styled-components';

const backLooker = "23456789TJQKA";
const backPattern = {0: 's', 1: 'c', 2: 'h', 3: 'd'};

const SelectcardBlock = observer((props) => {
    const blockStore = useContext(block);
    const shareStore = useContext(share);
    const labelStore = useContext(label);
    const playerStore = useContext(player);
    const color = useState('black');
    
    let placeholder = shareStore.card[props.num] !== Number?
        "" 
        : backLooker[shareStore.card[props.num] % 13] + backPattern[ shareStore.card[props.num] / 13 ];
    return(
        <SelectcardBlockStyle 
            className="input" 
            style={{color: color[0], width: "98%"}} 
            onChange={e => SharePatcher.setCard(e, color[1], shareStore, blockStore, labelStore, playerStore)} 
            placeholder={placeholder} />
    );
});

export default SelectcardBlock;

const SelectcardBlockStyle = styled.input`
    width: 15vw;
    height: 20px;
    border: 1px solid black;
    z-index: 6;
`;