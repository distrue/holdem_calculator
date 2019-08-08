export default (target, path) => {
    let now = target;
    for(let name in path) {
        if(now[path[name]] === undefined) {
            return false;
        }
        now = now[path[name]];
    }
    return true;
}