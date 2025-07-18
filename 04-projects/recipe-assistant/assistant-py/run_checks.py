import subprocess
import sys


def run_command(command):
    print(f"Running: {' '.join(command)}")
    result = subprocess.run(command, capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print(result.stderr, file=sys.stderr)
    return result.returncode


def main():
    print("Starting code checks...")

    # Run pytest with coverage
    pytest_result = run_command(["pytest", "--cov=.", "--cov-report=term-missing"])

    # Run Black
    black_result = run_command(["black", "--check", "."])

    # Run isort
    isort_result = run_command(["isort", "--check-only", "--diff", "."])

    # Run flake8
    flake8_result = run_command(["flake8", "."])

    # Check if any command failed
    if any([pytest_result, black_result, isort_result, flake8_result]):
        print("Some checks failed. Please review the output above.")
        sys.exit(1)
    else:
        print("All checks passed successfully!")


if __name__ == "__main__":
    main()
