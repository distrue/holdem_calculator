import jts from '../tools/JSONtoString';
export const checkEnv = (nowEnv, lookEnv) => {
    console.log(jts(nowEnv), jts(lookEnv));
    if(nowEnv.length !== lookEnv.length) {
        return false;
    }
    return true;
}
