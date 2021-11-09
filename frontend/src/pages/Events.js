import React from 'react'
import '../stylesheets/EventPage.scss'
import { useState, useEffect } from 'react'
import SearchField from './SearchField'
import EventTag from './EventTag'
import { IoMdCheckmarkCircle, IoMdCloseCircle } from 'react-icons/io'

const Events = () => {
    const [ allEvents, setAllEvents ] = useState([]);
    const [ renderedEvents, setRenderedEvents ] = useState([]);
    const [ showPastEvents, setShowPastEvents ] = useState(false);

    async function fetchEvents() {
        const net_id = 'dp239';
        let eventsResponse = await fetch('http://localhost:3001/events/favoriteByUser/?id=' + net_id);
        let eventsData = await eventsResponse.json();
        console.log(eventsData);
        setAllEvents(eventsData);
    }

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setRenderedEvents(allEvents);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allEvents]);


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
                                onUnfavorite={() => {}}
                            />
                        )
                    }
                    {
                        renderedEvents.length < 1 ?
                            <p className='no-events-indicator'>No favorited events found</p>
                        : ''
                    }
                </div>
            </div>
        </div>
    )
}

export default Events
