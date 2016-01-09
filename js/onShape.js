function onShape(state, world, s) {
	if (!state.playing) {
		return;
	}
	world.sounds.newShape();
	//remove unconfirmed shape
	s.sprite = generateSpriteForShape(world, s);
	world.stage.addChild(s.sprite);
	state.shapes.push(s);
	var uc = state.unconfirmedShapes[s.id];
	if (uc) {
		world.stage.removeChild(uc.sprite);
		delete state.unconfirmedShapes[s.id]
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
			if (kills(s1.type, s.type)) {
				anyKill = true;
				indexesToRemove.push(i);
				//scoreShape for kill
				state.scores[s.color] = state.scores[s.color] || {value: 0, level: s.level};
				var scoreShape = {
					t: s.t,
					x: s.x,
					y: s.y,
					size: s1.size,
					color: s.color,
					sprite: s1.sprite
				};
				state.scores[s.color].value += scoreShape.size;
				state.scoreShapes.push(scoreShape);
				if (world.color === s.color) {
					state.killCount++;
					if (state.killCount === 1 && world.level === 0) {
						help(state, world, 'Your first kill!')
					}
				}
			}
			if (kills(s.type, s1.type)) {
				state.shapes.pop(); // remove s
				s.size = 0;
				state.scoreShapes.push(s);
				break;
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
		var y = getMovedShapeY(world, s1, s.t);
		if (y < -s1.size || y > 1 + s1.size) {
			state.scores[s1.color] = state.scores[s1.color] || {value: 0};
			var scoreToAdd = s1.size - (s1.unverifiedScore || 0);
			state.scores[s1.color].value += scoreToAdd;
			if (scoreToAdd > 0.0000001) {
				state.scoreShapes.push(s1);
			}
			delete state.shapes[i];
			world.stage.removeChild(s1.sprite);
		}
	});
	state.shapes = state.shapes.filter(Boolean);
	return;

	function kills(type1, type2){
		return !!{
			'0':{ '1': true},
			'1':{ '2': true},
			'2':{ '0': true},
		}[type1][type2];
	}

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
