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
												    var query = connection.query("select * from ecommerce1.Admin where email = '" + input.email + "' and password = '" + input.password + "';",
												        function(err, rows) {
												            if (err) {
												                console.log("Error Fetching Message: %s", err);
												            } else {
												                console.log(rows);
												                if (rows[0] === undefined) {
												                      req.flash('info', 'Login Details are Incorrect, Please Enter Details Again !');
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
												        connection.query('SELECT * FROM ecommerce1.Products', function(err, rows) {
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
												        var query = connection.query("Insert into ecommerce1.Products set ?", data, function(
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
												    var productID = req.params.productID;
												    console.log("-----------............-----------       " + productID);

												    if (req.session.firstname === undefined) {
												        res.redirect("/");
												    } else {
												        var connection = mysqldb.getConnection();
												        connection.connect();
												        var query = connection.query("select * from ecommerce1.Products WHERE productID = ?", [productID], function(err, rows) {
												            if (err)
												                console.log("Error selecting : %s", err);
												            console.log(rows);

												            res.render('edit_products', {
												                page_title: "Details",
												                data: rows,
												                productID: rows[0].productID,
												                productName: rows[0].productName,
												                productQuantity: rows[0].productQuantity,
												                productPrice: rows[0].productPrice,
												                image : rows[0].image,
																message : req.flash('info'),
																sess: req.session,

												            });
												        });
												        connection.end();
												    }
												};


												exports.searchProduct = function(req, res){

												    var input = JSON.parse(JSON.stringify(req.body));

												    if (req.session.firstname === undefined) {
												        res.redirect("/");
												    } else {
												    	var connection = mysqldb.getConnection();
												    	connection.connect();
												    	var data = {
												            productName: input.productName,
												          
												        };

												        console.log("Data is     "+ data)


												    	var query = connection.query('select * from ecommerce1.Products where productName =  ?',[data], function(err,rows){
												    		if(err)
												    			console.log("Error selecting %s", err);
												    		console.log("huheuhuhuh rows      "   + rows);

												    		res.render('displaySearch',{
												    			data: rows,
												    			
												                sess : req.session,
												    		})
												    	});
												    	connection.end();
												    }


												}



												exports.saveDetails = function(req, res) {

												    var input = JSON.parse(JSON.stringify(req.body));
												    var productID = req.params.productID;

												    console.log(req.files);
												    console.log("product ID IS EQUAL TO    " + productID);

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
												                "UPDATE Products set productName=?, productQuantity = ?, productPrice = ? WHERE productID = ?", [data.productName, data.productQuantity, data.productPrice, productID],
												                function(err, rows) {
													            if (err){
													                console.log("Error inserting : %s", err);
													                req.flash('info', 'Incorrect entries, Please Enter Valid Data');
													                res.redirect('/products/edit/' + productID);

													            }
													                else{
													            res.redirect('/products');

													        }

												                });
												        connection.end();
												    }

												};




												exports.deleteProducts = function(req, res) {

												    var id = req.params.productID;

												    if (req.session.firstname === undefined) {
												        res.redirect("/");
												    } else {
												        var connection = mysqldb.getConnection();
												        connection.connect();

												        var query = connection.query("DELETE FROM Products WHERE productID = ?", [id], function(err, rows) {

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