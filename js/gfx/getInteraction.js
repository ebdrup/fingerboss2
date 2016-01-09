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
		if (state.newShape || !state.readyToPlay) {
			return;
		}
		if (!state.playing && state.readyToPlay) {
			resetGame(state, world);
		}
		state.newShape = {
			id: Math.random() + '_' + Date.now(),
			x: getX(e),
			y: getY(e),
			size: START_SIZE,
			color: world.color
		};
		state.newShape.tl = new TimelineMax({
			autoRemoveChildren: true,
			onComplete: function () {
				onUp();
				help(state, world, 'Auto release');
			}
		}).to(state.newShape, GROW_TIME, {size: END_SIZE, ease: Power1.easeOut});
		state.newShape.sprite = generateSpriteForShape(world, state.newShape);
		state.newShape.sprite.alpha = UNCONFIRMED_ALPHA;
		world.stage.addChild(state.newShape.sprite);
		newShapeEmitter(world, state);
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

	function onUp() {
		world.lastInteraction = Date.now();
		var shape;
		if (state.newShape) {
			if (state.newShape.tl) {
				state.newShape.tl.kill();
				delete state.newShape.tl;
			}
			world.stage.removeChild(state.newShape.sprite);
			delete state.newShape.sprite;
			world.stage.removeChild(state.newShape.innerSprite);
			delete state.newShape.innerSprite;
			if (state.newShape.size > MIN_SIZE) {
				shape = {
					owner: world.id,
					id: state.newShape.id,
					x: state.newShape.x,
					y: state.newShape.y,
					size: state.newShape.size,
					localTime: Date.now(),
					level: world.level
				};
				state.newShape.sprite = generateSpriteForShape(world, state.newShape);
				state.newShape.sprite.visible = false;
				state.newShape.sprite.alpha = UNCONFIRMED_ALPHA;
				state.unconfirmedShapess[state.newShape.id] = state.newShape;
				world.stage.addChild(state.newShape.sprite)
			}
			state.newShape = null;
			if (shape) {
				for (var i = 0; i < state.shapes.length; i++) {
					var s1 = state.shapes[i];
					if (s1.color !== world.color && isColliding(world, shape, s1)) {

					}
				}
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
	}
}
