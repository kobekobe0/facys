import logo from '../assets/logo.png';

const printStudentDetailsWithLogs = (student, logs, startDate = '', endDate = '', reportedBy) => {
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
.student-profile {
    margin-bottom: 20px;
}

.student-profile h2 {
    font-size: 20px;
    margin: 10px 0 20px 0;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* Three columns */
    grid-auto-rows: min-content; /* Dynamic row height */
    gap: 10px 20px; /* Adjust spacing between items */
}

.details-grid p {
    font-size: 14px; /* Regular font size for details */
    margin: 0; /* Remove default margin */
}

.details-grid .label {
    font-size: 12px; /* Smaller font size for labels */
    font-weight: bold; /* Bold to distinguish labels */
    color: #555; /* Slightly dim color for labels */
    display: block;
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
                    <div class="header">
                <h3>S &nbsp; T &nbsp; U &nbsp; D &nbsp; E &nbsp; N &nbsp; T &nbsp; &nbsp; R &nbsp; E &nbsp; P &nbsp; O &nbsp; R &nbsp; T</h3>
                </div>
<div class="student-profile">

    <div class="details-grid">
        <p><span class="label">Name:</span> ${student?.name || 'N/A'}</p>
        <p><span class="label">Student Number:</span> ${student?.studentNumber || 'N/A'}</p>
        <p><span class="label">Academic Year:</span> ${student?.SY || 'Unavailable'}</p>
        <p><span class="label">Section:</span> ${student?.section || 'No Section'}</p>
        <p><span class="label">Department:</span> ${student?.department || 'No Department'}</p>
        <p><span class="label">Email:</span> ${student?.email || 'No Email'}</p>
    </div>
</div>


                <hr>
                <h4>${dateRange}</h4>
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
                <div style="margin-top: 50px; font-size: 12px;">
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

export default printStudentDetailsWithLogs;
