import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import useTopThree from '../../hooks/useTopThree';
import './AdminVotingStanding.scss';

function AdminVotingStandings() {
    const { groupedContestants, topThreeMessages, totalContestants } = useTopThree();

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
            <p>Total Groups: {groupedContestants.length}</p>
            <p>Total Contestants: {totalContestants}</p>


            <button onClick={generatePDF}>Save to PDF</button>
            <div id="pdf-content">
                {groupedContestants.map((group, index) => (
                    <div className="admin-actor__card" key={index}>
                        <h2>Group {index + 1}</h2>
                        <ul>
                            {group.map((contestant, idx) => (
                                <div className='admin-actor__card-content' key={contestant.id}>
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
                ))}
            </div>
        </div>
    );
}

export default AdminVotingStandings;
