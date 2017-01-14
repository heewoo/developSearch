const Options = {
    ops: {
        interval: 1000
    },
    reporters: {
        myConsoleReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{log: '*', response: '*'}]
        }, {
            module: 'good-console'
        }, 'stdout'],
        myFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ops: '*'}]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson'

        }],
        myHTTPReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{error: '*'}]
        }, {
            module: 'good-http',
            args: ['http://localhost:3000', {
                wreck: {
                    headers: {'x-api-key': 12345}
                }
            }]
        }]
    }
};

exports.logging = function (server) {
    server.register(
        /*  logging */
        {
            register: require('good'),
            options: Options
        },
        (err)=> {
        if (err) {
            throw err;
        }
    }
    )
    ;
}

