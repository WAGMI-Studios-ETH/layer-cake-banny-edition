const number_of_star = 150;

const random_number = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function createStars() {
  const star_rotation = 'move_right;';
  for (let i = 0; i < number_of_star; i++) {
    rot = star_rotation === 'move_right;' ? 'move_left;' : 'move_right;';
    const star_top = random_number(0, document.documentElement.clientHeight);
    const star_left = random_number(0, document.documentElement.clientWidth);
    const star_radius = random_number(0, 4);
    const star_duration = random_number(6, 16);

    document.body.innerHTML +=
      "<div class='star' style='top: " +
      star_top +
      'px; left: ' +
      star_left +
      'px; width: ' +
      star_radius +
      'px; height: ' +
      star_radius +
      'px; ' +
      'animation-name:' +
      star_rotation +
      '; animation-duration: ' +
      star_duration +
      "s;'></div>";
  }
}

createStars();
