__author__ = 'Per och Matte'
import sqlite3
from flask import g

DATABASE = 'C:\Users\Per\PyCharmFlaskVirt\database.db'


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

def get_user_email(token):
    conn = connect_db()
    cur = conn.cursor()
    getToken = (token,)
    try:
        cur.execute('''SELECT email FROM logged_in_users2 WHERE token=?''', getToken)
        result = cur.fetchone()
        return result[0]
    except:
        return False

def get_user_data_by_token(token):
    email_input = get_user_email(token)
    conn = connect_db()
    cur = conn.cursor()
    email_input2 = (email_input,)
    try:
        cur.execute('''SELECT * FROM users WHERE email=? ''', email_input2)
        result = cur.fetchone()
        print result
        return result
    except:
        return False
#[result[1], result[2], result[3], result[4], result[5], result[6], result[7]]

def sign_in_user(token, email):
    conn = connect_db()
    userdata = (token, email)
    try:
        conn.execute('''INSERT INTO logged_in_users2 VALUES (?,?)''', userdata)
        conn.commit()
        return True
    except:
        return False

def new_password(new_password, email):
    conn = connect_db()
    user_data = (new_password, email)
    try:
        conn.execute('''UPDATE users SET password=? WHERE email=?''', user_data)
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
        # Lyckas alltid att ta bort fran logged in users, rakna rader istallet?