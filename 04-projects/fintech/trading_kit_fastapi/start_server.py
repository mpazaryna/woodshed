import os

import uvicorn

if __name__ == "__main__":
    os.environ["PYTHONPATH"] = "src"
    uvicorn.run(
        "src.trading_kit_fastapi.main:app", host="0.0.0.0", port=8000, reload=True
    )
