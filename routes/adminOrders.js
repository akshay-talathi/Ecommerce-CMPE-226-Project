										var mysqldb = require('../mysqldb.js');
										var util = require('util');

										exports.getOrders = function(req, res) {


										    if (req.session.firstname === undefined) {
										        res.redirect("/");
										    } else {
										        var connection = mysqldb.getConnection();
										        connection.query('SELECT * FROM ecommerce.Orders', function(err, rows) {
										            if (err)
										                console.log("Error Selecting : %s ", err);
										            console.log(rows);
										            res.render('view_orders', {
										                page_title: "view orders",
										                sess: req.session,
										                data: rows
										            });
										        });

										        connection.end();
										    }

										};


										exports.addOrders = function(req, res) {


										    if (req.session.firstname === undefined) {
										        res.redirect("/");
										    } else {
										        var connection = mysqldb.getConnection();
										        connection.query('SELECT * FROM ecommerce.Orders', function(err, rows) {
										            if (err)
										                console.log("Error Selecting : %s ", err);
										            console.log(rows);
										            res.render('add_orders', {
										                page_title: "add Orders",
										                sess: req.session,
										                data: rows
										            });
										        });

										        connection.end();

										    }

										};


										exports.saveOrders = function(req, res) {
										    var input = JSON.parse(JSON.stringify(req.body));
										    var data = {
										        username: input.username,
										        product_id: input.product_id,
										        orderQuantity: input.orderQuantity,
										        totals: input.totals,
										    };



										    if (req.session.firstname === undefined) {
										        res.redirect("/");
										    } else {
										        var connection = mysqldb.getConnection();
										        connection.connect();

										        var query = connection.query("insert into Orders set ?", data, function(err, rows) {
										            if (err)
										                console.log("Error inserting %s", err);
										            res.redirect('/orders');
										        });
										        connection.end();
										    }
										};

										exports.getDetailsOrders = function(req, res) {
										    var order_id = req.params.order_id;



										    if (req.session.firstname === undefined) {
										        res.redirect("/");
										    } else {
										        var connection = mysqldb.getConnection();
										        connection.connect();
										        var query = connection.query("select * from Orders WHERE order_id = ?", [order_id], function(err, rows) {
										            if (err)
										                console.log("Error inserting : %s", err);
										            console.log(rows);

										            res.render('edit_orders', {
										                page_title: "Details",
										                data: rows,
										                order_id: rows[0].order_id,
										                username: rows[0].username,
										                product_id: rows[0].product_id,
										                orderQuantity: rows[0].orderQuantity,
										                totals: rows[0].totals,
										                isCancelled: rows[0].isCancelled,
										                sess: req.session

										            });
										        });
										        connection.end();
										    }
										};



										exports.saveDetailsOrders = function(req, res) {

										    var input = JSON.parse(JSON.stringify(req.body));
										    var order_id = req.params.order_id;
										    var data = {
										        username: input.username,
										        product_id: input.product_id,
										        orderQuantity: input.orderQuantity,
										        totals: input.totals,
										        isCancelled: input.isCancelled
										    };

										    if (req.session.firstname === undefined) {
										        res.redirect("/");
										    } else {
										        var connection = mysqldb.getConnection();
										        connection.connect();

										        var query = connection.query(
										            "UPDATE Orders set username=?, product_id = ?, orderQuantity = ?, totals = ? WHERE order_id = ?", [
										                data.username, data.product_id, data.orderQuantity, data.totals, order_id
										            ],
										            function(err, rows) {

										                if (err)
										                    console.log("Error Updating : %s ", err);
										                console.log(rows);
										                res.redirect('/orders');

										            });
										        connection.end();
										    }

										};



										exports.deleteOrders = function(req, res) {

										    var order_id = req.params.order_id;

										    if (req.session.firstname === undefined) {
										        res.redirect("/");
										    } else {

										        var connection = mysqldb.getConnection();
										        connection.connect();

										        var query = connection.query("DELETE FROM Orders WHERE order_id = ?", [order_id], function(err, rows) {

										            if (err)
										                console.log("Error deleting : %s ", err);

										            res.redirect('/orders');

										        });
										        connection.end();
										    }
										};


										exports.cancelOrder = function(req, res) {

										    var order_id = req.params.order_id;
										    var isCancelled = req.params.isCancelled;
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
										                res.redirect('/orders')
										            });
										        } else {
										            console.log("iscancelled == 1");
										            var query23 = connection.query("update ecommerce.Orders set isCancelled = 0 where order_id = ?", [order_id], function(err, rows) {
										                if (err)
										                    console.log("Error %s", err);
										                res.redirect('/orders')
										            });

										        }
										        connection.end();
										    }
										};







										exports.viewSingleUserOrder = function(req, res){
											
											var username = req.params.username;

										    if (req.session.firstname === undefined) {
										        res.redirect("/");
										    } else {
										        var connection = mysqldb.getConnection();
										        connection.query('SELECT * FROM ecommerce.Orders where username = ?',[username], function(err, rows) {
										            if (err)
										                console.log("Error Selecting : %s ", err);
										            console.log(rows);
										            res.render('viewSingleUserOrder', {
										                page_title: "view User order",
										                sess: req.session,
										                data: rows
										            });
										        });

										        connection.end();
										    }
										}

										exports.cancelOneOrder = function(req, res) {
											var username = req.session.username;
										    var order_id = req.params.order_id;
										    var isCancelled = req.params.isCancelled;
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
										                res.redirect('/view/orders/' + username);
										            });
										        } else {
										            console.log("iscancelled == 1");
										            var query23 = connection.query("update ecommerce.Orders set isCancelled = 0 where order_id = ?", [order_id], function(err, rows) {
										                if (err)
										                    console.log("Error %s", err);
										                res.redirect('/view/orders/' + username);
										            });

										        }
										        connection.end();
										    };
										}
									