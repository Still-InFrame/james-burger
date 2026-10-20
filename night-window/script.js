// Sample hours, local time. Keys are getDay() values; close past midnight
// is written as 24 + hour so a 2 AM close is 26.
const HOURS = { 0: null, 1: [21, 26], 2: [21, 26], 3: [21, 26], 4: [21, 26], 5: [21, 27], 6: [21, 27] };

const root = document.documentElement;
const street = document.querySelector('.street');
const photo = document.querySelector('.street-photo');
const statusText = document.querySelector('.status-text');
const lamp = document.querySelector('.lamp');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fmt = h => {
  const hr = h % 24;
  if (hr === 0) return 'midnight';
  return `${hr % 12 || 12} ${hr < 12 ? 'AM' : 'PM'}`;
};

// Is the window open right now? Checks tonight's hours and last night's
// hours that run past midnight.
function windowState(now = new Date()) {
  const day = now.getDay();
  const h = now.getHours() + now.getMinutes() / 60;
  const yesterday = HOURS[(day + 6) % 7];
  if (yesterday && h < yesterday[1] - 24) return { open: true, closes: yesterday[1] };
  const today = HOURS[day];
  if (today && h >= today[0]) return { open: true, closes: today[1] };
  if (today) return { open: false, opens: `tonight at ${fmt(today[0])}` };
  for (let i = 1; i <= 7; i++) {
    const next = HOURS[(day + i) % 7];
    if (next) {
      const name = new Date(now.getTime() + i * 864e5).toLocaleDateString('en-US', { weekday: 'long' });
      return { open: false, opens: `${i === 1 ? 'tomorrow' : name} at ${fmt(next[0])}` };
    }
  }
  return { open: false, opens: 'soon' };
}

function setLight(on, animate) {
  root.dataset.light = on ? 'on' : 'off';
  lamp.setAttribute('aria-pressed', String(on));
  if (on && animate && !reduced) {
    photo.classList.remove('warming');
    void photo.offsetWidth; // restart the warm-up
    photo.classList.add('warming');
  }
}

const state = windowState();
street.classList.toggle('is-open', state.open);
statusText.textContent = state.open
  ? `Open now · closes ${fmt(state.closes)}`
  : `Closed · opens ${state.opens}`;

// The light follows the real hours. When the window is dark, visitors can
// flip the lamp on to see it lit; when it is open, the switch is already on.
setLight(state.open, false);
lamp.hidden = false;
lamp.querySelector('.lamp-label').textContent = state.open ? 'Flip the light' : 'Peek at 1 AM';
lamp.addEventListener('click', () => {
  const on = root.dataset.light !== 'on';
  setLight(on, true);
});

// Before 4 AM, "tonight" is still last night's shift.
const shiftDay = new Date(Date.now() - 4 * 36e5).getDay();
const tonight = document.querySelector(`.week tr[data-day="${shiftDay}"]`);
if (tonight) tonight.classList.add('tonight');
