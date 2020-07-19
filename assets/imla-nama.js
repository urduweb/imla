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

// Inspired by and adapted from showNameDetails() in https://github.com/r12a/shared/blob/gh-pages/code/show_codepoints.js
function showSpellingBox(str) {
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
    title.appendChild(document.createTextNode(str));
    
    closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.appendChild(document.createTextNode('×'));
    closeBtn.onclick = function() { spellingBox.style.display = 'none' }
    
    spellingBoxHeader.appendChild(title);
    spellingBoxHeader.appendChild(closeBtn);
    
    spellingTable = document.createElement('table');
    
    charArray = [...str];
    for (i = 0; i < charArray.length; i++) {
        c = charArray[i];
        dec = c.codePointAt(0);
        hex = dec.toString(16);
        while (hex.length < 4) { hex = '0' + hex };
        hex = hex.toUpperCase();
        
        row = document.createElement('tr');
        charItself = document.createElement('td');
        charUnicodeName = document.createElement('td');
        charUnicodeName.setAttribute('dir', 'ltr');
        charUnicodeName.setAttribute('lang', 'en');
        
        var name, nameNode;
        var label, labelNode;
        
        if (charData[c]) {
            cData = charData[c];
            
            name = 'U+' + hex + ' ' + cData.name;
            nameNode = document.createTextNode(name);
            
            if (cData.label) {
                label = cData.label;
                labelNode =  document.createElement('span');
                labelNode.appendChild(document.createTextNode(label));
                labelNode.className = 'alt-label';
                labelNode.setAttribute('dir', 'ltr');
                labelNode.setAttribute('lang', 'en');
            } else if (cData.type == 'diacritic') {
                label = '\u{25cc}' + c;
                labelNode = document.createElement('span');
                labelNode.appendChild(document.createTextNode(label));
                labelNode.className = 'diacritic';
            } else {
                label = c;
                labelNode = document.createTextNode(label);
            }
        } else {
            name = 'U+' + hex + ' NAME NOT FOUND';
            nameNode = document.createTextNode(name);
            labelNode = document.createTextNode(c);
        }
        
        charItself.appendChild(labelNode);
        charUnicodeName.appendChild(nameNode);
        
        row.appendChild(charItself);
        row.appendChild(charUnicodeName);

        spellingTable.appendChild(row);
    }
    
    spellingBoxBody.appendChild(spellingTable);
}

window.onload = function() {
    initExampleEvents();
}
