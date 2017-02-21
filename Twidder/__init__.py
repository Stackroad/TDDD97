from Twidder import server
from gevent.wsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

if __name__ == '__main__':

    http_server = WSGIServer(('127.0.0.1', 5000), server.app, handler_class=WebSocketHandler)
    http_server.serve_forever()

