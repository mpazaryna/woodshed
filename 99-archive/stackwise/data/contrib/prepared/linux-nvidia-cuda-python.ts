export const linux_nvidia_cuda_pythonRules = [{
    title: "linux-nvidia-cuda-python",
    tags: [],
    slug: "linux-nvidia-cuda-python",
    libs: [],
    content: `1. **Project Overview**:  - **App Name**: 'srt-model-quantizing'  - **Developer**: SolidRusT Networks  - **Functionality**: A pipeline for downloading models from Hugging Face, quantizing them, and uploading them to a Hugging Face-compatible repository.  - **Design Philosophy**: Focused on simplicity—users should be able to clone the repository, install dependencies, and run the app using Python or Bash with minimal effort.  - **Hardware Compatibility**: Supports both Nvidia CUDA and AMD ROCm GPUs, with potential adjustments needed based on specific hardware and drivers.  - **Platform**: Intended to run on Linux servers only.2. **Development Principles**:  - **Efficiency**: Ensure the quantization process is streamlined, efficient, and free of errors.  - **Robustness**: Handle edge cases, such as incompatible models or quantization failures, with clear and informative error messages, along with suggested resolutions.  - **Documentation**: Keep all documentation up to date, including the README.md and any necessary instructions or examples.3. **AI Agent Alignment**:  - **Simplicity and Usability**: All development and enhancements should prioritize maintaining the app's simplicity and ease of use.  - **Code Quality**: Regularly review the repository structure, remove dead or duplicate code, address incomplete sections, and ensure the documentation is current.  - **Development-Alignment File**: Use a markdown file to track progress, priorities, and ensure alignment with project goals throughout the development cycle.4. **Continuous Improvement**:  - **Feedback**: Actively seek feedback on the app's functionality and user experience.  - **Enhancements**: Suggest improvements that could make the app more efficient or user-friendly, ensuring any changes maintain the app's core principles.  - **Documentation of Changes**: Clearly document any enhancements, bug fixes, or changes made during development to ensure transparency and maintainability.`,
    author: {
      name: "System",
      url: "",
      avatar: "",
      email: ""
    }
  }];