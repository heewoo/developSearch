var Elasticsearch = require('elasticsearch');
var client = new Elasticsearch.Client({
    host: 's1:9200',
    log: 'info'
});

exports.index = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        if (request.auth.isAuthenticated) {
            return reply.redirect('/index');
        }
        reply.view('index', {
            title: '개서치',
            message: 'Index - Hello World!',
            dirname: 'index',
            description: '개발 검색사이트'
        });
    }
};

exports.totalCnt = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (req, reply) {
        client.count(function (error, response, status) {
            reply({result: true, count: response.count});
        });
    }
};

exports.search = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        const params = request.query;
        const keyword = params.q;
        const result = "";
        // elasticsearch-odm - npm 추후 적용 ( https://www.npmjs.com/package/elasticsearch-odm ) //
        client.search({
            index: 'nutch',
            type: 'doc',
            body: {
                query: {
                    multi_match: {
                        query: keyword,
                        fields: ["title", "content"],
                        tie_breaker: 0.5,
                        type: "best_fields",
                        fuzziness: "AUTO"
                    }
                },
                fields: ["host", "id", "title", "url", "content"],
                sort: {
                    _score: {
                        order: "desc"
                    }
                },
                highlight: {
                    // pre_tags:["<strong>"],
                    // post_tags:["</strong>"],
                    fields: {
                        content: {}
                    }
                },
                from: 0,
                size: 50,
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
            return reply.view('search', {
                title: 'search | Hapi ' + request.server.version,
                keyword: keyword,
                contents: content,
                total: resp.hits.total,
                took: resp.took / 1000,
                dirname: 'index',
                description: '개발 검색사이트'
            });
        }, function (err) {
            console.trace(err.message);
        });

    }
};


exports.page = {
    auth: {
        mode: 'try',
        strategy: 'session'
    },
    handler: function (request, reply) {
        const params = request.query;
        const keyword = params.q;
        client.search({
            index: 'nutch',
            type: 'doc',
            body: {
                query: {
                    match_phrase: {_id: keyword}
                },
                fields: ["host", "id", "title", "url", "content", "anchor"]
            }
        }).then(function (resp) {
            const resultHits = resp.hits.hits;
            const content = new Array();
            var title = "";
            var anchor = "";

            if (resp.hits.total > 0) {
                var t = resultHits[0].fields.url.toString().search("/feed");
                if (t) {
                    resultHits[0].fields.url = resultHits[0].fields.url.toString().replace('/feed', '');
                }

                content.push(resultHits[0]);
                title = resultHits[0].fields.title;

                return reply.view('search', {
                    title: title + '| search',
                    keyword: keyword,
                    anchor: anchor,
                    contents: content,
                    total: resp.hits.total,
                    took: resp.took / 1000,
                    dirname: 'index',
                    description: resultHits[0].fields.content.toString().substring(0, 200)
                });
            } else {
                var err_msg = "Not find data !";
                return reply.view('search', {
                    title: err_msg + '| search',
                    keyword: err_msg,
                    anchor: err_msg,
                    contents: err_msg,
                    total: resp.hits.total,
                    took: resp.took / 1000,
                    dirname: 'index',
                    description: err_msg
                });
            }
        }, function (err) {
            console.trace(err.message);
        });

    }
};

