document.addEventListener('DOMContentLoaded', function() {
    let entries = []; // This will hold our diary entries
    let editMode = false;

    const form = document.getElementById('entryForm');
    const entriesList = document.getElementById('entriesList');
    const searchInput = document.getElementById('searchInput');
    const entryId = document.getElementById('entryId');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = entryId.value ? parseInt(entryId.value) : Date.now();
        const date = document.getElementById('dateInput').value;
        const text = document.getElementById('textInput').value;
        const category = document.getElementById('categoryInput').value;

        const entryIndex = entries.findIndex(entry => entry.id === id);
        if (entryIndex > -1) {
            entries[entryIndex] = { id, date, text, category };
        } else {
            entries.push({ id, date, text, category });
        }
        resetForm();
        renderEntries();
    });

    searchInput.addEventListener('input', function() {
        renderEntries(this.value.trim());
    });

    function renderEntries(filter = '') {
        entriesList.innerHTML = '';
        entries
            .filter(entry => entry.date.includes(filter) || entry.category.toLowerCase().includes(filter.toLowerCase()))
            .forEach(entry => {
                const item = document.createElement('li');
                item.classList.add('list-group-item');
                item.innerHTML = `
                    <strong>${entry.date}</strong> - ${entry.text} <em>(${entry.category})</em>
                    <button onclick="editEntry(${entry.id})" class="btn btn-sm btn-primary">Edit</button>
                    <button onclick="deleteEntry(${entry.id})" class="btn btn-sm btn-danger">Delete</button>
                `;
                entriesList.appendChild(item);
            });
    }

    window.editEntry = function(id) {
        const entry = entries.find(entry => entry.id === id);
        if (entry) {
            document.getElementById('dateInput').value = entry.date;
            document.getElementById('textInput').value = entry.text;
            document.getElementById('categoryInput').value = entry.category;
            entryId.value = id;
        }
    };

    window.deleteEntry = function(id) {
        entries = entries.filter(entry => entry.id !== id);
        renderEntries();
    };

    function resetForm() {
        document.getElementById('dateInput').value = '';
        document.getElementById('textInput').value = '';
        document.getElementById('categoryInput').value = '';
        entryId.value = '';
    }
});
