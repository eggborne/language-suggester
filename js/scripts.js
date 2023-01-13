window.onload = function () {
  document.getElementById('settings-toggle').onpointerdown = function (e) {
    e.target.classList.toggle('open');
    document.querySelector('menu').classList.toggle('open');
  };
  [...document.getElementsByClassName('toggle')].forEach(function (toggle) {
    toggle.onpointerdown = function(e) {
      e.target.classList.toggle('yes');
    };
  });
}