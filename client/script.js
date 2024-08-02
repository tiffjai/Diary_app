document.addEventListener('DOMContentLoaded', () => {
    const entryForm = document.getElementById('entry-form');
    const viewEntriesButton = document.getElementById('view-entries-button');
    const searchForm = document.getElementById('search-form');
    const updateForm = document.getElementById('update-form');
    const deleteForm = document.getElementById('delete-form');
    const entriesList = document.getElementById('entries-list');
    const alerts = document.getElementById('alerts');

    // Create entry
    entryForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(entryForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/entries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                showAlert('Entry created successfully!', 'success');
                entryForm.reset(); // Clear the form after submission
            } else {
                showAlert('Failed to create entry.', 'error');
            }
        } catch (error) {
            showAlert('An error occurred.', 'error');
        }
    });

    // View entries
    viewEntriesButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/entries');
            if (response.ok) {
                const entries = await response.json();
                displayEntries(entries);
            } else {
                showAlert('Failed to fetch entries.', 'error');
            }
        } catch (error) {
            showAlert('An error occurred.', 'error');
        }
    });

    // Search entries
    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(searchForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/entries/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const entries = await response.json();
                displayEntries(entries);
            } else {
                showAlert('Failed to search entries.', 'error');
            }
        } catch (error) {
            showAlert('An error occurred.', 'error');
        }
    });

    // Update entry
    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(updateForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/api/entries/${data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: data.text })
            });
            if (response.ok) {
                showAlert('Entry updated successfully!', 'success');
                updateForm.reset(); // Clear the form after update
            } else {
                showAlert('Failed to update entry.', 'error');
            }
        } catch (error) {
            showAlert('An error occurred.', 'error');
        }
    });

    // Delete entry
    deleteForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(deleteForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`/api/entries/${data.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                showAlert('Entry deleted successfully!', 'success');
                deleteForm.reset(); // Clear the form after deletion
            } else {
                showAlert('Failed to delete entry.', 'error');
            }
        } catch (error) {
            showAlert('An error occurred.', 'error');
        }
    });

    // Display entries
    function displayEntries(entries) {
        entriesList.innerHTML = ''; // Clear existing entries
        entries.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `ID: ${entry.id}, Date: ${entry.date}, Category: ${entry.category}, Text: ${entry.text}`;
            entriesList.appendChild(li);
        });
    }

    // Show alerts
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = message;
        alerts.innerHTML = ''; // Clear previous alerts
        alerts.appendChild(alert);
        setTimeout(() => {
            alerts.innerHTML = ''; // Remove alert after a while
        }, 3000);
    }
});

