import * as React from 'react';
import {useContext} from 'react';
import {observer} from 'mobx-react-lite';
import {playerLabel} from '../store/example';

export default observer(() => {
    const store2 = useContext(playerLabel);
    return(<>
        <div>{store2.labelList.preflop}</div>
        <button style={{display:"block", width:"10vw"}} onClick={e => store2.labelList.preflop.push("2")}>New</button>
    </>);
});
