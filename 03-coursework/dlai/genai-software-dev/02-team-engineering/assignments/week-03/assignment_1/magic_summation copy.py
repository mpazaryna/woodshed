import sys
import numpy

def magic_summation(n, seed=None):
    ### DO NOT REMOVE OR CHANGE THE COMMAND BELOW 
    ### AS IT WON'T BE POSSIBLE TO CORRECTLY GRADE YOUR SOLUTION
    numpy.random.seed(seed)
    if n <= 2:
        return 'n cannot be less than or equal to 2'
    elif not isinstance(n, int):
        return "n must be an integer"
    ### YOUR CODE HERE ###
    return magic_summation_value

#######################################
####### DO NOT EDIT THIS PART #########
#######################################

if __name__ == "__main__":
    if len(sys.argv) > 3:
        print("You must pass at most two arguments, the value for n and/or the random seed")
        sys.exit()
    elif len(sys.argv) == 1:
        print("You must pass at least one argument, the value for n")
        sys.exit()
    elif len(sys.argv) == 3:
        n = int(sys.argv[1])
        seed = int(sys.argv[2])
    else:
        n = int(sys.argv[1])
        seed = None

    magic_summation(n, seed=seed)