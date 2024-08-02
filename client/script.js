document.addEventListener('DOMContentLoaded', () => {
    const entryForm = document.getElementById('entry-form');
    const searchForm = document.getElementById('search-form');
    const entriesList = document.getElementById('entries-list');
    const alerts = document.getElementById('alerts');
    const submitButton = document.getElementById('submit-button');

    let currentEntryId = null;

    // Handle Form Submission for Create, Update, and Delete
    entryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(entryForm);
        const entryData = Object.fromEntries(data.entries());

        if (currentEntryId) {
            // Update Entry
            try {
                const response = await fetch(`/api/entries/${currentEntryId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(entryData),
                });
                if (response.ok) {
                    showAlert('Entry updated successfully!', 'success');
                } else {
                    showAlert('Failed to update entry.', 'error');
                }
            } catch (error) {
                console.error('Error updating entry:', error);
                showAlert('Error updating entry.', 'error');
            }
        } else {
            // Create Entry
            try {
                const response = await fetch('/api/entries', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(entryData),
                });
                if (response.ok) {
                    showAlert('Entry created successfully!', 'success');
                    entryForm.reset();
                } else {
                    showAlert('Failed to create entry.', 'error');
                }
            } catch (error) {
                console.error('Error creating entry:', error);
                showAlert('Error creating entry.', 'error');
            }
        }
    });

    // Handle Search Entries Form Submission
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(searchForm);
        const queryParams = new URLSearchParams(Object.fromEntries(data.entries()));

        try {
            const response = await fetch(`/api/entries?${queryParams}`);
            if (response.ok) {
                const entries = await response.json();
                entriesList.innerHTML = entries.map(entry => `
                    <li>
                        <strong>${new Date(entry.date).toLocaleString()}:</strong>
                        ${entry.text} (${entry.category})
                        <button onclick="editEntry(${entry.id})">Edit</button>
                        <button onclick="deleteEntry(${entry.id})">Delete</button>
                    </li>
                `).join('');
            } else {
                showAlert('Failed to fetch entries.', 'error');
            }
        } catch (error) {
            console.error('Error fetching entries:', error);
            showAlert('Error fetching entries.', 'error');
        }
    });

    // Edit Entry
    window.editEntry = async (id) => {
        try {
            const response = await fetch(`/api/entries/${id}`);
            if (response.ok) {
                const entry = await response.json();
                document.getElementById('entry-id').value = entry.id;
                document.getElementById('date').value = new Date(entry.date).toISOString().slice(0, 16);
                document.getElementById('text').value = entry.text;
                document.getElementById('category').value = entry.category;
                currentEntryId = entry.id;
                submitButton.textContent = 'Update Entry';
            } else {
                showAlert('Failed to fetch entry for editing.', 'error');
            }
        } catch (error) {
            console.error('Error fetching entry:', error);
            showAlert('Error fetching entry for editing.', 'error');
        }
    };

    // Delete Entry
    window.deleteEntry = async (id) => {
        try {
            const response = await fetch(`/api/entries/${id}`, { method: 'DELETE' });
            if (response.ok) {
                showAlert('Entry deleted successfully!', 'success');
                searchForm.dispatchEvent(new Event('submit')); // Refresh list
            } else {
                showAlert('Failed to delete entry.', 'error');
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            showAlert('Error deleting entry.', 'error');
        }
    };

    // Show Alert Message
    function showAlert(message, type) {
        alerts.innerHTML = `<div class="alert ${type}">${message}</div>`;
        setTimeout(() => {
            alerts.innerHTML = '';
        }, 5000);
    }
});

