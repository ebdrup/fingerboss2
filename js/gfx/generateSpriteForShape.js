function generateSpriteForShape(world, s) {
	var w = world.renderer.view.width;
	var h = world.renderer.view.height;
	var key = w + '_' + h + '_' + s.color + '_' + s.type;
	var texture = world.textures[key];
	if (!texture) {
		var gfx = new PIXI.Graphics();
		shape();
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

	function shape(color, type, sizeFactor) {
		color = color || s.color;
		type = type || s.type;
		sizeFactor = sizeFactor || 1;
		gfx.beginFill(color);
		var width = sizeFactor * 0.1 * w;
		var height = sizeFactor * 0.1 * h;
		switch (type) {
			case CIRCLE:
				gfx.drawEllipse(0, 0, width, height);
				break;
			case TRIANGLE:
				gfx.moveTo(0, -(height / 2));
				gfx.lineTo(width / 2, height / 2);
				gfx.lineTo(-width / 2, height / 2);
				break;
			case SQUARE:
				gfx.drawRect(-width / 2, -height / 2, width, height);
				break;
			default:
				throw new Error('unknown shape type:' + s.type);
		}
		gfx.endFill();
	}

}

