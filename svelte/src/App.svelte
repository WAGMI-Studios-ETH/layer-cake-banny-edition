<script lang="ts">
  import { onMount } from 'svelte';

  const number_of_star = 150;

  let coin: HTMLElement;
  let sparkles: HTMLElement;

  const random_number = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  let front = './front.png';
  let back = './back.png';

  let ready = false;

  onMount(() => {
    const search = location.hash.slice(1);
    const urlSearchParams = new URLSearchParams(search);
    const tokenId = urlSearchParams.get('tokenId');
    const cid = urlSearchParams.get('cid');
    front = `https://cloudflare-ipfs.com/ipfs/${cid}/${tokenId}.png`;

    const interval = setInterval(() => {
      if (window.innerWidth > 100) {
        ready = true;
        clearInterval(interval);
      }
    }, 50);
  });

  function getStarData() {
    const star_rotation = 'move_right;';
    const star_top = random_number(0, window.innerHeight);
    const star_left = random_number(0, window.innerWidth);
    const star_radius = random_number(0, 4);
    const star_duration = random_number(6, 16);
    return {
      top: star_top,
      left: star_left,
      radius: star_radius,
      duration: star_duration,
      rotation: star_rotation,
    };
  }
  let animating = false;
  function spin() {
    animating = true;
    const [animation] = [coin, sparkles].map(elm =>
      elm.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(360deg)' }], {
        duration: 3000,
        iterations: 1,
        easing: 'cubic-bezier(0.42, 0, 0.58, 1)',
      }),
    );
    animation.onfinish = event => {
      if (animating) spin();
    };
  }
</script>

<div class="intro" />
<div class="purse" on:pointerenter={spin} on:pointerleave={() => (animating = false)}>
  <div bind:this={coin} class="coin" style="pointer-events: none">
    <div class="front" style="background-image: url('{front}')" />
    <div class="back" style="background-image: url('{back}');" />
    <div class="side">
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
    </div>
  </div>
  <div bind:this={sparkles} class="sparkles" style="pointer-events: none">
    <img src="./sparkles.gif" alt="" />
  </div>
</div>
{#if ready}
  {#each Array(number_of_star).fill(0).map(getStarData) as { top, left, radius, duration, rotation }}
    <div
      class="star"
      style="top:{top}px; left: {left}px; width: {radius}px; height: {radius}px; animation-name:{rotation}; animation-duration: {duration}s;"
    />
  {/each}
{/if}

<style>
  :root {
    background: black;
  }
  :global(body) {
    background-color: #000;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
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
    -webkit-box-reflect: below 0
      linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 45%, rgba(255, 255, 255, 0.2));
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
  .coin .back {
    position: absolute;
    height: 320px;
    width: 320px;
    border-radius: 50%;
    background-size: cover;
  }
  .coin .front {
    transform: translateZ(16px);
  }
  .coin .back {
    transform: translateZ(-16px) rotateY(180deg);
  }
  .coin .side {
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
  }
  .star {
    display: block;
    background-color: #fff;
    position: absolute;
    border-radius: 100%;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes move_right {
    from {
      transform: rotate(0deg) translateX(8px) rotate(0deg);
    }
    to {
      transform: rotate(360deg) translateX(8px) rotate(-360deg);
    }
  }

  @keyframes move_left {
    from {
      transform: rotate(0deg) translateX(8px) rotate(0deg);
    }
    to {
      transform: rotate(-360deg) translateX(8px) rotate(360deg);
    }
  }
  .intro {
    color: #63baf7;
    margin: 1em;
    font-family: Jura;
    font-size: 11pt;
  }
</style>
