
const menuButton = document.querySelector('.menu-btn');
const menu = document.querySelector('.nav-links');
if (menuButton && menu) {
  menuButton.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
}
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`RevenueStack Media inquiry — ${data.get('company') || data.get('name')}`);
    const body = encodeURIComponent(
`Name: ${data.get('name')}
Email: ${data.get('email')}
Company / Network: ${data.get('company')}
Interest: ${data.get('service')}

Message:
${data.get('message')}`
    );
    window.location.href = `mailto:hello@revenuestackmedia.com?subject=${subject}&body=${body}`;
    const message = document.querySelector('.success');
    if (message) message.style.display = 'block';
  });
}
