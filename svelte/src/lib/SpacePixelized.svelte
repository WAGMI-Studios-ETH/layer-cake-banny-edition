<script lang="ts">
  import { onMount } from 'svelte';
  import BlinkingStar from './BlinkingStar.svelte';

  const levelColors = ['#F9329D', '#FE5EB4', '#FE6FBB', '#FE70EE', '#E270FE', '#BA70FE'];

  const transition = 40;
  const dots = 55;
  const mdStars = 18;
  const smStars = 9;

  const transitions = {};
  const skylevels = [];

  let stars = [];

  function getRandomPosition() {
    const top = Math.floor(Math.random() * 90);
    const left = Math.floor(Math.random() * 100);
    return { top, left };
  }

  function getStars() {
    const stars = [];
    for (let i = 0; i < dots; i++) {
      const blinking = Math.random() < 0.33;
      const { top, left } = getRandomPosition();
      stars.push({ type: 'dot', blinking, top, left });
    }
    // for (let i = 0; i < lgStars; i++) {
    //   const { top, left } = getRandomPosition();
    //   stars.push({ type: 'large', top, left });
    // }
    for (let i = 0; i < mdStars; i++) {
      const { top, left } = getRandomPosition();
      stars.push({ type: 'medium', top, left });
    }
    for (let i = 0; i < smStars; i++) {
      const { top, left } = getRandomPosition();
      stars.push({ type: 'small', top, left });
    }
    return stars;
  }

  function stylesFromObject(obj: { [x: string]: any }) {
    return Object.keys(obj)
      .map(key => `${key}: ${obj[key]};`)
      .join(' ');
  }

  function setBackgroundLevelTransitions() {
    // For each level in the background, add 40 random divs
    // that will transition to the next level.
    for (let i = 0; i < levelColors.length; i++) {
      //   Initialize the transition array
      transitions[i] = [];
      // Calculate the sky level styles
      skylevels[i] = {
        background: 'currentColor',
        'z-index': levelColors.length - i,
        height: `${(100 / levelColors.length) * i}vh`,
        'padding-top': `${(100 / levelColors.length) * (i + 1)}vh`,
        color: levelColors[i],
      };
      // Add the transitions
      const p = Math.ceil(20 / transition);
      for (let j = 0; j < transition; j++) {
        const r = p * (transition - j + 1);
        transitions[i][j] = {
          width: Math.floor(Math.random() * r) + '%',
          'margin-left': Math.floor(Math.random() * 25) + '%',
        };
      }
    }
  }

  onMount(() => {
    setBackgroundLevelTransitions();
    stars = getStars();
  });
</script>

<div class="sky">
  {#each Object.keys(transitions) as skyLevelTransition, i}
    <div class="sky-level" style={stylesFromObject(skylevels[i])}>
      {#each transitions[skyLevelTransition] as transition}
        <div style={stylesFromObject(transition)} />
      {/each}
    </div>
  {/each}

  {#each stars as star}
    <BlinkingStar {...star} />
  {/each}
</div>

<style>
  :global(html, body, #app) {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
  }
  .sky {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    width: 1000%;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 100vh;
    /* Animation moving background from left to right */
    animation: moveSky 8s linear infinite;
  }

  .sky::-webkit-scrollbar {
    display: none;
  }

  /* Keyframes for moveSky */
  @keyframes moveSky {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-80%);
    }
  }
  .sky {
    position: relative;
  }
  .sky-level {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .sky-level div {
    float: left;
    height: 4px;
    background: currentColor;
  }
</style>
