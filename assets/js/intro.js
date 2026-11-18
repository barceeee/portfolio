// Opening animation controller: removes the overlay when it finishes or when the visitor skips it.
(function () {
  var root = document.documentElement;
  var screen = document.getElementById("intro");
  if (!screen) return;
  if (!root.classList.contains("intro-play")) { screen.remove(); return; }

  var finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}
    screen.classList.add("is-done");
    setTimeout(function () {
      root.classList.remove("intro-play");
      screen.remove();
      var main = document.getElementById("main");
      if (main) main.focus({ preventScroll: true });
    }, 360);
    removeEventListener("keydown", finish);
  }

  screen.addEventListener("click", finish);
  addEventListener("keydown", finish);
  setTimeout(finish, 3600); // safety net: the CSS animation ends at ~3.6s
})();
