function computerPlayer(state, world) {
	if (world.players > 1) {
		return;
	}
	if (state.nextComputerFire && (state.nextComputerFire > Date.now())) {
		return;
	}
	var s = Math.random() / 5;
	state.nextComputerFire = (s * 5900 + 500)/1.5 + Date.now();
	var x, y;
	if (state.lastShape && Math.random() > 0.5) {
		x = state.lastShape.x;
		y = state.lastShape.y;
		state.lastShape = null;
	} else {
		x = Math.random();
		y = Math.random();
	}
	onShape(state, world, {
		id: Math.random() + '_' + Date.now(),
		t: getEstimatedServerT(world),
		color: 0xff9500,
		x: x,
		y: y,
		size: s/2
	});
}