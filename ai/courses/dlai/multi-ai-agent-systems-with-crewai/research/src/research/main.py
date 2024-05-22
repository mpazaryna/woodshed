#!/usr/bin/env python
import os

import agentops
from dotenv import load_dotenv
from research.crew import ResearchCrew

load_dotenv()

agentops.init(tags=["research_article"])
AGENTOPS_API_KEY = os.getenv("AGENTOPS_API_KEY")


def run():
    inputs = {"topic": "Artificial Intelligence"}
    ResearchCrew().crew().kickoff(inputs=inputs)


# if __name__ == "__main__":
#    print("## Welcome to Financial Analysis Crew")
#    print('-------------------------------')
#    company = "Tesla"

#    financial_crew = FinancialCrew(company)
#    result = financial_crew.run()
#    print("\n\n########################")
#    print("## Here is the Report")
#    print("########################\n")
#    print(result)
