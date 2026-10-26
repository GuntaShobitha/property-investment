/**
 * STACKLY PROPERTY INVESTMENT — AUTHENTICATION LOGIC (DEMO SIMULATION)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Password Visibility Toggle
  document.querySelectorAll('.toggle-password-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input && input.tagName === 'INPUT') {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.textContent = isPassword ? 'visibility_off' : 'visibility';
        }
      }
    });
  });

  // 2. Demo Login Handler
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const roleSelect = document.getElementById('loginRole');
      const emailInput = document.getElementById('loginEmail');
      const passwordInput = document.getElementById('loginPassword');
      const submitBtn = loginForm.querySelector('.auth-submit-btn');

      let isValid = true;

      // Validate Role
      if (!roleSelect || !roleSelect.value) {
        showFieldError(roleSelect, 'Please select your role (User or Admin).');
        isValid = false;
      } else {
        clearFieldError(roleSelect);
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        showFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearFieldError(emailInput);
      }

      // Validate Password
      if (!passwordInput || passwordInput.value.trim().length < 4) {
        showFieldError(passwordInput, 'Please enter your password (minimum 4 characters).');
        isValid = false;
      } else {
        clearFieldError(passwordInput);
      }

      if (!isValid) return;

      const selectedRole = roleSelect.value;
      const email = emailInput.value.trim();

      // Submit feedback & redirect
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s infinite linear;">progress_activity</span> Authenticating Session...';
      }

      // Store current user session info in localStorage
      const sessionUser = {
        name: selectedRole === 'Admin' ? 'Eleanor Vance' : 'Marcus Sterling',
        email: email,
        role: selectedRole,
        loginTime: new Date().toISOString()
      };
      setStoredData('current_session', sessionUser);

      setTimeout(() => {
        showToast(`Login successful as ${selectedRole}. Redirecting to dashboard...`, 'success');

        setTimeout(() => {
          if (selectedRole === 'Admin') {
            window.location.href = 'admin-dashboard.html';
          } else {
            window.location.href = 'user-dashboard.html';
          }
        }, 800);
      }, 700);
    });
  }

  // 3. Demo Registration Handler
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('regName');
      const emailInput = document.getElementById('regEmail');
      const roleSelect = document.getElementById('regRole');
      const passInput = document.getElementById('regPassword');
      const confirmPassInput = document.getElementById('regConfirmPassword');
      const termsCheckbox = document.getElementById('regTerms');
      const submitBtn = registerForm.querySelector('.auth-submit-btn');

      let isValid = true;

      // Validate Name
      if (!nameInput || !nameInput.value.trim()) {
        showFieldError(nameInput, 'Please enter your full legal name.');
        isValid = false;
      } else {
        clearFieldError(nameInput);
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        showFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearFieldError(emailInput);
      }

      // Validate Role
      if (!roleSelect || !roleSelect.value) {
        showFieldError(roleSelect, 'Please select your intended role.');
        isValid = false;
      } else {
        clearFieldError(roleSelect);
      }

      // Validate Password
      if (!passInput || passInput.value.length < 6) {
        showFieldError(passInput, 'Password must be at least 6 characters long.');
        isValid = false;
      } else {
        clearFieldError(passInput);
      }

      // Validate Confirm Password
      if (!confirmPassInput || confirmPassInput.value !== passInput.value) {
        showFieldError(confirmPassInput, 'Passwords do not match.');
        isValid = false;
      } else {
        clearFieldError(confirmPassInput);
      }

      // Validate Terms
      if (!termsCheckbox || !termsCheckbox.checked) {
        showToast('Please acknowledge the STACKLY Terms of Investment.', 'error');
        isValid = false;
      }

      if (!isValid) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s infinite linear;">progress_activity</span> Creating Demo Account...';
      }

      setTimeout(() => {
        showToast('Demo registration completed successfully! Redirecting to login...', 'success');
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 900);
      }, 700);
    });
  }

  // 4. Demo Password Recovery Handler
  const forgotForm = document.getElementById('forgotForm');
  if (forgotForm) {
    forgotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('recoveryEmail');
      const submitBtn = forgotForm.querySelector('.auth-submit-btn');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        showFieldError(emailInput, 'Please enter a valid registered email address.');
        return;
      }
      clearFieldError(emailInput);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s infinite linear;">progress_activity</span> Generating Demo Link...';
      }

      setTimeout(() => {
        showToast('Demonstration link generated! A recovery email would be dispatched in production.', 'info');
        const recoveryFeedback = document.getElementById('recoveryFeedback');
        if (recoveryFeedback) {
          recoveryFeedback.style.display = 'block';
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Reset Password Again';
        }
      }, 800);
    });
  }

  // Field validation helpers
  function showFieldError(field, message) {
    if (!field) return;
    field.classList.add('is-invalid');
    const group = field.closest('.form-group');
    if (group) {
      let msgEl = group.querySelector('.validation-msg');
      if (!msgEl) {
        msgEl = document.createElement('div');
        msgEl.className = 'validation-msg visible';
        group.appendChild(msgEl);
      }
      msgEl.textContent = message;
      msgEl.classList.add('visible');
    }
  }

  function clearFieldError(field) {
    if (!field) return;
    field.classList.remove('is-invalid');
    const group = field.closest('.form-group');
    if (group) {
      const msgEl = group.querySelector('.validation-msg');
      if (msgEl) {
        msgEl.classList.remove('visible');
      }
    }
  }
});
