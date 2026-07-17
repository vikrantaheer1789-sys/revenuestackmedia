
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

const form = document.querySelector('#contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent(`New agency inquiry from ${data.get('name')}`);
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nCompany: ${data.get('company')}\nService: ${data.get('service')}\n\nMessage:\n${data.get('message')}`
    );
    window.location.href = `mailto:hello@revenuestackmedia.com?subject=${subject}&body=${body}`;
    document.querySelector('.success').style.display = 'block';
  });
}
