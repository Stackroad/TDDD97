__author__ = 'Per och Matte'
import sqlite3
from flask import g

DATABASE = 'C:\Users\Mattias\Desktop\PyCharmFlaskVirt\database.db'


def connect_db():
    return sqlite3.connect(DATABASE)


def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = connect_db()
    return db


def add_user(email, password, firstname, familyname, gender, city, country):
    conn = connect_db()
    userdata = (email, password, firstname, familyname, gender, city, country)
    try:
        conn.execute(''' INSERT INTO users VALUES(?,?,?,?,?,?,?) ''',userdata)
        conn.commit()
        return True
    except:
        return False


# CURSOR nar nagot ska hamtas,  conn nar nagat ska sattas in och commit

def get_user(email):
    conn = connect_db()
    cur = conn.cursor()
    mail = (email,)
    try:
        cur.execute('''SELECT password FROM users WHERE email=?''', mail)
        result = cur.fetchone()
        return result[0]
    except:
        return False


def sign_in_user(token, email):
    conn = connect_db()
    userdata = (token, email)
    try:
        conn.execute('''INSERT INTO logged_in_users2 VALUES (?,?)''', userdata)
        conn.commit()
        return True
    except:
        return False


def close():
    get_db().close()


def sign_out(token):
    conn = connect_db()
    toke = (token,)
    try:
        conn.execute('''DELETE FROM logged_in_users2 WHERE token=?''',toke)
        conn.commit()
        return True
    except:
        return False
