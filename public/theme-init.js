(function () {
  try {
    var d = document.documentElement;
    var t = JSON.parse(localStorage.getItem("theme") || "{}");
    var v = t && t.state && t.state.theme;
    if (v === "dark") {
      d.classList.add("dark");
    }
  } catch (e) {}
})();
