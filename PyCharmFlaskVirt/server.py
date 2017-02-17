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
            token = uuid.uuid4().hex
            print(token)
            added_user = database_helper.sign_in_user(token, email)
            if added_user == True:
                return 'User succesfully signed in', 200
            else:
                return 'Could nog sign in', 501
        else:
            return 'User not found', 200


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
        request.get_json()
        token = request.get_json().get('token')
        result = database_helper.get_user_data_by_token(token)
        print result
        if result == False:
            return 'User data could not be accessed', 501
        else:
            return  'email: {}, firstname: {},familyname: {}, gender: {}, city: {}, country: {}'.format(result[0], result[2], result[3], result[4], result[5], result[6])


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

if __name__ == '__main__':
    app.run()