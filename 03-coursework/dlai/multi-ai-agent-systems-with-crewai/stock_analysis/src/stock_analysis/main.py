#!/usr/bin/env python
import os

import agentops
from dotenv import load_dotenv
from research.crew import ResearchCrew
from stock_analysis.crew import StockAnalysisCrew

load_dotenv()

agentops.init(tags=["stock_analysis"])
AGENTOPS_API_KEY = os.getenv("AGENTOPS_API_KEY")


def run():
    # Replace with your inputs, it will automatically interpolate any tasks and agents information
    company = "Tesla"
    StockAnalysisCrew().crew().kickoff(company)


# if __name__ == "__main__":
#    print("## Welcome to Financial Analysis Crew")
#    print("-------------------------------")
#    company = "Tesla"

#    financial_crew = StockAnalysisCrew(company)
#    result = financial_crew.run()
#    print("\n\n########################")
#    print("## Here is the Report")
#    print("########################\n")
#    print(result)
