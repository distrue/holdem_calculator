import * as React from 'react';
import {RangeBlock} from '../components';
import styled from 'styled-components' ;

const NumRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const RangeTable = (props) => {
    const style = {...props.style};
    return(<div style={style}>
        {NumRange.map(first => {
            return(<Line>
                {NumRange.map(second => {
                    return(<RangeBlock keyV={first.toString() + second.toString()} com={[first, second]}/>);
                })}
            </Line>);
        })}
    </div>);
}

export default RangeTable;

const Line = styled.div`
    display: flex; width: 80vw;
    .menu {
        background-color: white;
        padding: 3px 3px 3px 3px;
        border: 1px solid black;
        z-index: 2;
    }
`;