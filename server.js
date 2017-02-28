'use strict';
const __viewPath = "/webapp";
const __layouPath = "/webapp/views/public/layout";
const Path = require('path');
const Hapi = require('hapi');
const Good = require('good');
const Vision = require('vision');
const Auth = require('hapi-auth-cookie');
const Ejs = require('ejs');
const Inert = require('inert');
const Logger = require("./webapp/module/logging/logging");
const rootRouter = require('./webapp/route/route');

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

server.connection({
    port: 3000,
    host: 'localhost',
    labels: ['develop search']
});


// logger module //
Logger.logging(server, Good);


const PageOption = {
    query: {
        page: {
            name: 'page', // The page parameter will now be called the_page
            default:1
        },
        limit: {
            name: 'rowLimit', // The limit will now be called per_page
            default:30       // The default value will be 10
        }
    },
    meta: {
        location: 'body', // The metadata will be put in the response body
        name: 'metadata', // The meta object will be called metadata
        count: {
            active: true,
            name: 'count'
        },
        pageCount: {
            name: 'totalPages'
        },
        previous: {
            active: true,
            name: 'previous'
        },
        next: {
            active: true,
            name: 'next'
        },
        self: {
            active: true, // Will not generate the self link
            name: 'self'
        },
        first: {
            active: true, // Will not generate the first link
            name: 'first'
        },
        last: {
            active: true, // Will not generate the last link
            name: 'last'
        }
    },
    routes: {
        include: ['/contentList','/hostList'],
    }
};

// page option //
server.register({register: require('hapi-pagination'), options: PageOption}, function (err) {
    if (err)
    throw err;
});


// route register //
server.register([Auth, Vision, Inert], function (err) {

    if (err) {
        throw err;
    }
    // const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
    // server.app.cache = cache;

    server.auth.strategy('session', 'cookie', true, {
        password: 'password-should-be-32-characters',
        cookie: 'sid-example',
        // redirectTo: '/',
        isSecure: false
    });

    server.views({
        engines: {ejs: Ejs},
        relativeTo: __dirname + __viewPath,
        layoutPath: __dirname + __layouPath,
        path: 'views/public',
        layout: true
    });

    server.route({
        method: 'GET', path: '/public/js/{file*}', config: {auth: false},
        handler: {
            directory: {
                path: __dirname + '/public/js',
                listing: true,
                index: true
            }
        }
    });

    server.route({
        method: 'GET', path: '/public/css/{file*}', config: {auth: false},
        handler: {
            directory: {
                path: __dirname + '/public/css',
                listing: true,
                index: true
            }
        }
    });

    server.route({
        method: 'GET', path: '/public/fonts/{file*}', config: {auth: false},
        handler: {
            directory: {
                path: __dirname + '/public/fonts',
                listing: true,
                index: true
            }
        }
    });

    server.route({
        method: 'GET', path: '/public/img/{file*}', config: {auth: false},
        handler: {
            directory: {
                path: __dirname + '/public/img',
                listing: true,
                index: true
            }
        }
    });

    server.route({
        method: 'GET', path: '/sitemap/{file*}', config: {auth: false},
        handler: {
            directory: {
                path: '/home/heewoo/sitemap',
                listing: true,
                index: true
            }
        }
    });

    server.route({
        method: 'GET', path: '/sitemap-w/{file*}', config: {auth: false},
        handler: {
            directory: {
                path: '/home/heewoo/sitemap-w',
                listing: true,
                index: true
            }
        }
    });

    server.route({
        method: 'GET', path: '/{file*}', config: {auth: false},
        handler: {
            directory: {
                path: __dirname + '/public',
                listing: true,
                index: true
            }
        }
    });


    server.route(rootRouter.rootHandler);

    // 404 redirect
    server.ext('onPreResponse', function (request, reply) {
        if (request.response.isBoom) {
            return reply.redirect('/');
        }
        return reply.continue();
    });

});

server.start(function (err) {
    if (err) {
        throw err;
    }
    console.log("develop search start on port: 3000");
});




