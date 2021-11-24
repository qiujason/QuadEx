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
export async function getImage(filename){
    return await fetch(`http://localhost:3001/images/${filename}`, {
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

export async function postImage(fileObj, filename){
    if(fileObj.type.substring(0, 5) !== 'image') return;

    const formData = new FormData();
    formData.append('image', fileObj, filename);

    await fetch('http://localhost:3001/images', 
        {
            method: 'POST',
            body: formData,
        }
    );
}

export async function deleteImage(filename){
    await fetch(`http://localhost:3001/images/${filename}`, 
        { 
            method: 'DELETE',
            body: null
        } 
    );
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
    if(data.length === 0) return null;
    return data[0];
}

export async function getUsersByBirthday(birthday){
    const data = await getRequest(`http://localhost:3001/users/birthday/${birthday}`);
    if(data.length === 0) return null;
    return data;
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

export async function getEvent(eventID){
    const data = await getRequest(`http://localhost:3001/events/?id=${eventID}`);
    if(data.length <= 0) return null;
    return data[0];
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

export async function postQuadEvent(quadName, eventID){
    var feedback;
    await fetch(`http://localhost:3001/quads/event/?quad_name=${quadName}&event_id=${eventID}`, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: null,
        }
    ).then(handlePostError).then(data => feedback = data.text()).catch(() => feedback = false);
    return feedback;
}

export async function getEventsByQuad(quad){
    return await getRequest(`http://localhost:3001/events/?quad=${quad}`);
}

export async function getAffiliatedQuadsByEvent(eventID){
    return await getRequest(`http://localhost:3001/quads/?event=${eventID}`);
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

export async function deleteQuadEvent(eventID){
    await deleteRequest(`http://localhost:3001/quads/event/?event_id=${eventID}`);
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