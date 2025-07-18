# Architecture Decision Record: Story Framework Integration

## Context

We aim to integrate a new story framework domain into the existing stacking system architecture. The system currently uses a domain-based approach for managing primitives and their composition, with a focus on maintaining separation between content and mapping logic. The story framework needs to handle Aristotelian dramatic structures while following established patterns for primitive management and concept injection.

## Decision

We will extend the existing domain-based architecture to include a story framework domain, leveraging the established pattern of using index.json and config.json files as the primary means of managing primitive relationships and stacking rules. This approach maintains consistency with existing domains while accommodating the unique requirements of story structure management.

## Key Components and Design

The architecture will center around two crucial configuration files:

The config.json file will define the domain-specific rules, categories, and tag structures for the story framework. This includes phase definitions (exposition, rising action, climax, falling action, denouement), their respective weights, and the relationships between different story elements. The config file establishes the rules for how primitives can be combined and what tags are valid within the story domain context.

The index.json file will serve as the primary reference for primitive lookups and relationships. This file maps available primitives, their metadata, and file locations without requiring direct filesystem access during the stacking process. The index will be regeneratable and updateable independently of the primitive content, allowing for flexible evolution of the framework while maintaining stable interfaces.

## Implementation Strategy

The implementation should proceed in the following phases:

1. Domain Configuration Development
First, create the story domain configuration, including all necessary category definitions, tag structures, and phase specifications. This involves defining the complete config.json structure with appropriate weights and relationships for story elements.

2. Primitive Structure Development
Convert existing story framework files into the markdown-with-frontmatter format, ensuring consistent metadata structure across all primitives. This includes adding appropriate tags, categories, and phase-specific information in the frontmatter.

3. Index Generation System
Develop the system for generating and updating index.json based on the available primitives. This should include validation of primitive metadata against the config.json rules and automatic updating capabilities.

4. Stacking Logic Implementation
Implement the story-specific stacking logic that will handle concept injection and primitive composition. This needs to respect phase ordering, handle dependencies between primitives, and manage the injection of user-provided concepts throughout the structure.

5. Integration with Existing Systems
Connect the new story domain handlers with the existing stacking infrastructure, ensuring proper handling of domain-specific requirements while maintaining consistency with the established patterns.

## Technical Considerations

The system must maintain the existing separation of concerns where the stacking mechanism relies solely on index.json for primitive discovery and mapping. This design choice ensures performance and maintainability while allowing for independent updates to both the primitive content and the mapping structure.

The concept injection system needs to be robust enough to handle various types of story concepts while maintaining the structural integrity of the Aristotelian framework. This includes proper handling of placeholders and ensuring consistent concept application across all relevant primitives.

## Future Considerations

The architecture should allow for future expansion of:

- Additional story framework types beyond Aristotelian
- Enhanced concept mapping capabilities
- Dynamic updating of primitives without system restart
- Advanced validation of story structures
- Multiple concept injection points

## Migration Path

The implementation should begin with the core Aristotelian framework while building in the flexibility to add other story frameworks later. The initial focus should be on establishing the basic infrastructure and ensuring proper concept injection and primitive stacking.

## Success Metrics

The implementation will be considered successful if it:

- Maintains consistent performance with existing domains
- Allows for independent updates to primitives and index
- Successfully handles concept injection across all phases
- Provides clear, structured output for LLM consumption
- Maintains separation of concerns throughout the system

## Next Steps

The immediate next steps should be:

1. Create detailed config.json for the story domain
2. Convert existing story primitives to markdown format
3. Implement index generation for story primitives
4. Develop story-specific domain handler
5. Create initial test cases for concept injection
6. Implement basic stacking logic
7. Develop validation systems

This framework provides a solid foundation for implementation while maintaining consistency with existing architectural patterns and allowing for future expansion and enhancement of the story framework system.