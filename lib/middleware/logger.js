'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/5/2
 */
const fs = require('fs');
const util = require('util');
const lib = require('../util/lib.js');

/**
 * 
 * 
 * @param {any} path 
 * @param {any} name 
 * @param {any} msgs 
 */
const write = function write(path, name, msgs) {
    try {
        let log_path = `${think.root_path}${lib.sep}logs${lib.sep}${lib.isEmpty(path) ? 'console' : path}`;
        think.isDir(log_path) || think.mkDir(log_path);
        if (!think.isEmpty(msgs)) {
            let file = `${log_path}${lib.sep}${name ? name + '_' : ''}${lib.datetime('', 'yyyy-mm-dd')}.log`;
            msgs = ['[' + lib.datetime('', '') + ']'].concat([].slice.call(msgs));
            let message = util.format.apply(null, msgs) + '\n';
            fs.appendFile(file, message);
        }
    } catch (e) {}
};

/**
 * 
 * 
 * @param {any} [level=[]] 
 */
const logConsole = function logConsole(level = []) {
    ['info', 'warn', 'error'].map(item => {
        if (level.indexOf(item) > -1) {
            console[item] = function () {
                try {
                    let msgs = ['[' + item.toUpperCase() + ']'].concat([].slice.call(arguments));
                    write('', '', msgs);
                } catch (e) {}
            };
        }
    });
};

const logCustom = function logCustom(name, msgs) {
    try {
        msgs = ['[INFO]', lib.isString(msgs) ? msgs : (0, _stringify2.default)(msgs)];
        write('custom', name, msgs);
    } catch (e) {}
};

module.exports = function (options) {
    //logger仅执行一次
    think.app.once('appReady', () => {
        if (!options || !options.log) {
            return;
        }
        //日志
        let level = options.level || [];
        logConsole(level);
        think.addLogs = logCustom;
    });

    return function (ctx, next) {
        return next();
    };
};