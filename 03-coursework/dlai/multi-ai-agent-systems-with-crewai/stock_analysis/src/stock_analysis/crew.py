from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from langchain.tools.yahoo_finance_news import YahooFinanceNewsTool
from langchain_openai import ChatOpenAI
from tools.calculator_tools import CalculatorTools
from tools.search_tools import SearchTools
from tools.sec_tools import SECTools


@CrewBase
class StockAnalysisCrew:
    """StockAnalysis crew"""

    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o"
            # model="gpt-4-turbo"
            # model="gpt-3.5-turbo"
        )

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def financial_analysis(self) -> Agent:
        return Agent(
            config=self.agents_config["financial_analysis"],
            verbose=True,
            tools=[
                SearchTools.search_internet,
                CalculatorTools.calculate,
                SECTools.search_10q,
                SECTools.search_10k,
            ],
            llm=self.llm,
        )

    @agent
    def research_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config["research"],
            verbose=True,
            tools=[
                SearchTools.search_internet,
                SearchTools.search_news,
                YahooFinanceNewsTool(),
                SECTools.search_10q,
                SECTools.search_10k,
            ],
            llm=self.llm,
        )

    @agent
    def investment_advisor(self) -> Agent:
        return Agent(
            config=self.agents_config["investment_advisor"],
            verbose=True,
            tools=[
                SearchTools.search_internet,
                CalculatorTools.calculate,
                SECTools.search_10q,
                SECTools.search_10k,
            ],
            llm=self.llm,
        )

    @task
    def recommend(self) -> Task:
        return Task(
            config=self.tasks_config["recommend"], agent=self.investment_advisor()
        )

    @task
    def financial_analysis(self) -> Task:
        return Task(
            config=self.tasks_config["financial_analysis"],
            agent=self.financial_analysis(),
            output_file="report.md",
        )

    @task
    def filings_analysis(self) -> Task:
        return Task(
            config=self.tasks_config["filings_analysis"],
            agent=self.financial_analysis(),
            output_file="report.md",
        )

    @task
    def recommend(self) -> Task:
        return Task(
            config=self.tasks_config["recommend"],
            agent=self.investment_advisor(),
            output_file="report.md",
        )

    @crew
    def crew(self) -> Crew:
        """Creates the StockAnalysis crew"""
        return Crew(
            agents=self.agents,  # Automatically created by the @agent decorator
            tasks=self.tasks,  # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=2,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )
