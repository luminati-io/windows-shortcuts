var ws = require('../lib/windows-shortcuts');
var tape = require('tape');
var tmp = require('tmp');
var touch = require("touch");
var path = require("path");

tmp.setGracefulCleanup();

tape("create->query", function(t) {
	var target = tmp.tmpNameSync({postfix: ".txt"});
	touch.sync(target);
	var lnkName = tmp.tmpNameSync({postfix: ".lnk"});
	var lnkOpts = {
		target : target,
		args : '2 "baz quux"',
		workingDir: "C:\\Windows",
		runStyle : ws.MIN,
		hotkey: 100,
		desc : "Does cool stuff."
	};
	ws.create(lnkName, lnkOpts, function(err) {
		t.notOk(err, "No errors on create");
		ws.query(lnkName, function(err, opts) {
			t.notOk(err, "No errors on query");
			Object.keys(lnkOpts).forEach(function(k) {
				t.equal(lnkOpts[k], opts[k]);
			});
			t.end();
		});
	});
});

tape("create->edit->query", function(t) {
	var target = tmp.tmpNameSync({postfix: ".txt"});
	touch.sync(target);
	var lnkName = tmp.tmpNameSync({postfix: ".lnk"});
	var lnkOpts = {
		target : target,
		args : '2 "baz quux"',
		workingDir: "C:\\Windows",
		runStyle : ws.MIN,
		hotkey: 100,
		desc : "Does cool stuff."
	};
	var lnkNewOpts = {
		runStyle : ws.MAX,
		args: '3 4'
	};
	ws.create(lnkName, lnkOpts, function(err) {
		t.notOk(err, "No errors on create");
		ws.edit(lnkName, lnkNewOpts, function(err) {
			t.notOk(err, "No errors on edit");
			ws.query(lnkName, function(err, opts) {
				t.notOk(err, "No errors on query");
				Object.keys(lnkOpts).forEach(function(k) {
					if (k in lnkNewOpts) {
						t.equal(lnkNewOpts[k], opts[k]);
					} else {
						t.equal(lnkOpts[k], opts[k]);
					}
				});
				t.end();
			});
		});
	});
});

tape("create->query without target extension", function(t) {
	var target = tmp.tmpNameSync();
	touch.sync(target);
	var lnkName = tmp.tmpNameSync({postfix: ".lnk"});
	var lnkOpts = {
		target : target,
		args : '2 "baz quux"',
		workingDir: "C:\\Windows",
		runStyle : ws.MIN,
		hotkey: 100,
		desc : "Does cool stuff."
	};
	ws.create(lnkName, lnkOpts, function(err) {
		t.notOk(err, "No errors on create");
		ws.query(lnkName, function(err, opts) {
			t.notOk(err, "No errors on query");
			Object.keys(lnkOpts).forEach(function(k) {
				t.equal(lnkOpts[k], opts[k]);
			});
			t.end();
		});
	});
});

tape("create->query in directory", function(t) {
	var target = tmp.tmpNameSync({postfix: ".txt"});
	var targetObj = path.parse(target);
	touch.sync(target);
	var lnk = tmp.dirSync();
	var lnkOpts = {
		target : target,
		args : '2 "baz quux"',
		workingDir: "C:\\Windows",
		runStyle : ws.MIN,
		hotkey: 100,
		desc : "Does cool stuff."
	};
	ws.create(lnk.name, lnkOpts, function(err) {
		t.notOk(err, "No errors on create");
		ws.query(lnk.name + "\\" + targetObj.name + ".lnk", function(err, opts) {
			t.notOk(err, "No errors on query");
			Object.keys(lnkOpts).forEach(function(k) {
				t.equal(lnkOpts[k], opts[k]);
			});
			t.end();
		});
	});
});
