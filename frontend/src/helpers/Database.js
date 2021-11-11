import * as currDate from "./CurrDate";

function handlePostError(response){
    if(!response.ok) throw Error(response.statusText);
    return response;
}

async function insertRequest(type, url, obj){
    var feedback = true;
    await fetch(url, 
        {
            method: type,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        }
    ).then(handlePostError).catch(() => feedback = false);
    return feedback;
}

async function deleteRequest(url){
    await fetch(url, 
        { 
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: null
        } 
    );
}

// == USERS == //

// returns user object or null
export async function getUser(netID){
    let response = await fetch('http://localhost:3001/users/?id=' + netID);
    let data = await response.json();

    if(data.length <= 0) return null;
    return data[0];
}

export async function putUser(userObj){
    return await insertRequest('PUT', 'http://localhost:3001/users/?id=' + userObj.net_id, userObj);
}

// == EVENTS == //

// returns array of event objects
export async function getFavEventsByUser(netID){
    let response = await fetch('http://localhost:3001/events/favoriteByUser/?id=' + netID);
    let data = await response.json();
    return data;
}

export async function deleteFavEvent(netID, eventID){
    await deleteRequest('http://localhost:3001/events/favoriteForUser/?net_id=' + netID + '&event_id=' + eventID);
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
    const obj = {
        net_id: netID,
        date: currDate.getCurrDateMDY(),
        reason: reason,
        point_value: value,
    }
    return await insertRequest('POST', 'http://localhost:3001/points', obj);
}