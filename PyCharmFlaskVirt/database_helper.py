__author__ = 'Per och Matte'
import sqlite3
from flask import g

DEFAULT = 'C:\Users\Per\PyCharmFlaskVirt\database.db'


def connect_db(database):
    conn = sqlite3.connect(database)
    return conn



def close_db(database):
    sqlite3.connect(database).close


def sign_up(name):
    conn = sqlite3.connect(DEFAULT)
    cur = conn.cursor()
    cur.execute('INSERT INTO USER VALUES(?)', (name,))
    return cur.lastrowid


