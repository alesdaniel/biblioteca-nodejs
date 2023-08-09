const mysql = require('mysql2');

/*module.exports = mysql;*/
//alternativa
module.exports = () => {
    return mysql.createConnection({
        host: 'containers-us-west-158.railway.app',
    	port: '7631',
        user: 'root',
        password: 'qtnpUj0prrf5GuAKtM0r',
        database: 'libreria',
        insecureAuth : true
       //  WITH mysql_native_password
    });
}