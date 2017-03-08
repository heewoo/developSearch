exports.index = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/index');
        }
        reply.view('about',
            {
            title: 'developSearch - About',
            message: 'Index - Hello World!',
            dirname: 'about',
            img_path: '../../public/img/',
            description: 'developSearch About'
            },
            {layout:'layout'}
        );
    }
};




