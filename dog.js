async function loadCarouselImages() {
  try {
    const res = await fetch("https://api.thedogapi.com/v1/images/search?limit=10");
    const data = await res.json();
    const carousel = document.getElementById("carousel");
    carousel.innerHTML = "";

    data.forEach(img => {
      const imgEl = document.createElement("img");
      imgEl.src = img.url;
      imgEl.alt = "Dog Image";
      imgEl.className = "carousel-img";
      carousel.appendChild(imgEl);
    });

    setTimeout(() => {
      simpleslider.getSlider({
        container: carousel,
        delay: 3,
        duration: 0.5,
        prop: 'left',
        unit: '%'
      });
    }, 100);
  } catch (err) {
    console.error("Error loading carousel images:", err);
  }
}

async function loadBreeds() {
  try {
    const res = await fetch("https://api.thedogapi.com/v1/breeds");
    const data = await res.json();
    const buttonContainer = document.getElementById("breed-buttons");
    window.allBreeds = data;

    data.forEach(breed => {
      const btn = document.createElement("button");
      btn.className = "custom-button";
      btn.textContent = breed.name;
      btn.setAttribute("aria-label", `Show info for ${breed.name}`);
      btn.onclick = () => showBreedInfo(breed);
      buttonContainer.appendChild(btn);
    });
  } catch (err) {
    console.error("Error loading breeds:", err);
  }
}

function showBreedInfo(breed) {
  const infoBox = document.getElementById("breed-info");
  infoBox.style.display = "block";
  let minLife = "";
  let maxLife = "";
  if (breed.life_span) {
    const match = breed.life_span.match(/(\d+)\s*-\s*(\d+)/);
    if (match) {
      minLife = match[1];
      maxLife = match[2];
    }
  }

  infoBox.innerHTML = `
    <h3>${breed.name}</h3>
    <p><strong>Description:</strong> ${breed.temperament || "No description available."}</p>
    <p><strong>Min Life:</strong> ${minLife} years</p>
    <p><strong>Max Life:</strong> ${maxLife} years</p>
  `;
}

function setupVoice() {
  if (annyang) {
    const commands = {
      'load dog breed *name': (name) => {
        const breed = window.allBreeds.find(b =>
          b.name.toLowerCase().includes(name.toLowerCase())
        );
        if (breed) {
          showBreedInfo(breed);
        } else {
          alert("Breed not found.");
        }
      },
      'navigate to *page': (page) => {
        const p = page.toLowerCase();
        if (p === 'home') window.location.href = 'home.html';
        if (p === 'stocks') window.location.href = 'stocks.html';
        if (p === 'dogs') window.location.href = 'dogs.html';
      }
    };
    annyang.addCommands(commands);
    document.getElementById("start-audio").onclick = () => annyang.start();
    document.getElementById("stop-audio").onclick = () => annyang.abort();
  }
}

window.onload = function () {
  loadCarouselImages();
  loadBreeds();
  setupVoice();
};

