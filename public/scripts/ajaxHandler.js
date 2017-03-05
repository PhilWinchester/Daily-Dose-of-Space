function fetchPrediction(fetchPos) {
  console.log(fetchPos);
  return fetch('/data', {
    method: 'POST',
    body: JSON.stringify({
      latitude: 'document.querySelector("#latitude-input").value',
      longitude: 'document.querySelector("#longitude-input").value',
      time: 'n/a'
    })
  })
  .then(r => r.json())
}
