import asyncio
import json
import logging
import time
from typing import Any, Dict, List, Optional

import httpx
from anthropic import Anthropic, AsyncAnthropic
from openai import OpenAI
from termcolor import colored

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


class UnifiedApis:
    def __init__(
        self,
        name: str = "Unified Apis",
        api_key: str = "",
        max_history_words: int = 10000,
        max_words_per_message: Optional[int] = None,
        json_mode: bool = False,
        stream: bool = True,
        use_async: bool = False,
        max_retry: int = 3,
        provider: str = "anthropic",
        model: Optional[str] = None,
        should_print_init: bool = True,
        print_color: str = "green",
    ):
        """
        Initialize the UnifiedApis instance.

        :param name: Name of the instance
        :param api_key: API key for the chosen provider
        :param max_history_words: Maximum number of words to keep in conversation history
        :param max_words_per_message: Maximum words per message (if specified)
        :param json_mode: Whether to use JSON mode for responses (OpenAI only)
        :param stream: Whether to stream the response
        :param use_async: Whether to use async client
        :param max_retry: Maximum number of retries for API calls
        :param provider: AI provider to use (openai, anthropic, or openrouter)
        :param model: Specific model to use (if None, uses default for the provider)
        :param should_print_init: Whether to print initialization info
        :param print_color: Color to use for printing responses
        """
        self.provider = provider.lower()
        self.model = model or self._get_default_model()
        self.name = name
        self.api_key = api_key
        self.history: List[Dict[str, str]] = []
        self.max_history_words = max_history_words
        self.max_words_per_message = max_words_per_message
        self.json_mode = json_mode
        self.stream = stream
        self.use_async = use_async
        self.max_retry = max_retry
        self.print_color = print_color
        self.system_message = self._get_default_system_message()

        self._initialize_client()

        if should_print_init:
            print(
                colored(
                    f"{self.name} initialized with provider={self.provider}, model={self.model}, json_mode={json_mode}, stream={stream}, use_async={use_async}, max_history_words={max_history_words}, max_words_per_message={max_words_per_message}",
                    "red",
                )
            )

    def _get_default_model(self) -> str:
        """Return the default model for the selected provider."""
        if self.provider == "openai":
            return "gpt-4"
        elif self.provider == "anthropic":
            return "claude-3-sonnet-20240229"
        elif self.provider == "openrouter":
            return "google/gemini-pro-1.5"
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

    def _get_default_system_message(self) -> str:
        """Return the default system message, with JSON mode consideration for OpenAI."""
        message = "You are a helpful assistant."
        if self.provider == "openai" and self.json_mode:
            message += " Please return your response in JSON unless user has specified a system message."
        return message

    def _initialize_client(self) -> None:
        """Initialize the appropriate client based on the provider and async setting."""
        if not self.api_key:
            raise ValueError(f"API key is required for provider: {self.provider}")

        if self.provider == "openai":
            self.client = OpenAI(api_key=self.api_key)
        elif self.provider == "anthropic":
            self.client = (
                AsyncAnthropic(api_key=self.api_key)
                if self.use_async
                else Anthropic(api_key=self.api_key)
            )
        elif self.provider == "openrouter":
            base_url = "https://openrouter.ai/api/v1"
            self.client = OpenAI(base_url=base_url, api_key=self.api_key)
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

    def set_system_message(self, message: Optional[str] = None) -> None:
        """Set a new system message or reset to default if None is provided."""
        self.system_message = message or self._get_default_system_message()

    async def set_system_message_async(self, message: Optional[str] = None) -> None:
        """Asynchronous version of set_system_message."""
        self.set_system_message(message)

    def add_message(self, role: str, content: str) -> None:
        """Add a message to the conversation history."""
        if role == "user" and self.max_words_per_message:
            content += f" please use {self.max_words_per_message} words or less"
        self.history.append({"role": role, "content": str(content)})

    async def add_message_async(self, role: str, content: str) -> None:
        """Asynchronous version of add_message."""
        self.add_message(role, content)

    def print_history_length(self) -> None:
        """Print the current length of the conversation history in words."""
        history_length = sum(
            len(str(message["content"]).split()) for message in self.history
        )
        print(f"\nCurrent history length is {history_length} words")

    async def print_history_length_async(self) -> None:
        """Asynchronous version of print_history_length."""
        self.print_history_length()

    def clear_history(self) -> None:
        """Clear the conversation history."""
        self.history.clear()

    async def clear_history_async(self) -> None:
        """Asynchronous version of clear_history."""
        self.clear_history()

    def chat(self, prompt, color=None, should_print=True, **kwargs):
        """
        Send a chat message and get a response.

        :param prompt: The user's input message
        :param color: Color for printing the response (if None, uses default)
        :param should_print: Whether to print the response
        :param kwargs: Additional keyword arguments for the API call
        :return: The assistant's response
        """
        if self.use_async:
            return asyncio.run(self.chat_async(prompt, color, should_print, **kwargs))
        else:
            return self.get_response(prompt, color, should_print, **kwargs)

    async def chat_async(self, prompt, color=None, should_print=True, **kwargs):
        await self.add_message_async("user", prompt)
        return await self.get_response_async(prompt, color, should_print, **kwargs)

    def get_response(
        self,
        prompt,
        color: Optional[str] = None,
        should_print: bool = True,
        **kwargs: Any,
    ) -> Any:
        self.add_message("user", prompt)
        return self._process_response(color, should_print, **kwargs)

    def _process_response(
        self, color: Optional[str] = None, should_print: bool = True, **kwargs: Any
    ) -> Any:
        for _ in range(self.max_retry):
            try:
                return self._handle_provider_response(color, should_print, **kwargs)
            except Exception as e:
                logger.error(f"Error on attempt {_ + 1}/{self.max_retry}: {str(e)}")
                if _ < self.max_retry - 1:
                    time.sleep(1)
        raise Exception(f"Max retries ({self.max_retry}) reached")

    def _handle_provider_response(
        self, color: Optional[str], should_print: bool, **kwargs: Any
    ) -> Any:
        if self.provider in ["openai", "openrouter"]:
            return self._handle_openai_response(color, should_print, **kwargs)
        elif self.provider == "anthropic":
            return self._handle_anthropic_response(**kwargs)
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

    def _handle_openai_response(
        self, color: Optional[str], should_print: bool, **kwargs: Any
    ) -> Any:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "system", "content": self.system_message}]
            + self.history,
            stream=self.stream,
            max_tokens=kwargs.get("max_tokens", 4000),
            response_format=({"type": "json_object"} if self.json_mode else None),
            **kwargs,
        )

        assistant_response = (
            self._process_openai_stream(response, color, should_print)
            if self.stream
            else response.choices[0].message.content
        )

        if self.json_mode:
            try:
                return json.loads(assistant_response)
            except json.JSONDecodeError:
                # If JSON parsing fails, return a dict with the original response
                return {"response": assistant_response}
        else:
            return assistant_response

    def _handle_anthropic_response(self, **kwargs: Any) -> Any:
        response = self.client.messages.create(
            model=self.model,
            system=self.system_message,
            messages=self.history,
            stream=self.stream,
            max_tokens=kwargs.get("max_tokens", 8192),
            extra_headers={"anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15"},
            **kwargs,
        )
        assistant_response = response.content[0].text
        return self._finalize_response(assistant_response)

    def _process_openai_stream(
        self, response, color: Optional[str], should_print: bool
    ) -> str:
        assistant_response = ""
        for chunk in response:
            if chunk.choices[0].delta.content:
                content = chunk.choices[0].delta.content
                if should_print:
                    print(
                        colored(content, color or self.print_color),
                        end="",
                        flush=True,
                    )
                assistant_response += content
        print()
        return assistant_response

    def _finalize_response(self, assistant_response: Any) -> Any:
        if self.json_mode and self.provider == "openai":
            try:
                assistant_response = json.loads(assistant_response)
            except json.JSONDecodeError:
                logger.error(f"Failed to parse JSON response: {assistant_response}")
                raise ValueError("Invalid JSON response received")

        self.add_message(
            "assistant",
            (
                json.dumps(assistant_response)
                if isinstance(assistant_response, dict)
                else assistant_response
            ),
        )
        self.trim_history()
        return assistant_response

    async def get_response_async(
        self,
        prompt,
        color: Optional[str] = None,
        should_print: bool = True,
        **kwargs: Any,
    ) -> Any:
        self.add_message("user", prompt)
        return await self._process_response_async(color, should_print, **kwargs)

    async def _process_response_async(
        self, color: Optional[str] = None, should_print: bool = True, **kwargs: Any
    ) -> Any:
        for _ in range(self.max_retry):
            try:
                return await self._handle_provider_response_async(
                    color, should_print, **kwargs
                )
            except Exception as e:
                logger.error(f"Error on attempt {_ + 1}/{self.max_retry}: {str(e)}")
                if _ < self.max_retry - 1:
                    await asyncio.sleep(1)
        raise Exception(f"Max retries ({self.max_retry}) reached")

    async def _handle_provider_response_async(
        self, color: Optional[str], should_print: bool, **kwargs: Any
    ) -> Any:
        if self.provider in ["openai", "openrouter"]:
            return await self._handle_openai_response_async(
                color, should_print, **kwargs
            )
        elif self.provider == "anthropic":
            return await self._handle_anthropic_response_async(**kwargs)
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")

    async def _handle_openai_response_async(
        self, color: Optional[str], should_print: bool, **kwargs: Any
    ) -> Any:
        def sync_request():
            with httpx.Client() as client:
                openai_client = OpenAI(api_key=self.api_key, http_client=client)
                response = openai_client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "system", "content": self.system_message}]
                    + self.history,
                    stream=self.stream,
                    max_tokens=kwargs.get("max_tokens", 4000),
                    response_format=(
                        {"type": "json_object"} if self.json_mode else None
                    ),
                    **kwargs,
                )
                return response

        try:
            response = await asyncio.to_thread(sync_request)

            if self.stream:
                assistant_response = await self._process_openai_stream_async(
                    response, color, should_print
                )
            else:
                assistant_response = response.choices[0].message.content

            return self._finalize_response(assistant_response)
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise

    async def _handle_anthropic_response_async(self, **kwargs: Any) -> Any:
        response = await self.client.messages.create(
            model=self.model,
            system=self.system_message,
            messages=self.history,
            stream=self.stream,
            max_tokens=kwargs.get("max_tokens", 8192),
            extra_headers={"anthropic-beta": "max-tokens-3-5-sonnet-2024-07-15"},
            **kwargs,
        )
        assistant_response = response.content[0].text
        return self._finalize_response(assistant_response)

    async def _process_openai_stream_async(
        self, response, color: Optional[str], should_print: bool
    ) -> str:
        full_response = ""
        async for chunk in response:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                full_response += content
                if should_print:
                    print(
                        colored(content, color or self.print_color), end="", flush=True
                    )
        if should_print:
            print()
        return full_response

    def trim_history(self) -> None:
        """Trim the conversation history to stay within the max_history_words limit."""
        words_count = sum(
            len(str(message["content"]).split())
            for message in self.history
            if message["role"] != "system"
        )
        while words_count > self.max_history_words and len(self.history) > 1:
            words_count -= len(self.history[0]["content"].split())
            self.history.pop(0)

    async def trim_history_async(self) -> None:
        """Asynchronous version of trim_history."""
        self.trim_history()
