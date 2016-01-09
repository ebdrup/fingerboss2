function generateSpriteForShape(world, s) {
	var w = world.renderer.view.width, h = world.renderer.view.height;
	var key = w + '_' + h + '_' + s.color;
	var texture = world.textures[key];
	if (!texture) {
		var gfx = new PIXI.Graphics();
		gfx.beginFill(s.color);
		gfx.drawEllipse(0, 0, 0.1 * w, 0.1 * h);
		world.textures[key] = texture = gfx.generateTexture();
	}
	var sprite = new PIXI.Sprite(texture);
	// center the sprite's anchor point
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
	sprite.position.x = s.x * world.renderer.view.width;
	sprite.position.y = s.y * world.renderer.view.height;
	sprite.width = s.size * world.renderer.view.width;
	sprite.height = s.size * world.renderer.view.height;
	sprite.color = s.color;
	return sprite;
}

