require('dotenv').config();

var csurf = require('csurf');
var express = require('express');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');

var userRoute = require('./routes/user.route');
var authRoute = require('./routes/auth.route');
var productRoute = require('./routes/product.route');
var cartRoute = require('./routes/cart.route');
var transferRoute = require('./routes/transfer.route');

var authMiddleware = require('./middlewares/auth.middleware');
var sessionMiddleware = require('./middlewares/session.middleware');

var port = 3000;

var app =express();
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMiddleware);
app.use(csurf({ cookie: true}));

app.use(express.static('public'));

app.get('/', function(req, res){
	res.render('index', {
		name: 'djdaan'
	});
});

app.use('/users', authMiddleware.requireAuth, userRoute);
app.use('/auth', authRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/transfer', authMiddleware.requireAuth, transferRoute);

app.listen(port, function(){
	console.log('Server listening on port' + port);
});

