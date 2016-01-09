function generateSpriteForShape(world, s) {
	var w = world.renderer.view.width, h = world.renderer.view.height;
	var key = w + '_' + h + '_' + s.color + '_' + s.type;
	var texture = world.textures[key];
	if (!texture) {
		var gfx = new PIXI.Graphics();
		gfx.beginFill(s.color);
		switch(s.type){
			case CIRCLE:
				gfx.drawEllipse(0, 0, 0.1 * w, 0.1 * h);
				break;
			case TRIANGLE:
				gfx.moveTo(0,0);
				gfx.lineTo(-0.05 * w, 0.1 * h);
				gfx.lineTo(0.05 * w, 0.1 * h);
				break;
			case SQUARE:
				gfx.drawRect(0, 0, 0.1 * w, 0.1 * h);
				break;
			default:
				throw new Error('unknown shape type:' + s.type);
		}
		gfx.endFill();
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

