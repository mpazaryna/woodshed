# test_fabric_manufacturing_simulation.py

import unittest
from unittest.mock import patch

from manufacturing_simulation import calculate_cost, calculate_lead_time, run_simulation


class TestCalculateCost(unittest.TestCase):
    def test_calculate_cost_cotton_validQuantity_correctCost(self):
        """Test calculate_cost with cotton and valid quantity returns correct cost."""
        fabric_type = "cotton"
        quantity = 100
        expected_cost = (5 * 100 * 1.0) + (15 * (100 / 10))  # Base cost + labor cost

        with patch("random.uniform", return_value=1.0):
            cost = calculate_cost(fabric_type, quantity)

        self.assertAlmostEqual(cost, expected_cost, places=2)

    def test_calculate_cost_invalidFabricType_raisesKeyError(self):
        """Test calculate_cost with invalid fabric type raises KeyError."""
        with self.assertRaises(KeyError):
            calculate_cost("invalid_fabric", 100)

    def test_calculate_cost_zeroQuantity_zeroCost(self):
        """Test calculate_cost with zero quantity returns zero cost."""
        fabric_type = "cotton"
        quantity = 0
        expected_cost = 0.0

        with patch("random.uniform", return_value=1.0):
            cost = calculate_cost(fabric_type, quantity)

        self.assertEqual(cost, expected_cost)


class TestCalculateLeadTime(unittest.TestCase):
    def test_calculate_lead_time_cotton_validQuantity_correctLeadTime(self):
        """Test calculate_lead_time with cotton and valid quantity returns correct lead time."""
        fabric_type = "cotton"
        quantity = 100
        expected_lead_time = (2 * 100 / 100) + 0.0  # Base time + delay

        with patch("random.uniform", return_value=0.0):
            lead_time = calculate_lead_time(fabric_type, quantity)

        self.assertAlmostEqual(lead_time, expected_lead_time, places=2)

    def test_calculate_lead_time_invalidFabricType_raisesKeyError(self):
        """Test calculate_lead_time with invalid fabric type raises KeyError."""
        with self.assertRaises(KeyError):
            calculate_lead_time("invalid_fabric", 100)

    def test_calculate_lead_time_zeroQuantity_zeroLeadTime(self):
        """Test calculate_lead_time with zero quantity returns zero lead time."""
        fabric_type = "cotton"
        quantity = 0
        expected_lead_time = 0.0

        with patch("random.uniform", return_value=0.0):
            lead_time = calculate_lead_time(fabric_type, quantity)

        self.assertEqual(lead_time, expected_lead_time)


class TestRunSimulation(unittest.TestCase):
    def test_run_simulation_cotton_validQuantity_printsOutput(self):
        """Test run_simulation with cotton and valid quantity prints expected output."""
        fabric_type = "cotton"
        quantity = 100

        with patch("builtins.print") as mock_print, patch(
            "random.uniform", return_value=1.0
        ):
            run_simulation(fabric_type, quantity)

        # Debugging: Print all calls to mock_print
        for call in mock_print.call_args_list:
            print(call)

        mock_print.assert_any_call(f"Fabric Type: {fabric_type}")
        mock_print.assert_any_call(f"Quantity: {quantity} yards")
        mock_print.assert_any_call(f"Estimated Cost: $650.00")  # Updated expected cost
        mock_print.assert_any_call(
            f"Estimated Lead Time: 3.0 days"
        )  # Updated expected lead time
        mock_print.assert_any_call("---")


if __name__ == "__main__":
    unittest.main()
