
-- CREATE TABLE USERTABLE3(name VARCHAR(120), PRIMARY KEY(name) );
--INSERT INTO USERTABLE3 values('Perra');
--select	*	from	USERTABLE3;

-- tasks table
CREATE TABLE if NOT EXISTS users(
                   email VARCHAR(120),
                   password VARCHAR(120),
                   firstname VARCHAR(120),
                   familyname VARCHAR(120),
                   gender VARCHAR(120),
                   city VARCHAR(120),
                   country VARCHAR(120),
                   PRIMARY KEY(email) );


CREATE TABLE if NOT EXISTS  logged_in_users2(
                            token VARCHAR (120),
                            email VARCHAR(120),
                            PRIMARY KEY(token) );