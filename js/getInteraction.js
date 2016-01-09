function getInteraction(state, world) {
	var gfx = new PIXI.Graphics();
	gfx.beginFill(BACKGROUND_COLOR);
	gfx.drawRect(0, 0, 1, 1);
	var sprite = new PIXI.Sprite(gfx.generateTexture());
	// center the sprite's anchor point
	sprite.width = world.renderer.view.width;
	sprite.height = world.renderer.view.height;
	sprite.interactive = true;
	sprite.on('mousedown', onDown);
	sprite.on('touchstart', onDown);
	sprite.on('mousemove', onMove);
	sprite.on('touchmove', onMove);
	sprite.on('mouseup', onUp);
	sprite.on('touchend', onUp);
	return sprite;

	function onDown(e) {
		world.lastInteraction = Date.now();
		if (!state.readyToPlay) {
			return;
		}
		if (!state.playing && state.readyToPlay) {
			resetGame(state, world);
		}
		if (state.timeout) {
			clearTimeout(state.timeout);
		}
		if (!state.newShape) {
			state.newShape = {
				type: CIRCLE,
				id: Math.random() + '_' + Date.now(),
				x: getX(e),
				y: getY(e),
				size: 0.05,
				color: world.color
			};
			state.newShape.sprite = generateSpriteForShape(world, state.newShape);
			state.newShape.sprite.alpha = UNCONFIRMED_ALPHA;
			world.stage.addChild(state.newShape.sprite);
		} else {
			world.stage.removeChild(state.newShape.sprite);
			state.newShape.type = (state.newShape.type + 1) % 3;
			state.newShape.sprite = generateSpriteForShape(world, state.newShape);
			state.newShape.sprite.alpha = UNCONFIRMED_ALPHA;
			world.stage.addChild(state.newShape.sprite);
		}
		newShapeEmitter(world, state);
	}

	function onUp() {
		world.lastInteraction = Date.now();
		if (!state.readyToPlay) {
			return;
		}
		if (!state.playing && state.readyToPlay) {
			resetGame(state, world);
		}
		if (state.timeout) {
			clearTimeout(state.timeout);
		}
		state.timeout = setTimeout(commitShape, 300);
	}

	function getX(e) {
		return Math.min(Math.max(e.data.global.x / world.renderer.view.width, 0), 1);
	}

	function getY(e) {
		return Math.min(Math.max(e.data.global.y / world.renderer.view.height, 0), 1);
	}

	function onMove(e) {
		if (state.newShape) {
			state.newShape.x = getX(e);
			state.newShape.y = getY(e);
		}
	}

	function commitShape() {
		if (!state.newShape) {
			return;
		}
		world.stage.removeChild(state.newShape.sprite);
		delete state.newShape.sprite;
		var shape = {
			owner: world.id,
			id: state.newShape.id,
			x: state.newShape.x,
			y: state.newShape.y,
			type: state.newShape.type,
			size: state.newShape.size,
			localTime: Date.now(),
			level: world.level
		};
		state.newShape.sprite = generateSpriteForShape(world, state.newShape);
		state.newShape.sprite.visible = false;
		state.newShape.sprite.alpha = UNCONFIRMED_ALPHA;
		state.unconfirmedShapes[state.newShape.id] = state.newShape;
		world.stage.addChild(state.newShape.sprite);
		state.newShape = null;
		if (world.players > 1 && !COMPUTER_VIA_SERVER) {
			world.socket.emit('shape', shape);
		} else {
			shape.color = world.color;
			shape.t = getEstimatedServerT(world);
			onShape(state, world, shape);
			state.lastShape = shape;
		}
	}
}
