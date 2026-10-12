<script lang="ts">
  import Icon from '../components/Icon.svelte';
  import { peso } from '../lib/catalog';
  import { catalog, loadSports } from '../lib/catalog.svelte';
  import { imageSrc, imageSet, localPhoto } from '../lib/images';
  let filter = $state('All sports');
  const filters = ['All sports', 'Team sport', 'Racquet sport', 'Paddle sport'];
  let visible = $derived(
    filter === 'All sports' ? catalog.sports : catalog.sports.filter((s) => s.category === filter),
  );
</script>

<section id="sports" class="section-spacing sports-section">
  <div class="container site-container">
    <div class="section-heading">
      <h1 class="page-title">Court</h1>
    </div>
    <div class="filter-row" role="group" aria-label="Filter sports">
      {#each filters as item}<button
          class:active={filter === item}
          aria-pressed={filter === item}
          onclick={() => (filter = item)}>{item}</button
        >{/each}
    </div>
    <div aria-busy={catalog.loading}>
      {#if catalog.loading}<div class="sports-grid" aria-hidden="true">
          {#each [1, 2, 3, 4] as item}<div class="sport-skeleton">
              <div></div>
              <span></span>
            </div>{/each}
        </div>
        <p class="visually-hidden" role="status">Loading courts</p>
      {:else if catalog.error}<p class="form-error" role="alert">{catalog.error}</p>
        <button class="text-link" onclick={loadSports}>Retry</button>
      {:else if visible.length === 0}<p>No courts in this category.</p>
      {:else}<ul class="sports-grid">
          {#each visible as sport (sport.id)}
            {@const asset = localPhoto(sport.image)}
            <li class="sport-item">
              <article>
                <div class="sport-image-wrap">
                  <img
                    src={asset ? imageSrc(asset) : sport.image}
                    srcset={asset ? imageSet(asset) : undefined}
                    sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 25vw"
                    decoding="async"
                    alt={sport.imageAlt}
                    loading="lazy"
                    width="600"
                    height="700"
                  />
                </div>
                <div class="sport-card-heading">
                  <h2>
                    <a href={`/booking?sport=${encodeURIComponent(sport.id)}`}
                      >{sport.name}<Icon name="arrow" /></a
                    >
                  </h2>
                </div>
                <p>{sport.description}</p>
                <div class="sport-rate">
                  <span>{sport.court}</span><strong
                    >{peso(sport.minRate)}–{peso(sport.maxRate)}<small> / hr</small></strong
                  >
                </div>
              </article>
            </li>{/each}
        </ul>{/if}
    </div>
    <p class="rates-note">
      Rates vary by setup and time. Final pricing is confirmed with your request.
    </p>
  </div>
</section>
