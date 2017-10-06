/* eslint-env node, es6 */
/* eslint no-console: 0 */

/**
 * Take an URL and translate to a local file path.
 * @param  {String} path The global URL
 * @returns {String} The local path
 */
function fileNameToLocal(path) {

    path = path

        // Don't use product folders
        .replace(
            '/code.highcharts.com/stock/',
            '/code.highcharts.com/'
        )
        .replace(
            '/code.highcharts.com/maps/',
            '/code.highcharts.com/'
        )

        // Load Highstock and Highmaps as modules
        .replace(
            '/code.highcharts.com/highmaps.js',
            '/code.highcharts.com/modules/map.js'
        )
        .replace(
            '/code.highcharts.com/highstock.js',
            '/code.highcharts.com/modules/stock.js'
        )

        // Use local files
        .replace(
            /https:\/\/code.highcharts.com\/(.*?)\.js$/,
            'code/$1.src.js'
        )
        .replace(
            /^code\/mapdata\/(.*?)\.src.js$/,
            'https://code.highcharts.com/mapdata/$1.js'
        );
    return path;
}

/**
 * Get the resources from demo.html files
 * @returns {Array.<String>} The file names
 */
function getFiles() { // eslint-disable-line no-unused-vars
    const fs = require('fs');
    const glob = require('glob-fs')({ gitignore: true });
    require('colors');

    const files = glob.readdirSync('samples/unit-tests/**/**/demo.html');
    const exclude = [
        /^https:\/\/code\.highcharts\.com\/js/,
        /^https:\/\/code\.highcharts\.com\/maps\/js/,
        /^https:\/\/code\.highcharts\.com\/stock\/js/,
        /^https:\/\/code\.highcharts\.com\/themes/
    ];

    let dependencies = [];

    let i = 0;

    files.forEach(file => {
        if (i < Infinity) {
            let html = fs.readFileSync(file, 'utf8');

            let regex = /src="(.*?)"/g;
            let match = regex.exec(html);
            let excluded = false;
            while (match) {

                let filename = match[1];
                exclude.forEach(pattern => { // eslint-disable-line no-loop-func
                    if (pattern.test(filename)) {
                        excluded = true;
                    }
                });

                filename = fileNameToLocal(filename);

                if (dependencies.indexOf(filename) === -1 && !excluded) {
                    dependencies.push(filename);
                }
                match = regex.exec(html);
            }
        }

        i++;
    });
    // console.log(('Found ' + dependencies.length + ' dependencies').green);
    /*
    console.log(dependencies.map(src => {
        src = src
            .replace(/^code/, 'http://code.highcharts.local')
            .replace(/\.src\.js$/, '.js');
        return `<script src="${src}"></script>`;
    }).join('\n'));
    // */
    // console.log(dependencies);
    return dependencies;
}


module.exports = function (config) {

    /*
    let files = [
        // External
        'vendor/jquery-1.9.1.js',
        'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data-2012-2022.min.js',

        // Highcharts
        'code/highcharts.src.js',
        'code/highcharts-more.src.js',
        'code/highcharts-3d.src.js',
        'code/modules/stock.src.js',
        'code/modules/map.src.js',
        'code/modules/annotations.src.js',
        // 'code/modules/boost.src.js',
        'code/modules/data.src.js',
        'code/modules/drilldown.src.js',
        'code/modules/exporting.src.js',
        'code/modules/exporting-data.src.js',
        'code/indicators/indicators.src.js',
        'code/indicators/*.src.js'
    ];
    */

    let files = getFiles();

    config.set({
        // frameworks: ['mocha', 'chai'],
        frameworks: ['qunit'],
        files: files.concat([

            // Set up
            'utils/samples/test-controller.js',
            'karma.setup.js',

            // Tests
            'samples/unit-tests/3d/*/demo.js',
            'samples/unit-tests/accessibility/*/demo.js',
            'samples/unit-tests/annotations/*/demo.js',
            // 'samples/unit-tests/axis/*/demo.js',
            // 'samples/unit-tests/boost/*/demo.js',
            // 'samples/unit-tests/chart/*/demo.js',
            'samples/unit-tests/color/*/demo.js',
            // 'samples/unit-tests/coloraxis/*/demo.js',
            'samples/unit-tests/data/*/demo.js',
            'samples/unit-tests/datalabels/*/demo.js',
            'samples/unit-tests/drilldown/*/demo.js',
            // 'samples/unit-tests/export-data/*/demo.js' // => move data into tests
            // 'samples/unit-tests/exporting/*/demo.js'
            'samples/unit-tests/global/*/demo.js',
            // 'samples/unit-tests/highcharts/*/demo.js',
            // 'samples/unit-tests/indicator-*/*/demo.js',
            // 'samples/unit-tests/interaction/*/demo.js',
            // 'samples/unit-tests/legend/*/demo.js',
            'samples/unit-tests/maps/*/demo.js',
            // 'samples/unit-tests/pane/*/demo.js',
            'samples/unit-tests/plotbandslines/*/demo.js'
            // 'samples/unit-tests/point/*/demo.js',
            // 'samples/unit-tests/pointer/*/demo.js',
            // 'samples/unit-tests/rangeselector/*/demo.js'
            // 'samples/unit-tests/responsive/*/demo.js',
            // 'samples/unit-tests/scrollbar/*/demo.js',
            // 'samples/unit-tests/scroller/*/demo.js'
            // 'samples/unit-tests/series/*/demo.js'


        ]),
        /*
        formatError: function (e) {
            console.log(arguments);
        },
        */
        reporters: ['progress'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        autoWatch: false,
        singleRun: true, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity
    });
};