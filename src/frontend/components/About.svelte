<script lang="ts">
  import { imageSrc, imageSet } from '../lib/images';
  const heading = 'Room for your crew.'.split(' ');
  const amenities = [
    'Regulation courts',
    'Evening floodlights',
    'Equipment rentals',
    'Changing rooms',
    'Customer parking',
    'Water refill station',
  ];
</script>

<section id="about" class="about-section" data-tone="court" aria-labelledby="about-title">
  <div class="about-stage">
    <img
      class="about-photo"
      src={imageSrc('basketball-court')}
      srcset={imageSet('basketball-court')}
      sizes="100vw"
      width="1600"
      height="1067"
      decoding="async"
      alt=""
      loading="lazy"
    />
    <div class="about-vignette" aria-hidden="true"></div>
    <svg class="about-court" viewBox="0 0 350 180" aria-hidden="true"
      ><path
        class="draw"
        pathLength="1"
        d="M4 4h342v172H4zM175 4v172M4 53h63v74H4m342-74h-63v74h63"
      /><circle class="draw" pathLength="1" cx="175" cy="90" r="29" /><path
        class="draw"
        pathLength="1"
        d="M67 53a50 50 0 0 1 0 74m216-74a50 50 0 0 0 0 74"
      /></svg
    >
    <div class="container site-container about-layout">
      <div class="about-art">
        <span class="art-top">SPORTS ZONE / TALIBON</span>
        <h2 id="about-title">
          <span class="about-title-mask"><span class="about-title-line">OUR</span></span>
          <span class="about-title-mask"><span class="about-title-line">PLACE.</span></span>
        </h2>
      </div>
      <div class="about-copy">
        <h3>
          {#each heading as word}<span class="word-mask"><span class="word">{word}</span></span
            >{' '}{/each}
        </h3>
        <p>A neighborhood sports center for pickup games, evening rallies, and team practice.</p>
        <ul class="amenities">
          {#each amenities as item}<li>{item}</li>{/each}
        </ul>
        <a href="#location" class="text-link">Directions</a>
      </div>
    </div>
    <i class="about-bar about-bar-top" aria-hidden="true"></i>
    <i class="about-bar about-bar-bottom" aria-hidden="true"></i>
    <div class="about-progress" aria-hidden="true"><span></span></div>
  </div>
</section>
