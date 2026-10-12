<script lang="ts">
  import Icon from './Icon.svelte';
  import { imageSrc, imageSet } from '../lib/images';
</script>

<section class="hero-section" id="home" data-tone="page">
  <div class="container site-container hero-layout">
    <div class="hero-copy">
      <span class="hero-eyebrow"><i></i>TALIBON, BOHOL · OPEN 7 DAYS</span>
      <h1>
        <span class="hero-title-mask"><span class="hero-title-line">MAKE TIME</span></span>
        <span class="hero-title-mask"><span class="hero-title-line">FOR PLAY.</span></span>
      </h1>
      <p class="hero-lede">
        Bring your crew. Find your game.<br />Court rentals in Talibon, Bohol.
      </p>
      <div class="hero-actions">
        <a href="/booking" class="btn btn-primary">Book a court <Icon name="arrow" /></a>
      </div>
      <div class="hero-court" aria-hidden="true">
        <svg viewBox="0 0 350 180"
          ><path
            pathLength="1"
            d="M4 4h342v172H4zM175 4v172M4 53h63v74H4m342-74h-63v74h63"
          /><circle pathLength="1" cx="175" cy="90" r="29" /><path
            pathLength="1"
            d="M67 53a50 50 0 0 1 0 74m216-74a50 50 0 0 0 0 74"
          />
          <path
            class="court-rally-lines"
            d="M38 24h274v132H38zM116 24v132m118-132v132M38 90h78m118 0h78"
          /></svg
        >
        <span>ONE PLACE.<br />MORE WAYS TO PLAY.</span>
      </div>
    </div>
    <div class="hero-visual">
      <img
        class="hero-image"
        src={imageSrc('basketball-hero')}
        srcset={imageSet('basketball-hero')}
        sizes="(orientation: portrait) 100vw, 48vw"
        decoding="async"
        alt="Basketball hoop and ball"
        fetchpriority="high"
        width="900"
        height="1000"
      />
    </div>
  </div>
</section>
