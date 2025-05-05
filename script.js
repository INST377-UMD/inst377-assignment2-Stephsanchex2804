function loadQuote() {
    fetch("https://zenquotes.io/api/random")
      .then((res) => res.json())
      .then((data) => {
        const quote = data[0];
        const quoteBox = document.getElementById("quote-box");
        quoteBox.innerText = `"${quote.q}" — ${quote.a}`;
      })
      .catch((err) => {
        console.error("Failed to load quote:", err);
        document.getElementById("quote-box").innerText = "Could not load quote.";
      });
  }
  
  window.onload = function () {
    loadQuote();
  };
  
  function startVoice() {
    if (annyang) {
      const commands = {
        'hello': () => alert('Hello World!'),
        'change the color to *color': (color) => {
          document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
          page = page.toLowerCase();
          if (page === 'home') window.location.href = 'home.html';
          else if (page === 'stocks') window.location.href = 'stocks.html';
          else if (page === 'dogs') window.location.href = 'dogs.html';
          else alert("Page not found.");
        }
      };
      annyang.addCommands(commands);
      annyang.start();
    }
  }
  
  function stopVoice() {
    if (annyang) {
      annyang.abort();
    }
  }
  
  window.onload = function () {
    loadQuote();
    document.getElementById('start-audio').onclick = startVoice;
    document.getElementById('stop-audio').onclick = stopVoice;
  };