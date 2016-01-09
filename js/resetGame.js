function resetGame(state, world) {
	state.shapes = [];
	state.unconfirmedShapess = {};
	state.scores = {};
	state.newShape = null;
	state.newShapeText = null;
	state.scoreShapes = [];
	state.readyToPlay = true;
	state.playing = true;
	state.shrinkCount = 0;
	state.killCount = 0;
	TweenMax.killAll();
	if (world.stage) {
		for (var i = world.stage.children.length - 1; i >= 0; i--) {
			world.stage.removeChild(world.stage.children[i]);
		}
	}
}