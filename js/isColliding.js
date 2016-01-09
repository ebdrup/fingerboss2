function isColliding(world, s1, s2, t) {
	if (!s1.size || !s2.size) {
		return false;
	}
	var distance = Math.sqrt(
		Math.pow(Math.abs(s2.x - s1.x), 2) +
		Math.pow(Math.abs(getMovedShapeY(world, s2, t) - getMovedShapeY(world, s1, t)), 2)
	);
	var minDistance = (s2.size + s1.size) / 2;
	return distance < minDistance;
}
