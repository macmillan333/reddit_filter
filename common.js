function MultilineStringToArray(str) {
    return str.split('\n').filter(line => line.length > 0);
}

function ArrayToMultilineString(arr) {
    return arr.join('\n');
}