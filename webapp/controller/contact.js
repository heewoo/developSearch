exports.index = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/index');
        }
        reply.view('contact', {
            title: '개서치 - Contact',
            message: 'Index - Hello World!',
            dirname: 'contact',
            img_path: '../../public/img/',
            description: '개서치 Contact'
        });
    }
};

