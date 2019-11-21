// Add zero in front of numbers < 10
export function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

export function monoDigits(digits) {
    let ret = "";
    const str = digits.toString();
    for (let index = 0; index < str.length; index++) {
        const num = str.charAt(index);
        ret = ret.concat(hex2a("0x1" + num));
    }
    return ret;
}

// Hex to string
export function hex2a(hex) {
    let str = '';
    for (let index = 0; index < hex.length; index += 2) {
        const val = parseInt(hex.substr(index, 2), 16);
        if (val) str += String.fromCharCode(val);
    }
    return str.toString();
}