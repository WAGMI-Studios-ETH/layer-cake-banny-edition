<script lang="ts">
  import { onMount } from 'svelte';
  import Tilt from 'vanilla-tilt';
  import Space from './lib/Space.svelte';
  import SpacePixelized from './lib/SpacePixelized.svelte';
  import BlinkingStar from './lib/BlinkingStar.svelte';

  export let vibe: 'zoomy-stars' | 'pixelized' = 'zoomy-stars';

  let purse: HTMLElement;

  let front = './front.png';

  let ready = false;

  let amount = 1000;

  let SpaceColor = ""

  onMount(() => {
    Tilt.init(purse, {
      max: 25,
      speed: 500,
    });
    const search = location.hash.slice(1);
    const urlSearchParams = new URLSearchParams(search);
    const tokenId = urlSearchParams.get('tokenId');
    const cid = urlSearchParams.get('cid');
    let lock_period = urlSearchParams.get('lock_period');
    if (cid && tokenId) {
      front = `https://cloudflare-ipfs.com/ipfs/${cid}/${tokenId}.png`;
    }


    


    if (lock_period)   {
      amount = Number(lock_period.replace(/[^\d]/g, '')) * 5;

switch (lock_period) {
  case '10':
  SpaceColor = '#E15476' 
    break;
    case '50':
  SpaceColor = 'Teal'
    break;
    case '100':
  SpaceColor = '#B062FF'
    break;
    case '500':
  SpaceColor = '#FFC61C'
    break;
    case '1000':
  SpaceColor = '#4CE15B'
    break;
  default:
    break;
}
    }

    const interval = setInterval(() => {
      if (window.innerWidth > 100) {
        ready = true;
        clearInterval(interval);
      }
    }, 50);
  });
</script>

<div class="purse" bind:this={purse}>
  <div class="coin" data-tilt style="pointer-events: none">
    {#if vibe == 'zoomy-stars'}
      <div class="barrier" />
    {/if}
    <div class="front" style="background-image: url('{front}')" />
    <!-- <div class="side">
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
      <div class="spoke" />
    </div> -->
  </div>
  <div class="sparkles" style="pointer-events: none">
    {#if vibe == 'zoomy-stars'}
      <img src="./sparkles.gif" alt="" />
    {:else}
      <BlinkingStar type="small" top={20} left={15} />
      <BlinkingStar type="small" top={30} left={30} />
      <BlinkingStar type="small" top={45} left={75} />
      <BlinkingStar type="small" top={45} left={95} />
      {#each Array.from({ length: 50 }, (_, i) => i) as i}
        <BlinkingStar type="dot" top={Math.random() * 100} left={Math.random() * 100} />
      {/each}
    {/if}
  </div>
</div>

{#if ready}
  {#if vibe === 'zoomy-stars'}
    <Space color={SpaceColor}/>
  {:else if vibe === 'pixelized'}
    <SpacePixelized />
  {/if}
{/if}

<style>
  :global(body) {
    background-color: #000;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
  }
  .purse {
    height: 320px;
    width: 320px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -160px;
    margin-left: -160px;
    perspective: 1000;
    filter: saturate(1.45) hue-rotate(2deg);
    z-index: 1000;
  }
  .coin {
    height: 320px;
    width: 320px;
    position: absolute;
    transform-style: preserve-3d;
    transform-origin: 50%;
    animation-timing-function: linear;
  }
  .purse .sparkles {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 10000;
    border-radius: 50%;
    overflow: hidden;
    mix-blend-mode: color-dodge;
  }
  .coin .front,
  .coin .barrier {
    position: absolute;
    height: 320px;
    width: 320px;
    border-radius: 50%;
    background-size: cover;
  }
  .coin .barrier {
    background: #222;
  }
  .coin .front {
    transform: translateZ(16px);
  }
  .coin .barrier {
    clip-path: circle(320px);
    left: 50%;
    top: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: -5;
    border-width: 5px;
    border-style: solid;
    box-shadow: -10px -10px 25px 0px #32c8db, 10px -10px 25px 0px #32c8db, 10px 10px 25px 0px #32c8db,
      -10px 10px 25px 0px #32c8db;
    /* box-shadow: -10px -10px 25px 0px #ffff00bb, 10px -10px 25px 0px blue, 10px 10px 25px 0px red,
      -10px 10px 25px 0px green; */
    animation: spinin 25s linear infinite;
  }
  @keyframes spinin {
    from {
      transform: translate(-50%, -50%) rotateZ(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotateZ(360deg);
    }
  }

  /* NOTE: what are these spokes? */

  /* } */
  /* .coin .side {
    transform: translateX(144px);
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }
  .coin .side .spoke {
    height: 320px;
    width: 32px;
    position: absolute;
    transform-style: preserve-3d;
    backface-visibility: hidden;
  }
  .coin .side .spoke:before,
  .coin .side .spoke:after {
    content: '';
    display: block;
    height: 31.365484905459px;
    width: 32px;
    position: absolute;
    transform: rotateX(84.375deg);
    background: #222222;
    background: linear-gradient(to bottom, #222222 0%, #222222 74%, #202020 75%, #202020 100%);
    background-size: 100% 6.9701077567688px;
  }
  .coin .side .spoke:before {
    transform-origin: top center;
  }
  .coin .side .spoke:after {
    bottom: 0;
    transform-origin: center bottom;
  }
  .coin .side .spoke:nth-child(16) {
    transform: rotateY(90deg) rotateX(180deg);
  }
  .coin .side .spoke:nth-child(15) {
    transform: rotateY(90deg) rotateX(168.75deg);
  }
  .coin .side .spoke:nth-child(14) {
    transform: rotateY(90deg) rotateX(157.5deg);
  }
  .coin .side .spoke:nth-child(13) {
    transform: rotateY(90deg) rotateX(146.25deg);
  }
  .coin .side .spoke:nth-child(12) {
    transform: rotateY(90deg) rotateX(135deg);
  }
  .coin .side .spoke:nth-child(11) {
    transform: rotateY(90deg) rotateX(123.75deg);
  }
  .coin .side .spoke:nth-child(10) {
    transform: rotateY(90deg) rotateX(112.5deg);
  }
  .coin .side .spoke:nth-child(9) {
    transform: rotateY(90deg) rotateX(101.25deg);
  }
  .coin .side .spoke:nth-child(8) {
    transform: rotateY(90deg) rotateX(90deg);
  }
  .coin .side .spoke:nth-child(7) {
    transform: rotateY(90deg) rotateX(78.75deg);
  }
  .coin .side .spoke:nth-child(6) {
    transform: rotateY(90deg) rotateX(67.5deg);
  }
  .coin .side .spoke:nth-child(5) {
    transform: rotateY(90deg) rotateX(56.25deg);
  }
  .coin .side .spoke:nth-child(4) {
    transform: rotateY(90deg) rotateX(45deg);
  }
  .coin .side .spoke:nth-child(3) {
    transform: rotateY(90deg) rotateX(33.75deg);
  }
  .coin .side .spoke:nth-child(2) {
    transform: rotateY(90deg) rotateX(22.5deg);
  }
  .coin .side .spoke:nth-child(1) {
    transform: rotateY(90deg) rotateX(11.25deg);
  }
  .coin.skeleton .side .spoke,
  .coin.skeleton .side .spoke:before,
  .coin.skeleton .side .spoke:after {
    backface-visibility: visible;
  }
  .coin.skeleton .side .spoke {
    background: rgba(170, 170, 170, 0.1);
  }
  .coin.skeleton .side .spoke:before {
    background: rgba(255, 170, 170, 0.2);
  }
  .coin.skeleton .side .spoke:after {
    background: rgba(204, 204, 255, 0.2);
  } */
</style>
