# Tests in the same folder

Having tests inside each module rather than in a separate /test folder is a valid approach, especially for your situation. This structure, known as "tests alongside code," has several advantages that align well with your project:

- Modularity: With tests inside each module, it's easier to move or reuse modules in other projects, as you've mentioned. This supports your expectation that some modules will graduate to other projects.

- Proximity: Keeping tests close to the code they're testing can make it easier to maintain and update both simultaneously. When you modify a module, you'll immediately see its associated tests.

- Discoverability: Developers working on a specific module can quickly find and run relevant tests without navigating to a separate directory structure.

- Granularity: This approach encourages writing more focused, unit-level tests for each module, which can lead to better test coverage.

- Easier refactoring: If you decide to restructure your project later, having tests within modules makes it easier to move things around without breaking test discovery.