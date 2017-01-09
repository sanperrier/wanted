function pad(number) {
    if (number < 10) {
        return '0' + number;
    }
    return number;
}

if (!Date.prototype.toISOStringTZ) {
    Date.prototype.toISOStringTZ = function () {
        var tzo = -this.getTimezoneOffset(),
            dif = tzo >= 0 ? '+' : '-';

        return this.getFullYear()
            + '-' + pad(this.getMonth() + 1)
            + '-' + pad(this.getDate())
            + 'T' + pad(this.getHours())
            + ':' + pad(this.getMinutes())
            + ':' + pad(this.getSeconds())
            + (tzo >= 0 ? '+' : '-')
                    + pad(tzo / 60)
            + ':' + pad(tzo % 60);
    };
}

export default Date.prototype.toISOStringTZ;