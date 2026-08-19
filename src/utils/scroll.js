// Sections are position:sticky cards inside <main>, so their rendered
// position (getBoundingClientRect / offsetTop) can reflect the "stuck"
// position rather than the flow position. Compute flow offsets by
// accumulating section heights instead.
export function sectionTop(id) {
  const sections = document.querySelectorAll('main > section');
  let top = 0;
  for (const s of sections) {
    if (s.id === id) return top;
    top += s.offsetHeight;
  }
  return null;
}

export function scrollToSection(id) {
  const top = sectionTop(id);
  if (top !== null) window.scrollTo({ top, behavior: 'smooth' });
}
