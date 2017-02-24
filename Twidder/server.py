from flask import Flask, request, send_from_directory, render_template
from validate_email import validate_email

import database_helper
import uuid
import json

sockets = {}
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

@app.route('/socket')
def socket():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']
        while True:
            message = ws.receive()
            messagedata = json.loads(message)
            print messagedata
            token = messagedata['token']
            print token
            email = database_helper.get_user_email(token)
            print email
            if email in sockets:
                #returnMessage = json.dumps({'message': 'hastalavista'})
                sockets[email].send('hastalavista')
            sockets[email] = ws
    return

    # if 'tjena' == message[]:
    #   print 'Nu ar vi har'
    # ws.send(message)


# amessage = message.read()
# messagedata = json.loads(message)

# if (message[0] == )
# if (token != None)
# ws.send(message)


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
                return json.dumps({'success': True, 'message': 'Succesfully signed in, your token is:',
                                   'token': token})
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
                    return json.dumps({'success': True, 'message': 'Succesfully signed up', 'messages': 200})
                else:
                    return json.dumps({'success': False, 'message': 'Could not sign up check passwords or that your '
                                                                    ' not already a member', 'messages': 501})
            else: return json.dumps({'success': False, 'message': 'Not a valid email', 'messages': 501})
        else:
            return json.dumps({'success': False, 'message': 'Password needs to be longer then 5 characters',
                               'messages': 501})


@app.route('/sign_out', methods=['POST'])
def sign_out():
    if request.method == 'POST':
        token = request.form['token']
        result = database_helper.sign_out(token)
        print result
        if result == True:
            return json.dumps({'success': True, 'Message': ' signed out', 'token':token})
        else:
            return json.dumps({'success': False, 'Message': 'failed'})


@app.route('/change_password', methods=['POST'])
def change_password():
    if request.method == 'POST':
        token = request.form['token']
        old_password = request.form['oldPass']
        new_password = request.form['newPass']
        repeat_newpass = request.form['repeatNewPass']
        email = database_helper.get_user_email(token)
        verify_pass = database_helper.get_user(email)
        if verify_pass == old_password:
            if len(new_password) > 5:
                result = database_helper.new_password(new_password,email);
                if repeat_newpass == new_password:
                    if result == True:
                        return json.dumps({'success': True, 'message': 'Changed password'})
                    else:
                        return json.dumps({'success': False, 'message': 'could not change password'})
                else:
                    return json.dumps({'success': False, 'message': 'New passwords does not match',
                                       'messages': 501})
            else:
                return json.dumps({'success': False, 'message': 'Password needs to be longer then 5 characters',
                               'messages': 501})
        else:
            return json.dumps({'success': False, 'message': 'Old password does not match'})


@app.route('/get_user_data_by_token', methods=['POST'])
def get_user_data_by_token():
    if request.method == 'POST':
        token = request.form['token']
        result = database_helper.get_user_data_by_token(token)
        if result == False:
            return json.dumps({'success': False, 'message': 'Something went wrong'})
        else:
            return  json.dumps({'success': True, 'message': 'User data is returned',
                                'email': result[0], 'firstname': result[2],
                                'familyname': result[3], 'gender': result[4], 'city': result[5], 'country': result[6]})





@app.route('/get_user_data_by_email', methods=['POST'])
def get_user_data_by_email():
    if request.method == 'POST':
        email = request.form['email']
        token = request.form['token']
        if token != None:
            result = database_helper.get_user_data_by_email(email)
            if result == None:
                return json.dumps({'success': False, 'message': 'User email could not be found in table', 'messages': 501})
            else:
                return json.dumps({'success': True, 'message': 'User data is returned', 'email': result[0],
                                   'firstname': result[2], 'familyname': result[3], 'gender': result[4],
                                   'city': result[5], 'country': result[6]})
        else:
            return json.dumps({'success': False, 'message': 'User email could not be found in table', 'messages': 501})


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
        token = request.form['token']
        message = request.form['message']
        toUser = request.form['email']
        fromUser = database_helper.get_user_email(token)
        result = database_helper.post_message(fromUser, message, toUser)
        if result == True:
            return json.dumps({'success': True, 'Message': 'Message posted', 'token':token,'toUser':toUser,})
        else:
            return json.dumps({'success': False, 'Message': 'failed'})

@app.route('/get_user_messages_by_email', methods=['POST'])
def get_user_messages_by_email():
    if request.method == 'POST':
        token = request.form['token']
        toUser = request.form['email']
        signedIn = database_helper.get_user_email(token)
        if signedIn != False:
            result = database_helper.get_user_messages_by_email(toUser)
            return json.dumps({'success': True, 'Message': 'This is the retrieved messages', 'Messages': result})
        else:
            return json.dumps({'success': False, 'Message': 'failed'})

@app.route('/delete_message', methods=['POST'])
def delete_message():
    if request.method == 'POST':
        message = request.form['message']
        toUser = request.form['email']
        result = database_helper.delete_message(message, toUser)
        if result == True:
            return json.dumps({'success': True, 'message': message, 'toUser':toUser,})
        else:
            return json.dumps({'success': False, 'message': 'failed'})