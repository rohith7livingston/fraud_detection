# Use official Python image as base
FROM python:3.9-slim

# Set the working directory
WORKDIR /usr/src/app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the port your app will run on
EXPOSE 5001

# Command to run the Python Flask app
CMD ["python", "app.py"]
