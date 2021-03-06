function killShapeSprite(stage, sprite) {
	if (sprite.tl) {
		sprite.tl.kill();
		delete sprite.tl;
	}
	sprite.tl = new TimelineMax({
		autoRemoveChildren: true,
		onComplete: function () {
			stage.removeChild(sprite);
			if (sprite.tl) {
				sprite.tl.kill();
				delete sprite.tl;
			}
		}
	}).to(sprite.scale, 0.5, {ease: Power2.easeOut, x: 0, y: 0});
}
