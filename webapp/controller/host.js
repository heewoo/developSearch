var hostModel = require('../model/host');

exports.index = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/index');
        }
        reply.view('setting/hostAdd', {
            title: 'hostAdd',
            message: 'Index - Hello World!',
            dirname: 'host',
            img_path: '../../public/img/',
            description: 'developSearch About'
        });
    }
};


exports.hostInsert = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/index');
        }
        // var hostInfo = new hostModel(request.payload);
        // hostInfo.save(function (err) {
        //     if (err) {
        //         console.log(err);
        //         reply({result:false,resultMsg:"error"});
        //     }
        //     else {
        //         reply({result:true,resultMsg:"success"})
        //     }
        // });

    }
};






