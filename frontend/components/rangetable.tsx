import * as React from 'react';
import {RangeBlock} from '../components';
import styled from 'styled-components' ;

const NumRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const RangeTable = (props) => {
    const style = {display: "block", ...props.style};
    return(<div style={style}>
        {NumRange.map(first => {
            return(<Line>
                {NumRange.map(second => {
                    return(<RangeBlock com={[first, second]}/>); 
                })}
            </Line>);
        })}
    </div>);
}

export default RangeTable;

const Line = styled.div`
    display: flex; width: 80vw;
    .Block {
        display: block; width: 40px; height: 30px;
        border: 1px solid black;
        text-align: center;
        padding-top: 10px;
    }
`;