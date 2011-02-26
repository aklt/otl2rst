#!/usr/bin/env node
/*
 * Date: 26-Feb-2011
 * Author: Anders Thøgersen
 * email: NaOnSdPeArMslt@gmail.com -- remove NOSPAM
 *
 * Convert vimoutliner[1] files into restructured text 
 * 
 * [1] http://www.vim.org/scripts/script.php?script_id=517
 */

var fs   = require('fs'),
    puts = require('util').puts;

String.prototype.repeat = function (num) {
    return new Array(num + 1).join(this);
};

var writer = {
    getBody: function (indent, text) {
        return text.slice(1);
    },
    getHeader: function (title) {
        var markup = '='.repeat(title.length);
        return [markup, title, markup, '', '.. contents::', ''].join('\n');
    },
    getTitle: function (indent, text) {
        var char = '=';
        switch (indent.length) {
        case 0: char = '='; break;
        case 1: char = '-'; break;
        case 2: char = '~'; break;
        case 3: char = '^'; break;
        case 4: char = '#'; break;
        }
        return [text, char.repeat(text.length)].join('\n');
    }
};

var reSplit = /[\r\n]+/g,
    re      = [ /^(\t*)\|(.*)$/, writer.getBody,
                /^(\t*)(\w.*)$/, writer.getTitle
    ],
    reLength = re.length;

process.argv.slice(2).forEach(function (filename) {
    puts(filename);
    fs.readFile(filename, function (err, otl) {
        if (err) {
            throw err;
        }
        var lines = otl.toString().split(reSplit),
        first = lines.shift();
        puts(writer.getHeader(first));
        lines.forEach(function (line) {
            for (var i = 0; i < reLength; i += 2) {
                var match = re[i].exec(line);
                if (match) {
                    puts(re[i+1].apply(writer, match.slice(1)));
                    break;
                } 
            }

        });
    });
});

