const empModel = (function () {
    let employees;

    function uploadFile() {
        // read the text file and fill employees array with some employees
        const regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        if (!FILE_INPUT.value) {
            return;
        }

        if (regex.test(FILE_INPUT.value.toLowerCase())) {
            if (typeof (FileReader) != 'undefined') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    employees = e.target.result.split('\n');
                    employees.splice(employees.length - 1, 1);
                    employees = employees.map(el => {
                        el = el.split(',');
                        const dateFrom = new Date(el[2]).getTime();
                        const dateTo = el[3] === 'NULL\r' || !el[3] ? Date.now() : new Date(el[3]).getTime();
                        el = {
                            empId: el[0],
                            projectId: el[1],
                            dateFrom: dateFrom,
                            dateTo: dateTo
                        }

                        return el;
                    });

                    utils.render(bestPartnersProjects());
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
                // check if two workers work in same project and on same period
                const emp2 = employees[j];
                const ifSameProject = emp1.projectId === emp2.projectId;
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
                        employees: +emp1.empId > +emp2.empId ? `${emp2.empId}-${emp1.empId}` : `${emp1.empId}-${emp2.empId}`,
                        projectId: +emp1.projectId
                    }

                    output.push(obj);
                }
            }
        }

        return output;
    }

    function findBestPartners() {
        let partners = findProjectPartners();
        partners = partners.reduce((acc, el) => {
            if (acc[el.employees]) {
                acc[el.employees] += el.days;
            } else {
                acc[el.employees] = el.days;
            }

            return acc;
        }, {});

        // check if most working days are equal in some cases
        const partnersIds = Object.keys(partners).sort((a, b) => partners[b] - partners[a])[0];
        return partnersIds;
    }

    function bestPartnersProjects() {
        let partners = findProjectPartners();
        const partnersIds = findBestPartners();
        partners = partners.filter(el => el.employees === partnersIds);
        partners = partners.map(el => {
            const [emp1Id, emp2Id] = el.employees.split('-').map(Number);
            const projectId = el.projectId;
            const days = el.days;
            return {
                emp1Id,
                emp2Id,
                projectId,
                days
            }
        });

        return partners;
    }

    return {
        uploadFile,
        bestPartnersProjects
    }
})();