import React from 'react'
import '../stylesheets/EventPage.scss'
import { useState, useEffect } from 'react'
import SearchField from './SearchField'
import EventTag from './EventTag'
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io'

const Events = ({ netID }) => {
    const [ allEvents, setAllEvents ] = useState([]);
    const [ favoritedEventIDs, setFavoritedEventIDs ] = useState(null);
    const [ renderedEvents, setRenderedEvents ] = useState([]);
    const [ showPastEvents, setShowPastEvents ] = useState(false);

    async function fetchEvents() {
        let eventsResponse = await fetch('http://localhost:3001/events');
        let eventsData = await eventsResponse.json();
        setAllEvents(eventsData);

        eventsResponse = await fetch('http://localhost:3001/events/favoriteByUser/?id=' + netID);
        eventsData = await eventsResponse.json();

        const idSet = new Set();
        eventsData.forEach(eventObj => {
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

    const handleFavorite = (state, eventID) => {
        if(state){
            favoriteEvent(eventID);
        } else {
            unfavoriteEvent(eventID);
        }
    }

    async function favoriteEvent(eventID){

    }

    async function unfavoriteEvent(eventID) {
        await fetch('http://localhost:3001/events/favoriteForUser/?net_id=' + netID + '&event_id=' + eventID, 
            { 
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: null
            } 
        );
        fetchEvents();
    }

    return (
        <div className='events-page'>
            <div className='events-container'>
                <div className='title-container'>
                    <h1>EVENTS<p>{renderedEvents.length}</p></h1>
                </div>
                <div className='filter-container'>
                    <SearchField placeholder='Search for events by title' onChange={filterTitle}/>
                    <div className="time-container">
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
                                    title={eventObj.title} 
                                    startDate={eventObj.date} 
                                    endDate={eventObj.end_date} 
                                    startTime={eventObj.time} 
                                    endTime={eventObj.end_time} 
                                    location={eventObj.location}
                                    description={eventObj.description} 
                                    initialFavoriteState={favoritedEventIDs.has(eventObj.id) ? true : false}
                                    onBtnClick={(e) => handleFavorite(e, eventObj.id)}
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
        </div>
    )
}

export default Events
