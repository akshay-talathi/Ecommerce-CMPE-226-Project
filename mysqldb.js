var mysql = require('mysql');


function getConnection(){
	var connection = mysql.createConnection({        
	    host: 'localhost',
	    user: 'root',
	    password : '',
	    port : 3306, 
	    database:'ecommerce'
	});
	return connection;
}
exports.getConnection = getConnection;