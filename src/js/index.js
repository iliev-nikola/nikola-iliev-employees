let employees;

function upload() {
    const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(FILE_INPUT.value.toLowerCase())) {
        if (typeof (FileReader) != 'undefined') {
            const reader = new FileReader();
            reader.onload = function (e) {
                employees = e.target.result.split('\n');
                employees = employees.slice(0, employees.length - 1);
                employees.forEach(el => {
                    el = el.split(',');
                    const dateFrom = new Date(el[2]).getTime();
                    const dateTo = el[3] === 'NULL\r' ? Date.now() : new Date(el[3]).getTime();
                    el = {
                        empId: el[0],
                        projectId: el[1],
                        dateFrom: dateFrom,
                        dateTo: dateTo
                    }
                    console.log(el)
                });
            }

            reader.readAsText(FILE_INPUT.files[0]);
        } else {
            alert('This browser does not support HTML5.');
        }
    } else {
        alert('Please upload a valid CSV file.');
    }

}

function twoEmployees() {
    const output = [];

}


FILE_INPUT.addEventListener('change', upload);
BUTTON.addEventListener('click', (e) => {
    console.log(e.target);
});

// const diff = dateTo - dateFrom;
// const days = Math.floor(diff / (1000 * 60 * 60 * 24));