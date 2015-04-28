

                                var express = require('express');
                                var path = require('path');
                                var favicon = require('serve-favicon');
                                var logger = require('morgan');
                                var cookieParser = require('cookie-parser');
                                var bodyParser = require('body-parser');
                                var http = require('http');
                                var mysql = require('mysql');
                                var session = require('express-session');
                                var fs = require('fs');
                                var busboy = require('connect-busboy');
                                var admin = require('./routes/admin');
                                var adminOrders = require('./routes/adminOrders');
                                var customers = require('./routes/customers');
                                var register = require('./routes/register');
                                var user = require('./routes/user');
                                var app = express();
                                var flash = require('connect-flash-light');
                                var connection = require('express-myconnection');
                                var upload = require('formidable-upload');
                                var formidable = require('formidable');
                                // all environments
                                app.set('view engine', 'ejs');
                                app.set('views', path.join(__dirname, 'views'));
                                app.set('port', process.env.PORT || 4302);

                                //app.use(express.favicon());

                                app.route('/upload').post(function (req, res, next) {

                                  var form = new formidable.IncomingForm();
                                    //Formidable uploads to operating systems tmp dir by default
                                    form.uploadDir = "./images";       //set upload directory
                                    form.keepExtensions = true;     //keep file extension

                                    form.parse(req, function(err, fields, files) {
                                        res.writeHead(200, {'content-type': 'text/plain'});
                                        res.write('received upload:\n\n');
                                        console.log("form.bytesReceived");


                                        fs.rename(files.fileUploaded.path, './images/'+files.fileUploaded.name, function(err) {
                                        if (err)
                                            throw err;
                                          console.log('renamed complete');  
                                        });
                                          res.end();
                                    });
                                });




                                app.use(session({
                                    secret: 'ssshhhhh'
                                }));
                                var sess;

                                app.use(logger('dev'));
                                app.use(bodyParser.json());
                                app.use(bodyParser.urlencoded({
                                    extended: true,
                                    keepExtensions: true, uploadDir:'/Users/akshay/Documents/workspace/nodeProj/public/images' 
                                }));
                                app.use(cookieParser());
                                app.use(express.static(path.join(__dirname, 'public')));
                               
                                app.use(session({
                                    cookie: {
                                        maxAge: 60000
                                    }
                                }));
                                 app.use(flash());  

                               


                                //login Admin

                                app.get('/login', admin.loginAdmin);
                                app.post('/home', admin.doLoginAdmin);
                                //register
                                app.get('/', admin.getIndex);

                                //user
                                app.get('/check', register.check);

                                app.get('/signup', register.signup);
                                app.post('/signup', register.insertUser);
                                app.get('/user/login', user.loginUser);
                                app.post('/user/home', user.doLoginUser);
                                app.get('/user/home', user.getHomeUser);

                                app.get('/user/products', user.viewProducts);
                                app.get('/user/add/:product_id', user.addToCart);

                                app.post('/user/confirmQuantity/:product_id/:productQuantity/:productPrice', user.confirmQuantity);

                                app.get('/user/products/confirm/:product_id/:orderQuantity/:productPrice', user.confirmOrder);

                                app.post('/user/a/products/confirm/:product_id/:orderQuantity/:productPrice', user.confirmedOrder);

                                app.get('/user/view/orders', user.viewOrders);
                                app.get('/user/cancelOrder/:order_id/cancel/:isCancelled', user.cancelUserOrder);

                                app.get('/user/delivery/:order_id/:isDelivered',user.checkDelivery);

                                


                                //app.get('/user/login', register.loginDo);
                                //app.get("/user/:name", register.name);
                                //app.post("/home", register.create);
                                //app.options('/user/hey/login', register.options);

                                //app.get('/editOrganization', customers.editOrganization);

                                app.get('/home', admin.getHome);
                                app.get('/products', admin.getProducts);
                                app.get('/products/add', admin.addProducts);
                                app.post('/products', admin.save);
                                app.get('/deleteProducts/:product_id', admin.deleteProducts);
                                app.get('/products/edit/:product_id', admin.getDetails);
                                app.post('/products/:product_id', admin.saveDetails);

                                app.get('/logout', admin.logout);

                                app.get('/orders', adminOrders.getOrders);

                                app.get('/orders/add', adminOrders.addOrders);

                                app.post('/orders', adminOrders.saveOrders);

                                app.get('/deleteorders/:order_id', adminOrders.deleteOrders);

                                app.get('/orders/edit/:order_id', adminOrders.getDetailsOrders);

                                app.post('/orders/:order_id', adminOrders.saveDetailsOrders);

                                app.get('/cancelOrder/:order_id/cancelst/:isCancelled', adminOrders.cancelOrder);


                                app.get('/view/orders/:username', adminOrders.viewSingleUserOrder);


                                app.get('/cancelOrder/one/:order_id/:isCancelled', adminOrders.cancelOneOrder);
                                //app.post('/orders/:order:id/:id', adminOrders.saveCancelOrder);

                                app.route('/upload')
                                    .post(function (req, res, next) {

                                        var fstream;
                                        req.pipe(req.busboy);
                                        req.busboy.on('file', function (fieldname, file, filename) {
                                            console.log("Uploading: " + filename);

                                            //Path where image will be uploaded
                                            fstream = fs.createWriteStream(__dirname + '/images/' + filename);
                                            file.pipe(fstream);
                                            fstream.on('close', function () {    
                                                console.log("Upload Finished of " + filename);              
                                                res.redirect('login');           //where to go next
                                            });
                                        });
                                    });
                                //catch 404 and forward to error handler
                                app.use(function(req, res, next) {
                                    var err = new Error('Not Found');
                                    err.status = 404;
                                    next(err);
                                });


                                








                                // error handlers

                                // development error handler
                                // will print stacktrace
                                if (app.get('env') === 'development') {
                                    app.use(function(err, req, res, next) {
                                        res.status(err.status || 500);
                                        res.render('error', {
                                            message: err.message,
                                            error: err
                                        });
                                    });
                                }

                                // production error handler
                                // no stacktraces leaked to user
                                app.use(function(err, req, res, next) {
                                    res.status(err.status || 500);
                                    res.render('error', {
                                        message: err.message,
                                        error: {}
                                    });
                                });


                                http.createServer(app).listen(app.get('port'), function() {
                                    console.log('Express server listening on port ' + app.get('port'));
                                });


                                // app.use(function(req, res, next){
                                //   res.status(404);

                                //   // respond with html page
                                //   if (req.accepts('html')) {
                                //     res.render('404', { url: req.url });
                                //     return;
                                //   }

                                //   // respond with json
                                //   if (req.accepts('json')) {
                                //     res.send({ error: 'Not found' });
                                //     return;
                                //   }

                                //   // default to plain-text. send()
                                //   res.type('/').send('Not found');
                                // });


                                module.exports = app;