<script lang="ts">
  import Icon from './Icon.svelte';
</script>

<footer class="site-footer" id="location" data-tone="court">
  <div class="container site-container">
    <div class="footer-details">
      <div>
        <h2>Visit</h2>
        <address>Purok 2, San Francisco<br />Talibon, Bohol 6325</address>
        <a
          class="text-link footer-map"
          href="https://maps.google.com/?q=San+Francisco,+Talibon,+Bohol,+Philippines"
          target="_blank"
          rel="noopener noreferrer">Directions <Icon name="arrow" size={16} /></a
        >
        <p class="map-note">Barangay map. Call for exact directions.</p>
      </div>
      <div>
        <h2>Hours</h2>
        <dl>
          <div class="footer-hours">
            <dt>Mon–Fri</dt>
            <dd>6 AM – 10 PM</dd>
          </div>
          <div class="footer-hours">
            <dt>Sat–Sun</dt>
            <dd>5:30 AM – 10:30 PM</dd>
          </div>
          <div class="footer-hours">
            <dt>Night lighting</dt>
            <dd>5:30 PM – 10 PM</dd>
          </div>
        </dl>
      </div>
      <div class="footer-contact">
        <h2>Contact</h2>
        <a href="tel:+63385129842">038 512 9842</a>
        <a href="tel:+639175557768">0917 555 7768</a>
        <a href="mailto:sportszone.talibon@gmail.com">sportszone.talibon@gmail.com</a>
      </div>
    </div>
    <div class="footer-bottom">
      <a href="/" aria-label="Sports Zone home">SPORTS ZONE</a>
      <span>© {new Date().getFullYear()} Sports Zone</span>
    </div>
  </div>
</footer>
