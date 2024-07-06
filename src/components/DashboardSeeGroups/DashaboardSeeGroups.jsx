import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './DashboardSeeGroups.scss';

function DashboardSeeGroups({ URL, API_KEY, contestantId }) {
    const [groupedContestants, setGroupedContestants] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get(`${URL}/contestant-groups`, {
                    headers: { Authorization: `${API_KEY}` }
                });
                setGroupedContestants(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching groups data: ", error);
                setError("Failed to load groups data");
                setLoading(false);
            }
        };

        fetchGroups();
    }, [URL, API_KEY]);

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
                    pdf.save("contestant_group_standing.pdf");
                })
                .catch((error) => {
                    console.error('Error generating PDF:', error);
                });
        } else {
            console.error('Error: PDF content element not found.');
        }
    };

    // Find the group of the current contestant
    const contestantGroup = groupedContestants.find(group =>
        group.some(contestant => contestant.id === contestantId)
    );

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="contestant-group-standing">
            <h1>Your Group Standing</h1>
            {contestantGroup ? (
                <div id="pdf-content">
                    <div className="contestant-group__card">
                        <h2>Your Group</h2>
                        <ul>
                            {contestantGroup.map((contestant) => (
                                <div className='contestant-group__card-content' key={contestant.id}>
                                    <li>
                                        <p>{contestant.name}</p>
                                        <p>Votes: {contestant.votes}</p>
                                        <p>Round: {contestant.round}</p>
                                        <p>{contestant.announce}</p>
                                    </li>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <button onClick={generatePDF}>Save to PDF</button>
                </div>
            ) : (
                <p>You are not assigned to any group yet.</p>
            )}
            {error && <p className="contestant-group__error">{error}</p>}
        </div>
    );
}

export default DashboardSeeGroups;
