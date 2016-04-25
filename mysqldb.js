var mysql = require('mysql');


function getConnection(){
	var connection = mysql.createConnection({   
		facebook_api_key      :     "",
  		facebook_api_secret   :     "",
   	    callback_url         :     "http://localhost:4302/auth/facebook/callback",
     
	    host: 'localhost',
	    user: 'root',
	    password : '',
	    port : 3306, 
	    database:'ecommerce1'
	});
	return connection;
}
exports.getConnection = getConnection;
