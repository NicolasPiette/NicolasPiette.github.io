// a5_script.js
// Nicolas Piette - COMP 10259

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#btnFirst').addEventListener('click', handleFirstClick);
    document.querySelector('#btnSecond').addEventListener('click', handleSecondClick);
    document.querySelector('#btnThird').addEventListener('click', handleThirdClick);
  });
  
  // First Button (TEXT)
  function handleFirstClick() {
    fetch("https://csunix.mohawkcollege.ca/~adams/10259/a6_responder.php", {
      credentials: 'include'
    })
      .then(response => response.text())
      .then(showFirstText)
      .catch(err => console.error("Fetch error:", err));
  }
  
  function showFirstText(text) {
    const output = document.querySelector('#outputContainer');
    output.innerHTML = '';
  
    const div = document.createElement('div');
    div.classList.add('w-100', 'text-center');
  
    const h1 = document.createElement('h1');
    h1.textContent = `${text} — 000774456`; // Replace with your student number
  
    div.appendChild(h1);
    output.appendChild(div);
  }
  
  // Second Button (JSON -> CARDS)
  function handleSecondClick() {
    const input = document.querySelector('#choiceInput').value.trim().toLowerCase();
  
    if (input !== "mario" && input !== "starwars") {
      alert("Please enter 'mario' or 'starwars'");
      return;
    }
  
    const url = `https://csunix.mohawkcollege.ca/~adams/10259/a6_responder.php?choice=${input}`;
    console.log("Sending GET request to:", url);
  
    fetch(url, { credentials: 'include' })
      .then(response => response.json())
      .then(data => showCards(data, input))
      .catch(err => console.error("Fetch error:", err));
  }
  
  function showCards(array, type) {
    const output = document.querySelector('#outputContainer');
    const table = document.querySelector('#tableContainer');
    const copyright = document.querySelector('#copyrightNotice');
  
    output.innerHTML = '';
    table.innerHTML = '';
    copyright.innerHTML = '';
  
    let colClass = array.length === 1 ? 'col-12' : array.length === 2 ? 'col-md-6' : 'col-md-4';
  
    for (let i = 0; i < array.length; i++) {
      const obj = array[i];
  
      const card = document.createElement('div');
      card.className = `${colClass} text-center`;
  
      card.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5">${obj.series}</h2>
            <img src="${obj.url}" class="img-fluid my-2" style="max-height: 200px; object-fit: contain;" alt="${obj.name}">
            <p>${obj.name}</p>
          </div>
        </div>
      `;
  
      output.appendChild(card);
    }
  
    if (type === "mario") {
      copyright.innerHTML = "Game trademarks and copyrights are properties of their respective owners. Nintendo properties are trademarks of Nintendo. © 2019 Nintendo.";
    } else {
      copyright.innerHTML = "Star Wars © & TM 2022 Lucasfilm Ltd. All rights reserved. Visual material © 2022 Electronic Arts Inc.";
    }
  }
  
  // Third Button (POST - Coming Soon)
  function handleThirdClick() {
    alert("Hold on big dawg it ain't made yet!");
  }
  