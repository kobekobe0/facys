import logo from '../assets/logo.png';

const printStudentDetailsWithLogs = (student, logs, startDate = '', endDate = '') => {
    const systemName = 'BulSU Bustos Facys';

    const dateRange = startDate || endDate
        ? `Logs Date Range: ${startDate ? startDate : ''}${startDate && endDate ? ' - ' : ''}${endDate ? endDate : ''}`
        : 'Logs';

    const printContent = `
        <html>
            <head>
                <title>Student Profile and Logs</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        color: #333;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        font-size: 24px;
                        margin: 0;
                    }
                    .student-profile {
                        margin-bottom: 20px;
                    }
                    .student-profile h2 {
                        font-size: 20px;
                        margin: 10px 0 5px 0;
                    }
                    .profile-picture {
                        width: 150px;
                        height: 150px;
                        border-radius: 10px;
                        margin-bottom: 10px;
                    }
                    .status {
                        display: inline-block;
                        font-size: 12px;
                        margin-right: 5px;
                        padding: 3px 8px;
                        border-radius: 12px;
                    }
                    .blocked {
                        background-color: #fee2e2;
                        color: #b91c1c;
                    }
                    .up-to-date {
                        background-color: #d1fae5;
                        color: #065f46;
                    }
                    .out-of-date {
                        background-color: #fee2e2;
                        color: #b91c1c;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                        font-size: 12px;
                    }
                    th {
                        background-color: #f4f4f4;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${logo}" alt="Logo" width="75" height="75">
                    <h1>${systemName}</h1>
                </div>
                <div class="student-profile">
                    <h1>Student Details</h1>
                    <h2>${student?.name || 'N/A'}</h2>
                    <p><strong>Student Number:</strong> ${student?.studentNumber || 'N/A'}</p>
                    <p><strong>Academic Year:</strong> ${student?.SY || 'Unavailable'}</p>
                    <p><strong>Section:</strong> ${student?.section || 'No Section'}</p>
                    <p><strong>Department:</strong> ${student?.department || 'No Department'}</p>
                    <p><strong>Email:</strong> ${student?.email || 'No Email'}</p>
                </div>
                <hr>
                <h2>${dateRange}</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Student Number</th>
                            <th>Department</th>
                            <th>Section</th>
                            <th>Date</th>
                            <th>Time In</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${logs.length > 0
                            ? logs.map(log => {
                                const date = new Date(log.timeIn);
                                const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                                const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true });
                                return `
                                    <tr>
                                        <td>${log.studentID?.studentNumber || 'N/A'}</td>
                                        <td>${log.studentID?.department || 'N/A'}</td>
                                        <td>${log.studentID?.section || 'N/A'}</td>
                                        <td>${formattedDate}</td>
                                        <td>${formattedTime}</td>
                                    </tr>
                                `;
                            }).join('')
                            : `
                                <tr>
                                    <td colspan="5" style="text-align: center;">No logs available</td>
                                </tr>
                            `}
                    </tbody>
                </table>
            </body>
        </html>
    `;

    // Open a new window
    const printWindow = window.open('', '_blank');

    // Write content to the new window
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to fully load before printing
    printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
    };
};

export default printStudentDetailsWithLogs;
