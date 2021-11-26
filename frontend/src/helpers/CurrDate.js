const date = new Date();
const currDateObj = {
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0'),
    year: String(date.getFullYear()).padStart(4, '0'),
    hour: String(date.getHours()).padStart(2, '0'),
    minute: String(date.getMinutes()).padStart(2, '0')
};

export function getCurrDateObj(){
    return currDateObj;
}

export function getCurrDateMDY(){
    const currDate = currDateObj.month + currDateObj.day + currDateObj.year;
    return currDate.toString();
}

export function getCurrDateYMDHM(){
    return currDateObj.year + currDateObj.month + currDateObj.day + currDateObj.hour + currDateObj.minute;
}