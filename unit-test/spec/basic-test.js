describe("Basic-tests", function() {
	obs = require('../../src/observable');
	var model;

	beforeEach(function() {
		model = {
			"aaa": "aaa",
			"bbb": 12345,
			"arra": [1, 2, 3],
			"ccc": {
				"ddd": 123,
				"arra": [1, 2, 3],
				"eee": {
					"fff": "asdjhaskjhad"
				}
			},
			"style": 2
		};
	});
	it("Notify when string property updated", function() {
		var m2 = obs.observe(model, function(prop, value, oldValue){
			expect(prop === "aaa").toBe(true);
		});
		model.aaa="abcdefg";
	});
	it("Notify when number property updated", function() {
		var m2 = obs.observe(model, function(prop, value, oldValue){
			expect(prop === "bbb" && model.bbb===321).toBe(true);
		});
		model.bbb=321;
	});
	it("Test deep property change", function() {
		var m2 = obs.observe(model, function(prop, value, oldValue){
			expect(prop === "ccc.eee.fff").toBe(true);
		});
		model.ccc.eee.fff=321;
	});
	it("Notify when array property updated", function() {
		var m2 = obs.observe(model, function(prop, value, oldValue){
			expect(model.ccc.arra.length == 4 && model.ccc.arra[3] === 321).toBe(true);
		});
		model.ccc.arra.push(321);
	});
});
