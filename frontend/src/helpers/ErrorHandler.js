const quadNames = ['raven', 'cardinal', 'eagle', 'robin', 'blue jay', 'owl', 'dove'];

// return null if no errors, new obj
export function checkInputs(prevObj, requiredKeys) {
    const minPasswordLength = 4;
    var isError = false;

    const obj = { ...prevObj };

    function makeError(key){
        obj[key][1] = true;
        isError = true;
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
    if('birthday_M' in obj && (Number(obj['birthday_M'][0]) < 1 || Number(obj['birthday_M'][0]) > 12)) {
        makeError('birthday_M');
    }
    if('birthday_D' in obj && (Number(obj['birthday_D'][0]) < 1 || Number(obj['birthday_D'][0]) > 31)) {
        makeError('birthday_D');
    }
    if('birthday_Y' in obj && (Number(obj['birthday_Y'][0]) > new Date().getFullYear())) {
        makeError('birthday_Y');
    }
    if('quad' in obj && !quadNames.includes(String(obj['quad'][0]).toLowerCase())) {
        makeError('quad');
    }
    
    if(!isError) return null;
    return obj;
}