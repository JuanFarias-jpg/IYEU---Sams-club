/* SAM'S CLUB REDESIGN - REGISTRO PAGE JS */
/* Theme handled by main.js */

function validateName(){
  const input = document.getElementById('name');
  const err = document.getElementById('name-err');
  const ok = input.value.trim().length >= 3;
  input.classList.toggle('error', !ok);
  input.classList.toggle('ok', ok);
  err.classList.toggle('show', !ok);
  return ok;
}

function validateEmail(){
  const input = document.getElementById('email');
  const err = document.getElementById('email-err');
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
  input.classList.toggle('error', !ok);
  input.classList.toggle('ok', ok);
  err.classList.toggle('show', !ok);
  return ok;
}

function validatePassword(){
  const input = document.getElementById('password');
  const err = document.getElementById('pw-err');
  const ok = input.value.length >= 8;
  input.classList.toggle('error', !ok);
  input.classList.toggle('ok', ok);
  err.classList.toggle('show', !ok);
  return ok;
}

function validateConfirm(){
  const password = document.getElementById('password');
  const confirm = document.getElementById('confirm');
  const err = document.getElementById('confirm-err');
  const ok = confirm.value.length >= 8 && password.value === confirm.value;
  confirm.classList.toggle('error', !ok);
  confirm.classList.toggle('ok', ok);
  err.classList.toggle('show', !ok);
  return ok;
}

function handleRegister(){
  const valid = validateName() & validateEmail() & validatePassword() & validateConfirm();
  if (!valid) return;
  const btn = document.getElementById('btn-register');
  btn.classList.add('loading');
  btn.innerHTML = '<div class="spinner"></div> Creando cuenta...';
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.classList.add('success');
    btn.innerHTML = 'Cuenta creada';
    document.getElementById('wm-overlay').classList.add('show');
    document.getElementById('wm-modal').classList.add('show');
    setTimeout(() => { window.location.href = 'account.html'; }, 2200);
  }, 1500);
}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('name').addEventListener('keydown',e=>{ if(e.key==='Enter') handleRegister(); });
  document.getElementById('email').addEventListener('keydown',e=>{ if(e.key==='Enter') handleRegister(); });
  document.getElementById('password').addEventListener('keydown',e=>{ if(e.key==='Enter') handleRegister(); });
  document.getElementById('confirm').addEventListener('keydown',e=>{ if(e.key==='Enter') handleRegister(); });
});