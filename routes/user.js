									var mysqldb = require('../mysqldb.js');
									var util = require('util');
									var crypto = require('crypto');
									var session = require('express-session');



									exports.loginUser = function(req, res) {
									    console.log("in login Admin ---- ");
									    res.render('loginUser', {
									        page_title: "login User",
									        message : req.flash('info'),
									    });
									};



									exports.doLoginUser = function(req, res) {
									    var sess = req.session;


									    var input = JSON.parse(JSON.stringify(req.body));
									    console.log("in do Login User ----" + input);
									    console.log("---  " + util.inspect(input.password, {
									        showHidden: false,
									        depth: null
									    }));

									    var connection = mysqldb.getConnection();
									    connection.connect();
									    var query = connection.query("select * from ecommerce.User where email = '" + input.email + "' and password = SHA1('" + input.password + "');",
									        function(err, rows) {
									            if (err) {
									                console.log("Error Fetching Message: %s", err);
									            } else {
									                console.log(rows);
									                if (rows[0] === undefined) {
														req.flash('info', 'Incorrect Login Details. Please Enter Valid Email Address and Password');
									                    console.log("            ======       error in do login user  ===== ");
									                    res.redirect('/user/login');
									                } else {
									                    if (rows[0].email === input.email) {
									                        console.log("requesting session " + JSON.stringify(sess));
									                        sess.id = rows[0].id;
									                        sess.username = rows[0].username;
									                        sess.email = rows[0].email;
									                        sess.firstname = rows[0].firstname;
									                        sess.lastname = rows[0].lastname;
									                        res.render('homeUser', {
									                            data: rows,
									                            page_title: "",
									                            sess: req.session,
									                            firstname: sess.firstname,
									                            lastname: sess.lastname

									                        });
									                        connection.end();
									                    } else {
									                        console.log("here in else");


									                        res.redirect('/');
									                    }
									                }

									            }
									        });

									};



									exports.getHomeUser = function(req, res) {

									    console.log("  in get Home of Users ");
									    if (req.session.firstname === undefined) {
									        res.redirect("/user/login");
									    } else {
									        res.render('homeUser', {
									            page_title: "Home of user",
									            sess: req.session,

									        });
									    }
									};



									exports.viewProducts = function(req, res) {
									    if (req.session.firstname === undefined) {
									        res.redirect("/user/login");
									    } else {

									        console.log("in view Products of user  ");
									        var connection = mysqldb.getConnection();
									        connection.query('SELECT * FROM ecommerce.Products', function(err, rows) {
									            if (err)
									                console.log("Error Selecting : %s ", err);
									            console.log(rows);
									            res.render('userViewProducts', {
									                page_title: "View Products User",
									                messages: req.flash('msg'),
									                sess: req.session,
									                data: rows
									            });
									        });

									        connection.end();
									    }

									};



									exports.addToCart = function(req, res) {

									    var product_id = req.params.product_id;
									    console.log("-----------............----------- product id in add to cart      " + product_id);
									    req.flash('msg', 'Your message was flashed!');
									    if (req.session.firstname === undefined) {
									        res.redirect("/user/login");
									    } else {
									        var connection = mysqldb.getConnection();
									        connection.connect();
									        var query = connection.query("select * from ecommerce.Products WHERE product_id = ?", [product_id], function(err, rows) {
									            if (err)
									                console.log("Error inserting : %s", err);
									            console.log(rows);

									            res.render('userAddToCart', {
									                page_title: "Details",
									                data: rows,
									                product_id: rows[0].product_id,
									                productName: rows[0].productName,
									                productQuantity: rows[0].productQuantity,
									                productPrice: rows[0].productPrice,

									                sess: req.session,

									            });
									        });
									        connection.end();
									    }
									}




									exports.confirmOrder = function(req, res) {

									    var product_id = req.params.product_id;
									    console.log("-----------............----------- product id in confirm order      " + product_id);

									    var orderQuantity = req.params.orderQuantity;
									    if (req.session.firstname === undefined) {
									        res.redirect("/user/login");
									    } else {
									    	
									        var connection = mysqldb.getConnection();
									        connection.connect();
									        var query = connection.query("select * from ecommerce.Products WHERE product_id = ?", [product_id], function(err, rows) {
									            if (err)
									                console.log("Error inserting : %s", err);
									            console.log(rows);

									            res.render('userConfirmedOrder', {
									                page_title: "Details",
									                data: rows,
									                product_id: rows[0].product_id,
									                productName: rows[0].productName,
									                productQuantity: rows[0].productQuantity,
									                productPrice: rows[0].productPrice,
									                sess: req.session,
									                orderQuantit: orderQuantity,
									                total : orderQuantity * rows[0].productPrice,

									            });
									        });
									        connection.end();
									    }
									};




									exports.confirmQuantity = function(req, res) {

									    var input = JSON.parse(JSON.stringify(req.body));
									    var product_id = req.params.product_id;
									    var prodQuant = req.params.productQuantity;
									    var order_id = req.params.order_id;
									    var productPrice = req.params.productPrice;


									    console.log("product id in confirm confirmQuantity  " + product_id);

									    var orderQuantity = req.body.orderQuantity;
									    var sub = prodQuant - orderQuantity;
									    var data;
									    //var out = orderQuantity.replace(/[^0-9]/g, '')
									    console.log("product quantity   " + prodQuant);
									    console.log("--------order quantity--------------" + orderQuantity);
									    console.log("---hoping for sub    " + sub);

									    var input = JSON.parse(JSON.stringify(req.body));

									    if (req.session.firstname === undefined) {
									        res.redirect("/user/login");
									    } else {
									        var connection = mysqldb.getConnection();
									        connection.connect();

									        var query = connection
									            .query("UPDATE ecommerce.Products set productQuantity = productQuantity - ? WHERE product_id = ?", [orderQuantity, product_id], function(err, rows) {

									                if (err)
									                    console.log("Error Updating : %s ", err);

									            });

									        if (sub < 0) {
									            var query2 = connection.query("UPDATE ecommerce.Products set productQuantity = productQuantity + ? WHERE product_id = ?", [orderQuantity, product_id], function(err, rows) {

									                if (err)
									                    console.log("Error Updating : %s ", err);
									                console.log("hhhhhhhhhhh");
									                connection.end();
									                res.redirect('/user/products');
									            });
									        } else {
									            res.redirect('/user/products/confirm/' + product_id + '/' + orderQuantity +'/'+ productPrice);
									            connection.end();
									        }



									    }

									};
									exports.confirmedOrder = function(req, res) {


									    var product_id = req.params.product_id;
									    var orderQuantity = req.params.orderQuantity;
									    var productPrice = req.params.productPrice;
									    var username = req.session.username;
									    var total = orderQuantity * productPrice;

									    console.log("total    " + total)
									    console.log(product_id + "       "   +orderQuantity+ "       " + productPrice + "      " + username);
									    var ins = {username: username, product_id:product_id, orderQuantity: orderQuantity,totals: total, isCancelled: 1}
									    if (req.session.firstname === undefined) {
									        res.redirect("/user/login");
									    } else {

									        console.log("in confirmed order of user  ");
									        var connection = mysqldb.getConnection();

									        var query2 = connection.query("insert into ecommerce.Orders set ?",[ins],
									        	function(err, rows){
									        		if(err)
									        			console.log("Error inserting into Orders %s", err);
									        	});


// 									        SELECT Products.productName FROM Orders LEFT JOIN Products ON Orders.product_id=Products.product_id
// ORDER BY Products.product_id;



									        connection.query('SELECT * FROM ecommerce.Orders where username=?', [username], function(err, rows) {
									            if (err)
									                console.log("Error Selecting : %s ", err);
									            console.log(rows);
									            res.render('userOrders', {
									                page_title: "View User Orders",
									                username : rows[0].username,

									                sess: req.session,
									                data: rows
									            });
									        });

									        connection.end();
									    }


									}





									exports.viewOrders = function(req, res){

										var username = req.session.username;
										if (req.session.firstname === undefined) {
									        res.redirect("/user/login");
									    } else {

									        console.log("in view order of user  ");
									        var connection = mysqldb.getConnection();

									      
									        connection.query('SELECT * FROM ecommerce.Orders where username =?', [username], function(err, rows) {
									            if (err)
									                console.log("Error Selecting : %s ", err);
									            console.log(rows);

									            if(rows.length == 0){
														
														res.render('homeUser',{
														page_title : "orders",
														sess: req.session,

														});
									            }
									            else{
									            res.render('userOrders', {
									                page_title: "View User Orders",
									                username : rows[0].username,
									                sess: req.session,
									                data: rows
									            });
									        }
									        });

									        connection.end();
									    }
									
									
}









									




									exports.cancelUserOrder = function(req, res) {

										    var order_id = req.params.order_id;
										    var isCancelled = req.params.isCancelled;

										    console.log("isisisisisisisisisis           " + isCancelled);
										    console.log("                                          ");

										    if (req.session.firstname === undefined) {
										        res.redirect("/");
										    } else {
										        console.log("in cancel Order" + isCancelled);

										        var connection = mysqldb.getConnection();
										        connection.connect();

										        if (isCancelled == 0) {
										            console.log("iscancelled == 0");
										            var query = connection.query("update ecommerce.Orders set isCancelled = 1 where order_id = ?", [order_id], function(err, rows) {
										                if (err)
										                    console.log("Error %s", err);
										                res.redirect('/user/view/orders');
										            });
										        } else {
										            console.log("iscancelled == 1");
										            var query23 = connection.query("update ecommerce.Orders set isCancelled = 0 where order_id = ?", [order_id], function(err, rows) {
										                if (err)
										                    console.log("Error %s", err);
										                res.redirect('/user/view/orders');
										            });
										        }
										        connection.end();
										    }
										};



								exports.checkDelivery = function(req,res){

									var username = req.session.username;
									var order_id = req.params.order_id;
										if (req.session.firstname === undefined) {
									        res.redirect("/user/login");
									    } else {

									        console.log("in confirmed order of user  ");
									        var connection = mysqldb.getConnection();


									        connection.query('SELECT * FROM ecommerce.Orders where username=? and order_id = ?', [username, order_id], 
									        	function(err, rows) {
									            if (err)
									                console.log("Error Selecting : %s ", err);
									            console.log(rows);
									            res.render('userOrderStatus', {
									                page_title: "View User Orders Status",
									                username : rows[0].username,
									                order_id : rows[0].order_id,
									                sess: req.session,
									                data: rows
									            });
									        });

									        connection.end();
									    }




								};





























