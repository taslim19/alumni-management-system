#!/usr/bin/env python3
"""
Simple HTTP server for SPA (Single Page Application)
Serves index.html for all routes to support client-side routing
"""

import http.server
import socketserver
import os
from urllib.parse import urlparse

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers if needed
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()
    
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        # If it's a file that exists, serve it normally
        if os.path.isfile('.' + parsed_path.path):
            return super().do_GET()
        
        # For all other routes, serve index.html (SPA routing)
        self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    PORT = 3000
    
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")

