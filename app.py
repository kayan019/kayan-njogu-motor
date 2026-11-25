"""
Kayan & Njogu Motors — Entrypoint Compatibility Wrapper
Delegates directly to the secure Flask application factory in `run.py`.
"""

import os
from run import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
