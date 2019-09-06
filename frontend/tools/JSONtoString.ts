export default function JSONtoString(object) {
    var results = [];
    for (var property in object) {
        var value = object[property];
        if (value)
            if(typeof value === "object") {
                value = JSONtoString(value);
            }
            results.push(property.toString() + ': ' + value);
        }
                
        return '{\n' + results.join(', ') + '}\n';
}
