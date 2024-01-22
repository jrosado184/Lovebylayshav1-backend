#!/bin/bash

# Define an array of test scripts
tests=("guestUserTests" "appointmentTests" "userTests" "authTests")

# Loop through the test scripts
for test in "${tests[@]}"; do
  echo "Running test: $test"
  npm run "$test" & # Run the test in the background
  pid=$! # Get the process ID of the test

  # Wait for the user to press Enter to stop the test
  read -p "Press Enter to stop the test..."
  
  # Send Ctrl+C to terminate the test
  pkill -P "$pid" # Send Ctrl+C to the child process

  # Wait for the test to finish
  wait "$pid"

  echo "Test $test completed."
done

# Continue with the next command
echo "All tests completed. Continuing with the next command..."
# Insert your next command here
