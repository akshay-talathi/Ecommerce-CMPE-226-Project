							var mysqldb = require('../mysqldb.js');
							var util = require('util');


							exports.login = function(req, res) {
							    // console.log(mysqldb.getName());


							    res.render('login', {
							        page_title: "Login"
							    });
							};

							exports.home = function(req, res) {
							    var input = JSON.parse(JSON.stringify(req.body));
							    var data = {
							        email: input.email,
							        password: input.password,
							    };


							    if (req.session.firstname === undefined) {
							        res.redirect("/");
							    } else {

							        var connection = mysqldb.getConnection();
							        connection.connect();
							        console.log("----------------data    " + data);
							        var query = connection.query("SELECT * from ecommerce1.User WHERE email = ? ", [data.email], function(err, rows) {
							            if (err)
							                console.log("Error fecthing details : %s", err);
							            if (rows[0].password == data.password) {
							                console.log(rows);

							            } else {
							                res.redirect('/');
							            }
							            console.log();
							        });
							        connection.end();
							    }
							};