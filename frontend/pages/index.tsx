import * as React from 'react';
import {RangeTable, LabelTable, HandTable} from '../components';
import styled from 'styled-components' ;

export default () => {
    return(<>
    <div style={{position: "absolute", left:"5vw", top: "3vh", fontSize:"3vh", fontWeight:"bold"}}>Range Calculator</div>
    <div>
        <RangeTable style={{position:"absolute", top:"10vh", left:"10vw"}}/>
        <LabelTable style={{position:"absolute", top:"10vh", left:"58vw"}}/>
        <HandTable style={{position:"absolute", top:"10vh", left:"80vw"}}/>
    </div>
    </>);
};
