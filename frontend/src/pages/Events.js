import React from 'react'
import '../stylesheets/EventPage.scss'
import { useState, useEffect } from 'react'
import SearchField from './SearchField'
import EventTag from './EventTag'
import UserTag from './UserTag'
import { IoMdCheckmarkCircle, IoMdCloseCircle, IoMdInformationCircle } from 'react-icons/io'
import { IoPeopleCircle } from 'react-icons/io5'
import { convertDate, convertTime, capitalize } from '../helpers/Helpers'
import { FaPlusCircle } from 'react-icons/fa'
import * as db from '../helpers/Database'
import InputBox from '../components/InputBox'

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
        members: [],
    });

    async function fetchEvents() {
        setAllEvents(await db.getEvents());
        const data = await db.getFavEventsByUser(netID);

        const idSet = new Set();
        data.forEach(eventObj => {
            idSet.add(eventObj.id);
        });
        setFavoritedEventIDs(idSet);
    }

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        newObj.members = await db.getFavedUsersByEvent(newObj.id);

        setDetailedEvent(newObj);
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
        quad: ['', false],
    };
    const [ isInterquad, setIsInterquad ] = useState(false);
    const [ addEventValues, setAddEventValues ] = useState(emptyAddEventValues);
    const updateAddEventValues = (key, value) => {
        const prevObj = { ...addEventValues };
        if(!(key in prevObj)) return;
        prevObj[key][typeof value === 'boolean' ? 1 : 0] = value;
        if(typeof value !== 'boolean') prevObj[key][1] = false;
        setAddEventValues(prevObj);
    }

    return (
        <div className='events-page'>
            {isAdmin ? 
                <div className="admin-main-container">
                    <div className={'background' + (isAddEventOn ? ' active' : '')} onClick={() => {
                        setIsAddEventOn(false);
                        //setPointsValues(emptyPointsValues);
                    }}/>
                    <div className="admin-container">
                        <div className={'title-container' + (isAddEventOn ? ' active' : '')}>
                            <FaPlusCircle className='admin-icon' onClick={() => setIsAddEventOn(true)}/>
                            <p>Add Events</p>
                        </div>
                        {isAddEventOn ? 
                            <div className='body-container'>
                                <div className="column-1">
                                    <p className='subheader'>Title</p>
                                    <InputBox placeholder={'Event title'} value={addEventValues['title'][0] ?? ''} error={addEventValues['title'][1] ? 'Invalid' : ''} width='18rem' onChange={val => updateAddEventValues('title', val)}/>
                                    
                                    <p className='subheader'>Start Time &amp; Date</p>
                                    <div className="inputs-container">
                                        <InputBox placeholder={'HH'} isCentered={true} value={addEventValues['time_H'][0] ?? ''} isNumeric={true} limit={2} error={addEventValues['time_H'][1] ? 'Invalid' : ''} width='2.5rem' onChange={val => updateAddEventValues('time_H', val)}/>
                                        <p>:</p>
                                        <InputBox placeholder={'MM'} isCentered={true} value={addEventValues['time_M'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['time_M'][1] ? 'Invalid' : ''} width='2.5rem' onChange={val => updateAddEventValues('time_M', val)}/>
                                        <InputBox placeholder={'MM'} isCentered={true} value={addEventValues['date_M'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['date_M'][1] ? 'Invalid' : ''} width='2.5rem' onChange={val => updateAddEventValues('date_M', val)}/>
                                        <p>/</p>
                                        <InputBox placeholder={'DD'} isCentered={true} value={addEventValues['date_D'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['date_D'][1] ? 'Invalid' : ''} width='2.5rem' onChange={val => updateAddEventValues('date_D', val)}/>
                                        <p>/</p>
                                        <InputBox placeholder={'YYYY'} isCentered={true} value={addEventValues['date_Y'][0] ?? ''} isNumeric={true} limit={4}  error={addEventValues['date_Y'][1] ? 'Invalid' : ''} width='3rem' onChange={val => updateAddEventValues('date_Y', val)}/>
                                    </div>

                                    <p className='subheader'>End Time &amp; Date</p>
                                    <div className="inputs-container">
                                        <InputBox placeholder={'HH'} isCentered={true} value={addEventValues['end_time_H'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['end_time_H'][1] ? 'Invalid' : ''} width='2.5rem' onChange={val => updateAddEventValues('end_time_H', val)}/>
                                        <p>:</p>
                                        <InputBox placeholder={'MM'} isCentered={true} value={addEventValues['end_time_M'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['end_time_M'][1] ? 'Invalid' : ''} width='2.5rem' onChange={val => updateAddEventValues('end_time_M', val)}/>
                                        <InputBox placeholder={'MM'} isCentered={true} value={addEventValues['end_date_M'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['end_date_M'][1] ? 'Invalid' : ''} width='2.5rem' onChange={val => updateAddEventValues('end_date_M', val)}/>
                                        <p>/</p>
                                        <InputBox placeholder={'DD'} isCentered={true} value={addEventValues['end_date_D'][0] ?? ''} isNumeric={true} limit={2}  error={addEventValues['end_date_D'][1] ? 'Invalid' : ''} width='2.5rem' onChange={val => updateAddEventValues('end_date_D', val)}/>
                                        <p>/</p>
                                        <InputBox placeholder={'YYYY'} isCentered={true} value={addEventValues['end_date_Y'][0] ?? ''} isNumeric={true} limit={4}  error={addEventValues['end_date_Y'][1] ? 'Invalid' : ''} width='3rem' onChange={val => updateAddEventValues('end_date_Y', val)}/>
                                    </div>
                                    
                                    <p className='subheader'>Location</p>
                                    <InputBox placeholder={'e.g. BC Plaza'} value={addEventValues['location'][0] ?? ''} error={addEventValues['location'][1] ? 'Invalid' : ''} width='18rem' onChange={val => updateAddEventValues('location', val)}/>

                                    <p className='subheader'>Tags</p>
                                    <InputBox placeholder={'e.g. social, sports, etc.'} value={addEventValues['tags'][0] ?? ''} error={addEventValues['tags'][1] ? 'Invalid' : ''} width='18rem' onChange={val => updateAddEventValues('tags', val)}/>
                                </div>
                                
                                <div className="column-2">
                                    <p className='subheader'>Description</p>
                                    {addEventValues.description[1] ? <p className='error-display'>* Required</p> : ''}
                                    <div className="textarea-container">
                                        <textarea placeholder='Write description...' value={addEventValues['description'][0] ?? ''} onChange={e => {
                                            if(e.target.value.length <= 250){
                                                updateAddEventValues('description', e.target.value);
                                            }
                                        }}/>
                                        <p className='char-count-indicator'>{String(addEventValues['description'][0] ?? '').length}/250</p>
                                    </div>

                                    <p className='subheader'>Quad Preference</p>
                                    <div className="checkbox">
                                        <div className={'icon-container' + (isInterquad ? ' active' : '')} onClick={() => setIsInterquad(!isInterquad)}>
                                            {isInterquad ? <IoMdCheckmarkCircle className='icon active'/> : <IoMdCloseCircle className='icon'/>}
                                        </div>
                                        <p>Make event inter-quad</p>
                                    </div>

                                    {!isInterquad ?
                                    <>
                                        <p className='subheader'>Afilliated Quad</p>
                                        <InputBox placeholder={'e.g. Cardinal'} value={addEventValues['quad'][0] ?? ''} error={addEventValues['quad'][1] ? 'Invalid quad name' : ''} width='18rem' onChange={val => updateAddEventValues('quad', val)}/>
                                    </>
                                    : '' }
                                </div>

                                <div className='btns-container'>
                                    <IoMdCheckmarkCircle className='btn apply' onClick={() => {
                                        //postPoints();
                                    }}/>
                                    <IoMdCloseCircle className='btn cancel' onClick={() => {
                                        //setIsAddEventOn(false);
                                        //setPointsValues(emptyPointsValues);
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
                {/* { title, startDate, endDate, startTime, endTime, location, description, picture } */}
                {favoritedEventIDs !== null ? 
                    <div className='list-container'>
                        {
                            renderedEvents.map((eventObj) => 
                                <EventTag 
                                    key={eventObj.id}
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
                                    onBtnClick={async (isFavorite) => {
                                        if(isFavorite){
                                            await favoriteEvent(eventObj);
                                        } else {
                                            await unfavoriteEvent(eventObj);
                                        }
                                        await updateDetailedEvent(eventObj);
                                    }}
                                />
                            )
                        }
                        {
                            renderedEvents.length < 1 ?
                                <p className='no-events-indicator'>No favorited events found</p>
                            : ''
                        }
                    </div>
                : ''}
            </div>
            <div className='event-details-container'>
                <div className='title-container'>
                    <h1>EVENT DETAILS</h1>
                    <div className={'show-interest-btn' + (showInterestList ? ' active' : '')} onClick={() => setShowInterestList(!showInterestList)}>
                        {showInterestList ? <IoMdInformationCircle className='icon active'/> : <IoPeopleCircle className='icon'/>}
                    </div>
                </div>
                {showInterestList ?
                    <div className='details-container'>
                        <h1 className='title'>{detailedEvent.title}</h1>
                        <p className='subheader'>{detailedEvent.subtext}</p>
                        <p className='description'>{detailedEvent.description}</p>
                    </div>
                :
                    <>
                    <div className="roster-title">
                        <h1>{detailedEvent.members.length}</h1>
                        <p>members have favorited this event</p>
                    </div>
                    <div className='roster-container'>
                        {detailedEvent.members.map(userObj => <UserTag key={userObj.net_id} name={capitalize(userObj.first_name + ' ' + userObj.last_name)} netID={userObj.net_id}/>)}
                    </div>
                    </>
                }
            </div>
        </div>
    )
}

export default Events
