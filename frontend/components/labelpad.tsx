import * as React from 'react';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {label, player} from '../store';

const LabelPad = observer(() => {
    const tmpLabel = [...Array(12).keys()];
    const labelStore = useContext(label);
    const playerStore = useContext(player);
    return(<div style={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
        {tmpLabel.map(item => {
            return(
            <div 
                style={{cursor: "pointer", width:"80px", textAlign:"center", padding:"10px 0px 10px 0px", border:"1px solid black"}}
                onClick={() => { 
                    if(playerStore.now === "") {
                        return;
                    }
                    labelStore.now = labelStore.playerLabel[playerStore.now][item]; 
                    // console.log(labelStore.playerLabel[playerStore.now][item]); // (이용하고 있는) label 번호 출력
                }}>{item+1}</div>);
        })}
    </div>);
});

export default LabelPad;
