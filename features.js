// Small, local illustrations. No receipt uploads, account calls or external code.
(() => {
  const section = document.querySelector('.features');
  if (!section) return;
  const tabs = [...section.querySelectorAll('[data-feature]')];
  const panels = [...section.querySelectorAll('.feature-panel')];
  const playback = section.querySelector('.feature-playback');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;
  let visible = false;
  let active = 0;

  function updatePlayback() {
    section.classList.toggle('is-running', visible && !paused && !document.hidden);
    playback.hidden = reduced.matches;
    playback.replaceChildren(document.createTextNode(paused ? 'Play previews ' : 'Pause previews '));
    const symbol = document.createElement('span');
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = paused ? '▷' : 'Ⅱ';
    playback.append(symbol);
  }
  function select(index, focus = false) {
    active = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
    });
    if (focus) {
      tabs[index].focus({preventScroll: true});
      tabs[index].scrollIntoView({block: 'nearest', inline: 'nearest', behavior: 'instant'});
    }
  }
  section.querySelector('.feature-tabs').setAttribute('role', 'tablist');
  const orientation = matchMedia('(max-width: 700px)');
  function updateOrientation() {
    section.querySelector('.feature-tabs').setAttribute('aria-orientation', orientation.matches ? 'horizontal' : 'vertical');
  }
  orientation.addEventListener('change', updateOrientation);
  updateOrientation();
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[i].id);
    panels[i].setAttribute('role', 'tabpanel');
    panels[i].setAttribute('aria-labelledby', tab.id);
    panels[i].tabIndex = 0;
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', event => {
      const next = orientation.matches ? 'ArrowRight' : 'ArrowDown';
      const previous = orientation.matches ? 'ArrowLeft' : 'ArrowUp';
      let index;
      if (event.key === next) index = (active + 1) % tabs.length;
      if (event.key === previous) index = (active - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = tabs.length - 1;
      if (index !== undefined) { event.preventDefault(); select(index, true); }
    });
  });
  section.querySelectorAll('.script-only').forEach(element => { element.hidden = false; });
  section.classList.add('features-ready');
  select(0);
  playback.addEventListener('click', () => { paused = !paused; updatePlayback(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; updatePlayback(); });
  document.addEventListener('visibilitychange', updatePlayback);
  if ('IntersectionObserver' in window) {
    // Observe the demos, not the section heading, so they don't finish before arriving.
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      updatePlayback();
    }, {threshold: 0.15}).observe(section.querySelector('.feature-panels'));
  } else { visible = true; }
  updatePlayback();

  const people = [...section.querySelectorAll('[data-person]')];
  const money = value => '฿' + value.toFixed(2);
  people.forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
      const selected = people.filter(person => person.getAttribute('aria-pressed') === 'true');
      // Integer cents keep all assigned shares summing to exactly ฿120.00.
      const cents = selected.length ? Math.floor(12000 / selected.length) : 0;
      const remainder = selected.length ? 12000 % selected.length : 0;
      people.forEach(person => {
        const index = selected.indexOf(person);
        const amount = index < 0 ? 0 : (cents + (index < remainder ? 1 : 0)) / 100;
        person.querySelector('.demo-share').textContent = money(amount);
      });
      const message = selected.length ? (selected.length === 1 ? 'Assigned to 1 person' : `Split equally between ${selected.length}`) : 'Choose who shared this item';
      section.querySelector('[data-split-status]').textContent = message;
      section.querySelector('[data-split-announcement]').textContent = selected.length
        ? `${selected.map(person => person.dataset.person).join(', ')} ${selected.length === 1 ? 'has' : 'share'} ฿120.00. ${money(cents / 100)} each.`
        : 'No one selected. Choose a name to split this item.';
    });
  });
  const styleButtons = [...section.querySelectorAll('[data-style]')];
  styleButtons.forEach(button => {
    button.addEventListener('click', () => {
      section.querySelector('.share-preview').dataset.shareStyle = button.dataset.style;
      styleButtons.forEach(candidate => candidate.setAttribute('aria-pressed', String(candidate === button)));
    });
  });
})();
