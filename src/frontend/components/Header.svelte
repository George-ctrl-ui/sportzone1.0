<script lang="ts">
  import { currentPath } from '../lib/pages';
  import Icon from './Icon.svelte';
  let menuOpen = $state(false);
  const links = [
    { href: '/court', label: 'Court' },
    { href: '/gallery', label: 'Gallery' },
  ];
</script>

<svelte:window
  onkeydown={(event) => {
    if (event.key === 'Escape' && menuOpen) {
      menuOpen = false;
      document.getElementById('menu-toggle')?.focus();
    }
  }}
/>

<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-tone="page">
  <nav class="container site-container nav-shell" aria-label="Main navigation">
    <a href="/" class="brand" aria-label="Sports Zone home"
      ><img src="/favicon.svg" alt="" width="38" height="38" /><span
        >SPORTS<span class="brand-light">ZONE</span></span
      ></a
    >
    <button
      id="menu-toggle"
      class="menu-toggle"
      onclick={() => (menuOpen = !menuOpen)}
      aria-expanded={menuOpen}
      aria-controls="main-nav"
      aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
      ><Icon name={menuOpen ? 'close' : 'menu'} /></button
    >
    <div id="main-nav" class:menu-open={menuOpen} class="nav-links">
      {#each links as link}<a
          href={link.href}
          aria-current={currentPath === link.href ? 'page' : undefined}
          onclick={() => (menuOpen = false)}>{link.label}</a
        >{/each}
      <a
        href="/booking"
        aria-current={currentPath === '/booking' ? 'page' : undefined}
        class="btn btn-dark nav-book"
        onclick={() => (menuOpen = false)}>Book <Icon name="arrow" size={17} /></a
      >
    </div>
  </nav>
</header>
