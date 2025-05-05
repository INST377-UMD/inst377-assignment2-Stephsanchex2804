let stockChart = null; 
function convertEpochToDate(epoch) {
  const date = new Date(epoch);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function getStartDate(daysBack) {
  const date = new Date();
  date.setDate(date.getDate() - parseInt(daysBack));
  return date.toISOString().split("T")[0];
}

async function getStock() {
  const ticker = document.getElementById("ticker-input").value.toUpperCase();
  const range = document.getElementById("day-range").value;
  const apiKey = "Sa9t8JMOPxiKYMNpqrl7MTm7lACnMKlV";
  const endDate = new Date().toISOString().split("T")[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${getStartDate(range)}/${endDate}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data); 

    if (!data.results || data.results.length === 0) {
      alert("No data found for this ticker.");
      return;
    }

    const labels = data.results.map(item => convertEpochToDate(item.t));
    const values = data.results.map(item => item.c);

    const ctx = document.getElementById("stock-chart").getContext("2d");

    if (stockChart) {
      stockChart.destroy();
    }

    stockChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: `${ticker} Closing Prices`,
          data: values,
          borderColor: '#d42b1e',
          backgroundColor: 'rgba(212, 43, 30, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Price (USD)"
            }
          },
          x: {
            title: {
              display: true,
              text: "Date"
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching stock data:", error);
    alert("Failed to load stock data.");
  }
}

async function loadRedditStocks() {
  const res = await fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03");
  const data = await res.json();
  const top5 = data.slice(0, 5);
  const table = document.querySelector("#reddit-table tbody");
  table.innerHTML = "";

  top5.forEach(stock => {
    const row = document.createElement("tr");
    const link = `https://finance.yahoo.com/quote/${stock.ticker}`;
    row.innerHTML = `
      <td><a href="${link}" target="_blank">${stock.ticker}</a></td>
      <td>${stock.no_of_comments}</td>
      <td>${stock.sentiment} ${getSentimentIcon(stock.sentiment)}</td>
    `;
    table.appendChild(row);
  });
}

function getSentimentIcon(sentiment) {
  if (sentiment === "Bullish") return "📈";
  if (sentiment === "Bearish") return "📉";
  return "";
}

function setupVoice() {
  if (annyang) {
    const commands = {
      'lookup *stock': (stock) => {
        document.getElementById("ticker-input").value = stock.toUpperCase();
        document.getElementById("day-range").value = "30"; // Default
        getStock();
      },
      'navigate to *page': (page) => {
        const lower = page.toLowerCase();
        if (lower === 'home') window.location.href = "home.html";
        if (lower === 'stocks') window.location.href = "stocks.html";
        if (lower === 'dogs') window.location.href = "dogs.html";
      }
    };
    annyang.addCommands(commands);
    document.getElementById("start-audio").onclick = () => annyang.start();
    document.getElementById("stop-audio").onclick = () => annyang.abort();
  }
}

window.onload = function () {
  setupVoice();
  loadRedditStocks();

};
