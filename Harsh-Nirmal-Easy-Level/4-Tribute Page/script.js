// script.js

window.addEventListener("scroll", function () {
  var footer = document.getElementById("page-footer");
  var position = footer.getBoundingClientRect();

  if (position.top < window.innerHeight) {
    footer.style.bottom = "0";
  } else {
    footer.style.bottom = "80px";
  }
});
