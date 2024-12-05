import logo from '../assets/logo.png';

const printStudentLogs = (logs, startDate = '', endDate = '', reportedBy) => {
    const systemName = 'BulSU Bustos Facys';

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
                        justify-content: center;
                        width: 100%;
                        margin-bottom: 20px;
                        gap: 10px;
                    }
                    .header h1 {
                        font-size: 24px;
                        margin: 0;
                    }
                    .header p {
                        font-size: 14px;
                        margin: 0;
                    }
                    .date-range {
                        font-size: 18px;
                        color: #555;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 100%;
                        background-color: #f4f4f4;
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
                        <img src="${logo}" alt="Logo" width="50" height="50">
                        <div>
                            <h1>Bulacan State University</h1>
                            <p>${systemName}</p>
                        </div>

                    </div>
                    <div class="date-range">
                        <h4>S &nbsp; T &nbsp; U &nbsp; D &nbsp; E &nbsp; N &nbsp; T  &nbsp; &nbsp; L &nbsp; O &nbsp; G &nbsp; S &nbsp; &nbsp;  R &nbsp; E &nbsp; P &nbsp; O &nbsp; R &nbsp; T</h4>
                        
                    </div>
        
                <hr>
                <p>${dateRange}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student Number</th>
                            <th>Department</th>
                            <th>Section</th>
                            <th>Sex</th>
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
                                <td>${log?.studentID?.sex || 'N/A'}</td>
                                <td>${new Date(log?.timeIn).toLocaleString('en-us', { month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div style="margin-top: 100px; font-size: 12px">
                    <p>Reported By: <u>${reportedBy}</u></p>
                    <p>Generated: ${new Date().toLocaleString('en-us', { month: 'long', day: '2-digit', year: 'numeric' })}</p>
                </div>

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
