import React from 'react'
import '../stylesheets/EventPage.scss'
import { useState, useEffect, useCallback } from 'react'
import SearchField from './SearchField'
import EventTag from './EventTag'
import UserTag from './UserTag'
import { IoMdCheckmarkCircle, IoMdCloseCircle, IoMdInformationCircle } from 'react-icons/io'
import { IoPeopleCircle } from 'react-icons/io5'
import { convertDate, convertTime, capitalize } from '../helpers/Helpers'
import { FaPlusCircle } from 'react-icons/fa'
import * as db from '../helpers/Database'
import InputBox from '../components/InputBox'
import * as errorHandler from '../helpers/ErrorHandler'
import ScrollViewport from 'react-scroll-viewport';

const defaultImgSrc = 'https://ih1.redbubble.net/image.1297785969.6887/st,small,507x507-pad,600x600,f8f8f8.u1.jpg';

const Events = ({ netID, isAdmin }) => {
    const [ allEvents, setAllEvents ] = useState([]);
    const [ favoritedEventIDs, setFavoritedEventIDs ] = useState(null);
    const [ renderedEvents, setRenderedEvents ] = useState([]);
    const [ showPastEvents, setShowPastEvents ] = useState(false);
    const [ showInterestList, setShowInterestList ] = useState(true);
    const [ detailedEvent, setDetailedEvent ] = useState({
        id: null,
        title: '',
        subtext: '',
        description: '',
        tags: [],
        members: [],
    });

    const fetchEvents = useCallback(async () => {
        const userObj = await db.getUser(netID);
        const userQuad = userObj.quad;
        const quadEvents = await db.getEventsByQuad(userQuad);
        setAllEvents(quadEvents);

        const data = await db.getFavEventsByUser(netID);

        const idSet = new Set();
        data.forEach(eventObj => {
            idSet.add(eventObj.id);
        });
        setFavoritedEventIDs(idSet);
    }, [netID]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        if(showPastEvents){
            setRenderedEvents(allEvents);
            return;
        } else {
            setRenderedEvents([]);
            const date = new Date();
            var currDate, eventDate;
            allEvents.forEach(eventObj => {
                currDate = Number(String(date.getFullYear()) + String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0') + String(date.getHours()).padStart(2, '0') + String(date.getMinutes()).padStart(2, '0'));
                eventDate = Number(eventObj.date.substring(4) + eventObj.date.substring(0, 2) + eventObj.date.substring(2, 4) + eventObj.time.substring(0, 2) + eventObj.time.substring(2));
                if(eventDate >= currDate) setRenderedEvents(renderedEvents => [...renderedEvents, eventObj]);
            });
        }
    }, [showPastEvents, allEvents, favoritedEventIDs]);

    // sort events list chronologically
    renderedEvents.sort(function (i1, i2){
        var year1 = Number(i1.date.substring(4) + i1.date.substring(0, 2) + i1.date.substring(2, 4));
        var year2 = Number(i2.date.substring(4) + i2.date.substring(0, 2) + i2.date.substring(2, 4));
        return year1 - year2;
    });

    // filter rendered events by title
    const filterTitle = (str) => {
        if(str.length === 0){
            setRenderedEvents(allEvents);
            return;
        }

        setRenderedEvents([]);
        allEvents.forEach(eventObj => {
            if(eventObj.title.toLowerCase().indexOf(str.toLowerCase()) !== -1){
                setRenderedEvents(renderedEvents => [...renderedEvents, eventObj]);
            }
        });
    }

    async function updateDetailedEvent(eventObj) {
        var subText = convertDate(eventObj.date) + ', ' + convertTime(eventObj.time) + ' - ';
        subText += (eventObj.date !== eventObj.end_date ? convertDate(eventObj.end_date) + ', ' : '');
        subText += convertTime(eventObj.end_time) + (eventObj.location !== null ? ' ~ @ ' + capitalize(eventObj.location) : '');

        const newObj = { ...detailedEvent };
        newObj.id = eventObj.id;
        newObj.title = eventObj.title.toUpperCase();
        newObj.subtext =  subText;
        newObj.description = eventObj.description;
        newObj.tags = eventObj.tags;
        newObj.members = await db.getFavedUsersByEvent(newObj.id);

        setDetailedEvent(newObj);
        setShowInterestList(false);
    }

    async function favoriteEvent(eventObj){
        const postRes = await db.postFavEvent(netID, eventObj.id);
        if(postRes) { /* no authentication */ }
    }

    async function unfavoriteEvent(eventObj) {
        await db.deleteFavEvent(netID, eventObj.id);
    }

    const [ isAddEventOn, setIsAddEventOn ] = useState(false);
    const emptyAddEventValues = {
        title: ['', false],
        date_M: ['', false],
        date_D: ['', false],
        date_Y: ['', false],
        end_date_M: ['', false],
        end_date_D: ['', false],
        end_date_Y: ['', false],
        time_H: ['', false],
        time_M: ['', false],
        end_time_H: ['', false],
        end_time_M: ['', false],
        description: ['', false],
        location: ['', false],
        tags: ['', false],
        affiliatedQuad: ['', false],
    };
    const [ isInterquad, setIsInterquad ] = useState(false);
    const [ addEventValues, setAddEventValues ] = useState(emptyAddEventValues);
    const updateAddEventValues = (key, value) => {
        const prevObj = { ...addEventValues };
        if(!(key in prevObj)) return;
        prevObj[key][typeof value === 'boolean' ? 1 : 0] = value;
        if(typeof value !== 'boolean') prevObj[key][1] = false;
        setAddEventValues(prevObj);
        document.getElementById('event-desc-textarea').scrollTop = document.getElementById('event-desc-textarea').scrollHeight;
    }

    async function hasInputError(requiredKeys, state, setFunc){
        const errorObj = await errorHandler.checkInputs(state, requiredKeys);
        if(errorObj !== null){
            setFunc(errorObj);
            return true;
        }
        return false;
    }

    async function getInsertEventObj(){
        var requiredKeys = ['title', 'date_M', 'date_D', 'date_Y', 'end_date_M', 'end_date_D', 'end_date_Y', 'time_H', 'time_M', 'end_time_H', 'end_time_M', 'description'];
        if(!isInterquad) requiredKeys.push('affiliatedQuad');
        if(await hasInputError(requiredKeys, addEventValues, setAddEventValues)) return null;

        const returnObj = {
            title: addEventValues['title'][0],
            time: addEventValues['time_H'][0] + addEventValues['time_M'][0],
            end_time: addEventValues['end_time_H'][0] + addEventValues['end_time_M'][0],
            date: addEventValues['date_M'][0] + addEventValues['date_D'][0] + addEventValues['date_Y'][0],
            end_date: addEventValues['end_date_M'][0] + addEventValues['end_date_D'][0] + addEventValues['end_date_Y'][0],
            description: addEventValues['description'][0] === '' ? null : addEventValues['description'][0],
            location: addEventValues['location'][0] === '' ? null : addEventValues['location'][0],
            tags: addEventValues['tags'][0] === '' ? null : String(addEventValues['tags'][0]).split(', '),
            pic: null
        };
        return returnObj;
    }

    async function updateEvent(type){
        const objToUpdate = await getInsertEventObj();
        if(objToUpdate === null) return;

        var fetchRes;
        if(type === 'PUT'){
            fetchRes = await db.putEvent(editingEventID, objToUpdate);
        } else if (type === 'POST'){
            fetchRes = await db.postEvent(objToUpdate);
        }

        // if it's a put, delete from quad_events by event ID first
        // then for both, post to quad_events
        
        if(fetchRes){
            const newEventID = typeof fetchRes !== 'boolean' ? fetchRes : editingEventID;
            if(type === 'PUT'){
                await db.deleteQuadEvent(editingEventID);
            }

            var affiliatedQuads;
            if(!isInterquad){
                affiliatedQuads = [String(addEventValues['affiliatedQuad'][0]).replace(' ', '%20')];
            } else {
                affiliatedQuads = ['raven', 'cardinal', 'eagle', 'robin', 'blue%20jay', 'owl', 'dove'];
            }

            for(const quad of affiliatedQuads){
                await db.postQuadEvent(quad, newEventID);
            }
            
            const newDetailedEventObj = await db.getEvent(newEventID);
            updateDetailedEvent(newDetailedEventObj);
            setEditingEventID(null);
            setIsAddEventOn(false);
            setIsInterquad(false);
            setAddEventValues(emptyAddEventValues);
            
            await fetchEvents();
        }
    }

    async function deleteEvent(eventID){
        await db.deleteEvent(eventID);
        setDetailedEvent({ id: null });
        await fetchEvents();
    }

    const [ editingEventID, setEditingEventID ] = useState(null);

    async function editEvent(eventObj){
        setEditingEventID(eventObj.id);
        const affilQuads = await db.getAffiliatedQuadsByEvent(eventObj.id);
        if(affilQuads.length > 1) setIsInterquad(true);

        const newValues = {
            title: [eventObj.title, false],
            date_M: [eventObj.date.substring(0, 2), false],
            date_D: [eventObj.date.substring(2, 4), false],
            date_Y: [eventObj.date.substring(4), false],
            end_date_M: [eventObj.end_date.substring(0, 2), false],
            end_date_D: [eventObj.end_date.substring(2, 4), false],
            end_date_Y: [eventObj.end_date.substring(4), false],
            time_H: [eventObj.time.substring(0, 2), false],
            time_M: [eventObj.time.substring(2), false],
            end_time_H: [eventObj.end_time.substring(0, 2), false],
            end_time_M: [eventObj.end_time.substring(2), false],
            description: [eventObj.description ?? '', false],
            location: [eventObj.location ?? '', false],
            tags: [(eventObj.tags ?? []).join(', '), false],
            affiliatedQuad: [affilQuads.length === 1 ? affilQuads[0].name : '', false],
        };
        setAddEventValues(newValues);
        setIsAddEventOn(true);
        await fetchEvents();
    }

    const emptyDetailedUserObj = { net_id: null };
    const [ detailedUserObj, setDetailedUserObj ] = useState(emptyDetailedUserObj);
    const [ detailedUserProfilePic, setDetailedUserProfilePic ] = useState(null);


    return (
        <div className='events-page'>
            {isAdmin ? 
                <div className='admin-main-container'>
                    <div className={'background' + (isAddEventOn ? ' active' : '')} onClick={() => {
                        setIsAddEventOn(false);
                        setIsInterquad(false);
                        setAddEventValues(emptyAddEventValues);
                    }}/>
                    <div className='admin-container'>
                        <div className={'title-container' + (isAddEventOn ? ' active' : '')}>
                            <FaPlusCircle className='admin-icon' onClick={() => setIsAddEventOn(true)}/>
                            <p>Add Events</p>
                        </div>
                        {isAddEventOn ? 
                            <div className='body-container'>
                                <div className='column-1'>
                                    <p className='subheader'>Title</p>
                                    <InputBox placeholder={'Event title'} value={addEventValues['title'][0] ?? ''} error={addEventValues['title'][1] ? 'Invalid' : ''} width='18rem' onChange={val => updateAddEventValues('title', val)}/>
                                                                        
                                    <p className='subheader'>Location</p>
                                    <InputBox placeholder={'e.g. BC Plaza'} value={addEventValues['location'][0] ?? ''} error={addEventValues['location'][1] ? 'Invalid' : ''} width='18rem' onChange={val => updateAddEventValues('location', val)}/>

                                    <p className='subheader'>Tags</p>
                                    <InputBox placeholder={'e.g. social, sports, etc.'} value={addEventValues['tags'][0] ?? ''} error={addEventValues['tags'][1] ? 'Invalid' : ''} width='18rem' onChange={val => updateAddEventValues('tags', val)}/>
                                
                                    <p className='subheader'>Quad Preference</p>
                                    <div className='checkbox'>
                                        <div className={'icon-container' + (isInterquad ? ' active' : '')} onClick={() => setIsInterquad(!isInterquad)}>
                                            {isInterquad ? <IoMdCheckmarkCircle className='icon active'/> : <IoMdCloseCircle className='icon'/>}
                                        </div>
                                        <p>Make event school-wide</p>
                                    </div>

                                    {!isInterquad ?
                                    <>
                                        <p className='subheader'>Afilliated Quad</p>
                                        <InputBox placeholder={'e.g. Cardinal'} value={addEventValues['affiliatedQuad'][0] ?? ''} error={addEventValues['affiliatedQuad'][1] ? 'Invalid quad name' : ''} width='18rem' onChange={val => updateAddEventValues('affiliatedQuad', val)}/>
                                    </>
                                    : '' }
                                </div>
                                
                                <div className='column-2'>
                                    <div className='inputs-container sub'>
                                        <p className='subheader'>Start Time, Military</p>
                                        <p className='subheader'>Start Date</p>
                                    </div>
                                    
                                    <div className='inputs-container'>
                                        <InputBox placeholder={'HH'} value={addEventValues['time_H'][0] ?? ''} isNumeric={true} limit={2} error={addEventValues['time_H'][1] ? 'Invalid' : ''} width='4rem' onChange={val => updateAddEventValues('time_H', val)}/>
                                        <InputBox placeholder={'MM'} value={addEventValues['time_M'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['time_M'][1] ? 'Invalid' : ''} width='4rem' onChange={val => updateAddEventValues('time_M', val)}/>
                                        <div className='spacer'/>
                                        <InputBox placeholder={'MM'} value={addEventValues['date_M'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['date_M'][1] ? 'Invalid' : ''} width='5rem' onChange={val => updateAddEventValues('date_M', val)}/>
                                        <InputBox placeholder={'DD'} value={addEventValues['date_D'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['date_D'][1] ? 'Invalid' : ''} width='5rem' onChange={val => updateAddEventValues('date_D', val)}/>
                                        <InputBox placeholder={'YYYY'} value={addEventValues['date_Y'][0] ?? ''} isNumeric={true} limit={4}  error={addEventValues['date_Y'][1] ? 'Invalid' : ''} width='6rem' onChange={val => updateAddEventValues('date_Y', val)}/>
                                    </div>

                                    <div className='inputs-container sub'>
                                        <p className='subheader'>End Time, Military</p>
                                        <p className='subheader'>End Date</p>
                                    </div>
                                    <div className='inputs-container'>
                                        <InputBox placeholder={'HH'} value={addEventValues['end_time_H'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['end_time_H'][1] ? 'Invalid' : ''} width='4rem' onChange={val => updateAddEventValues('end_time_H', val)}/>
                                        <InputBox placeholder={'MM'} value={addEventValues['end_time_M'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['end_time_M'][1] ? 'Invalid' : ''} width='4rem' onChange={val => updateAddEventValues('end_time_M', val)}/>
                                        <div className='spacer'/>
                                        <InputBox placeholder={'MM'} value={addEventValues['end_date_M'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['end_date_M'][1] ? 'Invalid' : ''} width='5rem' onChange={val => updateAddEventValues('end_date_M', val)}/>
                                        <InputBox placeholder={'DD'} value={addEventValues['end_date_D'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['end_date_D'][1] ? 'Invalid' : ''} width='5rem' onChange={val => updateAddEventValues('end_date_D', val)}/>
                                        <InputBox placeholder={'YYYY'} value={addEventValues['end_date_Y'][0] ?? ''} isNumeric={true} limit={4}  error={addEventValues['end_date_Y'][1] ? 'Invalid' : ''} width='6rem' onChange={val => updateAddEventValues('end_date_Y', val)}/>
                                    </div>

                                    <p className='subheader'>Description</p>
                                    {addEventValues.description[1] ? <p className='error-display'>* Required</p> : ''}
                                    <div className='textarea-container'>
                                        <textarea id='event-desc-textarea' placeholder='Write description...' value={addEventValues['description'][0] ?? ''} onChange={e => {
                                            if(e.target.value.length <= 1000){
                                                updateAddEventValues('description', e.target.value);
                                            }
                                        }}/>
                                        <p className='char-count-indicator'>{String(addEventValues['description'][0] ?? '').length}/1000</p>
                                    </div>
                                </div>

                                <div className='btns-container'>
                                    <IoMdCheckmarkCircle className='btn apply' onClick={() => {
                                        if(editingEventID === null){
                                            updateEvent('POST');
                                        } else {
                                            updateEvent('PUT');
                                        }
                                    }}/>
                                    <IoMdCloseCircle className='btn cancel' onClick={() => {
                                        setIsAddEventOn(false);
                                        setIsInterquad(false);
                                        setAddEventValues(emptyAddEventValues);
                                    }}/>
                                </div>
                            </div>
                        : ''}
                    </div>
                </div>
            : ''}

            <div className='events-container'>
                <div className='title-container'>
                    <h1>QUAD EVENTS<p>{renderedEvents.length}</p></h1>
                </div>

                <div className='filter-container'>
                    <SearchField placeholder='Search for events by title' onChange={filterTitle}/>
                    <div className='time-container'>
                        <div className={'icon-container' + (showPastEvents ? ' active' : '')} onClick={() => setShowPastEvents(!showPastEvents)}>
                            {showPastEvents ? <IoMdCheckmarkCircle className='icon active'/> : <IoMdCloseCircle className='icon'/>}
                        </div>
                        <p>Include past events</p>
                    </div>
                </div>

                {favoritedEventIDs !== null ? 
                    <div className='list-container'>
                        <ScrollViewport rowHeight={266}>
                            {renderedEvents.map((eventObj) => 
                                <EventTag 
                                    key={eventObj.id}
                                    isAdmin={isAdmin}
                                    highlight={eventObj.id === detailedEvent.id}
                                    title={eventObj.title} 
                                    startDate={eventObj.date} 
                                    endDate={eventObj.end_date} 
                                    startTime={eventObj.time} 
                                    endTime={eventObj.end_time} 
                                    location={eventObj.location}
                                    description={eventObj.description} 
                                    initialFavoriteState={favoritedEventIDs.has(eventObj.id) ? true : false}
                                    onClick={() => updateDetailedEvent(eventObj)}
                                    onFavBtnClick={async (isFavorite) => {
                                        if(isFavorite){
                                            await favoriteEvent(eventObj);
                                        } else {
                                            await unfavoriteEvent(eventObj);
                                        }
                                        await updateDetailedEvent(eventObj);
                                    }}
                                    onDelBtnClick={() => deleteEvent(eventObj.id)}
                                    onEditBtnClick={async () => editEvent(eventObj)}
                                />
                            )}
                        </ScrollViewport>
                        { renderedEvents.length < 1 ?
                            <p className='no-events-indicator'>No favorited events found</p>
                        : '' }
                    </div>
                : ''}
            </div>

            <div className='event-details-container'>
                <div className='title-container'>
                    <h1>EVENT DETAILS</h1>
                    {detailedEvent.id !== null ?
                    <div className='show-interest-btn' onClick={() => setShowInterestList(!showInterestList)}>
                        {!showInterestList ? <IoPeopleCircle className='icon active'/> : <IoMdInformationCircle className='icon'/>}
                    </div>
                    : ''}
                </div>

                {detailedEvent.id !== null ?
                <>
                    <div className='details-container'>
                        <h1 className='title'>{detailedEvent.title}</h1>
                        <p className='subheader'>{detailedEvent.subtext}</p>
                        <p className='tags-subheader'><strong>Tags : </strong>{detailedEvent.tags !== null ? capitalize(detailedEvent.tags.join(', ')) : 'None'}</p>
                        <div className='interested-container'>
                            <p className='indicator'>{detailedEvent.members.length}</p>
                            <p>{(detailedEvent.members.length === 1 ? ' member has' : ' members have')} favorited this event</p>
                        </div>
                    </div>
                    
                    <div className='body-container'>
                        {!showInterestList ? 
                            <p className='description'>{detailedEvent.description}</p>
                        : 
                            <div className='roster-container'>
                                {detailedEvent.members.map(userObj => 
                                    <UserTag 
                                        key={userObj.net_id} 
                                        name={capitalize(userObj.first_name + ' ' + userObj.last_name)} 
                                        netID={userObj.net_id} 
                                        quad={userObj.quad}
                                        onClick={async () => {
                                            setDetailedUserObj(userObj);
                                            const imgSrc = await db.getImage(`user_${userObj.net_id}`);
                                            setDetailedUserProfilePic(imgSrc);
                                        }}
                                    />
                                )}
                                {detailedEvent.members.length === 0 ? 
                                    <p className='no-members-indicator'>No interested members</p>
                                : null}
                            </div>
                        }
                    </div>
                </>
                : 
                    <p className='unselected-indicator'>No event selected</p>
                }
            </div>

            <div className={'user-details-container' + (detailedUserObj.net_id !== null ? ' active' : '')}>
                <div className={'background' + (detailedUserObj.net_id !== null ? ' active' : '')} onClick={() => {
                    setDetailedUserObj(emptyDetailedUserObj);
                }}/>
                <div className={'user-details-info-container' + (detailedUserObj.net_id !== null ? ' active' : '')}>
                    <div className='user-details-title-container'>
                        <h1>{capitalize(detailedUserObj['first_name'] + ' ' + detailedUserObj['last_name'])}</h1>
                    </div>
                    <img className='profile-pic' src={detailedUserProfilePic} alt='profile' onError={(e) => e.target.src=defaultImgSrc}/>
                    <div className='info-box isBio'>
                        <p>'{detailedUserObj['bio'] ?? 'No bio found'}'</p>
                    </div>
                    <div className='info-box'>
                        <p className='title'>ABOUT</p>
                        <p><strong>Net ID :</strong> {detailedUserObj.net_id}</p>
                        <p><strong>Quad Affiliation :</strong> {capitalize(detailedUserObj['quad'] ?? '?')}</p>
                        <p><strong>Birthday :</strong> {detailedUserObj['bday_cal'] ? convertDate(detailedUserObj['birthday']) : 'Private'}</p>
                        <p><strong>Year :</strong> {detailedUserObj['year'] ?? '?'}</p>
                        <p><strong>Degree Program :</strong> {capitalize(detailedUserObj['degree'] ?? '?')}</p>
                    </div>

                    <div className='info-box'>
                        <p className='title'>CONTACT</p>
                        <p><strong>Instagram :</strong> {detailedUserObj['insta'] && detailedUserObj['insta'][0] !== '@' ? '@' : ''}{detailedUserObj['insta'] ?? '?'}</p>
                        <p><strong>Hometown :</strong> {detailedUserObj['hometown'] ?? '?'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Events
