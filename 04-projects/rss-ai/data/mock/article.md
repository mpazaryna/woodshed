# Introducing OpenAI o1 | OpenAI

September 12, 2024

A new series of reasoning models for solving hard problems. Available now.

We've developed a new series of AI models designed to spend more time thinking before they respond. They can reason through complex tasks and solve harder problems than previous models in science, coding, and math.

Today, we are releasing the first of this series in ChatGPT and our API. This is a preview and we expect regular updates and improvements. Alongside this release, we’re also including

## How it works

We trained these models to spend more time thinking through problems before they respond, much like a person would. Through training, they learn to refine their thinking process, try different strategies, and recognize their mistakes.

In our tests, the next model update performs similarly to PhD students on challenging benchmark tasks in physics, chemistry, and biology. We also found that it excels in math and coding. In a qualifying exam for the International Mathematics Olympiad (IMO), GPT-4o correctly solved only 13% of problems, while the reasoning model scored 83%. Their coding abilities were evaluated in contests and reached the 89th percentile in Codeforces competitions. You can read more about this in our [technical research post](https://openai.com/index/learning-to-reason-with-llms/).

As an early model, it doesn't yet have many of the features that make ChatGPT useful, like browsing the web for information and uploading files and images. For many common cases GPT-4o will be more capable in the near term.

But for complex reasoning tasks this is a significant advancement and represents a new level of AI capability. Given this, we are resetting the counter back to 1 and naming this series OpenAI o1.

## Safety

As part of developing these new models, we have come up with a new safety training approach that harnesses their reasoning capabilities to make them adhere to safety and alignment guidelines. By being able to reason about our safety rules in context, it can apply them more effectively.

One way we measure safety is by testing how well our model continues to follow its safety rules if a user tries to bypass them (known as "jailbreaking"). On one of our hardest jailbreaking tests, GPT-4o scored 22 (on a scale of 0-100) while our o1-preview model scored 84. You can read more about this in the [system card](https://openai.com/index/openai-o1-system-card/) and our [research post](https://openai.com/index/learning-to-reason-with-llms/).

To match the new capabilities of these models, we’ve bolstered our safety work, internal governance, and federal government collaboration. This includes rigorous testing and evaluations using our [Preparedness Framework(opens in a new window)](https://cdn.openai.com/openai-preparedness-framework-beta.pdf), best-in-class red teaming, and board-level review processes, including by our Safety & Security Committee.

To advance our commitment to AI safety, we recently formalized agreements with the U.S. and U.K. AI Safety Institutes. We've begun operationalizing these agreements, including granting the institutes early access to a research version of this model. This was an important first step in our partnership, helping to establish a process for research, evaluation, and testing of future models prior to and following their public release.

## Whom it’s for

These enhanced reasoning capabilities may be particularly useful if you’re tackling complex problems in science, coding, math, and similar fields. For example, o1 can be used by healthcare researchers to annotate cell sequencing data, by physicists to generate complicated mathematical formulas needed for quantum optics, and by developers in all fields to build and execute multi-step workflows.

## OpenAI o1-mini

The o1 series excels at accurately generating and debugging complex code. To offer a more efficient solution for developers, we’re also releasing [OpenAI o1-mini](https://openai.com/index/openai-o1-mini-advancing-cost-efficient-reasoning/), a faster, cheaper reasoning model that is particularly effective at coding. As a smaller model, o1-mini is 80% cheaper than o1-preview, making it a powerful, cost-effective model for applications that require reasoning but not broad world knowledge.

## How to use OpenAI o1

**ChatGPT Plus and Team** users will be able to access o1 models in ChatGPT starting today. Both o1-preview and o1-mini can be selected manually in the model picker, and at launch, weekly rate limits will be 30 messages for o1-preview and 50 for o1-mini. We are working to increase those rates and enable ChatGPT to automatically choose the right model for a given prompt.

We also are planning to bring o1-mini access to all **ChatGPT** **Free users**.

## What’s next

This is an early preview of these reasoning models in ChatGPT and the API. In addition to model updates, we expect to add browsing, file and image uploading, and other features to make them more useful to everyone.

We also plan to continue developing and releasing models in our GPT series, in addition to the new OpenAI o1 series.
