var	express	    =	require('express'),
    app         =	express();

app.set('port',	(process.env.PORT	||	9999));


// MAIN PAGE
app.use('/',        express.static('./dist/', {
        'index' : 'index.html'
}));
app.use('/shipping',	express.static('./dist/', {
        'index' : 'checkout__shipping.html'
}));
app.use('/payment',	    express.static('./dist/', {
        'index' : 'checkout__payment.html'
}));
app.use('/confirm',	    express.static('./dist/', {
        'index' : 'checkout__confirmation.html'
}));
app.use('/status',	    express.static('./dist/', {
        'index' : 'checkout__status.html'
}));


app.listen(app.get('port'),	function()	{
    console.log('Server	started:	http://localhost:'	+	app.get('port')	+	'/');
});