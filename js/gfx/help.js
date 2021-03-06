function help(state, world, str) {
	var fontSize = getFontSize(world, str);
	var style = {
		font: 'bold ' + fontSize + 'px Impact, Futura-CondensedExtraBold, DroidSans, Charcoal, sans-serif',
		fill: '#' + ('000000' + parseInt(world.color, 10).toString(16)).slice(-6),
		align: 'center'
	};
	var text = new PIXI.Text(str, style);
	text.anchor.x = 0.5;
	text.anchor.y = 0.5;
	var h = text.height;
	text.x = Math.round(world.renderer.view.width / 2);
	text.y = Math.round(h / 2 + (world.renderer.view.height - h) * Math.random());
	world.stage.addChild(text);
	fadeSprite(world.stage, text)
}
