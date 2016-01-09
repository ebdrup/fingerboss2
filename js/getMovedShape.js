function getMovedShapeY(world, s, t) {
	var dt = s.t - t;
	return s.y > 0.5 ? s.y + dt * world.velocity : s.y - dt * world.velocity;
}
