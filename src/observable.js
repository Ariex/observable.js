"use strict";
(function(root, factory) {
	if (typeof define === "function" && define.amd) { // for AMD and normal
		define(function() {
			return root.observable = factory();
		});
	} else if (typeof module === "object" && module.exports) { // for CommonJS and normal
		module.exports = (root.observable = factory());
	} else { // normal
		root.observable = factory();
	}
}(this, function() {
	var isArray = function(arr) {
		return Object.prototype.toString.call(arr) === "[object Array]";
	}
	var isFunc = function(arr) {
		return Object.prototype.toString.call(arr) === "[object Function]";
	}
	var isObj = function(obj) {
		return Object.prototype.toString.call(obj) === "[object Object]";
	}
	var isReg = function(reg) {
		return Object.prototype.toString.call(obj) === "[object RegExp]";
	}
	var isSimpleObject = function(obj) {
		return !(isArray(obj) || isFunc(obj) || isObj(obj) || isReg(obj));
	}

	var defProp = Object.defineProperty;
	var hasProp = Object.hasOwnProperty;

	var arrayModFuncs = ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"];

	var returnObj = {
		observe: function(obj, valueChangedHandler, path) {
			path = path || "";
			if (isArray(obj)) {
				// bind for array
				for (var i = 0; i < arrayModFuncs.length; i++) {
					(function(func, o) {
						var oldFunc = o[func];
						o[func] = function() {
							var returnVal = oldFunc.apply(this, arguments);
							if (isFunc(valueChangedHandler)) {
								valueChangedHandler((path).slice(1), this, returnVal);
							}
							return returnVal;
						}
					}(arrayModFuncs[i], obj));
				}
			} else if (isFunc(obj)) {
				// bind for func
				return function(){
					// console.log("before func exec");
					try{
						obj.apply(this, arguments);
						// console.log("after func exec");
					}catch(ex){
						// console.log("whe error happened");
						throw ex;
					}finally{
						// console.log("exec finished");
					}
				}
			} else {
				// normal object
				try {
					defProp({}, "_", {
						value: "_"
					});
					for (var prop in obj) {
						if (isObj(obj[prop])) {
							returnObj.observe(obj[prop], valueChangedHandler, path + "." + prop);
						} else if (isArray(obj[prop])) {
							obj[prop] = returnObj.observe(obj[prop], valueChangedHandler, path + "." + prop);
						} else if (isFunc(obj[prop])) {
							// do nothing
							obj[prop] = returnObj.observe(obj[prop], valueChangedHandler, path + "." + prop);
						} else {
							if (hasProp.call(obj, prop)) {
								// add setter and getter to this prop
								(function(pname) {
									var v = obj[pname];
									defProp(obj, pname, {
										get: function() {
											return v;
										},
										set: function(value) {
											var oldValue = v;
											v = value;
											if (isFunc(valueChangedHandler)) {
												valueChangedHandler((path + "." + pname).slice(1), value, oldValue);
											}
										}
									});
								}(prop));
							}
						}
					}
				} catch (e) { // IE8, ignore other ancient browsers
					var dom = document.createElement("obj");
					for (var prop in obj) {
						if (isObj(obj[prop])) {
							dom[prop] = returnObj.observe(obj[prop], valueChangedHandler, path + "." + prop);
						} else {
							// add setter and getter to this prop
							(function(pname) {
								var v = obj[pname];
								defProp(dom, pname, {
									get: function() {
										return v;
									},
									set: function(value) {
										var oldValue = v;
										v = value;
										if (isFunc(valueChangedHandler)) {
											valueChangedHandler((path + "." + pname).slice(1), value, oldValue);
										}
									}
								});
							}(prop));
						}
					}

					obj = dom;
				}
			}
			return obj;
		}
	};
	return returnObj;
}));
