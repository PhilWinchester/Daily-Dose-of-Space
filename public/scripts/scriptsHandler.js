/* TODO LIST
 1 - Swap sunsets to be stored using PSQL
 2 - Users in MongoDB have pointers to entries in PSQL
   - give users favorite locations
 3 -
 4 -
*/

(() => {
  getBrowserLocation();

  document.querySelector('#zip-lookup').addEventListener('click', () => {
    fetchPrediction(document.querySelector('#zip-input').value)
      .then(zipResp => {
        console.log(zipResp);
      })
      .catch(err => console.log(err))

  document.querySelector('#sunset-lookup').addEventListener('click', () => {
    let fetchPos = {
      latitude: document.querySelector('#latitude-input').value,
      longitude: document.querySelector('#longitude-input').value,
      time: 'n/a'
    }

    fetchPrediction(fetchPos)
      .then(sunsetData => {
        console.log(sunsetData);
      })
      .catch(err => console.log(err))
  });

  });


})();
