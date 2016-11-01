
document.addEventListener("DOMContentLoaded", () => {

  document.querySelector("#create-button").disabled = true;

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => {

      document.querySelector("#hidden-latitude").value = pos.coords.latitude;
      document.querySelector("#hidden-longitude").value =  pos.coords.longitude;
      document.querySelector("form").removeChild(document.querySelector("h3"));
      document.querySelector("#create-button").disabled = false;

    });
  };

});
