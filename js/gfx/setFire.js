var fire = {
	"alpha": {
		"start": 0.62,
		"end": 0
	},
	"scale": {
		"start": 0.25,
		"end": 0.75,
		"minimumScaleMultiplier": 1
	},
	"color": {
		"start": "#fafafa",
		"end": "#fafafa"
	},
	"speed": {
		"start": 500,
		"end": 200
	},
	"acceleration": {
		"x": 0,
		"y": 0
	},
	"startRotation": {
		"min": 0,
		"max": 360
	},
	"rotationSpeed": {
		"min": 50,
		"max": 50
	},
	"lifetime": {
		"min": 0.1,
		"max": 0.75
	},
	"blendMode": "add",
	"frequency": 0.0001,
	"emitterLifetime": 0.15,
	"maxParticles": 500,
	"addAtBack": true,
	"spawnType": "shape",
	"spawnShape": {
		"x": 0,
		"y": 0,
		"r": 10
	}
};
var fireTexture = PIXI.Texture.fromImage('fire.png');
var particleTexture = PIXI.Texture.fromImage('particle.png');
function setFire(container, s) {
	var sprite = s.sprite;
	var conf = JSON.parse(JSON.stringify(fire));
	var factor = s.size * 8;
	conf.scale.start *= factor;
	conf.scale.end *= factor;
	conf.speed.start *= factor / 2;
	conf.speed.end *= factor / 2;
	conf.color.start = '#' + ('000000' + parseInt(s.color, 10).toString(16)).slice(-6);
	conf.color.end = '#' + ('000000' + parseInt(s.sprite.color, 10).toString(16)).slice(-6);
	conf.pos = sprite.position;
	var emitter = new cloudkid.Emitter(
		container,
		[fireTexture],
		conf);
	var elapsed = Date.now();
	var lastDt = 0;
	var update = function () {
		if (lastDt / 1000 > conf.emitterLifetime + conf.lifetime.max) {
			return emitter.destroy();
		}
		requestAnimationFrame(update);
		var now = Date.now();
		var dt = now - elapsed;
		emitter.update(dt * 0.001);
		elapsed = now;
		lastDt = dt;
	};
	emitter.emit = true;
	update();
}