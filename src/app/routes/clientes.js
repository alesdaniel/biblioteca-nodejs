const dbConnection=require('../../config/dbConnection');

module.exports = app=>{
    const conexion=dbConnection();

    app.get('/',(req,res)=>{
        socio= [];
        libro= [];
        conexion.query('SELECT * FROM socios ',(err,result)=>{
            socio = result;
         });
         conexion.query('SELECT * FROM libros ',(err,result)=>{
            libro = result;
         }); 
        conexion.query('SELECT prestados.id_prestamo,  concat(socios.nombre," ",socios.apellido) as id_cliente ,libros.titulo as id_libro ,prestados.id_estado as id_estado,DATE_FORMAT(prestados.fecha_prestamo, "%e/%m/%Y") as fecha_prestamo,DATE_FORMAT(prestados.fecha_devolucion , "%e/%m/%Y") as fecha_devolucion FROM prestados LEFT JOIN socios ON prestados.id_clientes = socios.id_socios  LEFT JOIN libros ON prestados.id_clientes = libros.id_libro WHERE id_estado = false'
        ,(err,result)=>{  
        //conexion.query('SELECT * FROM clientes, p rovincias WHERE clientes.id_provincia = provincias.id_provincia',(err,result)=>{
         //   console.log(result);            
            res.render('prestamo.ejs',{
                prestados: result,
                socios: socio,
                libros: libro
            }); //
        })        
    });

    app.get('/devueltos',(req,res)=>{

        conexion.query('SELECT prestados.id_prestamo,  concat(socios.nombre," ",socios.apellido) as id_cliente ,libros.titulo as id_libro ,prestados.id_estado as id_estado,DATE_FORMAT(prestados.fecha_prestamo, "%e/%m/%Y") as fecha_prestamo,DATE_FORMAT(prestados.fecha_devolucion , "%e/%m/%Y") as fecha_devolucion, prestados.comentario FROM prestados LEFT JOIN socios ON prestados.id_clientes = socios.id_socios  LEFT JOIN libros ON prestados.id_clientes = libros.id_libro WHERE id_estado = true'
        ,(err,result)=>{  
        //conexion.query('SELECT * FROM clientes, p rovincias WHERE clientes.id_provincia = provincias.id_provincia',(err,result)=>{
         //   console.log(result);            
            res.render('devueltos.ejs',{
                prestados: result,
            }); //
        })        
    });

    app.post('/prestamo',(req,res)=>{ //Quede aca

        const id_clientes = req.body.socios;
        const id_libro = req.body.libros;
        const id_estado = false;
        const fecha_prestamo = new Date().toISOString().slice(0, 19).replace('T', ' ');
        var date = new Date();
        date.setDate(date.getDate() + 7);
        const fecha_devolucion = date.toISOString().slice(0, 19).replace('T', ' ')
        const comentario = " "
        //metodo alternbativo para leer los datos de la pagina
        //const {nombre, apellido} = req.body;
        conexion.query('INSERT INTO prestados SET? ',{
            id_clientes,
            id_libro,
            id_estado,
            fecha_prestamo,
            fecha_devolucion,
            comentario
        },(err,result)=>{
            console.log(id_clientes); 
            res.redirect('/');
        }) 
    });

 /*   app.get('/editar_provincia/:id',(req,res)=>{  
    const id=req.params.id;    
      
    const query="SELECT * FROM provincias WHERE id_provincia =?";
    
    conexion.query(query,[id],(err,result)=>{ 
        if(err) {
            console.error("Error actualizado datos: " + err);
            res.status(500).send("Error actualizado datos: " + err);
        } else {
          //  console.log('Se envia parametro a render nuevo');
            res.render('editar_provincias',{
            provincia:result[0] //privincia es un vector
            });
        }
    });
});  */

    app.get('/devolucion/:id',(req,res)=>{
        const id=req.params.id;    
      
        const query="SELECT * FROM prestados WHERE id_prestamo =?";
        
        conexion.query(query,[id],(err,result)=>{ 
            if(err) {
                console.error("Error actualizado datos: " + err);
                res.status(500).send("Error actualizado datos: " + err);
            } else {
              //  console.log('Se envia parametro a render nuevo');
                res.render('cierra_devolucion',{
                devolucion:result[0] //privincia es un vector
                });
            }
        });
    }); 

    app.post('/devolucion/:id',(req,res)=>{  
        const id=req.params.id;    
        const comentario=req.body.comentario;
        const estado =true;
        const fecha_devolucion =  new Date().toISOString().slice(0, 19).replace('T', ' ');
        const query="UPDATE prestados SET comentario=?, id_estado=?, fecha_devolucion=? WHERE id_prestamo=? ";
        console.log(comentario)
        conexion.query(query,[comentario, estado, fecha_devolucion, id],(err,result)=>{ 
            if(err) {   
                console.error("Error actualizado datos: " + err);
                res.status(500).send("Error actualizado datos: " + err);
            } else {
                console.log(query);
                res.redirect('/');
            }
        });
    }); 

    app.post('/provincias',(req,res)=>{
        const provincia = req.body.provincia;        
        //metodo alternbativo para leer los datos de la pagina
        //const {nombre, apellido} = req.body; 
        conexion.query('INSERT INTO provincias SET?',{
        provincia,
        },(err,result)=>{
            res.redirect('/carga');
        })                
    });

    app.get('/libros',(req,res)=>{
        genero   =[];
        categorias=[]
        conexion.query('SELECT * FROM generos ',(err,result)=>{
            genero = result;
         });
         conexion.query('SELECT * FROM categorias ',(err,result)=>{
            categorias = result;
         });
        console.log("Este")
        conexion.query('SELECT libros.id_libro,libros.isbn,libros.titulo,libros.id_autor,generos.genero FROM libros  LEFT JOIN generos  ON  libros.id_genero = generos.id_genero ',(err,result)=>{
            //conexion.query('SELECT * FROM clientes, provincias WHERE clientes.id_provincia = provincias.id_provincia',(err,result)=>{
            console.log(genero);           
            res.render('libros.ejs',{ 
                libros: result,
                generos: genero
            }); //
        })        
    });

    app.post('/libros',(req,res)=>{ //Quede aca
        const id=req.params.id;    
        const isbn=req.body.isbn;
        const titulo=req.body.titulo;
        const autor=req.body.autor;
        const genero=req.body.genero;
        const query="INSERT INTO libros set  isbn=?, titulo=?, id_autor=?, id_genero=? ";
        
        conexion.query(query,[isbn,titulo,autor,genero],(err,result)=>{ 
            if(err) {   
                console.error("Error actualizado datos: " + err);
                res.status(500).send("Error actualizado datos: " + err);
            } else {
                console.log(query);
                res.redirect('/libros');
            }
        });
    });

    app.get('/clientes',(req,res)=>{
        provincia=[]
        conexion.query('SELECT * FROM provincias ',(err,result)=>{
            provincia = result;
         });
        conexion.query('SELECT * FROM socios LEFT JOIN provincias ON socios.id_provincia = provincias.id_provincia',(err,result)=>{
        //conexion.query('SELECT * FROM clientes, p rovincias WHERE clientes.id_provincia = provincias.id_provincia',(err,result)=>{
            console.log(result);            
            res.render('socios.ejs',{
                socios: result,
                provincias: provincia
            }); //
        })        
    });


    app.get('/carga',(req,res)=>{
        conexion.query('SELECT * FROM provincias', (err,result)=>{
            res.render('carga.ejs',{
                provincias: result
                //tiene que tener el mismo nombre de la tabla
            });
        })
    });   

    app.get('/categorias',(req,res)=>{
        conexion.query('SELECT * FROM categorias', (err,result)=>{
            res.render('categorias.ejs',{
                categorias: result
                //tiene que tener el mismo nombre de la tabla
            });
        })
    });   

    app.post('/categorias',(req,res)=>{
        const categoria = req.body.categoria;        
        //metodo alternbativo para leer los datos de la pagina
        //const {nombre, apellido} = req.body; 
        conexion.query('INSERT INTO categorias SET?',{
            categoria,
        },(err,result)=>{
            res.redirect('/categorias');
        })                
    });


    app.post('/provincias',(req,res)=>{
        const provincia = req.body.provincia;        
        //metodo alternbativo para leer los datos de la pagina
        //const {nombre, apellido} = req.body; 
        conexion.query('INSERT INTO provincias SET?',{
        provincia,
        },(err,result)=>{
            res.redirect('/carga');
        })                
    });

    app.post('/clientes',(req,res)=>{
        const nombre = req.body.nombre;
        const apellido = req.body.apellido;
        const id_provincia = req.body.id_provincia;
        const fecha_nac = req.body.fecha_nac;
        const id_genero = req.body.id_genero;
        const dni = req.body.dni;
        //metodo alternbativo para leer los datos de la pagina
        //const {nombre, apellido} = req.body;
        console.log( req.body);
        conexion.query('INSERT INTO socios SET?',{
        nombre,
        apellido,
        id_provincia,
        fecha_nac,
        id_genero,
        dni
        },(err,result)=>{
            console.log(err);
            res.redirect('/clientes');
        })                
    });

    app.post('/borrar',(req,res)=>{
        const id=req.body.registroId;
        query="DELETE FROM clientes WHERE id_clientes=?";

        conexion.query(query,[id],(err,result)=>{
            if(err) {
            console.error("Error borrando datos: " + err);
            res.status(500).send("Error borrando datos: " + err);
            } else {
                console.log('El registro se elimino correctamente');
                res.redirect('/');
            }
        });
    });

    app.post('/editar',(req,res)=>{  
        console.log("Entra a editar");
        const id=req.body.registroId;
        
        const {nombre, apellido, id_provincia} = req.body;        
        const query="UPDATE clientes SET nombre =?, apellido =?, id_provincia =? WHERE id_clientes=?" ;
        
        conexion.query(query,[nombre,apellido,id_provincia,id],(err,result)=>{ 
            if(err) { 
                console.error("Error actualizado datos: " + err);
                res.status(500).send("Error actualizado datos: " + err);
            } else {
                console.log('El registro se Edito correctamente');
                res.redirect('/');
            }
        });
    });  


    app.get('/genero',(req,res)=>{
        conexion.query('SELECT * FROM generos', (err,result)=>{
            res.render('generos.ejs',{
                generos: result
                //tiene que tener el mismo nombre de la tabla
            });
        })
    }); 
    
    app.post('/generos',(req,res)=>{
        const genero = req.body.genero;        
        //metodo alternbativo para leer los datos de la pagina
        //const {nombre, apellido} = req.body; 
        conexion.query('INSERT INTO generos SET?',{
        genero,
        },(err,result)=>{
            res.redirect('/genero');
        })                
    });

//Provincias
//los datos que vienen en params viene via get los de body via post
app.get('/borrar_provincia/:id',(req,res)=>{
    const id=req.params.id; //id es el que esta arriba
    query="DELETE FROM provincias WHERE id_provincia=?";

    conexion.query(query,[id],(err,result)=>{
        if(err) {
        console.error("Error borrando datos: " + err);
        res.status(500).send("Error borrando datos: " + err);
        } else {
            console.log('El registro se elimino correctamente');
            res.redirect('/carga');
        }
    });
});

app.get('/editar_provincia/:id',(req,res)=>{  
    const id=req.params.id;    
      
    const query="SELECT * FROM provincias WHERE id_provincia =?";
    
    conexion.query(query,[id],(err,result)=>{ 
        if(err) {
            console.error("Error actualizado datos: " + err);
            res.status(500).send("Error actualizado datos: " + err);
        } else {
          //  console.log('Se envia parametro a render nuevo');
            res.render('editar_provincias',{
            provincia:result[0] //privincia es un vector
            });
        }
    });
});  

app.post('/editar_provincia/:id',(req,res)=>{  
    const id=req.params.id; //dado que viene de arriba   
    const {provincia}=req.body;
    console.log('Este falla'); //ver error en esta funcion
    console.log(id + " "+provincia); 
    const query="UPDATE provincias SET provincia=? WHERE id_provincia=?";
    
    conexion.query(query,[provincia, id],(err,result)=>{ 
        if(err) { 
            console.error("Error actualizado datos: " + err);
            res.status(500).send("Error actualizado datos: " + err);
        } else {
            res.redirect('/carga');
        }
    });
});  

// Categoria
app.get('/borrar_genero/:id',(req,res)=>{
    const id=req.params.id;
    query="DELETE FROM generos WHERE id_genero=?";

    conexion.query(query,[id],(err,result)=>{
        if(err) {
        console.error("Error borrando datos: " + err);
        res.status(500).send("Error borrando datos: " + err);
        } else {
            console.log('El registro se elimino correctamente');
            res.redirect('/genero');
        }
    });
});

app.get('/editar_genero/:id',(req,res)=>{  
    const id=req.params.id;    
      
    const query="SELECT * FROM generos WHERE id_genero=?";
    
    conexion.query(query,[id],(err,result)=>{ 
        if(err) { 
            console.error("Error actualizado datos: " + err);
            res.status(500).send("Error actualizado datos: " + err);
        } else {
            console.log('Se envia parametro a render nuevo');
            res.render('editar_generos.ejs',{
            genero:result[0] //genero es un vector
            });
        }
    });
});    

app.post('/editar_genero/:id',(req,res)=>{  
    const id=req.params.id;    
    const {genero}=req.body;
    console.log('Este falla'); //ver error en esta funcion
    
    const query="UPDATE generos SET genero=? WHERE id_genero=?";
    
    conexion.query(query,[genero, id],(err,result)=>{ 
        if(err) {   
            console.error("Error actualizado datos: " + err);
            res.status(500).send("Error actualizado datos: " + err);
        } else {
            console.log(query);
            res.redirect('/genero');
        }
    });
});  


app.post('/editar_libros/:id',(req,res)=>{    
    const id=req.params.id;    
    const isbn=req.body.isbn;
    const titulo=req.body.titulo;
    const autor=req.body.autor;
    const genero=req.body.genero;
    const query="UPDATE libros SET isbn=?, titulo=?, autor=?, id_genero=genero WHERE id_libro=?";
    
    conexion.query(query,[isbn,titulo,autor,genero, id],(err,result)=>{ 
        if(err) {   
            console.error("Error actualizado datos: " + err);
            res.status(500).send("Error actualizado datos: " + err);
        } else {
            console.log(query);
            res.redirect('/libros');
        }
    });
});

app.get('/editar_libro/:id',(req,res)=>{  
    const id=req.params.id;    
    genero   =[];

    conexion.query('SELECT * FROM generos ',(err,result)=>{
        genero = result;
     });    
    const query="SELECT * FROM libros WHERE id_libro=?";
    
    conexion.query(query,[id],(err,result)=>{ 
        if(err) { 
            console.error("Error actualizado datos: " + err);
            res.status(500).send("Error actualizado datos: " + err);
        } else {
            console.log('Se envia parametro a render nuevo');
            res.render('editar_libros.ejs',{
            libros:result[0],
            generos:genero //genero es un vector
            });
        }
    });
});
        


}

