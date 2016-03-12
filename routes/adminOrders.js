		var mysqldb = require('../mysqldb.js');
		var util = require('util');

		exports.getOrders = function(req, res) {


		    if (req.session.firstname === undefined) {
		        res.redirect("/");
		    } else {
		        var connection = mysqldb.getConnection();
		        connection.query('SELECT * FROM ecommerce1.Orders', function(err, rows) {
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
		        connection.query('SELECT * FROM ecommerce1.Orders', function(err, rows) {
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
		        productID: input.productID,
		        quantity: input.quantity,
		        total: input.total,
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
		    var orderId = req.params.orderId;



		    if (req.session.firstname === undefined) {
		        res.redirect("/");
		    } else {
		        var connection = mysqldb.getConnection();
		        connection.connect();
		        var query = connection.query("select * from Orders WHERE orderId = ?", [orderId], function(err, rows) {
		            if (err)
		                console.log("Error inserting : %s", err);
		            console.log(rows);

		            res.render('edit_orders', {
		                page_title: "Details",
		                data: rows,
		                orderId: rows[0].orderId,
		                username: rows[0].username,
		                productId: rows[0].productId,
		                quantity: rows[0].quantity,
		                total: rows[0].total,
		                isCancelled: rows[0].isCancelled,
		                sess: req.session

		            });
		        });
		        connection.end();
		    }
		};



		exports.saveDetailsOrders = function(req, res) {

		    var input = JSON.parse(JSON.stringify(req.body));
		    var orderId = req.params.orderId;
		    var data = {
		        username: input.username,
		        product: input.productID,
		        quantity: input.quantity,
		        total: input.total,
		        isCancelled: input.isCancelled
		    };

		    if (req.session.firstname === undefined) {
		        res.redirect("/");
		    } else {
		        var connection = mysqldb.getConnection();
		        connection.connect();

		        var query = connection.query(
		            "UPDATE Orders set username=?, productID = ?, quantity = ?, total = ? WHERE orderId = ?", [
		                data.username, data.productID, data.quantity, data.total, orderId
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

		    var orderId = req.params.orderId;

		    if (req.session.firstname === undefined) {
		        res.redirect("/");
		    } else {

		        var connection = mysqldb.getConnection();
		        connection.connect();

		        var query = connection.query("DELETE FROM Orders WHERE orderId = ?", [orderId], function(err, rows) {

		            if (err)
		                console.log("Error deleting : %s ", err);

		            res.redirect('/orders');

		        });
		        connection.end();
		    }
		};


		exports.cancelOrder = function(req, res) {

		    var orderId = req.params.orderId;
		    var isCancelled = req.params.isCancelled;
		    if (req.session.firstname === undefined) {
		        res.redirect("/");
		    } else {
		        console.log("in cancel Order" + isCancelled);

		        var connection = mysqldb.getConnection();
		        connection.connect();
		        console.log("hrrrrrrrr")
		        if (isCancelled == 0) {
		            console.log("iscancelled == 0");
		            var query = connection.query("update ecommerce1.Orders set isCancelled = 1 where orderId = ?", [orderId], function(err, rows) {
		                if (err)
		                    console.log("Error %s", err);
		                res.redirect('/orders')
		            });
		        } else {
		            console.log("iscancelled == 1");
		            var query23 = connection.query("update ecommerce1.Orders set isCancelled = 0 where orderId = ?", [orderId], function(err, rows) {
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
		        connection.query('SELECT * FROM ecommerce1.Orders where username = ?',[username], function(err, rows) {
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
		    var orderId = req.params.orderId;
		    var isCancelled = req.params.isCancelled;
		    if (req.session.firstname === undefined) {
		        res.redirect("/");
		    } else {
		        console.log("in cancel Order" + isCancelled);

		        var connection = mysqldb.getConnection();
		        
		        connection.connect();

		        if (isCancelled == 0) {
		            console.log("iscancelled == 0");
		            var query = connection.query("update ecommerce.Orders set isCancelled = 1 where orderId = ?", [orderId], function(err, rows) {
		                if (err)
		                    console.log("Error %s", err);
		                res.redirect('/view/orders/' + username);
		            });
		        } else {
		            console.log("iscancelled == 1");
		            var query23 = connection.query("update ecommerce.Orders set isCancelled = 0 where orderId = ?", [orderId], function(err, rows) {
		                if (err)
		                    console.log("Error %s", err);
		                res.redirect('/view/orders/' + username);
		            });

		        }
		        connection.end();
		    };
		}





		exports.changeToDelivered = function(req, res){
			var username = req.session.username;
			var user = req.params.username;
			console.log('                ' + user)
			var orderId = req.params.orderId;
			var isDelivered = req.params.isDelivered;
			if (req.session.firstname === undefined) {
		        res.redirect("/");
		    } else {
		    	console.log("in change to delivered  " + isDelivered);

		    	var connection = mysqldb.getConnection();
		    	connection.connect();

		    	if (isDelivered == 0) {
		            console.log("isDelivered == 0");
		            var query = connection.query("update ecommerce1.Orders set isDelivered = 1, iscancelled=0 where orderId = ?", [orderId], function(err, rows) {
		                if (err)
		                    console.log("Error %s", err);
		                res.redirect('/view/orders/' + user);
		            });
		        } 
		        connection.end();
		   



		    }


		}







