let employees;

function upload() {
    // read the text file and fill employees array with some employees
    const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(FILE_INPUT.value.toLowerCase())) {
        if (typeof (FileReader) != 'undefined') {
            const reader = new FileReader();
            reader.onload = function (e) {
                employees = e.target.result.split('\n');
                employees = employees.slice(0, employees.length - 1);
                employees = employees.map(el => {
                    el = el.split(',');
                    const dateFrom = new Date(el[2]).getTime();
                    const dateTo = el[3] === 'NULL\r' ? Date.now() : new Date(el[3]).getTime();
                    el = {
                        empId: el[0],
                        projectId: el[1],
                        dateFrom: dateFrom,
                        dateTo: dateTo
                    }

                    return el;
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

function findProjectPartners() {
    const output = [];

    for (let i = 0; i < employees.length - 1; i++) {
        const emp1 = employees[i];
        for (let j = i + 1; j < employees.length; j++) {
            // check if both workers work in same project and on same period
            const emp2 = employees[j];
            const ifSameProject = employees[i].projectId === employees[j].projectId;
            if (!ifSameProject) {
                continue;
            }
            let diff;
            if (emp2.dateFrom >= emp1.dateFrom && emp2.dateTo <= emp1.dateTo) {
                diff = emp2.dateTo - emp2.dateFrom;
            } else if (emp2.dateFrom >= emp1.dateFrom && emp2.dateFrom < emp1.dateTo && emp2.dateTo >= emp1.dateTo) {
                diff = emp1.dateTo - emp2.dateFrom;
            } else if (emp2.dateFrom <= emp1.dateFrom && emp2.dateTo > emp1.dateFrom && emp2.dateTo <= emp1.dateTo) {
                diff = emp2.dateTo - emp1.dateFrom;
            } else if (emp2.dateFrom <= emp1.dateFrom && emp2.dateTo >= emp1.dateTo) {
                diff = emp1.dateTo - emp1.dateFrom;
            }

            if (diff) {
                const workingDays = Math.floor(diff / (1000 * 60 * 60 * 24));
                const obj = {
                    days: workingDays,
                    emp1: +emp1.empId > +emp2.empId ? +emp2.empId : +emp1.empId,
                    emp2: +emp1.empId < +emp2.empId ? +emp2.empId : +emp1.empId
                }

                output.push(obj);
            }
        }
    }

    return output;
}


FILE_INPUT.addEventListener('change', upload);
BUTTON.addEventListener('click', findTwoEmployees);
