module.exports = function (date1, date2) {

    const msPerDay = 1000 * 60 * 60 * 24
    const diffMs = Math.abs(date2 - date1)
    return Math.floor(diffMs / msPerDay)
}