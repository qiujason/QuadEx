import { getUser } from "./Database"

const quadNames = ['raven', 'cardinal', 'eagle', 'robin', 'blue jay', 'owl', 'dove'];

// return null if no errors, new obj
export async function checkInputs(prevObj, requiredKeys) {
    const minPasswordLength = 4;
    var isError = false;

    const obj = { ...prevObj };

    function makeError(key){
        obj[key][1] = true;
        isError = true;
    }
    
    function checkMonth(key){
        if(key in obj && (Number(obj[key][0]) < 1 || Number(obj[key][0]) > 12)) makeError(key);
    }
    
    function checkDay(key){
        if(key in obj && (Number(obj[key][0]) < 1 || Number(obj[key][0]) > 31)) makeError(key);
    }
    
    function checkYear(key){
        if(key in obj && (Number(obj[key][0]) > new Date().getFullYear())) makeError(key);
    }

    requiredKeys.forEach(key => {
        if(obj[key][0] === '') makeError(key);
    });

    if('password' in obj && obj['password'][0] !== '' && String(obj['password'][0]).length < minPasswordLength) {
        makeError('password');
    }
    if('password' in obj && 'confirm_password' in obj && obj['password'][0] !== obj['confirm_password'][0]) {
        makeError('confirm_password');
    }
    
    checkMonth('birthday_M');
    checkDay('birthday_D');
    checkYear('birthday_Y');

    if('quad' in obj && !quadNames.includes(String(obj['quad'][0]).toLowerCase())) {
        makeError('quad');
    }
    if('affiliatedQuad' in obj && requiredKeys.includes('affiliatedQuad') && !quadNames.includes(String(obj['affiliatedQuad'][0]).toLowerCase())) {
        makeError('affiliatedQuad');
    }

    if('net_id' in obj && await getUser(obj['net_id'][0]) === null) {
        makeError('net_id');
    }
    
    if(!isError) return null;
    return obj;
}