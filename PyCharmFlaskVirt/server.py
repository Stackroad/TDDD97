from flask import Flask, request
import database_helper
import json

#\ , render_template

app = Flask(__name__)
app.debug = True

@app.before_request
def before_request():
    database_helper.connect_db(database_helper.DEFAULT)

@app.teardown_request
def teardown_request(exception):
    database_helper.close_db(database_helper.DEFAULT)



@app.route('/')
def hello_world():
    print ('Hejsan')
    return 'Welcome to TWIDDER'


@app.route('/signup', methods=['POST'])
def signup():
    request.get_json()
    name = request.get_json().get('name')
    print (name)
    result = database_helper.sign_up(name)
    if result == True:
        return 'contact added', 200
    else:
        return 'could not add the contact', 501



#@app.route('/')
#def render_static():
#   return render_template('client.html')




if __name__ == '__main__':
    app.run(port=5001)