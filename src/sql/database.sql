CREATE DATABASE libreria;
USE libreria;

CREATE TABLE prestados {
    id_prestamo INT PRIMARY KEY AUTOINCREMENT,
    id_clientes INT,
    id_libro INT,
    id_estado BOOLEAN,
    fecha_prestamo DATE NOT NULL,
    fecha_devolucion DATE NOT NULL,
    comentario VARCHAR(255) NOT NULL
};

CREATE TABLE libros {
    id_libro INT PRIMARY KEY AUTOINCREMENT,
    isbn INT NOT NULL,
    titulo VARCHAR(50) NOT NULL,
    id_autor INT,
    id_genero INT,
    id categoria INT
};

CREATE TABLE clientes(
    id_clientes INT NOT NULL PRIMARY KEY AUTO_INCREMENT,   
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL
    /* ALTER TABLE clientes ADD id_provincia INT*/
);

CREATE TABLE socios (
    id_socios INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    fecha_nac date NOT NULL,
    id_genero  INT,
    dni VARCHAR(11) NOT NULL,
    direccion VARCHAR(50),
    localidad VARCHAR(50),
    id_provincia INT,
    telefono  VARCHAR(20),
    email VARCHAR(50),
    fecha_alta DATE,
    id_categoria INT
);

CREATE TABLE generos ( 
    id_genero INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    genero VARCHAR(50)
);

CREATE TABLE categorias (
    id_categoria INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(50)    
);

CREATE TABLE provincias (
    id_provincia INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    provincia VARCHAR(50)
);

DESCRIBE clientes;
DESCRIBE socios;
DESCRIBE generos;
DESCRIBE categorias;
DESCRIBE provincias;

/*INSERT INTO clientes(nombre,apellido) VALUES('Nombre','Apellido');
SELECT * FROM clientes; */
