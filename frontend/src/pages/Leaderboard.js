import React from 'react'
import '../stylesheets/LeaderboardPage.scss'
import QuadTag from './QuadTag';
import { useState, useEffect } from 'react';
import * as db from '../helpers/Database';
import ScrollViewport from 'react-scroll-viewport';
import { capitalize } from '../helpers/Helpers';


const Leaderboard = () => {
    const [ quadObjs, setQuadObjs ] = useState([]);
    const [ detailedQuad, setDetailedQuad ] = useState(null);
    const [ quadAdmins, setQuadAdmins ] = useState([]);

    async function updateDetailedQuad(quadObj){
        console.log(quadObj.name.replace(/ /g, '%20'));
        const adminData = await db.getAdminsByQuad(quadObj.name.replace(/ /g, '%20'));
        if(adminData === null){
            setQuadAdmins(['None found']);
        }
        else {
            const adminArr = [];
            for(let i = 0; i < adminData.length; i++){
                adminArr.push(`${capitalize(`${adminData[i].first_name} ${adminData[i].last_name}`)} (${adminData[i].net_id})`);
            }
            setQuadAdmins(adminArr);
        }
        setDetailedQuad(quadObj);
    }

    async function fetchQuads(){
        const data = await db.getAllQuads();
        if(data.length > 0){
            data.sort(function (a, b){
                return b.points - a.points;
            });
            await updateDetailedQuad(data[0]);
            setQuadObjs(data);
        }
    }

    useEffect(() => {
        fetchQuads();
    }, []);

    return (
        <div className='leaderboards-page'>
            {quadObjs.length > 0 ?
            <>
                <div className='leaderboard-container'>
                    <div className='title-container'>
                        <h1 className='title'>LEADERBOARD</h1>
                    </div>
                    <div className='list-container'>
                        <ScrollViewport rowHeight={116}>
                            {quadObjs.map((quadObj, index) => 
                                <QuadTag 
                                    key={quadObj.name}
                                    highlight={quadObj.name === detailedQuad.name}
                                    rank={index + 1}
                                    name={quadObj.name + 'S'}
                                    dorms={quadObj.dorms}
                                    num_students={quadObj.num_students}
                                    points={quadObj.points}
                                    onClick={async () => updateDetailedQuad(quadObj)}
                                />
                            )}
                        </ScrollViewport>
                    </div>
                </div>
                
                <div className='quad-details-container'>
                    <div className='title-container'>
                        <h1 className='title'>QUAD DETAILS</h1>
                    </div>
                    <div className="body-container">
                        <div className="title-container">
                            <h1>{detailedQuad.name.toUpperCase()}</h1>
                            <p className='dorm-desc'><span className='subheader'>Affiliated dorms :</span> {detailedQuad.dorms.join(', ')}</p>
                            <p><span className='subheader'>Members :</span> {detailedQuad.num_students ?? 0}</p>
                            <p><span className='subheader'>Quad admins :</span> {quadAdmins.join(', ')}</p>
                        </div>
                    </div>
                </div>
            </>
            : null}
        </div>
    )
}

export default Leaderboard
