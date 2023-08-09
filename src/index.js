const app=require('./config/server.js');
require('./app/routes/clientes')(app);

//iniciar servidor
app.listen(app.get('port'),()=>{
    console.log('listening on port '+app.get('port'));
});