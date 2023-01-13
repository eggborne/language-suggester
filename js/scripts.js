window.onload = function() {
  document.getElementById('settings-toggle').onpointerdown = function(e) {
    console.log('blarg', e.target)
    e.target.classList.toggle('open');
    document.querySelector('menu').classList.toggle('open');
  }
}