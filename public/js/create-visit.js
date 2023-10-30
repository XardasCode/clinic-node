window.onload = async function () {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        await sendRequest();
    });
}

async function sendRequest() {
    const date = document.getElementById('date').value;
    const problem = document.getElementById('problem').value;
    const patientId = document.getElementById('patientId').value;
    const doctorId = document.getElementById('doctorId').value;

    if (!checkDate) {
        alert('Date cannot be in past!');
        return;
    }

    const visit = {
        doctorId: doctorId,
        patientId: patientId,
        date: date,
        problem: problem
    };

    const url = 'http://localhost:3010/api/v1/visits';

    const request = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(visit),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await request.json();

    if (result.error) {
        alert("Oops! Something went wrong! Try again!");
        return;
    }

    alert('Visit created!');
    window.location.href = '/api/v1/visits/my';
};

function checkDate(date) {
    date = new Date(date);
    const today = new Date();
    return date >= today;
}