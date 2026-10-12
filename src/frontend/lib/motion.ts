import gsap from 'gsap';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

const LANDSCAPE =
  '(orientation: landscape) and (min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
let lenis: Lenis | null = null;

/** Scroll so the section's top edge lands exactly on the top of the screen. */
export function scrollToTarget(target: HTMLElement) {
  const y = Math.round(target.getBoundingClientRect().top + window.scrollY);
  if (lenis) lenis.scrollTo(y);
  else window.scrollTo({ top: y });
}

export function setupMotion(root: HTMLElement) {
  const mm = gsap.matchMedia();

  mm.add(LANDSCAPE, () => {
    // Lenis 2 starts its own RAF by default. GSAP must be the only clock.
    lenis = new Lenis({ autoRaf: false, anchors: false, programmatic: { duration: 0.7 } });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);

    // In-page anchors: land exactly under the header, no stacked offsets.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!link || !target || event.defaultPrevented || event.metaKey || event.ctrlKey) return;
      event.preventDefault();
      history.replaceState(null, '', `#${id}`);
      scrollToTarget(target);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
    };
  });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const context = gsap.context(() => {
      /* ── hero intro ── */
      const heroPaths = gsap.utils.toArray<SVGElement>(
        '.hero-court svg path:not(.court-rally-lines), .hero-court svg circle',
      );
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero-eyebrow', { y: 16, opacity: 0, duration: 0.8 }, 0)
        .from('.hero-title-line', { yPercent: 115, duration: 1.2, stagger: 0.12 }, 0.05)
        .from('.hero-lede, .hero-actions', { y: 24, opacity: 0, duration: 0.9, stagger: 0.1 }, 0.5)
        .from(
          '.hero-visual',
          {
            opacity: 0,
            duration: 1.3,
            ease: 'power4.inOut',
            clearProps: 'opacity',
          },
          0.1,
        )
        .from('.hero-image', { scale: 1.3, duration: 1.8 }, 0.1)
        .fromTo(
          heroPaths,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.6,
            stagger: 0.15,
            ease: 'power2.inOut',
            clearProps: 'strokeDasharray,strokeDashoffset',
          },
          0.6,
        )
        .from('.hero-court > span, .court-rally-lines', { opacity: 0, duration: 1 }, 1.4);

      /* Desktop only: touch scrolling stays native with a stationary image. */
      if (window.matchMedia(LANDSCAPE).matches) {
        const heroScroll = {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        };
        gsap.fromTo(
          '.hero-image',
          { yPercent: -4 },
          { yPercent: 4, ease: 'none', scrollTrigger: heroScroll },
        );
      }
    }, root);

    return () => {
      context.revert();
    };
  });

  // Cinematic "Our Place": one scrubbed timeline across a tall section with a CSS-sticky stage.
  mm.add(LANDSCAPE, () => {
    const context = gsap.context(() => {
      const draw = gsap.utils.toArray<SVGElement>('.about-court .draw');
      const reveal = { ease: 'power3.out' };
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '.about-section',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        // act 1 — letterbox opens, the court is drawn, the title rises
        .fromTo('.about-bar-top', { scaleY: 1 }, { scaleY: 0, duration: 1.6 }, 0)
        .fromTo('.about-bar-bottom', { scaleY: 1 }, { scaleY: 0, duration: 1.6 }, 0)
        .fromTo(
          '.about-photo',
          { opacity: 0, scale: 1.4 },
          { opacity: 0.5, scale: 1.15, duration: 3 },
          0,
        )
        .fromTo(
          draw,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 2.4, stagger: 0.35 },
          0.3,
        )
        .fromTo(
          '.about-title-line',
          { yPercent: 115 },
          { yPercent: 0, duration: 1.6, stagger: 0.25, ...reveal },
          0.6,
        )
        .fromTo('.art-top', { opacity: 0 }, { opacity: 1, duration: 1 }, 1)
        // act 2 — camera pushes into the court while the copy arrives
        .fromTo(
          '.about-court',
          { scale: 1, rotation: -4 },
          { scale: 2.1, rotation: -12, duration: 7.5 },
          2.5,
        )
        .to('.about-photo', { scale: 1.3, duration: 7 }, 3)
        .fromTo(
          '.about-copy .word',
          { yPercent: 115 },
          { yPercent: 0, duration: 1.3, stagger: 0.28, ...reveal },
          3.6,
        )
        .fromTo(
          '.about-copy p',
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.4, ...reveal },
          5,
        )
        .fromTo(
          '.amenities li',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.25, ...reveal },
          5.8,
        )
        .fromTo('.about-copy .text-link', { opacity: 0 }, { opacity: 1, duration: 1 }, 7.6)
        // act 3 — title drifts up and the stage holds so the copy can be read
        .to('.about-art h2', { yPercent: -6, duration: 3 }, 7)
        .fromTo('.about-progress span', { scaleX: 0 }, { scaleX: 1, duration: 10 }, 0);
    }, root);
    return () => context.revert();
  });

  // phones / portrait: simple one-shot reveal, no tall scrubbed section
  mm.add('(orientation: portrait) and (prefers-reduced-motion: no-preference)', () => {
    const context = gsap.context(() => {
      gsap
        .timeline({
          defaults: { duration: 0.9, ease: 'power3.out', clearProps: 'all' },
          scrollTrigger: { trigger: '.about-section', start: 'top 72%', once: true },
        })
        .from('.about-title-line', { yPercent: 115, stagger: 0.12 })
        .from(
          '.about-copy .word, .about-copy p, .amenities li',
          { y: 28, opacity: 0, stagger: 0.07 },
          '<0.2',
        );
    }, root);
    return () => context.revert();
  });

  // header colours follow whichever section sits under it
  const header = document.querySelector<HTMLElement>('.site-header');
  const tones = gsap.context(() => {
    if (!header) return;
    document.querySelectorAll<HTMLElement>('[data-tone]').forEach((section) => {
      if (section === header) return;
      ScrollTrigger.create({
        trigger: section,
        start: () => `top ${header.offsetHeight / 2}px`,
        end: () => `bottom ${header.offsetHeight / 2}px`,
        onToggle: (self) => {
          if (self.isActive) header.dataset.tone = section.dataset.tone ?? 'page';
        },
      });
    });
  });

  const refresh = () => ScrollTrigger.refresh();
  // Images have reserved layout dimensions, so decoding does not require a
  // global refresh. Refresh only after fonts or the async catalogue change layout.
  let disposed = false;
  void document.fonts.ready.then(() => {
    if (!disposed) refresh();
  });
  return () => {
    disposed = true;
    tones.revert();
    mm.revert();
  };
}

export function setupSportsMotion(root: HTMLElement, select: (id: string) => void) {
  const mm = gsap.matchMedia();
  const tracking = gsap.context(() => {
    const stories = Array.from(root.querySelectorAll<HTMLElement>('.sport-story'));
    for (const story of stories) {
      const activate = () => select(story.dataset.sport ?? '');
      ScrollTrigger.create({
        trigger: story,
        start: 'top center',
        end: 'bottom center',
        onEnter: activate,
        onEnterBack: activate,
      });
    }
  }, root);
  mm.add(LANDSCAPE, () => {
    const context = gsap.context(() => {
      const stories = Array.from(root.querySelectorAll<HTMLElement>('.sport-story'));
      for (const story of stories) {
        gsap.fromTo(
          story.querySelector('.story-photo img'),
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: 'none',
            scrollTrigger: { trigger: story, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      }
      gsap.fromTo(
        '.showcase-progress span',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: true },
        },
      );
    }, root);
    return () => context.revert();
  });
  const refresh = () => ScrollTrigger.refresh();
  let disposed = false;
  void document.fonts.ready.then(() => {
    if (!disposed) refresh();
  });
  refresh();
  return () => {
    disposed = true;
    mm.revert();
    tracking.revert();
  };
}
