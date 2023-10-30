window.onload = function () {
    let doneForm = document.getElementById('doneForm');

    doneForm.addEventListener('submit', function (e) {
        console.log('doneForm');
        e.preventDefault();
        doneVisit();
    });
}

async function cancelVisit() {

    let url = window.location.href;
    let visitId = url.substring(url.lastIndexOf('/') + 1);


    let URL = 'http://localhost:3010/api/v1/visits/cancel/' + visitId;

    const response = await fetch(URL, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.json();

    if (response.status === 200) {
        alert('Visit canceled');
        window.location.href = 'http://localhost:3010/api/v1/visits/my';
    } else {
        alert(result.message);
    }
}

async function doneVisit() {

    let url = window.location.href;
    let visitId = url.substring(url.lastIndexOf('/') + 1);

    let URL = 'http://localhost:3010/api/v1/visits/done/' + visitId;

    let treatment = document.getElementById('treatment').value;
    let diagnosis = document.getElementById('diagnosis').value;

    let data = {
        treatment: treatment,
        diagnosis: diagnosis
    }

    await fetch(URL, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status === 200) {
            alert('Visit done');
            window.location.href = 'http://localhost:3010/api/v1/visits/my';
        } else {
            alert('Error');
        }
    });

}

async function updateVisit() {
    let url = window.location.href;
    let visitId = url.substring(url.lastIndexOf('/') + 1);

    let URL = 'http://localhost:3010/api/v1/visits/' + visitId;

    let treatment = document.getElementById('treatment').value;
    let diagnosis = document.getElementById('diagnosis').value;

    let data = {
        treatment: treatment,
        diagnosis: diagnosis
    }

    await fetch(URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status === 200) {
            alert('Visit updated');
            window.location.href = 'http://localhost:3010/api/v1/visits/my';
        } else {
            alert('Error');
        }
    });
}

async function takeInProgressVisit() {
    let url = window.location.href;
    let visitId = url.substring(url.lastIndexOf('/') + 1);
    console.log(visitId);

    let URL = 'http://localhost:3010/api/v1/visits/in-progress/' + visitId;

    await fetch(URL, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status === 200) {
            alert('Visit in progress');
            window.location.href = 'http://localhost:3010/api/v1/visits/my';
        } else {
            alert('Error');
        }
    });
}