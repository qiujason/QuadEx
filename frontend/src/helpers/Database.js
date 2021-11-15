import * as currDate from "./CurrDate";

function handlePostError(response){
    if(!response.ok) throw Error(response.statusText);
    return response;
}

async function getRequest(url){
    let response = await fetch(url);
    return await response.json();
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


// returns image src or empty string
export async function getImage(url){
    return await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'image/jpeg'
        }
    }).then(async response => {
        if(!response.ok) return 'https://ih1.redbubble.net/image.1297785969.6887/st,small,507x507-pad,600x600,f8f8f8.u1.jpg';
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    });
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
    const data = await getRequest('http://localhost:3001/users/?id=' + netID);
    if(data.length <= 0) return null;
    return data[0];
}

export async function putUser(userObj){
    return await insertRequest('PUT', 'http://localhost:3001/users/?id=' + userObj.net_id, userObj);
}

// == EVENTS == //

export async function getEvents(){
    return await getRequest('http://localhost:3001/events');
}

export async function putEvent(eventID, eventObj){
    return await insertRequest('PUT', 'http://localhost:3001/events/?id=' + eventID, eventObj);
}

// returns array of event objects
export async function getFavEventsByUser(netID){
    return await getRequest('http://localhost:3001/events/favoriteByUser/?id=' + netID);
}

// returns array of user objects
export async function getFavedUsersByEvent(eventID){
    return await getRequest('http://localhost:3001/events/listUsers/?id=' + eventID);
}

export async function postEvent(obj){
    var feedback;
    await fetch('http://localhost:3001/events', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj)
        }
    ).then(handlePostError).then(data => feedback = data.text()).catch(() => feedback = false);
    return feedback;
}

// returns true or false
export async function postFavEvent(netID, eventID){
    const obj = {
        net_id: netID, 
        event_id: eventID,
    };
    return await insertRequest('POST', 'http://localhost:3001/events/favoriteForUser/?net_id=' + netID + '&event_id=' + eventID, obj);
}

export async function deleteEvent(eventID){
    await deleteRequest('http://localhost:3001/events/?id=' + eventID);
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