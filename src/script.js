// Select the button
const btn = document.querySelector('.btn-toggle');

// Listen for a click on the button
btn.addEventListener('click', function() {
  // Then toggle (add/remove) the .dark-theme class to the body
  document.body.classList.toggle('dark-theme');  
})

const saveToFileBtn = document.querySelector('.btn-save-file');
saveToFileBtn.addEventListener('click', function() {
  // Get all the text items, and map them into a formatted string
  const clipboardItems = Array.from(document.querySelectorAll('.text-truncate')).map(item => item.textContent);

  // Add '++ NEW ITEM ++' after each item, but exclude the last item
  const history = clipboardItems
    .map((text, index) => {
      // Add '++ NEW ITEM ++' only if it's not the last item
      return index === clipboardItems.length - 1 ? text : `${text}\n\n++ NEW ITEM ++`;
    })
    .join('\n\n'); // Join all items with a new line

  // Create a Blob from the history string
  const blob = new Blob([history], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  // Create an anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'clipboard-history.txt'; // Set the default filename for download
  document.body.appendChild(a);
  a.click(); // Programmatically click the anchor to trigger the download
  document.body.removeChild(a); // Remove the anchor after downloading

  // Revoke the Object URL after the download
  URL.revokeObjectURL(url);
});