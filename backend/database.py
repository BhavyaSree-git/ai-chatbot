from flask import Flask
from flask_mysqldb import MySQL

app = Flask(__name__)
app.secret_key = 'abcdefghijklmnopqirestuvwxyz'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'chatbot_db'

mysql = MySQL(app)
