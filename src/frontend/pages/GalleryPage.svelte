<script lang="ts">
  import { galleryPhotos, imageSrc, imageSet } from '../lib/images';
  let active = $state(0);
</script>

<section id="gallery" class="gallery-section section-spacing">
  <div class="container site-container">
    <div class="section-heading"><h1 class="page-title">Gallery</h1></div>
    {#if galleryPhotos[active]}<div class="gallery-frame">
        <img
          src={imageSrc(galleryPhotos[active].name)}
          srcset={imageSet(galleryPhotos[active].name)}
          sizes="(max-width: 1240px) 100vw, 1240px"
          alt={galleryPhotos[active].alt}
          decoding="async"
          width="1400"
          height="650"
        />
        <div class="gallery-caption">
          <span>{galleryPhotos[active].label}</span><small>Representative sports photography</small>
        </div>
      </div>
      <div class="gallery-tabs" role="group" aria-label="Choose gallery image">
        {#each galleryPhotos as photo, i}<button
            class:active={i === active}
            aria-pressed={i === active}
            onclick={() => (active = i)}>{photo.label}</button
          >{/each}
      </div>{/if}
  </div>
</section>
