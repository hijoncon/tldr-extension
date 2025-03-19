import http.server
import ssl
import os

os.chdir('build')

port = 3000
Handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(('localhost', port), Handler)

# Create an SSL context
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(certfile="../localhost.pem", keyfile="../localhost-key.pem")

# Wrap the socket
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

print(f"Serving on https://localhost:{port}")
httpd.serve_forever()