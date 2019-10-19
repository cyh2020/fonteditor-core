/**
 * @file ttfwriter
 * @author mengke01(kekee000@gmail.com)
 */
import assert from 'assert';
import {readData} from '../data';
import TTFReader from 'fonteditor-core/ttf/ttfreader';
import TTFWriter from 'fonteditor-core/ttf/ttfwriter';


describe('写ttf数据', function () {

    let fontObject = new TTFReader().read(readData('baiduHealth.ttf'));

    it('test write ttf', function () {
        let buffer = new TTFWriter().write(fontObject);
        assert.ok(buffer.byteLength > 1000);
        assert.ok(buffer.byteLength < 10000);

        let ttf = new TTFReader().read(buffer);

        assert.equal(ttf.version, 1);

        assert.equal(ttf.head.magickNumber, 1594834165);
        assert.equal(ttf.head.unitsPerEm, 512);

        assert.equal(ttf.post.format, 2);
        assert.equal(ttf.post.underlinePosition, 0);
        assert.equal(ttf.post.underlineThickness, 0);

        assert.equal(ttf.hhea.advanceWidthMax, 682);
        assert.equal(ttf.hhea.ascent, 480);
        assert.equal(ttf.hhea.descent, -33);

        assert.equal(ttf.maxp.version, 1);
        assert.equal(ttf.maxp.numGlyphs, 17);

        assert.equal(ttf.glyf[0].advanceWidth, 512);
        assert.equal(ttf.glyf[0].leftSideBearing, 0);
        assert.equal(ttf.glyf[0].name, '.notdef');
        assert.equal(ttf.glyf[3].contours[0].length, 31);
        assert.equal(ttf.glyf[16].compound, true);
        assert.equal(ttf.glyf[16].glyfs.length, 2);

        assert.equal(ttf.cmap[0], 1);
        assert.equal(ttf.cmap[57400], 16);
        assert.equal(+ttf.head.created === +fontObject.head.created, true);
        assert.equal(+ttf.head.modified === +fontObject.head.modified, true);

    });

    it('test write ttf error', function () {
        assert.throws(function () {
            let ttf = Object.assign({}, fontObject);
            ttf.head = null;
            new TTFWriter().write(ttf);
        });

        assert.throws(function () {
            let ttf = Object.assign({}, fontObject);
            ttf.glyf.length = 0;
            new TTFWriter().write(ttf);
        });

        assert.throws(function () {
            let ttf = Object.assign({}, fontObject);
            ttf.name = null;
            new TTFWriter().write(ttf);
        });

    });
});


describe('写ttf hinting数据', function () {

    let fontObject = new TTFReader({
        hinting: true
    }).read(readData('baiduHealth-hinting.ttf'));

    it('test write ttf hinting', function () {
        let buffer = new TTFWriter({
            hinting: true
        }).write(fontObject);
        assert.ok(buffer.byteLength > 1000);
        assert.ok(buffer.byteLength < 10000);

        assert.equal(fontObject.cvt.length, 24);
        assert.equal(fontObject.fpgm.length, 371);
        assert.equal(fontObject.prep.length, 204);
        assert.equal(fontObject.gasp.length, 8);
    });
});
