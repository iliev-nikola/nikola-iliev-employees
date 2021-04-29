const utils = (function () {
    function getById(id) {
        return document.getElementById(id);
    }

    function createEl(type, content, className) {
        const el = document.createElement(type);
        if (content) {
            el.innerHTML = content;
        }

        if (className) {
            el.className = className;
        }

        return el;
    }

    function render(bestResults) {
        if (!bestResults.length) {
            NO_RESULTS.style.display = 'block';
            return;
        }

        TABLE.innerHTML = '';
        const tr = createEl('tr', null, 'row');
        const emp1IdHead = createEl('th', 'Employee ID #1', 'cell');
        const emp2IdHead = createEl('th', 'Employee ID #2', 'cell');
        const projectIdHead = createEl('th', 'Project ID', 'cell');
        const daysHead = createEl('th', 'Working days', 'cell');
        tr.append(emp1IdHead, emp2IdHead, projectIdHead, daysHead);
        TABLE.append(tr);

        bestResults.forEach(result => {
            console.log(result);
            const newRow = createEl('tr', null, 'row');
            const emp1Id = createEl('td', result.emp1Id, 'cell');
            const emp2Id = createEl('td', result.emp2Id, 'cell');
            const projectId = createEl('td', result.projectId, 'cell');
            const days = createEl('td', result.days, 'cell');
            newRow.append(emp1Id, emp2Id, projectId, days);
            TABLE.append(newRow);
        });

        TABLE.style.display = 'block';
        SORT_BY.style.display = 'block';
    }

    function sortBy() {
        let partners = empModel.bestPartnersProjects();
        const value = SORT_BY.value;
        if (value === 'projectId') {
            partners = partners.sort((a, b) => a.projectId - b.projectId);
        } else {
            partners = partners.sort((a, b) => b.days - a.days);
        }

        render(partners);
    }

    return {
        getById,
        render,
        sortBy
    }
})();