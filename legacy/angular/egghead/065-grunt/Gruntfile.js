// https://egghead.io/lessons/gruntjs-introduction-to-grunt

module.exports = function(grunt) {
	grunt.initConfig(grunt.file.readJSON("config.json"))

	grunt.registerTask("default", function (name) {
		grunt.log.writeln("Hello " + grunt.config.get("person").firstName);
	})
}