#!/usr/bin/env node
 
var path = require('path');
var exec = require('child_process').exec;

module.exports = function (context)
{
    var deferral = context.requireCordovaModule('q').defer();

    console.log("npm install");
    exec("npm install", { cwd: path.resolve(context.opts.projectRoot) }, function (error) {
        if (error !== null) {
            deferral.reject("npm install error: " + error);
            throw error;
        } else {
            let command;
            if(context.cmdLine.indexOf("--release") != -1) {
                command = "npm run build-production";
            } else {
                command = "npm run build";
            }
            console.log(command);
            exec(command, { cwd: path.resolve(context.opts.projectRoot) }, function (error) {
                if (error !== null) {
                    deferral.reject(command + "error: " + error);
                    throw error;
                } else {
                    deferral.resolve();
                }
            }).stdout.pipe(process.stdout)
        }
    }).stdout.pipe(process.stdout)

    return deferral.promise;
}