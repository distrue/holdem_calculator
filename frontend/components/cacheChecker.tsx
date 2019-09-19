import * as React from 'react';
import styled from 'styled-components';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {cache} from '../store';

const cacheChecker = observer(() => {
    const cacheStore = useContext(cache);
    return(<CheckerStyle onClick={() => { console.log(cacheStore.available); cacheStore.available = !cacheStore.available;}}>
        <input checked={cacheStore.available} type="checkbox"/>: {cacheStore.available?"Drag On":"Drag Off"}
    </CheckerStyle>);
});

export default cacheChecker;

const CheckerStyle = styled.div`
    position: relative; 
    margin-left: 20px;
    display: block; width: 100px; height: 20px;
    border-radius: 20px;
    padding: 10px;
    background-color: #a0a0a0; cursor: pointer;
    z-index: 3;
`;
