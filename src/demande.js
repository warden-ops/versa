/* Demandes de financement.
   Un seul réglage : VITE_DEMANDE_ENDPOINT.
   Vide = le visiteur confirme, puis son logiciel de courriel s’ouvre vers info@versacapital.ca.
   Une URL https (ou http locale) = POST JSON du même formulaire, puis confirmation à l’écran.
   TODO-CLIENT: choisir l’outil de formulaire hébergé au Canada et renseigner VITE_DEMANDE_ENDPOINT au build. */

const COURRIEL = 'info@versacapital.ca';

function endpointValide(raw) {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) return '';
  let url;
  try {
    url = new URL(value);
  } catch {
    return '';
  }
  const host = url.hostname.toLowerCase();
  const local = host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  if (local && (url.protocol === 'http:' || url.protocol === 'https:')) return url.toString();
  if (url.protocol === 'https:') return url.toString();
  return '';
}

const COPY = {
  fr: {
    confirmerTitre: 'Confirmez votre demande',
    reponse: 'Un conseiller de Versa Capital vous répond.',
    envoyer: 'Envoyer ma demande',
    modifier: 'Modifier la demande',
    sujet: 'Demande de financement',
    mailto: 'Votre demande est prête dans votre logiciel de courriel. Envoyez le message à info@versacapital.ca. Un conseiller de Versa Capital vous répond.',
    envoye: 'Votre demande a été envoyée. Un conseiller de Versa Capital vous répond.',
    erreur: 'L’envoi n’a pas abouti. Écrivez à info@versacapital.ca.',
    vide: 'Non précisé',
  },
  en: {
    confirmerTitre: 'Confirm your request',
    reponse: 'A Versa Capital advisor will reply.',
    envoyer: 'Send my request',
    modifier: 'Edit the request',
    sujet: 'Financing request',
    mailto: 'Your request is ready in your email app. Send the message to info@versacapital.ca. A Versa Capital advisor will reply.',
    envoye: 'Your request has been sent. A Versa Capital advisor will reply.',
    erreur: 'The request could not be sent. Write to info@versacapital.ca.',
    vide: 'Not provided',
  },
};

function texte(form) {
  return (document.documentElement.lang || '').toLowerCase().startsWith('en') ? COPY.en : COPY.fr;
}

function lignes(form, t) {
  const rows = [];
  form.querySelectorAll('.field').forEach((field) => {
    const label = field.querySelector(':scope > span')?.childNodes?.[0]?.textContent?.trim()
      || field.querySelector('span')?.textContent?.trim();
    const control = field.querySelector('input, select, textarea');
    if (!control || control.type === 'checkbox' || control.type === 'hidden') return;
    const value = (control.value || '').trim();
    if (!label || !value) return;
    rows.push([label, value]);
  });
  const consent = form.querySelector('[name="consentement"]');
  if (consent?.checked) rows.push([t === COPY.en ? 'Consent' : 'Consentement', t === COPY.en ? 'Yes' : 'Oui']);
  return rows;
}

function mailto(form, t) {
  const body = lignes(form, t).map(([k, v]) => `${k}: ${v}`).join('\n');
  return `mailto:${COURRIEL}?subject=${encodeURIComponent(t.sujet)}&body=${encodeURIComponent(body)}`;
}

function panneau(form, t) {
  let box = form.querySelector('.form__confirm');
  if (!box) {
    box = document.createElement('div');
    box.className = 'form__confirm';
    box.hidden = true;
    form.append(box);
  }
  const rows = lignes(form, t);
  box.innerHTML = '';
  const title = document.createElement('p');
  title.className = 'form__confirm-title';
  title.id = 'confirm-demande-titre';
  title.textContent = t.confirmerTitre;
  const list = document.createElement('dl');
  rows.forEach(([label, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value || t.vide;
    list.append(dt, dd);
  });
  const note = document.createElement('p');
  note.className = 'form__reply';
  note.textContent = t.reponse;
  const send = document.createElement('button');
  send.type = 'button';
  send.className = 'btn form__submit';
  send.dataset.confirmSend = '';
  const label = document.createElement('span');
  label.className = 'btn__label';
  label.dataset.text = t.envoyer;
  label.textContent = t.envoyer;
  const arrow = document.createElement('span');
  arrow.className = 'btn__arrow';
  arrow.setAttribute('aria-hidden', 'true');
  send.append(label, arrow);
  const edit = document.createElement('button');
  edit.type = 'button';
  edit.className = 'form__edit';
  edit.dataset.confirmEdit = '';
  edit.textContent = t.modifier;
  box.append(title, list, note, send, edit);
  box.setAttribute('role', 'region');
  box.setAttribute('aria-labelledby', title.id);
  return box;
}

function montrer(form, el, message) {
  let done = form.querySelector('.form__done');
  if (!done) {
    done = document.createElement('div');
    done.className = 'form__done';
    done.setAttribute('role', 'status');
    form.append(done);
  }
  done.textContent = message;
  done.hidden = false;
  el.hidden = true;
  form.classList.add('is-done');
  form.classList.remove('is-confirm');
  done.tabIndex = -1;
  done.focus();
}

export function brancherDemandes() {
  const configured = import.meta.env.VITE_DEMANDE_ENDPOINT;
  const endpoint = endpointValide(configured);
  if (typeof configured === 'string' && configured.trim() && !endpoint) {
    console.warn('VITE_DEMANDE_ENDPOINT ignorée : utilisez une URL https, ou http sur localhost.');
  }

  document.querySelectorAll('form[data-needs-backend]').forEach((form) => {
    form.dataset.endpoint = endpoint ? 'pret' : 'mailto';
    const t = texte(form);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.classList.add('is-confirm');
      const box = panneau(form, t);
      box.hidden = false;
      box.querySelector('[data-confirm-send]')?.focus();
    });
    form.addEventListener('click', async (event) => {
      const send = event.target.closest('[data-confirm-send]');
      const edit = event.target.closest('[data-confirm-edit]');
      if (edit) {
        form.classList.remove('is-confirm');
        form.querySelector('.form__confirm')?.setAttribute('hidden', '');
        form.querySelector('.form__submit')?.focus();
        return;
      }
      if (!send || form.dataset.sending === '1') return;
      const box = form.querySelector('.form__confirm');
      send.disabled = true;
      form.dataset.sending = '1';
      try {
        if (!endpoint) {
          window.location.href = mailto(form, t);
          montrer(form, box, t.mailto);
          return;
        }
        const payload = Object.fromEntries(lignes(form, t));
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(String(res.status));
        montrer(form, box, t.envoye);
      } catch {
        let err = box.querySelector('.form__error');
        if (!err) {
          err = document.createElement('p');
          err.className = 'form__error';
          err.setAttribute('role', 'alert');
          box.append(err);
        }
        err.textContent = t.erreur;
      } finally {
        send.disabled = false;
        delete form.dataset.sending;
      }
    });
  });
}
