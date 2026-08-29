const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

window.addEventListener('load', () => {
  setTimeout(() => document.querySelector('.loader')?.classList.add('done'), 250);
  if (!reduced && window.gsap && window.ScrollTrigger) initMotion();
  else document.querySelectorAll('.reveal').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
});

function initMotion() {
  gsap.registerPlugin(ScrollTrigger);
  gsap.timeline({ delay: .25 })
    .from('.site-header', { y: -35, opacity: 0, duration: .7 })
    .from('.hero h1 .line', { yPercent: 110, opacity: 0, duration: 1, stagger: .12, ease: 'power4.out' }, '-=.35')
    .to('.hero .reveal', { y: 0, opacity: 1, duration: .7, stagger: .1 }, '-=.5');

  gsap.to('.progress span', { width: '100%', ease: 'none', scrollTrigger: { start: 'top top', end: 'max', scrub: .15 } });

  const scrubVideo = document.querySelector('#heroScrub');
  let scrubReady = false;

  const setupVideoScrub = () => {
    if (scrubReady || !scrubVideo.duration) return;
    scrubReady = true;
    scrubVideo.pause();
    scrubVideo.currentTime = 0.01;
    gsap.to(scrubVideo, {
      currentTime: Math.max(0.01, scrubVideo.duration - 0.04),
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: .35,
        onUpdate: self => document.documentElement.style.setProperty('--scrub-progress', self.progress.toFixed(4))
      }
    });
    ScrollTrigger.refresh();
  };

  // Mobile unlock: a silent play/pause on the first touch tells the browser
  // this video is approved, so it loads metadata and allows seeking.
  const unlockVideo = () => {
    const p = scrubVideo.play();
    if (p) p.then(() => { scrubVideo.pause(); setupVideoScrub(); }).catch(() => {});
  };
  window.addEventListener('touchstart', unlockVideo, { once: true, passive: true });

  scrubVideo.load(); // nudge browsers that ignore preload="auto"
  if (scrubVideo.readyState >= 1) setupVideoScrub();
  else scrubVideo.addEventListener('loadedmetadata', setupVideoScrub, { once: true });

  gsap.to('.hero-copy', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '8% top', end: '28% top', scrub: true } });
  gsap.to('.hero-shade', { opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '10% top', end: '34% top', scrub: true } });
  gsap.to('.scrub-status', { opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '65% top', end: '90% top', scrub: true } });

  document.querySelectorAll('.reveal').forEach(el => {
    if (el.closest('.hero')) return;
    gsap.to(el, { y: 0, opacity: 1, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  gsap.from('.split-text', { y: 90, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.split-text', start: 'top 80%' } });
  gsap.fromTo('.macro-frame', { clipPath: 'inset(18% 18% 18% 18%)', scale: .86 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'none', scrollTrigger: { trigger: '.macro-stage', start: 'top 85%', end: 'bottom 70%', scrub: 1 } });
  gsap.from('.ingredient', { scale: .5, opacity: 0, stagger: .15, duration: .6, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.macro-stage', start: 'top 55%' } });
  gsap.from('.menu-card', { x: 140, opacity: 0, stagger: .12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.menu-rail', start: 'top 78%' } });
  gsap.from('.score', { textContent: 0, duration: 1.4, snap: { textContent: .1 }, ease: 'power2.out', scrollTrigger: { trigger: '.proof', start: 'top 65%' } });
  gsap.to('.visit-image img', { yPercent: 10, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.visit', start: 'top bottom', end: 'bottom top', scrub: true } });
}

document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    if (reduced) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.16}px, ${(e.clientY-r.top-r.height/2)*.16}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = 'translate(0,0)');
});

const reviews = [...document.querySelectorAll('.review')];
const dots = [...document.querySelectorAll('.review-dots button')];
let reviewIndex = 0;
function showReview(i) {
  reviewIndex = i;
  reviews.forEach((r, n) => r.classList.toggle('active', n === i));
  dots.forEach((d, n) => d.classList.toggle('active', n === i));
}
dots.forEach((dot, i) => dot.addEventListener('click', () => showReview(i)));
setInterval(() => showReview((reviewIndex + 1) % reviews.length), 5200);
