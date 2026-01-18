FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

WORKDIR /app

# Copy only the backend folder into the image. When Fly builds remotely the
# build context is the repository root, so reference the backend files with
# their relative paths from the repo root.
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Place the package under /app/backend so the module path `backend.app` works
# the same way it does locally.
COPY backend/ /app/backend

EXPOSE 8080
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8080"]
