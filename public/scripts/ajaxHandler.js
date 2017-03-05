function fetchPrediction(fetchPos) {
  console.log(fetchPos);
  return fetch('/data/openweather', {
    headers: {
      'Content-Type':'application/json'
    },
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(fetchPos),
  })
  .then(r => r.json())
  // return fetch('/user/login', {
  //     headers: {
  //       'Content-Type':'application/json'
  //     },
  //     method: 'POST',
  //     body: JSON.stringify({
  //       username: username,
  //       password: password
  //     }),
  //   })
  //   .then(r => r.json())
}
