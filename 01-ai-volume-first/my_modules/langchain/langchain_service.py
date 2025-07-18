# flake8: noqa: W293
import asyncio
import logging
import os
from pathlib import Path

import yaml  # type: ignore
from langchain.memory import ConversationBufferMemory
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import OpenAI

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class LangChainService:
    def __init__(self):
        self.config = {
            "llm": {"default": "openai", "options": ["openai", "gemini"]},
            "openai": {"api_key_env": "OPENAI_API_KEY", "model": "gpt-3.5-turbo"},
            "gemini": {"api_key_env": "GOOGLE_API_KEY", "model": "gemini-pro-vision"},
        }
        self.llm = None
        self.memory = ConversationBufferMemory(return_messages=True)

    async def initialize_llm(self):
        if self.llm is not None:
            return

        llm_type = self.config["llm"]["default"]
        logger.debug(f"Initializing LLM of type: {llm_type}")

        if llm_type not in self.config["llm"]["options"]:
            logger.error(f"Unsupported LLM type: {llm_type}")
            raise ValueError(f"Unsupported LLM type: {llm_type}")

        api_key_env = self.config[llm_type]["api_key_env"]
        api_key = os.getenv(api_key_env)

        if not api_key:
            logger.error(f"API key not found in environment variable: {api_key_env}")
            raise ValueError(
                f"API key not found in environment variable: {api_key_env}"
            )

        logger.debug(f"API key found for {llm_type}")

        try:
            if llm_type == "openai":
                logger.debug("Initializing OpenAI LLM")
                self.llm = OpenAI(api_key=api_key)
            elif llm_type == "gemini":
                logger.debug("Initializing Gemini LLM")
                self.llm = ChatGoogleGenerativeAI(
                    google_api_key=api_key,
                    model=self.config["gemini"]["model"],
                    temperature=0.7,
                    max_output_tokens=1024,
                )
        except Exception as e:
            logger.exception(f"Error initializing {llm_type} LLM: {str(e)}")
            raise

    def create_chain(self, prompt):
        prompt_template = PromptTemplate(
            input_variables=["history", "input"], template=prompt
        )
        return (
            {"history": RunnablePassthrough(), "input": RunnablePassthrough()}
            | prompt_template
            | self.llm
        )

    async def generate_response(self, prompt, input_text):
        await self.initialize_llm()

        logger.debug(f"Generating response for input: {input_text[:50]}...")
        chain = self.create_chain(prompt)
        response = await chain.ainvoke(
            {"history": self.memory.buffer, "input": input_text}
        )

        # Handle different response formats
        if isinstance(response, str):
            content = response
        elif hasattr(response, "content"):
            content = response.content
        else:
            content = str(response)

        logger.debug(f"Generated response: {content[:50]}...")

        self.memory.chat_memory.add_user_message(input_text)
        self.memory.chat_memory.add_ai_message(content)
        return content

    async def summarize_text(self, text):
        await self.initialize_llm()

        summary_prompt = PromptTemplate(
            input_variables=["text"],
            template="Please provide a concise summary of the following text:\n\n{text}\n\nSummary:",
        )

        chain = summary_prompt | self.llm

        try:
            response = await chain.ainvoke({"text": text})
            return response if isinstance(response, str) else str(response)
        except Exception as e:
            logger.exception("Error in summarize_text")
            raise

    async def answer_question(self, question, context):
        await self.initialize_llm()

        qa_prompt = PromptTemplate(
            input_variables=["context", "question"],
            template="Context: {context}\n\nQuestion: {question}\n\nAnswer:",
        )

        chain = qa_prompt | self.llm

        try:
            response = await chain.ainvoke({"context": context, "question": question})
            return response if isinstance(response, str) else str(response)
        except Exception as e:
            logger.exception("Error in answer_question")
            raise

    async def translate_text(self, text, target_language):
        await self.initialize_llm()

        translation_prompt = PromptTemplate(
            input_variables=["target_language", "text"],
            template="Translate the following text to {target_language}:\n\n{text}\n\nTranslation:",
        )

        chain = translation_prompt | self.llm

        try:
            response = await chain.ainvoke(
                {"target_language": target_language, "text": text}
            )
            return response if isinstance(response, str) else str(response)
        except Exception as e:
            logger.exception("Error in translate_text")
            raise


async def get_langchain_service():
    service = LangChainService()
    await service.initialize_llm()
    return service
