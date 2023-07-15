create database escuel_a;
use escuel_a;

create table curso(
id_curso varchar(20) not null primary key,
nombre varchar (20) not null
);

create table alumno (
matricula int (20) not null primary key,
nombre varchar(20) not null,
cuatrimestre varchar(20) not null
);

create table inscrito(
matricula int (20) not null,
id_curso varchar(20) not null,
foreign key (matricula) references alumno (matricula) ON DELETE CASCADE ON UPDATE CASCADE,
foreign key (id_curso) references curso (id_curso) ON DELETE CASCADE ON UPDATE CASCADE
);

create table bajas(
matricula int (20) not null,
nombre varchar(20) not null,
cuatrimestre varchar (20) not null
);


#agregar alumno
insert into alumno values (1, "Pedro picapiedra", "tercero" );

#agregar un curso
insert into curso values(1,"base de datos");

#Agregar un inscrito
insert into inscrito values(2, "Base de datos");
insert into inscrito values (1,1);



select * from alumno;
select * from curso;
select * from inscrito;

alter user 'root'@"localhost" identified with mysql_native_password by 'P4nt3r4.123';

select * from e_scuela.inscrito;

delete from inscrito where matricula > 0 ;
delete from alumno where matricula > 0 ;
