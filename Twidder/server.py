from flask import Flask, request, send_from_directory, render_template
from validate_email import validate_email
import database_helper
import uuid
import json

# app = Flask('Twidder')
app = Flask(__name__, static_url_path='')
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
def root():
    return app.send_static_file('client.html')


@app.route('/sign_in', methods=['POST'])
def sign_in():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        result = database_helper.get_user(email)
        print(result)
        if result == password:
            token = uuid.uuid4().hex
            added_user = database_helper.sign_in_user(token, email)
            if added_user == True:
                return json.dumps({'success': True, 'message': 'Succesfully signed in, your token is:', 'messages': token})
            else:
                 return json.dumps({'success': False, 'message': 'Could not sign in', 'messages': 501})
        else:
            return json.dumps({'False': True, 'message': 'Password does not match', 'messages': 501})

# skapa tpoken och lagra i logged in users table
# .hex as a 32-character hexadecimal string
# uuid4() random uuid


@app.route('/sign_up', methods=['POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        firstname = request.form['firstname']
        familyname = request.form['familyname']
        gender = request.form['gender']
        city = request.form['city']
        country = request.form['country']
        result = database_helper.add_user(email, password, firstname, familyname, gender, city, country)
        if len(password) > 5:
            if validate_email(email)== True:
                if result == True:
                    return 'signed up', 200
                else:
                    return 'could not sign up', 501
            else: return 'Not a valid email', 501
        else:
            return 'Password needs to be longer then 5 characters', 501


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


@app.route('/change_password', methods=['POST'])
def change_password():
    if request.method == 'POST':
        request.get_json()
        token = request.get_json().get('token')
        old_password = request.get_json().get('old_password')
        new_password = request.get_json().get('new_password')
        email = database_helper.get_user_email(token)
        verify_pass = database_helper.get_user(email)
        if verify_pass == old_password:
            result = database_helper.new_password(new_password,email)
            if result == True:
                return 'Changed password', 200
            else:
                return 'could not change password', 501
        else:
            return 'Old password does not match', 501


@app.route('/get_user_data_by_token', methods=['POST'])
def get_user_data_by_token():
    if request.method == 'POST':
        token = request.form('token')
        result = database_helper.get_user_data_by_token(token)
        if result == False:
            return 'User data could not be accessed', 501
        else:
            return  json.dumps({'Success': True, 'Message': 'User data is returned', 'email': result[0],
                                   'firstname': result[2], 'familyname': result[3], 'gender': result[4],
                                   'city': result[5], 'country': result[6]})




@app.route('/get_user_data_by_email', methods=['POST'])
def get_user_data_by_email():
    if request.method == 'POST':
        request.get_json()
        email = request.get_json().get('email')
        token = request.get_json().get('token')
        if token != None:
            result = database_helper.get_user_data_by_email(email)
            if result == False:
                return 'User email could not be found in table', 501
            else:
                return json.dumps({'Success': True, 'Message': 'User data is returned', 'email': result[0],
                                   'firstname': result[2], 'familyname': result[3], 'gender': result[4],
                                   'city': result[5], 'country': result[6]})
        else:
            return 'You are not signed in', 501


@app.route('/get_user_messages_by_token', methods=['POST'])
def get_user_messages_by_token():
    if request.method == 'POST':
        request.get_json()
        token = request.get_json().get('token')
        toUser = database_helper.get_user_email(token)
        result = database_helper.get_user_message_by_token(toUser)
        if result != False:
            return json.dumps({'Success': True, 'Message': 'This is the retrieved messages', 'Messages': result})
        else:
            return 'could not change password', 501


@app.route('/post_message', methods=['POST'])
def post_message():
    if request.method == 'POST':
        request.get_json()
        token = request.get_json().get('token')
        message = request.get_json().get('message')
        toUser = request.get_json().get('email')
        fromUser = database_helper.get_user_email(token)
        result = database_helper.post_message(fromUser, message, toUser)
        if result == True:
            return 'Message posted', 200
        else:
            return 'could not post message', 501

@app.route('/get_user_messages_by_email', methods=['POST'])
def get_user_messages_by_email():
    if request.method == 'POST':
        request.get_json()
        token = request.get_json().get('token')
        toUser = request.get_json().get('email')
        signedIn = database_helper.get_user_email(token)
        if signedIn != False:
            result = database_helper.get_user_messages_by_email(toUser)
            print result
            return json.dumps({'Success': True, 'Message': 'This is the retrieved messages', 'Messages': result})
        else:
            return 'fial', 501



# ['email':result[0], 'firstname':result[1], 'familyname':result[2], 'gender':result[3], 'city':result[4], 'country':result[5]]

