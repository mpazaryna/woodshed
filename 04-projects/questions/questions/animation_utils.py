import asyncio
import sys
import time
from typing import Callable, Tuple


def create_progress_animation() -> Tuple[Callable, Callable]:
    """
    Creates progress animation functions for the CLI interface.

    This function defines and returns two functions: `start_animation` and `stop_animation`.
    The `start_animation` function initiates a progress animation that runs in a separate thread,
    while the `stop_animation` function stops the animation and clears the output line.

    The animation consists of a series of dots that appear and disappear to indicate progress.
    The `animation_running` variable is used to control the animation state. It is defined in the
    enclosing scope of this function and is modified by the nested functions. The `nonlocal`
    keyword is used to allow the nested functions to access and modify the `animation_running`
    variable from the outer function's scope.

    Returns:
        Tuple[Callable, Callable]: A tuple containing the `start_animation` and `stop_animation`
        functions, which can be called to control the progress animation.

    Example:
        start, stop = create_progress_animation()
        task = start("Processing...")
        # ... perform some work ...
        stop(task, message_length=len("Processing..."))
    """
    animation_running = False
    MAX_ANIMATION_DOTS = 3
    ANIMATION_SLEEP_DURATION = 0.5  # Duration for each animation dot

    def animate(message: str):
        """Animate the progress indicator."""
        nonlocal animation_running
        dots = 1
        while animation_running:
            sys.stdout.write(
                f"\r{message}" + "." * dots + " " * (MAX_ANIMATION_DOTS - dots)
            )
            sys.stdout.flush()
            dots = (dots % MAX_ANIMATION_DOTS) + 1
            time.sleep(ANIMATION_SLEEP_DURATION)

    def start_animation(message: str) -> asyncio.Task:
        """Start the animation in a separate thread."""
        nonlocal animation_running
        animation_running = True
        return asyncio.create_task(asyncio.to_thread(animate, message))

    def stop_animation(task: asyncio.Task, message_length: int):
        """Stop the animation and clear the line."""
        nonlocal animation_running
        animation_running = False
        task.cancel()
        sys.stdout.write("\r" + " " * (message_length + MAX_ANIMATION_DOTS + 1) + "\r")
        sys.stdout.flush()
        print()

    return start_animation, stop_animation
