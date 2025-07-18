# README

Key changes made to make the code Python 3 compatible:

- Changed the print statements from Python 2 style to Python 3 style using parentheses
- Used f-strings for string formatting instead of .format()
- Changed range() to list(range()) since range returns an iterator in Python 3
- Used integer division operator // instead of regular division / to maintain the same behavior as Python 2
- Changed .next() method to next() function for iterator
- Fixed indentation to be consistent throughout the code

The main behavioral difference that needed to be addressed was the division operator change between Python 2 and Python 3. In Python 2, division between integers automatically performed integer division (floor division), while in Python 3 it performs float division. To maintain the same behavior, we explicitly use the floor division operator //.
Based on the unittest provided, it's testing for these specific conditions:

The function type checking
Exception handling
Correct output for n=30 and seed=10, expecting a result of 46