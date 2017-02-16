from flask import Flask, request, render_template
import database_helper
import uuid
import json

app = Flask(__name__)
app.debug = True


@app.before_request
def before_request():
    database_helper.connect_db()

# @app.teardown_appcontext
# def teardown_db(exception):
#     db = getattr(g, '_database', None)
#     if db is not None:
#         db.close()


@app.route('/', methods=['GET'])
def hello_world():
    return render_template('client.html')


@app.route('/sign_in', methods=['POST'])
def sign_in():
    if request.method == 'POST':
        request.get_json()
        email = request.json['email']
        password = request.json['password']
        result = database_helper.get_user(email)
        print(result)
        if result == password:
            return 'User found', 200
        token = uuid.uuid4().hex
        added_user = database_helper.sign_in_user(token, email)
        if added_user == True:
            return 'User succesfully signe in', 200
        else:
            return 'Could nog sign in', 501


# skapa tpoken och lagra i logged in users table
# .hex as a 32-character hexadecimal string
# uuid4() random uuid

@app.route('/sign_up', methods=['POST'])
def sign_up():
    if request.method == 'POST':
        request.get_json()
        email = request.get_json().get('email')
        password = request.get_json().get('password')
        firstname = request.get_json().get('firstname')
        familyname = request.get_json().get('familyname')
        gender = request.get_json().get('gender')
        city = request.get_json().get('city')
        country = request.get_json().get('country')
        result = database_helper.add_user(email, password, firstname, familyname, gender, city, country)
        print(result)
        if result == True:
            return 'signed up', 200
        else:
            return 'could not sign up', 501


@app.route('/sign_out', methods=['POST'])
def sign_out():
    if request.method == 'POST':
        request.get_json()
        token = request.get_json().get('token')
        result = database_helper.sign_out(token)
        print result
        if result == True:
            return 'signed out', 200
        else:
            return 'could not sign out', 501


if __name__ == '__main__':
    app.run()