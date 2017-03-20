var Elasticsearch = require('elasticsearch');
var client = new Elasticsearch.Client({
    host: 's1:9200',
    log: 'info'
});

var keywordTitle = 'developSearch | Content';

exports.index = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/index');
        }

        var pageFrom;
        var pageCurrent;
        var pageNum=0;
        if(!request.query.p){
            pageFrom = 0;
            pageNum  = 1;
        }else{
            pageFrom = (request.query.p-1) * 10;
            pageNum  = request.query.p

        }
        pageCurrent = pageNum

        var pageLimit = 10;

        var pageMax = parseInt(pageNum / pageLimit) * pageLimit + pageLimit;

        client.search({
            index: 'nutch',
            type: 'doc',
            body: {
                fields: ["host", "id", "title", "url", "content"],
                sort: {
                    _score: {
                        order: "desc"
                    }
                },
                highlight: {
                    fields: {
                        content: {}
                    }
                },
                from: pageFrom,
                size: pageLimit,
                explain: true
            }
        }).then(function (resp) {
            const resultHits = resp.hits.hits;
            const content = new Array();

            for (i in resultHits) {
                var t = resultHits[i].fields.url.toString().search("/feed");
                if (t) {
                    resultHits[i].fields.url = resultHits[i].fields.url.toString().replace('/feed', '');
                }
                content.push(resultHits[i]);
            }


            return reply.view('content',
                {
                    results:content,
                    title: keywordTitle,
                    message: 'Index - Hello World!',
                    dirname: 'content',
                    img_path: '../../public/img/',
                    description: 'developSearch Content',
                    pageInfo : {
                        pageNum: parseInt(pageNum),
                        pageLimit: parseInt(pageLimit),
                        pageCurrent : pageCurrent,
                        pageMax : parseInt(pageMax),
                        limit : 10
                    }
                },
                {layout:'layout'}

            );
        }, function (err) {
            console.trace(err.message);
        });
    }

};

exports.contentList = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/index');
        }

        var tc = request.query.tc;
        var pageNum = (request.query.page-1) * 10;
        var limit = request.query.rowLimit;

        client.search({
            index: 'nutch',
            type: 'doc',
            body: {
                fields: ["host", "id", "title", "url", "content"],
                sort: {
                    _score: {
                        order: "desc"
                    }
                },
                highlight: {
                    fields: {
                        content: {}
                    }
                },
                from: pageNum,
                size: limit,
                explain: true
            }
        }).then(function (resp) {
            const resultHits = resp.hits.hits;
            const content = new Array();

            for (i in resultHits) {
                var t = resultHits[i].fields.url.toString().search("/feed");
                if (t) {
                    resultHits[i].fields.url = resultHits[i].fields.url.toString().replace('/feed', '');
                }
                content.push(resultHits[i]);
            }

            return reply({results:content, totalCount: tc});
        }, function (err) {
            console.trace(err.message);
        });
    }
};




exports.contentAjax = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/index');
        }

        var tc = request.query.tc;
        var pageNum = (request.query.page-1) * 10;
        var limit = request.query.rowLimit;

        client.search({
            index: 'nutch',
            type: 'doc',
            body: {
                fields: ["host", "id", "title", "url", "content"],
                sort: {
                    _score: {
                        order: "desc"
                    }
                },
                highlight: {
                    fields: {
                        content: {}
                    }
                },
                from: pageNum,
                size: limit,
                explain: true
            }
        }).then(function (resp) {
            const resultHits = resp.hits.hits;
            const content = new Array();

            for (i in resultHits) {
                var t = resultHits[i].fields.url.toString().search("/feed");
                if (t) {
                    resultHits[i].fields.url = resultHits[i].fields.url.toString().replace('/feed', '');
                }
                content.push(resultHits[i]);
            }

            return reply.view('ajax/contentAjax',
                {results:content, totalCount: tc},
                {layout:'nolayout'}
            );
        }, function (err) {
            console.trace(err.message);
        });
    }
};






