import * as React from 'react';
import {useContext} from 'react';
import {RangeBlock} from '../components';
import {observer} from 'mobx-react-lite';
import styled from 'styled-components' ;
import {block} from '../store';

const NumRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const Totalcombo = observer(() => {
    const blockStore = useContext(block);
    return(<div>TotalCombo: {blockStore.totalCombo}</div>);
});
const RangeTable = (props) => {
    const style = {...props.style};
    return(<div style={style}>
        <Totalcombo/>
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