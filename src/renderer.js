const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('clipboard-list');

    // Load clipboard history from localStorage
    let clipboardHistory = JSON.parse(localStorage.getItem('clipboardHistory')) || [];
    updateUI(clipboardHistory);

    ipcRenderer.on('updateClipboard', (_, newItem) => {
        if (newItem && !clipboardHistory.includes(newItem)) { // Avoid duplicates
            clipboardHistory.push(newItem); // Add the new item to history
            localStorage.setItem('clipboardHistory', JSON.stringify(clipboardHistory)); // Save updated history
            updateUI(clipboardHistory); // Update UI after adding
        }
    });
    
    // Function to update UI
    function updateUI(history) {
        const list = document.getElementById('clipboard-list');
        list.innerHTML = ''; // Clear the list
    
        // Loop through the history and add it to the list in reverse order (newest first)
        history.slice().reverse().forEach(text => {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.classList.add('d-flex');
            listItem.classList.add('justify-content-between');
            listItem.classList.add('align-items-center');
    
            // Create a span for the text with truncation
            const textElement = document.createElement('span');
            textElement.classList.add('text-truncate');
            textElement.style.maxWidth = '250px'; // Adjust max-width based on your design
            textElement.style.display = 'inline-block';
            textElement.textContent = text; // Set the clipboard text here
    
            // Add a delete button (optional)
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => {
                // Remove the item from the history when the delete button is clicked
                clipboardHistory = clipboardHistory.filter(item => item !== text);
                localStorage.setItem('clipboardHistory', JSON.stringify(clipboardHistory));
                updateUI(clipboardHistory); // Update UI after removal
            };
    
            // Append the text and delete button to the list item
            listItem.appendChild(textElement);
            listItem.appendChild(deleteButton);
            list.appendChild(listItem);
        });
    }
    
    
});
