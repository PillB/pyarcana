#!/usr/bin/env python3
"""Serve a built static export the way GitHub Pages serves it.

`python3 -m http.server` is not a stand-in for Pages, and the gap hid a real
defect: Next's export writes `cookies.html` next to a `cookies/` directory of
RSC segment files, so http.server answered `/pyarcana/cookies` with a redirect
to `cookies/` and a listing of it, while Pages returns the page. A browser test
of a legal route therefore never saw the route at all.

Verified against https://pillb.github.io/pyarcana on 2026-09-19:

    /pyarcana/cookies        200, the exported cookies.html
    /pyarcana/cookies/       404
    /pyarcana/cookies.html   200

So: a path with no extension is served from `<path>.html` when that file
exists, even though a directory of the same name is there too; a path with a
trailing slash is served from its `index.html` or not at all; anything missing
gets the export's own `404.html` with status 404, as Pages does; and no
directory is ever listed.

Usage (the CI job serves the directory holding the base path):

    python3 scripts/serve_pages_static.py .ci-static 4173
"""

import functools
import http.server
import os
import sys


class PagesHandler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler with Pages' file resolution."""

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            # Pages serves a directory only through its own index.html, and
            # never redirects to a listing.
            index = os.path.join(path, "index.html")
            if not os.path.isfile(index):
                return self.send_not_found()
        elif not os.path.isfile(path):
            return self.send_not_found()
        return super().send_head()

    def translate_path(self, path):
        translated = super().translate_path(path)
        clean = path.split("?", 1)[0].split("#", 1)[0]
        if not clean.endswith("/") and os.path.isfile(translated + ".html"):
            return translated + ".html"
        return translated

    def send_not_found(self):
        """The export's own 404 page, with the status Pages sends."""
        page = os.path.join(self.directory, self.base_path, "404.html")
        body = b""
        if os.path.isfile(page):
            with open(page, "rb") as handle:
                body = handle.read()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)
        return None

    def log_message(self, *args):
        """Quiet: a CI log of every asset request buries the test output."""


def main():
    if len(sys.argv) != 3:
        sys.exit(f"usage: {sys.argv[0]} <directory> <port>")
    directory, port = sys.argv[1], int(sys.argv[2])
    # The base path is a directory inside the served root, as on Pages, where
    # the site lives under the repository name.
    PagesHandler.base_path = os.environ.get("PAGES_BASE_PATH", "pyarcana")
    handler = functools.partial(PagesHandler, directory=directory)
    server = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)
    print(f"serving {directory} on http://127.0.0.1:{port} the way Pages does", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
