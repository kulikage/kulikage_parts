// Auto copyright year update
(function () {
    var y = new Date().getFullYear();
    var el = document.getElementById('copyyear');
    if (el) el.textContent = y > 2018 ? '2018–' + y : '2018';
})();

// Smooth scrolling for anchor links (Optional, adds nice feel)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
