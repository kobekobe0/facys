import React from 'react';

// Temporary data for system logs
const logs = [
    {
        _id: '1',
        description: 'Face data updated',
        action: 'UPDATE',
        type: 'Student',
        entityID: '67270eb7f14e4ce4dc4c6e43',
        entityType: 'Student',
        date: '2024-11-03T11:54:28.853+00:00',
    },
    {
        _id: '2',
        description: 'New student record created',
        action: 'CREATE',
        type: 'Student',
        entityID: '67270eb7f14e4ce4dc4c6e44',
        entityType: 'Student',
        date: '2024-11-03T10:23:00.000+00:00',
    },
    {
        _id: '3',
        description: 'Student record deleted',
        action: 'DELETE',
        type: 'Student',
        entityID: '67270eb7f14e4ce4dc4c6e45',
        entityType: 'Student',
        date: '2024-11-03T08:12:00.000+00:00',
    },
];

// Function to get SVG based on action type
const getActionIcon = (action) => {
    switch (action) {
        case 'UPDATE':
            return (
                <svg width="3em" height="3em" fill="#4A90E2" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#E5F1FF" />
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
            );
        case 'CREATE':
            return (
                <svg width="3em" height="3em" fill="#4CAF50" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#E7F9EF" />
                    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
            );
        case 'DELETE':
            return (
                <svg width="3em" height="3em" fill="#F44336" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#FFE7E7" />
                    <path d="M16 9v10H8V9h8m-1.5-6h-5L9 4H5v2h14V4h-4l-1.5-1z"/>
                </svg>
            );
        default:
            return null;
    }
};

const SystemLogs = () => {
    return (
        <div className="flex flex-col p-6 bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-semibold mb-6">System Logs</h2>
            <div className="relative pl-12 border-l-2 border-gray-200">
                {logs.map((log, index) => (
                    <div key={log._id} className="flex items-start mb-6 relative">
                        <div className="absolute -left-12 top-1">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full">
                                {getActionIcon(log.action)}
                            </div>
                        </div>
                        <div className="ml-4 bg-white shadow-sm rounded-lg p-4 w-full">
                            <p className="text-sm text-gray-500 mb-1">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <p className="text-md font-semibold text-gray-800">{log.description}</p>
                            <p className="text-sm text-gray-400">{log.type} - {log.entityType}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SystemLogs;
