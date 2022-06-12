<script lang="ts">
  import { onMount } from 'svelte';
  import BlinkingStar from './BlinkingStar.svelte';
  import { stylesFromObject, setBackgroundLevelTransitions } from './utils';

  let bitStarPositions = [];
  let transitions = {};
  let skylevels = [];

  const levelColors = ['black', '#0F0E0E', 'black', '#0F0E0E', 'black', '#0F0E0E', 'black'];

  function getCenter(sky: Element) {
    const w = sky.clientWidth;
    const h = sky.clientHeight;
    return {
      x: w / 2,
      y: h / 2,
    };
  }

  function getDot(x: number, y: number, group: number) {
    const size = Math.round(Math.random() * 8);
    if (size >= 4) {
      bitStarPositions = [
        ...bitStarPositions,
        {
          // No need to set x,y here everytime, can be gotten once from the center
          x,
          y,
          group,
        },
      ];
      return;
    }
    const dot = document.createElement('span');
    dot.classList.add('stars-star', `stars-axis-${group}`, `stars-size-${size}`);
    dot.style.top = `${y}px`;
    dot.style.left = `${x}px`;
    return dot.cloneNode();
  }

  function init() {
    const sky = document.querySelector('#stars-sky');
    sky.innerHTML = '';
    for (let i = 1; i < 360; i++) {
      const { x, y } = getCenter(sky);
      const dot = getDot(x, y, i);
      if (dot) {
        sky.appendChild(dot);
      }
    }
  }

  onMount(() => {
    init();
    const data = setBackgroundLevelTransitions(levelColors);
    transitions = data.transitions;
    skylevels = data.skylevels;
  });
</script>

<div class="stars-outer">
  <div id="stars-sky">
    {#each bitStarPositions as position}
      <BlinkingStar
        type="small"
        size={Math.floor(Math.random() * 8)}
        unit="px"
        top={position.y}
        left={position.x}
        className={`stars-star stars-axis-${position.group}`}
      />
    {/each}
  </div>
</div>
<div class="sky">
  {#each Object.keys(transitions) as skyLevelTransition, i}
    <div class="sky-level" style={stylesFromObject(skylevels[i])}>
      {#each transitions[skyLevelTransition] as transition}
        <div style={stylesFromObject(transition)} />
      {/each}
    </div>
  {/each}
</div>

<style lang="scss" global>
  @import './space.scss';

  .sky {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    width: 1000%;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 100vh;
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
