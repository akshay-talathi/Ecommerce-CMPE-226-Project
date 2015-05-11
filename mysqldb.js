var mysql = require('mysql');


function getConnection(){
	var connection = mysql.createConnection({   
		facebook_api_key      :     "420507768127451",
  		facebook_api_secret   :     "cb799a25b790181819c231af9307ccdc",
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