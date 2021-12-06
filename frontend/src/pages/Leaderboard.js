import React from 'react'
import '../stylesheets/LeaderboardPage.scss'
import QuadTag from './QuadTag'
import { useState, useEffect } from 'react'
import * as db from '../helpers/Database'
import ScrollViewport from 'react-scroll-viewport'
import { capitalize } from '../helpers/Helpers'


const Leaderboard = () => {
    const [ quadObjs, setQuadObjs ] = useState([]);
    const [ detailedQuad, setDetailedQuad ] = useState(null);
    const [ quadAdmins, setQuadAdmins ] = useState([]);
    const [ historyObjs, setHistoryObjs ] = useState([]);
    

    async function updateDetailedQuad(quadObj){
        const quadName = quadObj.name.replace(/ /g, '%20');
        const adminData = await db.getAdminsByQuad(quadName);
        const historyData = await db.getPointsByQuad(quadName);
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
        setHistoryObjs(historyData.reverse());
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                    name={quadObj.name}
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
                    <div className='body-container'>
                        <div className='title-container'>
                            <h1>{detailedQuad.name.toUpperCase()} <span>&nbsp;{detailedQuad.points ?? 0} total points</span></h1>
                            <p className='dorm-desc'><span className='subheader'>Affiliated dorms :</span> {detailedQuad.dorms.join(', ')}</p>
                            <p><span className='subheader'>Members :</span> {detailedQuad.num_students ?? 0}</p>
                            <p><span className='subheader'>Quad admins :</span> {quadAdmins.join(', ')}</p>
                        </div>
                        <div className="history-container-title">
                            <h1>Point History</h1>
                        </div>
                        <div className='history-container'>
                            {historyObjs.map(historyObj => 
                                <div className="history-tag-container" key={historyObj.id}>
                                    <p><span className='point-value'>{'+' + historyObj.point_value + ' points'}</span> by <span className='subheader'>{`${capitalize(historyObj.first_name + ' ' + historyObj.last_name)} (${historyObj.net_id})`}</span> on {`${historyObj.date.substring(0, 2)}/${historyObj.date.substring(2, 4)}/${historyObj.date.substring(4)}`}</p>
                                    <p>{historyObj.reason[0].toUpperCase() + historyObj.reason.substring(1)}</p>
                                </div>
                            )}       
                            {historyObjs.length === 0 ?
                                <p className='no-point-indicator'>No points awarded</p>
                            : null}           
                        </div>
                    </div>
                </div>
            </>
            : null}
        </div>
    )
}

export default Leaderboard
