'use strict';

var crypto = require('crypto');
var strings = require('locutus/php/strings');

var secureToken = {
    urlGenerate: function urlGenerate(params) {

        if (!params === Object(params)) {
            throw new Error('urlGenerate: Params must be of type object');
            return;
        }

        /*
         wowzaSecureToken.urlGenerate({
         domain: '127.0.0.1',
         urlPrefix: 'vod/_definst_/mp4:', // your streaming file path is vod/mp4/test.mp4
         filePath: 'mp4',
         fileName: 'test.mp4',
         sharedSecret: 'uhef87bdub13e87',
         prefixParameter: 'wowzatoken', //default value is wowzatoken
         startTime: '1461322012789', //new Date()
         endTime: '1461322012789', //new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
         });
         */
        var obj = {
            domain: params.domain || '',
            urlPrefix: params.urlPrefix || '',
            filePath: params.filePath || '',
            fileName: params.fileName || '',
            sharedSecret: params.sharedSecret || '',
            prefixParameter: params.prefixParameter || 'wowzatoken',
            startTime: params.startTime || '0',
            endTime: params.endTime || '0'
        }

        var file = "";
        if (obj.filePath && obj.fileName) {
            file = obj.filePath + obj.fileName;
        }

        var usableHash = strings.strtr(crypto.createHash('sha256')
            .update(
                obj.urlPrefix
                + file
                + "?" + obj.sharedSecret
                + "&" + obj.prefixParameter + "endtime=" + obj.endTime
                + "&" + obj.prefixParameter + "starttime=" + obj.startTime
            ).digest('base64'), '+/', '-_');

        var postFixParam = obj.prefixParameter + "starttime=" + obj.startTime
            + "&" + obj.prefixParameter + "endtime=" + obj.endTime
            + "&" + obj.prefixParameter + "hash=" + usableHash;

        var httpUrl = "http://"
            + obj.domain + "/"
            + obj.urlPrefix
            + file
            + "/playlist.m3u8?"
            + postFixParam;

        var rtmpUrl = "rtmp://"
            + obj.domain + "/"
            + obj.urlPrefix
            + file
            + "?"
            + postFixParam;

        return {
            http: httpUrl,
            rtmp: rtmpUrl
        };
    }
}

module.exports = secureToken;