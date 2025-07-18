# Prompts

## Code optimizations

split this into multiline for clarity

## Code Generation

For context, we are building a "Business Builder" team of agents that will help entrepreneurs either start
their own online business or grow their current business.

The team of agents will consist of separate agents that will call each other one after another.

Now that we have confirmed the API is working, your task is to expand our project into
separate agents, each with a specific role:

The first agent will be a clarity agent that will be responsible for asking the user questions in order to
clarify their needs.

The second agent will be a niche agent that will be responsible for generating niche content and identify
his ideal target avatar.

The third agent will be an action agent that will be responsible for telling the user exactly what
to do next.  What platform to go to, what search to find leads, what to offer them. Basically 
ensuring that the user takes action toward making money.

The last agent will be the main one, the business strategist, which will put all of the responses 
from the previous agents together in a clear and concise way and deliver that to our user.

Use the current code in main.py, this is the official format from OpenAI.

Implement this in the simplest way possible.  The api key is already in the environment, do not use
or expect a .env file.

## Business Ideas

My business is to sell custom AI image model to companies that sell physical products (such as sunglasses, fashion,
phone cases, ... or anything else).  Those companies spend thousands of dollars on photographs, models, travelling,
sample products, studios, etc.  We can give them high-quality creatives that include their exact product, just
as it appears in real life, for a fraction of the cost it takes to do these photoshoots.  I want to use 
instagram to find companies who need this, but I don't know how to start, or what to do, or what to
message them.  Please help.
