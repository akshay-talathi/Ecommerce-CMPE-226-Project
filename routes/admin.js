												var mysqldb = require('../mysqldb.js');
												var util = require('util');
												var crypto = require('crypto');
												var session = require('express-session');


												exports.loginAdmin = function(req, res) {
												    console.log("in login Admin ---- ");

												    res.render('login', {
														message : req.flash('info'),
												        page_title: "login"
												    });
												};

												exports.getIndex = function(req, res) {
												    console.log("in get index  ---- ");
												    res.render('index', {
												        page_title: "index"
												    });
												};




												exports.doLoginAdmin = function(req, res) {
												    var sess = req.session;


												    var input = JSON.parse(JSON.stringify(req.body));
												    console.log("1111 in do LoginAdmin ----/n" + input);
     
												    console.log("--- 1jmjnkjnkjnkjnkjn " + util.inspect(input.password, {
												        showHidden: false,
												        depth: null
												    }));

												    var connection = mysqldb.getConnection();
												    connection.connect();
												    var query = connection.query("select * from ecommerce.Admin where email = '" + input.email + "' and password = '" + input.password + "';",
												        function(err, rows) {
												            if (err) {
												                console.log("Error Fetching Message: %s", err);
												            } else {
												                console.log(rows);
												                if (rows[0] === undefined) {
												                    console.log("            123======       error in do login admin  ===== ");
												                      req.flash('info', 'Incorrect Login Details. Please Enter Valid Email Address and Password');
												                    res.redirect('/login');
												                } else {
												                    if (rows[0].password === input.password) {
												                        console.log("requesting session " + JSON.stringify(sess));
												                        sess.id = rows[0].id;
												                        sess.username = rows[0].username;
												                        sess.email = rows[0].email;
												                        sess.firstname = rows[0].firstname;
												                        sess.lastname = rows[0].lastname;
												                        res.render('home', {
												                            data: rows,
												                            page_title: "",
												                            sess: req.session,
												                            firstname: sess.firstname,
												                            lastname: sess.lastname

												                        });
												                        connection.end();
												                    } else {
												                        console.log("here");


												                        res.redirect('/');
												                    }
												                }

												            }
												        });

												};
























												exports.getHome = function(req, res) {

												    console.log("  in get Home  ");
												    if (req.session.firstname === undefined) {
												        res.redirect("/");
												    } else {
												        res.render('home', {
												            page_title: "Home",
												            sess: req.session,

												        });
												    }
												};



												exports.getProducts = function(req, res) {
												    if (req.session.firstname === undefined) {
												        res.redirect("/");
												    } else {

												        console.log("3233 ");
												        var connection = mysqldb.getConnection();
												        connection.query('SELECT * FROM ecommerce.Products where productQuantity > 0', function(err, rows) {
												            if (err)
												                console.log("Error Selecting : %s ", err);
												            console.log(rows);
												            res.render('view_products', {
												                page_title: "View Products",
												                sess: req.session,
												                data: rows
												            });
												        });

												        connection.end();
												    }

												};

												exports.addProducts = function(req, res) {


												    if (req.session.firstname === undefined) {
												        res.redirect("/");
												    } else {
												        var connection = mysqldb.getConnection();
												        connection.query('SELECT * FROM Products', function(err, rows) {
												            if (err)
												                console.log("Error Selecting : %s ", err);
												            console.log("" + rows);
												            res.render('add_products', {
												                page_title: "Add Product",
												                sess: req.session,
												                message : req.flash('info'),
												                data: rows
												            });
												        });

												        connection.end();
												    }

												};

												exports.save = function(req, res) {

												    var input = JSON.parse(JSON.stringify(req.body));
												    console.log("-------=-=-=-=-=-    lll l l l l l      "+req.files);
												    var data = {
												        productName: input.productName,
												        productQuantity: input.productQuantity,
												        productPrice: input.productPrice,

												    };

												    if (req.session.firstname === undefined) {
												        res.redirect("/");
												    } else {
												        var connection = mysqldb.getConnection();
												        console.log(data);
												        connection.connect();
												        var query = connection.query("Insert into ecommerce.Products set ?", data, function(
												            err, rows) {
												            if (err){
												                console.log("Error inserting : %s", err);
												                req.flash('info', 'Incorrect entries, Please Enter Valid Data');
												                res.redirect('/products/add');

												            }
												                else{
												            res.redirect('/products');

												        }
												        });
												        connection.end();
												    }
												};


												exports.getDetails = function(req, res) {
												    var product_id = req.params.product_id;
												    console.log("-----------............-----------       " + product_id);

												    if (req.session.firstname === undefined) {
												        res.redirect("/");
												    } else {
												        var connection = mysqldb.getConnection();
												        connection.connect();
												        var query = connection.query("select * from ecommerce.Products WHERE product_id = ?", [product_id], function(err, rows) {
												            if (err)
												                console.log("Error inserting : %s", err);
												            console.log(rows);

												            res.render('edit_products', {
												                page_title: "Details",
												                data: rows,
												                product_id: rows[0].product_id,
												                productName: rows[0].productName,
												                productQuantity: rows[0].productQuantity,
												                productPrice: rows[0].productPrice,
												                productImage : rows[0].productImage,
																message : req.flash('info'),
																sess: req.session,

												            });
												        });
												        connection.end();
												    }
												};

												exports.saveDetails = function(req, res) {

												    var input = JSON.parse(JSON.stringify(req.body));
												    var product_id = req.params.product_id;

												    console.log(req.files);
												    console.log("product ID IS EQUAL TO    " + product_id);

												    if (req.session.firstname === undefined) {
												        res.redirect("/");
												    } else {
												        var connection = mysqldb.getConnection();
												        connection.connect();

												        var data = {
												            productName: input.productName,
												            productQuantity: input.productQuantity,
												            productPrice: input.productPrice,
												        };
												        console.log(data);
												        var query = connection
												            .query(
												                "UPDATE Products set productName=?, productQuantity = ?, productPrice = ? WHERE product_id = ?", [data.productName, data.productQuantity, data.productPrice, product_id],
												                function(err, rows) {
													            if (err){
													                console.log("Error inserting : %s", err);
													                req.flash('info', 'Incorrect entries, Please Enter Valid Data');
													                res.redirect('/products/edit/' + product_id);

													            }
													                else{
													            res.redirect('/products');

													        }

												                });
												        connection.end();
												    }

												};




												exports.deleteProducts = function(req, res) {

												    var id = req.params.product_id;

												    if (req.session.firstname === undefined) {
												        res.redirect("/");
												    } else {
												        var connection = mysqldb.getConnection();
												        connection.connect();

												        var query = connection.query("DELETE FROM Products WHERE product_id = ?", [id], function(err, rows) {

												            if (err)
												                console.log("Error deleting : %s ", err);

												            res.redirect('/products');

												        });
												        connection.end();
												    }
												};


												exports.logout = function(req, res) {

												    req.session.destroy(function(err) {
												        if (err) {
												            console.log(err);
												        } else {
												            console.log("Inside Logout destroy function");
												            req.session = null;
												            sess = null;
												            res.redirect('/');
												        }
												    });
												}