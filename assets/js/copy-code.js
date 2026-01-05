// Copy code button for Jekyll
document.addEventListener('DOMContentLoaded', function() {
  var codeBlocks = document.querySelectorAll('div.highlighter-rouge, div.highlight, pre.highlight');

  codeBlocks.forEach(function(codeBlock) {
    // Check if it already has a button (to prevent duplicates if script runs twice)
    if (codeBlock.querySelector('.copy-code-button')) {
      return;
    }

    var button = document.createElement('button');
    button.className = 'copy-code-button';
    button.type = 'button';
    button.innerText = 'Copy';
    button.setAttribute('aria-label', 'Copy code to clipboard');

    // Add button to the code block
    // We need to ensure the code block has relative positioning for absolute positioning of the button
    codeBlock.style.position = 'relative';
    codeBlock.appendChild(button);

    button.addEventListener('click', function() {
      var code = codeBlock.querySelector('code').innerText;
      
      // Remove the last newline if present (optional, but often desired)
      // code = code.replace(/\n$/, '');

      navigator.clipboard.writeText(code).then(function() {
        button.innerText = 'Copied!';
        button.classList.add('copied');
        
        setTimeout(function() {
          button.innerText = 'Copy';
          button.classList.remove('copied');
        }, 2000);
      }).catch(function(err) {
        console.error('Failed to copy: ', err);
        button.innerText = 'Error';
      });
    });
  });
});
