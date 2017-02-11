__author__ = 'Per och Matte'
import sqlite3
from flask import g

DEFAULT = 'C:\Users\Per\PyCharmFlaskVirt\database.db'


def connect_db(database):
    conn = sqlite3.connect(database)
    return conn

def create_user(conn, task):
    sql = ''' INSERT INTO users(email, password, firstname, familyname, gender, city, country) VALUES(?,?,?,?,?,?,?) '''
    cur = conn.cursor()
    cur.execute(sql, task)
    return cur.lastrowid

def mainTest(email, password, firstname, familyname, gender, city, country):
    database = DEFAULT

    # create a database connection
    conn = connect_db(DEFAULT)
    with conn:
        # tasks
        input_1 = (email, password, firstname, familyname, gender, city, country)

        # create tasks
        create_user(conn, input_1)

def close_db(database):
    sqlite3.connect(database).close


def sign_up(name):
    conn = sqlite3.connect(DEFAULT)
    cur = conn.cursor()
    print (name)
    cur.execute('INSERT INTO USERTABLE2 VALUES(?)', (name,))
    return cur.lastrowid


