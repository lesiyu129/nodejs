module.exports = function (...rest) {
    var sum = 0;
    for (let s of rest) {
        sum += s;
    }
    return sum;
}