function initExampleEvents() {
    var examples = document.querySelectorAll('.example')
    var examplesInList = document.querySelectorAll('.example-list li')
    
    examples.forEach(function(e) {
        e.onclick = function(event) { showSpellingBox(e.innerText) }
    })
    
    examplesInList.forEach(function(e) {
        e.onclick = function(event) { showSpellingBox(e.innerText) }
    })
}

function showSpellingBox(data) {
    console.log(data);
    spellingBox = document.getElementById('spelling-box');
    
    spellingBox.innerHTML = '';
    spellingBox.style.display = 'flex'
    
    spellingBoxHeader = document.createElement('div');
    spellingBoxHeader.className = 'spelling-box-header';
    
    spellingBoxBody = document.createElement('div');
    spellingBoxBody.className = 'spelling-box-body';
    
    spellingBox.appendChild(spellingBoxHeader);
    spellingBox.appendChild(spellingBoxBody);
    
    title = document.createElement('h6');
    title.appendChild(document.createTextNode(data));
    
    closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.appendChild(document.createTextNode('×'));
    closeBtn.onclick = function() { document.getElementById('spelling-box').style.display = 'none' }
    
    spellingBoxHeader.appendChild(title);
    spellingBoxHeader.appendChild(closeBtn);
    
    charTable = document.createElement('table');
    
    charArray = [...data];
    for (c = 0; c < charArray.length; c++) {
        character = charArray[c];
        dec = character.codePointAt(0);
        hex = dec.toString(16);
        while (hex.length < 4) { hex = '0' + hex }
        hex = hex.toUpperCase();
        
        row = document.createElement('tr');
        charItself = document.createElement('td');
        charUnicodeName = document.createElement('td');
        charUnicodeName.setAttribute('dir', 'ltr');
        charUnicodeName.setAttribute('lang', 'en');
        
        charItself.appendChild(document.createTextNode(character));
        charUnicodeName.appendChild(document.createTextNode("U+" + hex));
        
        row.appendChild(charItself);
        row.appendChild(charUnicodeName);
        charTable.appendChild(row);
    }
    
    spellingBoxBody.appendChild(charTable);
}

window.onload = function() {
    initExampleEvents();
}
