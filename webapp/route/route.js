var Index = require('../controller/index');
var About = require('../controller/about');
var Contact = require('../controller/contact');
var Content = require('../controller/content');
var Host = require('../controller/host');

exports.rootHandler = [

    /* index */
    {method: 'GET', path: '/', config: Index.index},
    {method: 'GET', path: '/search', config: Index.search},
    {method: 'GET', path: '/searchPage', config: Index.searchPage},
    {method: 'POST', path: '/searchMore', config: Index.searchMore},

    /* index total Count*/
    {method: 'GET', path: '/totalCnt', config: Index.totalCnt},

    /* about */
    {method: 'GET', path: '/about', config: About.index},

    /* contact */
    {method: 'GET', path: '/contact', config: Contact.index},

    /* content*/
    {method: 'GET', path: '/content', config: Content.index},

    /* content List*/
    {method: 'GET', path: '/contentList', config: Content.contentList},

    /* host Add Page*/
    {method: 'GET', path: '/hostAdd', config: Host.index},
    {method: 'POST', path: '/hostInsert', config: Host.insert},


];
