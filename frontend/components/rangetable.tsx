import * as React from 'react';
import {RangeBlock} from '../components';
import styled from 'styled-components' ;

const combiBase = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const RangeTable = (props) => {
    const style = {display: "block", ...props.style};
    return(<div style={style}>
        {combiBase.map(first => {
            return(<Line>
                {combiBase.map(second => {
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