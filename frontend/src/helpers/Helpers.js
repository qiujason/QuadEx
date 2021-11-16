export function convertDate(num){
    if(num === null) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var month = Number(num.substring(0, 2)) - 1;
    var day = num.substring(2, 4);
    var year = num.substring(4);
    return months[month] + ' ' + day + ', ' + year;
}

export function convertTime(num){
    if(num === null) return;

    const isPM = num >= 1200;
    var hour = Number(num.substring(0, 2)) === 12 ? 12 : Number(num.substring(0, 2)) % 12;
    var minute = num.substring(2);
    return hour + ':' + minute + ' ' + (isPM ? 'PM' : 'AM');
}

export function capitalize(str){
    if(str === null || str === '') return;

    const words = str.split(' ');
    return words.map((word) => {
        return word[0].toUpperCase() + word.substring(1); 
    }).join(' ');
}