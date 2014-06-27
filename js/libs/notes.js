	// Generate some scales (a, d & e)
	// Frequencies from http://www.seventhstring.com/resources/notefrequencies.html
	// Delta ratios are musical harmonies, like http://modularscale.com/
	var notes = {};
	notes.a = {
		min: [ 220.0,246.9,261.6,293.7,329.6,349.2,415.3,440.0,493.9,523.3 ],
		maj: [ 220.0,246.9,277.2,293.7,329.6,370.0,415.3,440.0,493.9,554.4 ]
	};

	notes.d = {
		min: generateScaleFrom( notes.a.min, 4/3 ),
		maj: generateScaleFrom( notes.a.maj, 4/3 )
	};

	notes.e = {
		min: generateScaleFrom( notes.a.min, 3/2 ),
		maj: generateScaleFrom( notes.a.maj, 3/2 )
	};


	function generateScaleFrom(originalScale, delta) {
	var newScale = [];
	originalScale.forEach(function (freq) {
		newScale.push(freq * delta);
	});
	return newScale;
	}