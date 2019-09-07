import * as React from 'react';
import {useContext, useState} from 'react';
import {RangeBlock, RangeSetBlock} from '.';
import {observer} from 'mobx-react-lite';
import styled from 'styled-components' ;
import {label, block, cache} from '../store';

const NumRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const Totalcombo = observer(() => {
    const blockStore = useContext(block);
    return(<div>TotalCombo: {blockStore.totalCombo}</div>);
});

const RangePad = (props) => {
    const RangeSetterView = useState(false);
    const style = {...props.style};
    const labelStore = useContext(label);
    const blockStore = useContext(block);
    const cacheStore = useContext(cache);

    return(<RangePadStyle style={style}>
        <Totalcombo/>
        {NumRange.map(first => {
            return(<Line>
                {NumRange.map(second => {
                    return(<RangeBlock keyV={first.toString() + second.toString()} com={[first, second]} rangeView={RangeSetterView[1]} labelStore={labelStore} blockStore={blockStore} cacheStore={cacheStore}/>);
                })}
            </Line>);
        })}
        {RangeSetterView[0] !== false?
            <RangeSetBlock view={RangeSetterView[0]} change={RangeSetterView[1]}/>
        :""}
    </RangePadStyle>);
}

export default RangePad;

const Line = styled.div`
    display: flex; width: 80vw;
    .menu {
        background-color: white;
        padding: 3px 3px 3px 3px;
        border: 1px solid black;
        z-index: 2;
    }
`;

const RangePadStyle = styled.div`
    display: block; position: relative;
    z-index: 3;
`;