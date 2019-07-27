import * as React from 'react';
import {observer, useObservable} from 'mobx-react-lite';

export default observer(() => {
    const store = useObservable({
        label: [""],
        addLabel(index) {
            store.label.push("1")
            console.log(store.label);
        }
    });
    return(<div>
        <div>{store.label}</div>
        <button style={{display:"block", width:"10vw"}} onClick={e => store.addLabel("preflop")}>New</button> 
    </div>);
});
