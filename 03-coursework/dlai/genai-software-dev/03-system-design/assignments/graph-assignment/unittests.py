import numpy as np
from dlai_grader.grading import test_case, print_feedback
from types import FunctionType
from dlai_grader.io import suppress_stdout_stderr
import os
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker



persons_data = np.array([("Alice", "New York", "Non-binary", 30), 
         ("Bob", "Los Angeles", "Male", 18), 
         ("Charlie", "Chicago", "Male", 60), 
         ("David", "Houston", "Male", 59),
         ("Eve", "Phoenix", "Non-binary", 18), 
         ("Frank", "Los Angeles", "Non-binary", 72), 
         ("Grace", "Chicago", "Female", 35), 
         ("Henry", "Houston", "Male", 21), 
         ("Ivy", "New York", "Female", 46), 
         ("Elena", "Phoenix", "Female", 66)])
#locations = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"]
#genders = ["Male", "Female", "Non-binary"]
club_descriptions = [
    "Book Club", "Hiking Club", "Chess Club", "Photography Club", "Cooking Club",
    "Music Club", "Gaming Club", "Fitness Club", "Art Club", "Travel Club"
]

def test_get_club_members(load_dataset, function):
    
    correct = {'Book Club': ['Eve', 'Alice', 'Grace', 'Frank', 'Charlie', 'Elena'],
 'Hiking Club': ['Frank', 'Ivy', 'Eve', 'Alice', 'David', 'Elena'],
 'Chess Club': ['Alice', 'Eve', 'Grace', 'Elena', 'Frank', 'David'],
 'Photography Club': ['David', 'Elena', 'Charlie', 'Alice'],
 'Cooking Club': ['David', 'Henry', 'Grace', 'Bob', 'Alice', 'Charlie'],
 'Music Club': ['Alice', 'Charlie', 'Eve', 'Henry'],
 'Gaming Club': ['Bob', 'Charlie', 'Grace', 'Alice'],
 'Fitness Club': ['Henry', 'Elena', 'Bob', 'Charlie'],
 'Art Club': ['Grace', 'David', 'Elena', 'Eve', 'Bob'],
 'Travel Club': ['Henry', 'David', 'Ivy', 'Eve', 'Elena']}
    def g():
        function_name = function.__name__
        cases = []

        # Check if function is a function method exists
        t = test_case()
        if not isinstance(function, FunctionType):
            t.failed = True
            t.msg = f"{function_name} is not a function"
            t.want = f"{function_name} must be a function"
            t.got = f"Type of {function_name} is {type(function_name)}"
            return [t]
        if 'tmp' not in os.listdir("/"):
            os.mkdir('/tmp')
        # List all files in the directory
        for filename in os.listdir('/tmp'):
            # Create the full file path
            file_path = os.path.join('/tmp', filename)
            # Check if it is a file (and not a directory/subdirectory)
            if os.path.isfile(file_path):
                # Delete the file silently
                os.remove(file_path)
        with suppress_stdout_stderr():
            session, Club, Person, friendships = load_dataset(path = '/tmp')
        learner = {}
        for c in correct.keys():
            t = test_case()
            try:
                members = [x.name for x in function(session, c)]
                learner[c] = members
            except Exception as e:
                t.failed = True
                t.msg = f"Failed execution for club description {c}"
                t.want = "Function must run properly"
                t.got = f"Exception thrown: {e}"
                return [t]
            
        for c in correct.keys():
            t = test_case()
            learner_list = learner[c]
            solution_list = correct[c]
            learner_list.sort()
            solution_list.sort()
            if learner_list != solution_list:
                t.failed = True
                t.msg = f"Incorrect club members for club description {c}"
                t.want = f"{solution_list}"
                t.got = f"{learner_list}"
            cases.append(t)
        session.close()
        return cases
    cases = g()
    print_feedback(cases)

def test_get_friends_of_person(load_dataset, function):
    
    correct = {'Alice': ['Bob', 'Charlie', 'David', 'Eve', 'Henry', 'Ivy', 'Elena'],
 'Bob': ['Alice', 'David', 'Eve', 'Frank', 'Henry', 'Ivy', 'Elena'],
 'Charlie': ['Alice',
  'Bob',
  'David',
  'Frank',
  'Grace',
  'Henry',
  'Ivy',
  'Elena'],
 'David': ['Alice',
  'Bob',
  'Charlie',
  'Eve',
  'Frank',
  'Grace',
  'Henry',
  'Ivy',
  'Elena'],
 'Eve': ['Alice', 'Charlie', 'David', 'Frank', 'Grace', 'Henry', 'Elena'],
 'Frank': ['Alice',
  'Bob',
  'Charlie',
  'David',
  'Eve',
  'Grace',
  'Henry',
  'Elena'],
 'Grace': ['Alice', 'Bob', 'David', 'Eve', 'Frank', 'Henry', 'Ivy', 'Elena'],
 'Henry': ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Grace', 'Elena'],
 'Ivy': ['Alice',
  'Bob',
  'Charlie',
  'David',
  'Eve',
  'Frank',
  'Grace',
  'Henry',
  'Elena'],
 'Elena': ['Alice',
  'Charlie',
  'David',
  'Eve',
  'Frank',
  'Grace',
  'Henry',
  'Ivy']}
    def g():
        function_name = function.__name__
        cases = []

        # Check if function is a function method exists
        t = test_case()
        if not isinstance(function, FunctionType):
            t.failed = True
            t.msg = f"{function_name} is not a function"
            t.want = f"{function_name} must be a function"
            t.got = f"Type of {function_name} is {type(function_name)}"
            return [t]
        if 'tmp' not in os.listdir("/"):
            os.mkdir('/tmp')
        # List all files in the directory
        for filename in os.listdir('/tmp'):
            # Create the full file path
            file_path = os.path.join('/tmp', filename)
            # Check if it is a file (and not a directory/subdirectory)
            if os.path.isfile(file_path):
                # Delete the file silently
                os.remove(file_path)
        with suppress_stdout_stderr():
            session, Club, Person, friendships = load_dataset(path = '/tmp')
        learner = {}
        for c in correct.keys():
            t = test_case()
            try:
                members = [x.name for x in function(session, c)]
                learner[c] = members
            except Exception as e:
                t.failed = True
                t.msg = f"Failed execution for club description {c}"
                t.want = "Function must run properly"
                t.got = f"Exception thrown: {e}"
                return [t]
            
        for c in correct.keys():
            t = test_case()
            learner_list = learner[c]
            solution_list = correct[c]
            learner_list.sort()
            solution_list.sort()
            if learner_list != solution_list:
                t.failed = True
                t.msg = f"Incorrect friends for person {c}"
                t.want = f"{solution_list}"
                t.got = f"{learner_list}"
            cases.append(t)
        return cases
    cases = g()
    print_feedback(cases)
            
def test_get_persons_who_consider_them_friend(load_dataset, function):
    
    correct = {'Alice': ['Eve',
  'Ivy',
  'Charlie',
  'Henry',
  'Bob',
  'Frank',
  'David',
  'Grace',
  'Elena'],
 'Bob': ['Frank', 'Ivy', 'David', 'Grace', 'Alice', 'Charlie', 'Henry'],
 'Charlie': ['Henry', 'Elena', 'Ivy', 'Eve', 'Frank', 'Alice', 'David'],
 'David': ['Grace',
  'Bob',
  'Henry',
  'Alice',
  'Frank',
  'Ivy',
  'Elena',
  'Eve',
  'Charlie'],
 'Eve': ['Henry', 'Frank', 'Grace', 'Elena', 'Bob', 'Alice', 'David', 'Ivy'],
 'Frank': ['Elena', 'Bob', 'David', 'Charlie', 'Ivy', 'Eve', 'Grace'],
 'Grace': ['Charlie', 'Ivy', 'Elena', 'David', 'Frank', 'Henry', 'Eve'],
 'Henry': ['David',
  'Bob',
  'Grace',
  'Ivy',
  'Charlie',
  'Frank',
  'Elena',
  'Alice',
  'Eve'],
 'Ivy': ['Elena', 'Grace', 'Alice', 'David', 'Charlie', 'Bob'],
 'Elena': ['Grace',
  'Frank',
  'Bob',
  'Henry',
  'Eve',
  'Ivy',
  'David',
  'Charlie',
  'Alice']}
    def g():
        function_name = function.__name__
        cases = []

        # Check if function is a function method exists
        t = test_case()
        if not isinstance(function, FunctionType):
            t.failed = True
            t.msg = f"{function_name} is not a function"
            t.want = f"{function_name} must be a function"
            t.got = f"Type of {function_name} is {type(function_name)}"
            return [t]
        if 'tmp' not in os.listdir("/"):
            os.mkdir('/tmp')
        # List all files in the directory
        for filename in os.listdir('/tmp'):
            # Create the full file path
            file_path = os.path.join('/tmp', filename)
            # Check if it is a file (and not a directory/subdirectory)
            if os.path.isfile(file_path):
                # Delete the file silently
                os.remove(file_path)
        with suppress_stdout_stderr():
            session, Club, Person, friendships = load_dataset(path = '/tmp')
        learner = {}
        for c in correct.keys():
            t = test_case()
            try:
                members = [x.name for x in function(session, c)]
                learner[c] = members
            except Exception as e:
                t.failed = True
                t.msg = f"Failed execution for club description {c}"
                t.want = "Function must run properly"
                t.got = f"Exception thrown: {e}"
                return [t]
            
        for c in correct.keys():
            t = test_case()
            learner_list = learner[c]
            solution_list = correct[c]
            learner_list.sort()
            solution_list.sort()
            if learner_list != solution_list:
                t.failed = True
                t.msg = f"Incorrect persons who consider {c} a friend"
                t.want = f"{solution_list}"
                t.got = f"{learner_list}"
            cases.append(t)
        return cases
    cases = g()
    print_feedback(cases)
                      
    
        
    