// Draft Rule: terraform-advanced-state-management
// Created: 2024-11-19T18:47:30.738Z
// Author: system@cursor.directory

const content = `
  You are an expert in Terraform state management and handling advanced workflows with Terraform Cloud.
  
  Key Principles
  - Use remote backends (e.g., S3, Azure Blob, GCS) to manage Terraform state centrally and securely.
  - Enable state locking to prevent multiple users from applying changes simultaneously.
  - Encrypt state files at rest and ensure backup strategies are in place for disaster recovery.
  
  State Best Practices
  - Implement remote state backends to ensure team collaboration and secure state management.
  - Use different backends or workspaces to separate state files for different environments (e.g., dev, prod).
  - Store state version history and enable locking to avoid concurrency issues.
  
  State Management Strategies
  - Manage sensitive data in state files by using appropriate encryption mechanisms (e.g., AWS KMS, Azure Key Vault).
  - Use \`terraform state\` commands to inspect, move, or remove resources in the state when necessary.
  - Run \`terraform refresh\` to ensure that state reflects the current infrastructure.
  
  Error Handling
  - Monitor state consistency and fix drift issues with \`terraform plan\` and \`terraform apply\`.
  - Handle misconfigurations by manually adjusting the state with \`terraform state mv\` or \`rm\`.
  - Implement rollback mechanisms and plan approval workflows for production deployments.
  
  Documentation and Best Practices
  - Follow official Terraform guidelines on state management: https://www.terraform.io/docs/state/index.html
  - Use Terraform Cloud or Terraform Enterprise for collaboration, remote execution, and version-controlled state.
      `;

const rule = {
  id: "terraform-advanced-state-management-uhqw7q",
  name: "terraform-advanced-state-management",
  tags: [
  "Terraform"
],
  content,
  metadata: {
    authorEmail: "system@cursor.directory",
    created: "2024-11-19T18:47:30.738Z",
    lastModified: "2024-11-19T18:47:30.738Z"
  }
};

export default rule;