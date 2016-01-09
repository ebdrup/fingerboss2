function onCircle(state, world, s) {
	if (!state.playing) {
		return;
	}
	world.sounds.newCircle();
	//remove unconfirmed shape
	s.sprite = generateSpriteForCircle(world, s);
	world.stage.addChild(s.sprite);
	state.shapes.push(s);
	var uc = state.unconfirmedCircless[s.id];
	if (uc) {
		world.stage.removeChild(uc.sprite);
		delete state.unconfirmedCircless[s.id]
	}
	var t = s.t;
	//same color collision detection
	merge(state, s, t);
	//collision detection
	var indexesToRemove = [];
	var anyCollision, anyKill;
	for (var i = 0; i < state.shapes.length - 1; i++) {
		var s1 = state.shapes[i];
		if (!s1 || !s || s1.color === s.color) {
			continue;
		}
		if (isColliding(world, s, s1, t)) {
			anyCollision = true;
			var cSize = s.size;
			s.size -= s1.size;
			s1.size -= cSize;
			if (s1.size <= KILL_SIZE) {
				anyKill = true;
				indexesToRemove.push(i);
				//scoreCircle for kill
				state.scores[s.color] = state.scores[s.color] || {value: 0, level: s.level};
				var scoreCircle = {
					t: s.t,
					x: s.x,
					y: s.y,
					size: (s1.size + cSize) * KILL_SCORE_FACTOR,
					color: s.color,
					sprite: s1.sprite
				};
				state.scores[s.color].value += scoreCircle.size;
				state.scoreCircles.push(scoreCircle);
				if (world.color === s.color) {
					state.killCount++;
					if (state.killCount === 1 && world.level === 0) {
						help(state, world, 'Your first kill!')
					}
				}
			}
			if (s.size <= KILL_SIZE) {
				state.shapes.pop(); // remove s
				s.size = 0;
				state.scoreCircles.push(s);
				break;
			}
		}
	}
	if (anyCollision && !anyKill) {
		world.sounds.shrink(0.04);
		if (s.color === world.color) {
			state.shrinkCount++;
			if (world.level === 0 && (state.shrinkCount === 1 || state.shrinkCount === 10)) {
				help(state, world, 'Try holding down longer');
			}
			if (world.level === 0 && (state.shrinkCount === 5 || state.shrinkCount === 15)) {
				help(state, world, 'Make your shape bigger\nthan the one you hit');
			}
		}
	}
	indexesToRemove.forEach(function (i) {
		var s1 = state.shapes[i];
		state.scores[s1.color] = state.scores[s1.color] || {value: 0};
		state.scores[s1.color].value -= (s1.unverifiedScore || 0); //remove state.scores added but not supposed to be
		delete state.shapes[i];
	});
	state.shapes = state.shapes.filter(Boolean);
	//remove & score shapes out of frame
	state.shapes.forEach(function (s1, i) {
		var y = getMovedCircleY(world, s1, s.t);
		if (y < -s1.size || y > 1 + s1.size) {
			state.scores[s1.color] = state.scores[s1.color] || {value: 0};
			var scoreToAdd = s1.size - (s1.unverifiedScore || 0);
			state.scores[s1.color].value += scoreToAdd;
			if (scoreToAdd > 0.0000001) {
				state.scoreCircles.push(s1);
			}
			delete state.shapes[i];
			world.stage.removeChild(s1.sprite);
		}
	});
	state.shapes = state.shapes.filter(Boolean);
	return;

	function merge(state, s1, t) {
		for (var i = 0; i < state.shapes.length; i++) {
			var s2 = state.shapes[i];
			if (!s2 || !s1 || s2.color !== s1.color || s2 === s1) {
				continue;
			}
			if (isColliding(world, s1, s2, t)) {
				if (s2.size > s1.size) {
					s2.size += s1.size;
					s1.size = 0;
					merge(state, s2, t);
				} else {
					s1.size += s2.size;
					s2.size = 0;
					merge(state, s1, t);
				}
			}
		}
	}
}
