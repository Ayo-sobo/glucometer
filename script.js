document.addEventListener('DOMContentLoaded', () => {
    fetchData();
    setInterval(fetchData, 30000); 

    document.getElementById('refresh-button').addEventListener('click', fetchData); 
});

function fetchData() {
    const requestBody = {
        filter: {},
        orderBy: 'id',
        order: 'DESC',
        pagination: {
            items_per_page: 20,
            page: 0
        }
    };

    fetch('https://nexus.drsavealife.com/glucometer/filter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
        displayData(data.data.list); 
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function displayData(data) {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    data.forEach(item => {
        const readings = JSON.parse(item.readings);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${new Date(item.createdAt).toLocaleString()}</td>
            <td>${new Date(item.updatedAt).toLocaleString()}</td>
            <td>${item.hospital_number}</td>
            <td>${item.deviceID}</td>
            <td>${readings.deviceimei}</td>
            <td>${readings.createtime}</td>
            <td>${readings.nonce || ''}</td>
            <td>${readings.glucose || readings.echostr}</td>
        `;

        tableBody.appendChild(row);
    });
}
