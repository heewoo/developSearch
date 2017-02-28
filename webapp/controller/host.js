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

exports.hostList = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/index');
        }


        var tc = request.query.tc;
        var pageNum = (request.query.page) * 10;
        var limit = request.query.rowLimit;


        hostModel.find({}).sort({created_at:-1})
            .skip(pageNum)
            .limit(limit)
            .exec(function(err,list){
                if (err) {
                    console.log(err);
                    reply({result:false,resultMsg:"error"});
                }
                else {
                    reply({result:true,resultMsg:"success",results:list,totalCount: tc})
                }
            });


    }
};

exports.hostCount = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/index');
        }
        var hostInfo = new hostModel(request.payload);

        if(request.payload.host==""){
            hostModel.count({}, function (err, cnt) {
                if (err) {
                    console.log(err);
                    reply({result: false, resultMsg: "error"});
                }
                else {
                    reply({result: true, resultMsg: "success", resultCnt: cnt})
                }
            });
        }else {
            hostModel.count({host: hostInfo.host}, function (err, cnt) {
                if (err) {
                    console.log(err);
                    reply({result: false, resultMsg: "error"});
                }
                else {
                    reply({result: true, resultMsg: "success", resultCnt: cnt})
                }
            });
        }

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
        var hostInfo = new hostModel(request.payload);
        hostInfo.save(function (err) {
            if (err) {
                console.log(err);
                reply({result:false,resultMsg:"error"});
            }
            else {
                reply({result:true,resultMsg:"success"})
            }
        });

    }
};

exports.totalHostCnt = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (req, reply) {
        client.count({
            index: 'nutch'
        },function (error, response, status) {
            reply({result: true, count: response.count});
        });
    }
};




