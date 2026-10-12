<script lang="ts">
  import { onMount, tick } from 'svelte';
  import Icon from './Icon.svelte';
  import { catalog, loadSports } from '../lib/catalog.svelte';
  import { peso } from '../lib/catalog';
  import { groupSports } from '../lib/categories';
  import { setupSportsMotion } from '../lib/motion';
  import { imageSrc, imageSet, localPhoto } from '../lib/images';

  let root: HTMLElement;
  let active = $state('');
  const categories = $derived(groupSports(catalog.sports));
  const introductions: Record<string, string> = {
    team: 'Bring the whole crew.',
    racquet: 'Find your rhythm. Keep the rally going.',
    paddle: 'A little competition. A lot of good company.',
  };
  let initialize: () => Promise<void> = async () => {};

  onMount(() => {
    const initialHash = window.location.hash;
    let disposed = false;
    let cleanup = () => {};
    initialize = async () => {
      cleanup();
      await loadSports();
      await tick();
      if (disposed) return;
      active = categories[0]?.id ?? '';
      cleanup = setupSportsMotion(root, (id) => (active = id));
      if (initialHash && window.location.hash === initialHash) {
        document.getElementById(initialHash.slice(1))?.scrollIntoView({ behavior: 'instant' });
      }
    };
    void initialize();
    return () => {
      disposed = true;
      cleanup();
    };
  });
</script>

<section
  class="showcase"
  id="games"
  data-tone="accent"
  bind:this={root}
  aria-labelledby="games-title"
>
  <div class="container site-container showcase-layout">
    <div class="showcase-index">
      <span class="section-eyebrow">SPORT CATEGORIES</span>
      <h2 id="games-title">MORE WAYS<br />TO PLAY.</h2>
      <nav aria-label="Sport categories">
        {#each categories as category}
          <a
            href={`#category-${category.id}`}
            class:current={active === category.id}
            aria-current={active === category.id ? 'location' : undefined}
            >{category.name}<Icon name="arrow" size={18} /></a
          >
        {/each}
      </nav>
      <div class="showcase-progress" aria-hidden="true"><span></span></div>
      <a class="text-link" href="/court">All courts & rates <Icon name="arrow" size={17} /></a>
    </div>
    <div class="showcase-stories" aria-busy={catalog.loading}>
      {#if catalog.loading}<p class="showcase-status" role="status">Loading sport categories…</p>
      {:else if catalog.error}<div class="showcase-status">
          <p role="alert">{catalog.error}</p>
          <button class="text-link" onclick={() => initialize()}>Retry</button>
        </div>
      {:else if categories.length === 0}
        <p class="showcase-status" role="status">
          Court details are being updated. Call 0917 555 7768.
        </p>
      {:else}
        {#each categories as category}
          {@const photo = category.sports[category.sports.length - 1]}
          {@const asset = localPhoto(photo.image)}
          <article
            class="sport-story"
            id={`category-${category.id}`}
            data-sport={category.id}
            aria-labelledby={`title-${category.id}`}
          >
            <div class="story-photo">
              <img
                src={asset ? imageSrc(asset) : photo.image}
                srcset={asset ? imageSet(asset) : undefined}
                sizes="(orientation: portrait) 100vw, 60vw"
                decoding="async"
                alt={photo.imageAlt}
                loading="lazy"
                width="1000"
                height="850"
              />
              <span class="story-photo-label">{category.name}</span>
            </div>
            <div class="story-info">
              <div class="story-intro">
                <div class="story-heading">
                  <h3 id={`title-${category.id}`}>{category.name}</h3>
                </div>
                {#if introductions[category.id]}<p>{introductions[category.id]}</p>{/if}
              </div>
              <ul class="category-sports" aria-label={`${category.name} courts`}>
                {#each category.sports as sport}
                  <li id={`game-${sport.id}`}>
                    <div>
                      <h4>{sport.name}</h4>
                      <span>{sport.court}</span>
                    </div>
                    <span class="category-rate"
                      >{peso(sport.minRate)}–{peso(sport.maxRate)} <small>/ hr</small></span
                    >
                    <a
                      href={`/booking?sport=${encodeURIComponent(sport.id)}`}
                      class="category-book"
                      aria-label={`Book ${sport.name}`}>Book <Icon name="arrow" size={18} /></a
                    >
                  </li>
                {/each}
              </ul>
            </div>
          </article>
        {/each}
      {/if}
    </div>
  </div>
</section>
