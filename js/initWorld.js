function initWorld(state, world) {
	world.dClocks = [];
	world.latency = 120;
	world.latencies = [];
	world.id = Math.random() + '_' + Date.now();
	world.socket = io();
	world.textures = {};
	world.sounds = sfx();
	world.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
		backgroundColor: 0x000000,
		antialias: true
	});
	document.body.appendChild(world.renderer.view);
	world.stage = new PIXI.Container();
	world.background = getInteraction(state, world);
	world.stage.addChild(world.background);
	window.onresize = function () {
		world.renderer.resize(window.innerWidth, window.innerHeight);
		world.background.width = world.renderer.view.width;
		world.background.height = world.renderer.view.height;
		state.circles.forEach(function (c) {
			state.stage.removeChild(c.sprite);
			c.sprite = generateSpriteForCircle(world, c);
			state.stage.addChild(c.sprite);
		});
	};

	world.socket.on('start', function (e) {
		state.color = e.color;
		world.velocity = e.velocity;
		world.dClock = Date.now() - e.t;
		world.dClocks.push(world.dClock);
	});

	world.socket.on('circle', onCircle.bind(null, state, world));
	world.socket.on('circle', onCircleTime);

	function onCircleTime(c) {
		// find median latency
		if (c.owner === world.id) {
			world.latencies.push(Date.now() - c.localTime);
			world.latencies.sort();
			if (world.latencies.length === 600) {
				world.latencies = world.latencies.slice(200, 400);
			}
			world.latency = world.latencies[Math.floor(world.latencies.length / 2)];
		}
		// find median clockDifference
		if (c.owner === world.id) {
			world.dClocks.push(Date.now() - c.t);
			world.dClocks.sort();
			if (world.dClocks.length === 600) {
				world.dClocks = world.dClocks.slice(200, 400);
			}
			world.dClock = world.dClocks[Math.floor(world.dClocks.length / 2)];
		}
	}
}