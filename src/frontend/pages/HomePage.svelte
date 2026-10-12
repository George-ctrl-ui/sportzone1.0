<script lang="ts">
  import { onMount } from 'svelte';
  import Hero from '../components/Hero.svelte';
  import SportsShowcase from '../components/SportsShowcase.svelte';
  import About from '../components/About.svelte';
  import { setupMotion } from '../lib/motion';
  let root: HTMLDivElement;
  onMount(() => setupMotion(root));
</script>

<div bind:this={root}><Hero /><About /><SportsShowcase /></div>
