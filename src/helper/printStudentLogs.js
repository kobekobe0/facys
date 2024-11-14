import logo from '../assets/logo.png';

const printStudentLogs = (logs, startDate = '', endDate = '') => {
    const systemName = 'Facys';

    const dateRange = startDate || endDate
        ? `Student Logs: ${startDate ? startDate : ''}${startDate && endDate ? ' - ' : ''}${endDate ? endDate : ''}`
        : 'Student Logs';

    const printContent = `
        <html>
            <head>
                <title>Student Logs</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        color: #333;
                    }
                    .header {
                        display: flex;
                        align-items: center;
                        justify-content: start;
                        margin-bottom: 20px;
                        gap: 10px;
                    }
                    .header h1 {
                        font-size: 24px;
                        margin: 0;
                    }
                    .date-range {
                        font-size: 14px;
                        color: #555;
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
                <div class="date-range">
                    ${dateRange}
                </div>
                <hr>
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student Number</th>
                            <th>Department</th>
                            <th>Section</th>
                            <th>Time In</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${logs.map(log => `
                            <tr>
                                <td>${log?.studentID?.name || 'N/A'}</td>
                                <td>${log?.studentID?.studentNumber || 'N/A'}</td>
                                <td>${log?.studentID?.department || 'N/A'}</td>
                                <td>${log?.studentID?.section || 'N/A'}</td>
                                <td>${new Date(log?.timeIn).toLocaleString('en-us', { month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                        `).join('')}
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

export default printStudentLogs;
