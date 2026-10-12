<script lang="ts">
  import { tick } from 'svelte';
  import Icon from '../components/Icon.svelte';
  import { peso, todayInManila } from '../lib/catalog';
  import { catalog } from '../lib/catalog.svelte';
  import { requestBooking } from '../lib/api';
  import type { BookingRequest } from '../lib/types';
  let selectedSport = $state(
    new URLSearchParams(window.location.search).get('sport') || 'basketball',
  );
  $effect(() => {
    if (catalog.sports.length && !catalog.sports.some((sport) => sport.id === selectedSport))
      selectedSport = catalog.sports[0]!.id;
  });
  let name = $state('');
  let phone = $state('');
  let email = $state('');
  let date = $state('');
  let time = $state('18:00');
  let duration = $state(1);
  let message = $state('');
  let website = $state('');
  let submitting = $state(false);
  let error = $state('');
  let reference = $state('');
  let selected = $derived(catalog.sports.find((s) => s.id === selectedSport));
  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (submitting) return;
    submitting = true;
    error = '';
    reference = '';
    try {
      const booking: BookingRequest = {
        name,
        phone,
        email,
        sport: selectedSport,
        date,
        time,
        duration,
        message,
        website,
      };
      reference = await requestBooking(booking);
      name = '';
      phone = '';
      email = '';
      date = '';
      message = '';
      await tick();
      document.getElementById('booking-success')?.focus();
    } catch (cause) {
      error = cause instanceof Error ? cause.message : 'Request not saved. Please try again.';
    } finally {
      submitting = false;
    }
  }
</script>

<section id="booking" class="booking-section section-spacing" data-lenis-prevent>
  <div class="container site-container booking-layout">
    <div class="booking-copy">
      <h1 class="page-title">Book</h1>
      <p>We’ll contact you to confirm your slot.</p>
      <a href="tel:+639175557768" class="booking-phone"
        ><span>Call for a court<strong>0917 555 7768</strong></span></a
      >
    </div>
    <div class="booking-panel">
      <h2>Request a court</h2>
      {#if reference}<div class="booking-success" id="booking-success" role="status" tabindex="-1">
          <Icon name="check" size={28} />
          <h4>Request received</h4>
          <p>
            Reference: <strong>{reference}</strong>. We’ll contact you to confirm availability. Your
            court is reserved after confirmation.
          </p>
          <button class="text-link" onclick={() => (reference = '')}>Another request</button>
        </div>
      {:else if !selected}<p>
          {catalog.loading
            ? 'Loading court details…'
            : 'Court details unavailable. Call 0917 555 7768 to book.'}
        </p>
      {:else}<form onsubmit={submit} aria-busy={submitting}>
          <div class="row g-3">
            <div class="md:col-6">
              <label for="name" class="form-label">Name</label><input
                class="form-control"
                id="name"
                bind:value={name}
                required
                maxlength="100"
                autocomplete="name"
                placeholder="Juan dela Cruz"
              />
            </div>
            <div class="md:col-6">
              <label for="phone" class="form-label">Mobile number</label><input
                class="form-control"
                type="tel"
                id="phone"
                bind:value={phone}
                required
                maxlength="25"
                autocomplete="tel"
                placeholder="0917 123 4567"
              />
            </div>
            <div class="col-12">
              <label for="email" class="form-label"
                >Email <span class="optional">(optional)</span></label
              ><input
                class="form-control"
                type="email"
                id="email"
                bind:value={email}
                maxlength="254"
                autocomplete="email"
                placeholder="you@example.com"
              />
            </div>
            <div class="col-12">
              <label for="sport" class="form-label">Sport</label><select
                class="form-select"
                id="sport"
                bind:value={selectedSport}
                >{#each catalog.sports as sport}<option value={sport.id}
                    >{sport.name} · {peso(sport.minRate)}–{peso(sport.maxRate)} / hr</option
                  >{/each}</select
              >
            </div>
            <div class="md:col-5">
              <label for="date" class="form-label">Date</label><input
                class="form-control"
                type="date"
                id="date"
                bind:value={date}
                min={todayInManila()}
                required
              />
            </div>
            <div class="col-6 md:col-4">
              <label for="time" class="form-label">Start time</label><input
                class="form-control"
                type="time"
                id="time"
                bind:value={time}
                min="05:30"
                max="21:30"
                step="1800"
                required
              />
            </div>
            <div class="col-6 md:col-3">
              <label for="duration" class="form-label">Duration</label><select
                class="form-select"
                id="duration"
                bind:value={duration}
                >{#each [1, 2, 3, 4] as hours}<option value={hours}
                    >{hours} {hours === 1 ? 'hour' : 'hours'}</option
                  >{/each}</select
              >
            </div>
            <div class="col-12">
              <label for="message" class="form-label"
                >Notes <span class="optional">(optional)</span></label
              ><textarea
                class="form-control"
                id="message"
                bind:value={message}
                maxlength="2000"
                rows="3"
                placeholder="Group size, equipment needs…"></textarea>
            </div>
          </div>
          <div class="honeypot" aria-hidden="true">
            <label for="website">Website</label><input
              id="website"
              tabindex="-1"
              autocomplete="off"
              bind:value={website}
            />
          </div>
          <div class="booking-estimate">
            <span>Estimated rate</span><strong
              >{peso(selected.minRate * duration)}–{peso(selected.maxRate * duration)}</strong
            >
          </div>
          {#if error}<p class="form-error" id="booking-error" role="alert">{error}</p>{/if}
          <button
            class="btn btn-primary booking-submit"
            type="submit"
            disabled={submitting}
            aria-describedby={error ? 'booking-error' : undefined}
            >{submitting ? 'Sending…' : 'Request court'}<Icon name="arrow" /></button
          >
          <p class="form-note">
            A request is not a confirmed booking. We use your details to respond to your request.
          </p>
        </form>{/if}
    </div>
  </div>
</section>
