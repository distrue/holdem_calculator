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
    position: fixed; bottom: 0%; left: 0%;
    display: block; width: 5%; height: 3%;
    padding: 2% 1% 1% 1%;
    background-color: #a0a0a0; cursor: pointer;
`;
