const root = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const dialog = document.querySelector('#settings-dialog');

function toggleTheme() {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';

  root.dataset.theme = next;
  themeToggle.setAttribute('aria-pressed', String(next === 'dark'));
  themeToggle.textContent = next === 'dark'
    ? 'Светлая тема'
    : 'Сменить тему';
}

themeToggle.addEventListener('click', toggleTheme);

for (const trigger of document.querySelectorAll('#open-dialog, [data-open-dialog]')) {
  trigger.addEventListener('click', () => {
    if (!dialog.open) {
      dialog.showModal();
    }
  });
}

const form = document.querySelector('#demo-form');
const formFeedback = document.querySelector('#form-feedback');

const fieldMessages = {
  'user-name': {
    hint: 'Укажите имя для сохранения изменений',
    error: 'Введите имя сотрудника.'
  },
  'user-email': {
    hint: 'Мы отправим подтверждение на эту почту',
    error: 'Введите корректный адрес электронной почты.'
  }
};

function updateField(input) {
  const invalid = !input.checkValidity();
  const hint = document.getElementById(input.getAttribute('aria-describedby'));
  const messages = fieldMessages[input.id];

  input.setAttribute('aria-invalid', String(invalid));

  if (hint && messages) {
    hint.textContent = invalid ? messages.error : messages.hint;
  }

  return !invalid;
}

for (const input of form.querySelectorAll('input[required]')) {
  input.addEventListener('blur', () => {
    updateField(input);
  });

  input.addEventListener('input', () => {
    if (input.hasAttribute('aria-invalid')) {
      updateField(input);
    }
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  let firstInvalid = null;

  for (const input of form.querySelectorAll('input[required]')) {
    if (!updateField(input) && !firstInvalid) {
      firstInvalid = input;
    }
  }

  formFeedback.textContent = firstInvalid
    ? 'Исправьте поля формы.'
    : 'Данные прошли проверку.';

  if (firstInvalid) {
    firstInvalid.focus();
  }
});

const alerts = document.querySelector('.alerts-stack');
const initialAlerts = alerts.innerHTML;

alerts.addEventListener('click', (event) => {
  const dismiss = event.target.closest('.ui-alert__dismiss');

  if (dismiss) {
    dismiss.closest('.ui-alert')?.remove();
  }
});

document.querySelector('#restore-alerts').addEventListener('click', () => {
  alerts.innerHTML = initialAlerts;
});

for (const input of document.querySelectorAll('.ui-switch input')) {
  input.addEventListener('change', () => {
    const name = input.closest('.ui-switch').querySelector('strong').textContent;
    const state = input.checked ? 'включено' : 'выключено';

    document.querySelector('#switch-feedback').textContent = `${name}: ${state}`;
  });
}