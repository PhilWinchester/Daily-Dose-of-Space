
function fetchPrediction(fetchPos) {
  console.log(fetchPos);
  return fetch('/data', {
    headers: {
      'Content-Type':'application/json'
    },
    method: 'POST',
    body: JSON.stringify(fetchPos),
  })
  .then(r => r.json())
}

function fetchZipData(zip) {
  return fetch('/data/zipcodes', {
    headers: {
      'Content-Type':'application/json'
    },
    method: 'POST',
    body: JSON.stringify(zip),
  })
  .then(r => r.json())
}
