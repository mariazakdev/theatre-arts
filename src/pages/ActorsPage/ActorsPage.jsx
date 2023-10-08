import React from 'react';
import './ActorsPage.scss';

// Mock data
const videoData = [
    { id: 1, user: 'Alice', name: 'My First Video', description: 'Just testing the waters', url: 'http://example.com/1' },
    { id: 2, user: 'Bob', name: 'Travel Vlog', description: 'Visit to the mountains', url: 'http://example.com/2' },
    { id: 3, user: 'Charlie', name: 'Cooking 101', description: 'Making spaghetti', url: 'http://example.com/3' },
    // ... add as many as you like
];

function ActorsPage() {
    return (
        <div className="video-list-container">
            <h1>Users and their Videos</h1>
            <ul>
                {videoData.map(video => (
                    <li key={video.id} className="video-item">
                        <h2>{video.user}</h2>
                        <p><strong>Title:</strong> {video.name}</p>
                        <p><strong>Description:</strong> {video.description}</p>
                        <p><strong>URL:</strong> <a href={video.url} target="_blank" rel="noopener noreferrer">{video.url}</a></p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ActorsPage;
