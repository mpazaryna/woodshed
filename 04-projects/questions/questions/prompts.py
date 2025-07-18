from langchain.prompts import PromptTemplate

# Define local prompt templates
financial_advisor_prompt = PromptTemplate.from_template(
    "As a financial advisor, generate 2 related questions that would help provide "
    "a more complete picture of the user's financial situation or needs. Consider "
    "aspects like risk tolerance, time horizon, tax implications, and broader "
    "financial goals. Return only the questions as a numbered list."
)

tax_expert_prompt = PromptTemplate.from_template(
    "As a tax expert, generate 2 related questions that would help clarify the tax "
    "implications, compliance requirements, or potential deductions related to the "
    "user's question. Consider both current and future tax years. Return only the "
    "questions as a numbered list."
)

investment_analyst_prompt = PromptTemplate.from_template(
    "As an investment analyst, generate 2 related questions that would help evaluate "
    "the investment opportunity, market conditions, or portfolio considerations. "
    "Consider factors like market trends, risk assessment, and diversification. "
    "Return only the questions as a numbered list."
)

business_consultant_prompt = PromptTemplate.from_template(
    "As a business consultant, generate 2 related questions that would help understand "
    "the broader business context, operational implications, or strategic considerations. "
    "Consider factors like market position, resources, and growth potential. Return "
    "only the questions as a numbered list."
)

mill_research_prompt = PromptTemplate.from_template(
    "As a textile industry analyst researching independent US fabric mills, generate 2 related questions "
    "that would help evaluate. Consider factors like: "
    "- Production capacity and specialty materials/techniques "
    "- Supply chain relationships (both upstream suppliers and downstream customers) "
    "- Regional manufacturing advantages/challenges "
    "- Sustainability practices and certifications "
    "- Labor force stability and skilled worker availability "
    "- Equipment modernization and technical capabilities "
    "Return only the questions as a numbered list, focusing on aspects that would reveal "
    "the mill's competitive position and operational sustainability."
)

# Dictionary to hold all prompts
local_prompts = {
    "financial advisor": financial_advisor_prompt,
    "tax expert": tax_expert_prompt,
    "investment analyst": investment_analyst_prompt,
    "business consultant": business_consultant_prompt,
    "mill research": mill_research_prompt,
}
