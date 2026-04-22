/* SAM'S CLUB REDESIGN - LOGIN PAGE JS */
/* Theme handled by main.js */

/* === VALIDATION === */
function validateEmail() {
  const i = document.getElementById('email');
  const err = document.getElementById('email-err');
  if (i.value.length > 0) {
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(i.value);
    i.classList.toggle('error', !ok);
    i.classList.toggle('ok', ok);
    err.classList.toggle('show', !ok);
  } else {
    i.classList.remove('error', 'ok');
    err.classList.remove('show');
  }
}

function validatePw() {
  const i = document.getElementById('password');
  const err = document.getElementById('pw-err');
  if (i.value.length > 0) {
    const ok = i.value.length >= 8;
    i.classList.toggle('error', !ok);
    i.classList.toggle('ok', ok);
    err.classList.toggle('show', !ok);
  } else {
    i.classList.remove('error', 'ok');
    err.classList.remove('show');
  }
}

/* === STEP FLOW === */
function continueToPassword() {
  const email = document.getElementById('email');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.classList.add('error');
    document.getElementById('email-err').classList.add('show');
    email.focus();
    return;
  }

  const btn = document.getElementById('btn-continue');
  btn.classList.add('loading');
  btn.innerHTML = '<div class="spinner"></div>';

  setTimeout(() => {
    btn.style.display = 'none';
    document.getElementById('step-password').classList.add('show');
    document.getElementById('password').focus();
  }, 800);
}

/* === PASSWORD TOGGLE === */
function togglePw() {
  const pw = document.getElementById('password');
  const btn = document.querySelector('.pw-toggle');
  if (pw.type === 'password') {
    pw.type = 'text';
    btn.textContent = 'Show';
    btn.setAttribute('aria-label', 'Ocultar contraseña');
  } else {
    pw.type = 'password';
    btn.textContent = 'Hide';
    btn.setAttribute('aria-label', 'Mostrar contraseña');
  }
}

/* === LOGIN SUBMIT === */
function handleLogin() {
  const pw = document.getElementById('password');
  if (pw.value.length < 8) {
    pw.classList.add('error');
    document.getElementById('pw-err').classList.add('show');
    pw.focus();
    return;
  }

  const btn = document.getElementById('btn-login');
  btn.classList.add('loading');
  btn.innerHTML = '<div class="spinner"></div> Verificando...';

  setTimeout(() => {
    btn.classList.add('success');
    btn.innerHTML = ' Acceso concedido';

    document.getElementById('wm-overlay').classList.add('show');
    document.getElementById('wm-modal').classList.add('show');

    setTimeout(() => {
      window.location.href = 'account.html';
    }, 2200);
  }, 1500);
}

/* === KEYBOARD SUPPORT === */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('email').addEventListener('keydown', e => {
    if (e.key === 'Enter') continueToPassword();
  });

  document.getElementById('password').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });
});