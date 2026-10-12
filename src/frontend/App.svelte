<script lang="ts">
  import { onMount } from 'svelte';
  import Header from './components/Header.svelte';
  import Footer from './components/Footer.svelte';
  import HomePage from './pages/HomePage.svelte';
  import CourtPage from './pages/CourtPage.svelte';
  import GalleryPage from './pages/GalleryPage.svelte';
  import BookingPage from './pages/BookingPage.svelte';
  import NotFoundPage from './pages/NotFoundPage.svelte';
  import { currentPath, pageTitle } from './lib/pages';
  import { loadSports } from './lib/catalog.svelte';

  onMount(() => {
    if (['/court', '/booking'].includes(currentPath)) void loadSports();
  });
</script>

<svelte:head
  ><title
    >{pageTitle === 'Home'
      ? 'Sports Zone — Court rentals in Talibon'
      : `${pageTitle} | Sports Zone`}</title
  ></svelte:head
>

<Header />
<main id="main" tabindex="-1" class:offset={currentPath !== '/'}>
  {#if currentPath === '/'}<HomePage />
  {:else if currentPath === '/court'}<CourtPage />
  {:else if currentPath === '/gallery'}<GalleryPage />
  {:else if currentPath === '/booking'}<BookingPage />
  {:else}<NotFoundPage />{/if}
</main>
<Footer />
