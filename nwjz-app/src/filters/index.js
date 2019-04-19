export function keepTwoNum(value) {
    value = Number(value)
    if (parseInt(value) === value) {
        return value.toFixed(0)
    } else {
        return value.toFixed(2)
    }
}
