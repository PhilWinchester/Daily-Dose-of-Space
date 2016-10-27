console.log("scripts loaded");
document.addEventListener("DOMContentLoaded", () => {
  console.log("dom loaded");

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log("in navigator");
      document.querySelector("#location").innerHTML = `Latitude: ${pos.coords.latitude}\n Longitude: ${pos.coords.longitude}`;
    });
  };

  let d = new Date();
  d = d.getTimezoneOffset()/60;
  document.querySelector("#timezone").innerHTML = `UTC - ${d}`;

});
