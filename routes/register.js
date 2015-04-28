                                        var mysqldb = require('../mysqldb.js');
                                        var util = require('util');



                                        exports.index = function(req, res) {

                                            console.log("in REGISTER exports to index    ")
                                            res.render("index", {
                                                title: "index"
                                            });
                                        };


                                        // exports.signup = function(req, res) {
                                        //     console.log("in REGISTER exports to signup ");
                                        //     res.render("registration", {
                                                
                                        //         title: "signup"
                                        //     });
                                        // };


                                        exports.login = function(req, res) {

                                            var input = JSON.parse(JSON.stringify(req.body));
                                            var connection = mysqldb.getConnection();

                                            console.log("in REGISTER exports to login ")
                                            var data = {
                                                email: input.email,
                                                password: input.password,
                                            };

                                            connection.connect();

                                            console.log("------------ data   " + data);

                                            var query = connection.query("select * from ecommerce.User where email= ?", [data.email], function(err, rows) {
                                                if (err)
                                                    console.log("Error fetching details : %s", err);

                                                if (rows[0].password === data.password) {
                                                    console.log(rows);
                                                } else {
                                                    res.redirect('/user/registration');
                                                }

                                            });
                                            connection.end();

                                        };



                                        exports.loginDo = function(req, res) {

                                            console.log("in REGISTER loginDO")
                                            if (req.method === 'OPTIONS') {
                                                console.log('!OPTIONS');
                                                var headers = {};
                                                // IE8 does not allow domains to be specified, just the *
                                                // headers["Access-Control-Allow-Origin"] = req.headers.origin;
                                                headers["Access-Control-Allow-Origin"] = "*";
                                                headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
                                                headers["Access-Control-Allow-Credentials"] = false;
                                                headers["Access-Control-Max-Age"] = '86400'; // 24 hours
                                                headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
                                                res.writeHead(200, headers);
                                                res.end();
                                            } else {
                                                console.log(req.body);
                                                var input = JSON.parse(JSON.stringify(req.body));
                                                var connection = mysqldb.getConnection();
                                                var data = {
                                                    email: input.email,
                                                    password: input.password,
                                                };
                                                connection.connect();
                                                console.log("das    " + data);

                                                console.log("--------------      ----------- --------" + util.inspect(data.password, {
                                                    showHidden: false,
                                                    depth: null
                                                }));

                                                var result = 'false';
                                                var query = connection.query("SELECT * from ecommerce.User WHERE email = '"+input.email+"' and password = SHA1('" + input.password + "')", function(err, rows) {
                                                    if (err)
                                                        console.log("Error fecthing details : %s", err);
                                                    if (rows[0] === undefined) {
                                                        result = 'false';
                                                    }
                                                    if (rows[0].email === data.email) {
                                                        // sess = req.session;
                                                        // console.log(req.session);
                                                        // console.log(rows[0].firstName);
                                                        // sess.fname = rows[0].firstName;
                                                        // sess.lname = rows[0].lastName;
                                                        // sess.email = rows[0].email;
                                                        console.log("---------------- rows    " + rows);
                                                        result = 'true';

                                                    } else {
                                                        res.redirect('/');
                                                    }
                                                    console.log(result);
                                                    res.json({
                                                        "email": data.email,
                                                        "password": data.password,
                                                        "result": result
                                                    });
                                                    // res.end(result);
                                                });
                                            }

                                        };



                                        exports.name = function(req, res) {

                                            console.log("in REGISTER name to render home1 else render index   ")
                                            if (req.session.loggedIn) {
                                                res.render('home1', {
                                                    title: "apptitle",
                                                });
                                            } else {
                                                res.render('index', {
                                                    title: "apptitle",

                                                });
                                            }
                                        };

//                                        CREATE USER

                                        // exports.signup = function(req, res) {
                                        //     console.log("in REGISTER exports to signup ");
                                        //     res.render("registration", {
                                        //         title: "signup"
                                        //     });
                                        // };


                                        // exports.insertUser = function(req, res) {
                                        //      console.log("in REGISTER insert user to get  get data and insert data    ");

                                        //      var input = JSON.parse(JSON.stringify(req.body));

                                        //      var connection = mysqldb.getConnection();

                                        //     var data = {
                                        //          username: input.username,
                                        //          email: input.email,
                                        //         password: input.password

                                        //    };

                                        //     connection.query('insert into ecommerce.User set ?', data, function(error, rows) {
                                        //         if (error) {
                                        //             console.log("Error Message is %s" + error);
                                        //         }
                                        //          res.render('loginUser', {
                                        //              page_title: "Login of User",

                                        //              data: rows
                                        //          });

                                        //      });

                                        //  };
                                        exports.signup = function(req, res) {
                                           
                                            
                                            res.render('registration', {
                                                page_title : "s",
                                                message : req.flash('error')
                                            });
                                        };





                                        exports.insertUser = function(req, res) {
                                            
                                            var input = JSON.parse(JSON.stringify(req.body));
                                            console.log("in insert user");
                                            console.log(input);
                                            var connection = mysqldb.getConnection();
                                            connection.connect();
                                            var data = {

                                                username : input.username,
                                                email : input.email,
                                                password : input.password
                                                
                                                
                                            };
                                            var query = connection.query("SELECT * from ecommerce.User WHERE email = ? ",[ data.email ],
                                                            function(err, rows) {
                                                                
                                                                if (err){
                                                                            console.log("Error fecthing details : %s", err);
                                                                            connection.end();
                                                                            req.flash('error','Error Occured !');
                                                                                       
                                                                            res.redirect('/check');
                                                                }
                                                                console.log("Found user:" + rows.length);
                                                                if (!rows.length) {
                                                                    console.log("Here Insert query     " + input.firstname + input.lastname);


 connection.query("insert into ecommerce.User set username='"+input.username+"',email='"+input.email+"',password= SHA1('"+input.password+"');",function(err,rows)       {                                                            
//connection.query("insert into ecommerce.User set username ='" + input.username + "',email='" + input.email + "',password=MD5('" + input.password + "'),firstname='" + input.firstname + "', lastname='" + input.lastname + "', contact='" + input.contact + "',apartment_no='" + input.lastname+ "',street_no='" + input.street + "',address='" + input.address + "',city='" + input.city + "',state='" + input.state + "',zip='" + input.zip + "';",function(err, rows) {

                                                                                        if (err){
                                                                                            console.log("Error Inserting: %s",err);
                                                                                        req.flash('error','User Name Already Exists ! Please Enter Details Again');
                                                                                        connection.end();
                                                                                        res.redirect('/check');
                                                                                    }
                                                                                    });

                                                                } else {
                                                                    if (rows[0].email == input.email) {
                                                                        req.flash('error','Email ID already exists. Please try another email.');
                                                                        connection.end();
                                                                        res.redirect('/check');
                                                                    }
                                                                    
                                                                }
                                                                 req.flash('error','You Are Registered.');

                                                                         connection.end();
                                                               res.redirect('/check');
                                                            });
                                        };







                                        // exports.insertUser = function(req, res) {
                                        //     var org_id = req.params.org_id;
                                        //     var input = JSON.parse(JSON.stringify(req.body));
                                        //     console.log("in save user");
                                        //     console.log(input);
                                        //     var connection = mysqldb.getConnection();
                                        //     connection.connect();
                                        //     var data = {

                                        //         username : input.username,
                                        //         email : input.email,
                                                
                                                
                                        //     };
                                        //     var query = connection.query("SELECT * from ecommerce.User WHERE email = ? ",[ data.email ],
                                        //                     function(err, rows) {
                                                                
                                        //                         if (err){
                                        //                                     console.log("Error fecthing details : %s", err);
                                        //                                     connection.end();
                                        //                                     req.flash('error','Error Occured !');
                                                                                       
                                        //                                     res.redirect('/signup');
                                        //                         }
                                        //                         console.log("Found user:" + rows.length);
                                        //                         if (!rows.length) {
                                        //                             console.log("Here Insert query" + input.firstname + input.lastname);
                                        //                             connection.query("INSERT INTO ecommerce.User set username = '" + input.username + "',email = '" + input.email + "',password = SHA1('" + input.password + "')" ,
                                        //                                             function(err, rows) {
                                        //                                                 if (err){
                                        //                                                     console.log("Error Inserting: %s",err);
                                        //                                                 req.flash('error','User Name Already Exists ! Please Enter Details Again');
                                        //                                                 connection.end();
                                        //                                                 res.redirect('/check');
                                        //                                             }
                                        //                                             });

                                        //                         } else {
                                        //                             if (rows[0].email == input.email) {
                                        //                                 req.flash('error','Email ID already exists. Please try another email.');
                                        //                                 connection.end();
                                        //                                 res.redirect('/check');
                                        //                             }
                                                                    
                                        //                         }
                                        //                     });
                                        // };



                                    exports.saveUser = function(req, res) {
                                   var input = JSON.parse(JSON.stringify(req.body));
                                    console.log("in save user");
                                    console.log(input);
                                    var connection = mysqldb.getConnection();
                                    connection.connect();
                                    var data = {

                                        username : input.username,
                                        email : input.email,
                                        password : input.password
                                        
                                    };
                                    var query = connection.query("SELECT * from User WHERE email = ? ",[ data.email ],
                                                    function(err, rows) {
                                                        
                                                        if (err){
                                                                    console.log("Error fecthing details : %s", err);
                                                                    connection.end();
                                                                    res.redirect('/signup');
                                                        }
                                                        console.log("Found user:" + rows.length);
                                                        if (!rows.length) {
                                                            console.log("Here Insert query" + input.username + input.email);
                                                            connection.query("INSERT INTO ecommerce.User set ?" ,data,
                                                                            function(err, rows) {
                                                                                if (err)
                                                                                    console.log("Error Inserting: %s",err);
                                                                                req.flash('error','You are registered!');
                                                                                connection.end();
                                                                                res.redirect('/signup');

                                                                            });

                                                        } else {
                                                            if (rows[0].email == input.email) {
                                                                req.flash('error','Email ID already exists. Please try another email.');
                                                                connection.end();
                                                                res.redirect('/signup');
                                                                
                                                            }
                                                        }
                                                    });
                                };


                                 exports.check = function(req, res) {
                                            
                                            
                                            res.render('check', {
                                                page_title : "Sign up User",
                                                message : req.flash('error')
                                            });
                                        };






                                        // exports.options = function(req, res) {


                                        //  console.log("in REGISTER options   ");
                                        //     console.log('!OPTIONS');
                                        //     var headers = {};
                                        //     // IE8 does not allow domains to be specified, just the *
                                        //     // headers["Access-Control-Allow-Origin"] = req.headers.origin;
                                        //     headers["Access-Control-Allow-Origin"] = "*";
                                        //     headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
                                        //     headers["Access-Control-Allow-Credentials"] = false;
                                        //     headers["Access-Control-Max-Age"] = '86400'; // 24 hours
                                        //     headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
                                        //     res.writeHead(200, headers);
                                        //     res.end();
                                        // };