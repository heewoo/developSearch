var Index = require('../controller/index');
var About = require('../controller/about');
var Contact = require('../controller/contact');

exports.rootHandler = [

    /* index */
    {method: 'GET', path: '/', config: Index.index},
    {method: 'GET', path: '/search', config: Index.search},
    {method: 'GET', path: '/searchPage', config: Index.page},
    {method: 'GET', path: '/totalCnt', config: Index.totalCnt},

    /* about */
    {method: 'GET', path: '/about', config: About.index},

    /* contact */
    {method: 'GET', path: '/contact', config: Contact.index},

];
