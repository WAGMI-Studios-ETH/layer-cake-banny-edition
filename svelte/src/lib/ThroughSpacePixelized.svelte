<script lang="ts">
  import { onMount } from 'svelte';
  import BlinkingStar from './BlinkingStar.svelte';

  let bitStarPositions = [];

  function getCenter(sky) {
    const w = sky.clientWidth;
    const h = sky.clientHeight;
    return {
      x: parseInt(w / 2),
      y: parseInt(h / 2),
    };
  }

  function getDot(x, y, group) {
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

<style lang="scss" global>
  @import './space.scss';
</style>
