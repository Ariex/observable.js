define(function(require) {
    var obs = require("../src/observable");
    console.log(obs);

    window.model = {
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
        "style": 2,
        func: function(a,b,c,d,e,f,g){
        	console.log(a,b,c,d,e,f,g);
        }
    };

    var m2 = obs.observe(model, function(prop, value, oldValue) {
        console.log(prop + ": " + oldValue + " >> " + value);
    });
});
