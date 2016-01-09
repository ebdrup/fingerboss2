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
	var shape = {
		id: Math.random() + '_' + Date.now(),
		type: Math.round(Math.random()*3),
		color: 0xff9500,
		x: x,
		y: y,
		size: SHAPE_SIZE
	};
	if(!COMPUTER_VIA_SERVER) {
		shape.t = getEstimatedServerT(world);
		onShape(state, world, shape);
	} else {
		world.socket.emit('shape', shape);
	}
}