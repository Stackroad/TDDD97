
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
                   search VARCHAR (120),
                   PRIMARY KEY(email) );



CREATE TABLE if NOT EXISTS  logged_in_users2(
                            token VARCHAR (120),
                            email VARCHAR(120),
                            PRIMARY KEY(token) );

CREATE TABLE if NOT EXISTS  messages(
                            fromUser VARCHAR (120),
                            message VARCHAR (120),
                            toUser VARCHAR (120) );

CREATE TABLE if NOT EXISTS  user_files(
                            fromUserEmail VARCHAR (120),
                            path VARCHAR (120),
                            PRIMARY KEY(fromUserEmail) );

CREATE TABLE if NOT EXISTS  search_table(
                            email VARCHAR (120),
                            search VARCHAR (120),
                            PRIMARY KEY(email) );
