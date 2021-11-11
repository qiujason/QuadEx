import * as currDate from "./CurrDate";

function handlePostError(response){
    if(!response.ok) throw Error(response.statusText);
    return response;
}

// == USERS == //

// returns user object or null
export async function getUser(netID){
    let response = await fetch('http://localhost:3001/users/?id=' + netID);
    let data = await response.json();

    if(data.length <= 0) return null;
    return data[0];
}

// == EVENTS == //

// returns array of event objects
export async function getFavEventsByUser(netID){
    let response = await fetch('http://localhost:3001/events/favoriteByUser/?id=' + netID);
    let data = await response.json();
    return data;
}

// == POINTS == //

// returns int or null
export async function getTotalPointsByUser(netID){
    let response = await fetch('http://localhost:3001/points/user/sum/?id=' + netID);
    let data = await response.json();

    if(data.length === 0 || data[0].sum === null) return null;
    return data[0].sum;
}

// returns true or false
export async function postPoints(netID, reason, value){
    var feedback = true;
    await fetch('http://localhost:3001/points', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                net_id: netID,
                date: currDate.getCurrDateMDY(),
                reason: reason,
                point_value: value,
            })
        }
    )
    .then(handlePostError).catch(() => feedback = false);
    return feedback;
}