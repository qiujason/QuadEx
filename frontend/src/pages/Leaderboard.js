import React from 'react'
import '../stylesheets/LeaderboardPage.scss'
import QuadTag from './QuadTag';
import { useState, useEffect } from 'react';
import * as db from '../helpers/Database';
import ScrollViewport from 'react-scroll-viewport';


const Leaderboard = () => {
    const [ quadObjs, setQuadObjs ] = useState([]);

    async function fetchQuads(){
        const data = await db.getAllQuads();
        if(data.length > 0){
            data.sort(function (a, b){
                return b.points - a.points;
            });
            setQuadObjs(data);
        }
    }

    useEffect(() => {
        fetchQuads();
    }, []);

    return (
        <div className='leaderboards-page'>
            <div className='leaderboard-container'>
                <div className='title-container'>
                    <h1 className='title'>LEADERBOARD</h1>
                </div>
                <div className='list-container'>
                    <ScrollViewport rowHeight={116}>
                        {quadObjs.map((quadObj, index) => 
                            <QuadTag 
                                key={quadObj.name}
                                rank={index + 1}
                                name={quadObj.name}
                                dorms={quadObj.dorms}
                                num_students={quadObj.num_students}
                                points={quadObj.points}
                            />
                        )}
                    </ScrollViewport>
                </div>
            </div>
            <div className='quad-details-container'>
                <div className='title-container'>
                    <h1 className='title'>QUAD DETAILS</h1>
                </div>

            </div>
        </div>
    )
}

export default Leaderboard
