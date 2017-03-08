/* TODO LIST
 1 - Swap sunsets to be stored using PSQL
 2 - Users in MongoDB have pointers to entries in PSQL
   - give users favorite locations
 3 - if the user logged in then show their past sunsets, if not logged in show weather … or just leave blank
 4 -
*/

(() => {
  getBrowserLocation();
  addZipEvent();
  addSunsetEvent();

})();

function addZipEvent() {
  document.querySelector('#zip-lookup').addEventListener('click', () => {
    let zipcode = {
      zipcode: document.querySelector('#zip-input').value
    }
    fetchZipData(zipcode)
      .then(zipResp => {
        console.log(zipResp);
      })
      .catch(err => console.log(err))
  });
};

function addSunsetEvent() {
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
}
