<script lang="ts">
  import { onMount } from 'svelte';

  const levelColors = ['#F9329D', '#FE5EB4', '#FE6FBB', '#FE70EE', '#E270FE', '#BA70FE'];

  var transition = 40;
  var dots = 12;
  var lgStars = 2;
  var smStars = 3;

  const transitions = {};
  const skylevels = [];

  function nJoin(n, markup) {
    var fn = typeof markup == 'function' ? markup : e => markup;
    return new Array(n).join(' ').split(' ').map(fn).join('');
  }

  console.log(document.querySelectorAll('.sky-level'));

  // Stars and dots
  var bigStars = nJoin(
    lgStars,
    `
  <span class="star star--lg">
    <span class="star__part"></span>
    <span class="star__part"></span>
  </span>
`,
  );

  var smallStars = nJoin(
    smStars,
    `
  <span class="star star--sm">
    <span class="star__part"></span>
    <span class="star__part"></span>
  </span>
`,
  );

  var dotStars = nJoin(dots, e => {
    var isBlinking = Math.random() < 0.33;
    var className = 'dot';
    isBlinking && (className += ' dot--blinking');
    return `
    <span class="${className}"></span>
  `;
  });

  const stars = dotStars + smallStars + bigStars;

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
  });
</script>

<div class="sky">
  {#each Object.keys(transitions) as skyLevelTransition, i}
    {@debug skyLevelTransition}
    <div class="sky-level" style={stylesFromObject(skylevels[i])}>
      {#each transitions[skyLevelTransition] as transition}
        <div style={stylesFromObject(transition)} />
      {/each}
    </div>
  {/each}

  <div id="stars" class="sky-stars">
    {@html stars}
    <!--
    Markup for stars here. e.g.:
    span.dot
    span.dot.dot--blinking
    span.star.star--lg
      span.star__part
      span.star__part
    span.star.star--sm
      span.star__part
      span.star__part
    ...
    -->
  </div>
</div>

<style>
  .sky {
    width: 100%;
    height: 100%;
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
  /* .sky-level:nth-child(1) {
    padding-top: 16.6666666667vh;
    height: 16.6666666667vh;
    color: #f9329d;
    background: currentColor;
    z-index: 5;
  }
  .sky-level:nth-child(2) {
    padding-top: 33.3333333333vh;
    height: 33.3333333333vh;
    color: #fe5eb4;
    background: currentColor;
    z-index: 4;
  }
  .sky-level:nth-child(3) {
    padding-top: 50vh;
    height: 50vh;
    color: #fe6fbb;
    background: currentColor;
    z-index: 3;
  }
  .sky-level:nth-child(4) {
    padding-top: 66.6666666667vh;
    height: 66.6666666667vh;
    color: #fe70ee;
    background: currentColor;
    z-index: 2;
  }
  .sky-level:nth-child(5) {
    padding-top: 83.3333333333vh;
    height: 83.3333333333vh;
    color: #e270fe;
    background: currentColor;
    z-index: 1;
  }
  .sky-level:nth-child(6) {
    padding-top: 100vh;
    height: 100vh;
    color: #ba70fe;
    background: currentColor;
    z-index: 0;
  } */
  .sky-level div {
    float: left;
    height: 4px;
    background: currentColor;
  }
  .sky-stars {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 7;
  }
  .sky-stars .dot {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #fec8c9;
  }
  .sky-stars .dot:nth-child(1) {
    top: 76%;
    left: 34%;
  }
  .sky-stars .dot:nth-child(2) {
    top: 81%;
    left: 10%;
  }
  .sky-stars .dot:nth-child(3) {
    top: 30%;
    left: 2%;
  }
  .sky-stars .dot:nth-child(4) {
    top: 43%;
    left: 11%;
  }
  .sky-stars .dot:nth-child(5) {
    top: 76%;
    left: 60%;
  }
  .sky-stars .dot:nth-child(6) {
    top: 55%;
    left: 83%;
  }
  .sky-stars .dot:nth-child(7) {
    top: 55%;
    left: 58%;
  }
  .sky-stars .dot:nth-child(8) {
    top: 90%;
    left: 77%;
  }
  .sky-stars .dot:nth-child(9) {
    top: 31%;
    left: 59%;
  }
  .sky-stars .dot:nth-child(10) {
    top: 9%;
    left: 12%;
  }
  .sky-stars .dot:nth-child(11) {
    top: 15%;
    left: 3%;
  }
  .sky-stars .dot:nth-child(12) {
    top: 44%;
    left: 40%;
  }
  .sky-stars .dot--blinking {
    animation: blink 0.25s linear infinite;
  }
  .sky-stars .star {
    position: absolute;
    color: #fec8c9;
    animation: scale 0.5s linear infinite;
  }
  .sky-stars .star--sm {
    width: 28px;
    height: 28px;
  }
  .sky-stars .star--sm:nth-child(13) {
    top: 3%;
    left: 72%;
  }
  .sky-stars .star--sm:nth-child(14) {
    top: 59%;
    left: 79%;
  }
  .sky-stars .star--sm:nth-child(15) {
    top: 11%;
    left: 43%;
  }
  .sky-stars .star--lg {
    width: 48px;
    height: 48px;
  }
  .sky-stars .star--lg:nth-child(16) {
    top: 25%;
    left: 60%;
  }
  .sky-stars .star--lg:nth-child(17) {
    top: 14%;
    left: 73%;
  }
  .sky-stars .star::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: currentColor;
    animation: grow 0.5s linear infinite;
  }
  .sky-stars .star__part {
    position: absolute;
    background: currentColor;
  }
  .sky-stars .star__part:nth-child(1) {
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 20%;
  }
  .sky-stars .star__part:nth-child(2) {
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    width: 20%;
    height: 100%;
  }
  @keyframes blink {
    0%,
    32%,
    67% {
      opacity: 1;
    }
    33%,
    66% {
      opacity: 0;
    }
  }
  @keyframes scale {
    0%,
    16.4%,
    83.6%,
    100% {
      transform: scale(0.75, 0.75);
    }
    16.5%,
    33%,
    66.6%,
    83.5% {
      transform: scale(1, 1);
    }
  }
  @keyframes grow {
    0%,
    16.4%,
    83.6%,
    100% {
      width: 20%;
      height: 20%;
    }
    16.5%,
    33%,
    66.6%,
    83.5% {
      width: 50%;
      height: 50%;
    }
    33.1%,
    50%,
    66.5% {
      width: 100%;
      height: 100%;
    }
  }
</style>
