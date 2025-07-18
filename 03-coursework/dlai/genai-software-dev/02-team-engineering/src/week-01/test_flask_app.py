import unittest

from flask import Flask
from flask.testing import FlaskClient
from flask_app import app  # Assuming the Flask app is in flask_app.py


class TestFlaskApp(unittest.TestCase):
    def setUp(self):
        """Set up the test client for the Flask app."""
        self.app = app.test_client()
        self.app.testing = True

    def test_greet_valid_name(self):
        """Test the /api/greet/<name> route with a valid name."""
        response = self.app.get("/api/greet/Alice")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": "Hello, Alice!"})

    def test_greet_special_characters(self):
        """Test the /api/greet/<name> route with a name containing special characters."""
        response = self.app.get("/api/greet/John-Doe")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": "Hello, John-Doe!"})

    def test_greet_empty_name(self):
        """Test the /api/greet/<name> route with an empty name."""
        response = self.app.get("/api/greet/")
        self.assertEqual(
            response.status_code, 404
        )  # Assuming the app returns 404 for empty name

    def test_greet_long_name(self):
        """Test the /api/greet/<name> route with a very long name."""
        long_name = "a" * 256
        response = self.app.get(f"/api/greet/{long_name}")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": f"Hello, {long_name}!"})

    def test_greet_non_get_method(self):
        """Test the /api/greet/<name> route with a non-GET method."""
        response = self.app.post("/api/greet/Alice")
        self.assertEqual(response.status_code, 405)  # Method Not Allowed

    def test_invalid_route(self):
        """Test the app's response to an invalid route."""
        response = self.app.get("/api/unknown")
        self.assertEqual(response.status_code, 404)  # Not Found


if __name__ == "__main__":
    unittest.main()
