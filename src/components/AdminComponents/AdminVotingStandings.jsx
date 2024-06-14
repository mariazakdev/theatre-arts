import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './AdminVotingStanding.scss';

const API_KEY = process.env.REACT_APP_API_KEY;

function AdminVotingStandings({URL, API_KEY}) {
    const [contestants, setContestants] = useState([]);
    const [groupedContestants, setGroupedContestants] = useState([]);

    useEffect(() => {
        const fetchContestants = async () => {
            try {
                const response = await axios.get(`${URL}/contestants`, 
                {
                    headers: {
                      Authorization: `${API_KEY}`,
                    },
                  } 
                
                );
                const activeContestants = response.data.filter(contestant => contestant.active === 1);
                const grouped = [];
                for (let i = 0; i < activeContestants.length; i += 10) {
                    const group = activeContestants.slice(i, i + 10);
                    const topThree = group.sort((a, b) => b.votes - a.votes).slice(0, 4);
                    grouped.push(topThree);
                }
                setGroupedContestants(grouped);
            } catch (error) {
                console.error('Error fetching contestants:', error);
            }
        };

        fetchContestants();
    }, []);
    const generatePDF = () => {
        const input = document.getElementById('pdf-content');
        if (input) {
            html2canvas(input)
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF();
                    const imgProps = pdf.getImageProperties(imgData);
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save("contestants_current_standing.pdf");
                })
                .catch((error) => {
                    console.error('Error generating PDF:', error);
                });
        } else {
            console.error('Error: PDF content element not found.');
        }
    };

    return (
<div className="admin-actor-standing">
                <h1>Contestants Standing in Groups</h1>
                <p>Total Groups: {groupedContestants.length}</p> {/* Display the number of groups */}

                <button onClick={generatePDF}>Save to PDF</button>
                <div id="pdf-content">

            {groupedContestants.map((group, index) => (
                <div 
                className="admin-actor__card" 
                key={index}>
                    <h2>Group {index + 1}</h2>
                    <ul>
                        {group.map(contestant => (
                            <div className='admin-actor__card-content' >
                            <li key={contestant.id}>
                                <p>{contestant.name}</p>
                                <p>Votes: {contestant.votes}</p>
                                <p>Round: {contestant.round}</p>
                                {group.indexOf(contestant) === 0 && <h4>This contestant is currently in first place.</h4>}
                                {group.indexOf(contestant) === 1 && <h4>This contestant is currently in second place.</h4>}
                                {group.indexOf(contestant) === 2 && <h4>This contestant is currently in third place.</h4>}
                            </li>
                            </div>
                        ))}
                    </ul>
                </div>
            ))}
        </div></div>
    );
}

export default AdminVotingStandings;
