export function convertDate(num){
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = Number(num.substring(0, 2)) - 1;
    var day = num.substring(2, 4);
    var year = num.substring(4);
    return months[month] + ' ' + day + ', ' + year;
}