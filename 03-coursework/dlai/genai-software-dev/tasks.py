from pathlib import Path

from invoke import task


@task
def generate_summary(ctx, config="config.yaml"):
    """Generate summary links for README files based on config"""
    # Run the generator script from project root
    ctx.run(
        f"python ./scripts/functional_link_summary_generator.py {config}",
        echo=True,
    )


@task
def process_files(ctx, config="config.yaml"):
    """Process raw text files into summaries using fabric"""
    ctx.run(
        f"python ./scripts/process_files.py {config}",
        echo=True,
    )
