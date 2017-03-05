// document.addEventListener("DOMContentLoaded", () => {
//
//   document.querySelector("#create-button").disabled = true;
//
//   if ("geolocation" in navigator) {
//     navigator.geolocation.getCurrentPosition((pos) => {
//
//       document.querySelector("#hidden-latitude").value = pos.coords.latitude;
//       document.querySelector("#hidden-longitude").value =  pos.coords.longitude;
//       document.querySelector("form").removeChild(document.querySelector("h3"));
//       document.querySelector("#create-button").disabled = false;
//
//     });
//   };
// });
function getBrowserLocation() {
  // document.querySelector("#create-button").disabled = true;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => {
      // console.log(pos.coords);

      let d = new Date(pos.timestamp);
      let hours = d.getHours(),
          minutes = d.getMinutes(),
          seconds = d.getSeconds(),
          month = d.getMonth() + 1,
          day = d.getDate(),
          year = d.getFullYear() % 100;

      function pad(d) {
          return (d < 10 ? "0" : "") + d;
      }

      let formattedDate = pad(hours) + ":"
                        + pad(minutes) + ":"
                        + pad(seconds) + " "
                        + pad(month) + "-"
                        + pad(day) + "-"
                        + pad(year);

      // document.write(formattedDate);
      console.log(formattedDate);

      document.querySelector("#latitude-input").value = pos.coords.latitude;
      document.querySelector("#longitude-input").value =  pos.coords.longitude;
      // document.querySelector("form").removeChild(document.querySelector("h3"));
      // document.querySelector("#create-button").disabled = false;
      // console.log('done');

    });
  };
};
