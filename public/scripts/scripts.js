console.log("scripts loaded");
document.addEventListener("DOMContentLoaded", () => {
  console.log("dom loaded");

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log("in navigator");
      // document.querySelector("#hidden-position").value = `${pos.coords.latitude} ${pos.coords.longitude}`;
      document.querySelector("#hidden-latitude").value = pos.coords.latitude;
      document.querySelector("#hidden-longitude").value =  pos.coords.longitude;
    });
  };
});
