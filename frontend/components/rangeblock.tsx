import * as React from 'react';

interface Props {
    com: string[];
}
const RangeBlock = (props: Props) => {
    return(<div className="Block">{props.com[0]}{props.com[1]}</div>);
}

export default RangeBlock;
