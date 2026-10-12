# Sports Zone design notes

The primary task is requesting a local court session. Retain the original location, sports, rates, hours, and contacts.

References reviewed before implementation (markup/copy only; not reference screenshots):

- https://www.better.org.uk/ — sport-first navigation and facility information.
- https://www.everyoneactive.com/ — distinct routes for activities and a local visit.
- https://www.typewolf.com/ — display/body scale contrast; avoid flat system typography.
- https://www.awwwards.com/websites/sports/ — physical sport imagery and oversized athletic type.

Concept: the neighborhood court noticeboard. Barlow Condensed evokes team jerseys; Barlow gives forms readable labels. Court green, pale painted lines, and a ball-yellow action accent derive from court materials. The code-drawn basketball diagram is the signature object. The content is intentionally more practical than the gallery references.

Home wireframe: location strip / navigation; oversized left title + right game photo; court diagram + About and amenities; full yellow sport-category section with a sticky index and photo-led stories; address + aligned hours; footer. Court, gallery, and booking retain their separate pages.

Grid: 1240px maximum, 24px gutter; 12-column Bootstrap grid in the form, 4-column sport objects, 2-column hero. Collapse to one column on phones. Space scale: 8/16/24/32/48/72/96px. Radius: 4px controls, 8px media. No decorative shadows or section rules. The only filled panel is the actionable booking form.

Motion: one GSAP load sequence for title and court diagram. Lenis supports anchor travel across this landing page; booking form opts out. Dynamic reduced-motion preference disables both.

Copy: one short hero lede, one sport description each, one about paragraph, essential pricing/request notes. All remaining content is labels, prices, hours, and contact details. No fabricated reviews or performance metrics. Existing Unsplash photos are representative and identified as such.

Plan review: removed numbered section markers, badges, headline word accents, equal boxed cards, and blanket scroll reveals. Sport objects remain independent actions, without borders or raised surfaces.

## Home sports showcase

The yellow sports ribbon is now a full-height section of photo-led category stories. Categories come from the SQLite catalogue's `category` field: Team sports, Racquet sports, and Paddle sports today. Singular/plural category labels are grouped together; future sports and new categories appear without updating the homepage markup. Each category lists its available courts, hourly rates, and individual booking links. Existing `#game-...` anchors remain valid.

About and amenities sit directly after the hero, before categories. A sticky desktop index follows the current category; GSAP ScrollTrigger scrubs image movement and reading progress in sync with Lenis. Native vertical scrolling remains intact, without a pinned sequence. Mobile has a static wrapping category index, and reduced-motion views omit parallax and smooth scrolling. Category tracking still works in both fallbacks.

The hero uses larger athletic type, a single Book a court action, subtle image parallax, and overlapping court markings to represent several ways to play. The eyebrow, secondary Explore our place link, and photo caption have been removed following feedback. The original green/yellow palette and type families remain.

About occupies the viewport below the sticky navigation, using a continuous court-green background and oversized two-line type. Its title and amenities enter in a staggered GSAP sequence. On desktop, a short pinned ScrollTrigger scene rotates and moves the court illustration as Lenis drives scrolling; copy moves subtly before handing off to categories. Mobile and shorter viewports use the flowing layout without pinning. Reduced motion keeps all content static. Browser verification of this follow-up is left to the user as requested.

Motion references: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ and https://github.com/darkroomengineering/lenis.
