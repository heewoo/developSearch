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


        var reqPage = request.query.p;

        var pageLimit = 10;
        var pageFrom;
        var pageCurrent;
        var pageNum;
        var pageTotal;
        var pageMax;

        if (!reqPage || reqPage == 0 || isNaN(reqPage)) {
            pageFrom = 0;
            pageNum = 1;
        } else {
            pageFrom = (reqPage - 1) * 10;
            pageNum = reqPage
        }


        pageCurrent = pageNum;
        pageMax = parseInt(pageNum / pageLimit) * pageLimit + pageLimit;

        if (pageNum <= 10) {
            pageMax = 10;
        }

        if (pageNum % pageLimit == 0) {
            if (pageNum > 10) {
                pageMax = pageMax - pageLimit;
            }
        }

        client.count({
            index: 'nutch'
        }, function (error, response) {

            pageTotal = response.count;

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
                        results: content,
                        title: keywordTitle + " Page " + pageNum,
                        message: 'Index - Hello World!',
                        dirname: 'content',
                        img_path: '../../public/img/',
                        description: 'developSearch Content',
                        pageInfo: {
                            pageNum: parseInt(pageNum),
                            pageLimit: parseInt(pageLimit),
                            pageCurrent: parseInt(pageCurrent),
                            pageMax: parseInt(pageMax),
                            pageTotal: parseInt(pageTotal/pageLimit),
                            limit: 10
                        }
                    },
                    {layout: 'layout'}
                );
            }, function (err) {
                console.trace(err.message);
            });
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
        var pageNum = (request.query.page - 1) * 10;
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

            return reply({results: content, totalCount: tc});
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
        var pageNum = (request.query.page - 1) * 10;
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
                {results: content, totalCount: tc},
                {layout: 'nolayout'}
            );
        }, function (err) {
            console.trace(err.message);
        });
    }
};






