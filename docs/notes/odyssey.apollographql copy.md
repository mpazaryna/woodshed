# Apollo Tutorials

[Learning Home](https://odyssey.apollographql.com/)

## schema-definition-language-sdl

At its heart, a schema is a collection of object types that contain fields. Each field has a type of its own. A field's type can be scalar (such as an Int or a String), or it can be another object type. For example, the Track object type in our schema will have an author field of type Author.

We declare a type using the type keyword, followed by the name of the type (PascalCase is best practice), then opening brackets to hold its contained fields:

Fields are declared by their name (camelCase), a colon, and then the type of the field (scalar or object). A field can also contain a list, indicated by square brackets. Unlike Javascript objects (which look very similar), fields are not separated by commas. In addition, we can indicate whether each field value is nullable or non-nullable. If a field should never be null, we add an exclamation mark after its type:

```js
const typeDefs = gql`
  type SpaceCat {
    name: String!
    age: Int
    missions: [Mission]
  }
`;
```

```js
const typeDefs = gql`
  """
  I'm a block description
  with a line break
  """
  type SpaceCat {
    "I'm a regular description"
    name: String!
    age: Int
    missions: [Mission]
  }
`;
```

Create a full schema with: a type \`Query\` containing a field \`spaceCats\` to fetch a List of \`SpaceCat\`. A type \`SpaceCat\` with its subfields: \`id\` of type ID!, \`name\` of type String!, \`age\` of type Int and \`missions\` of type List of Mission. Finally define the \`Mission\` type with its subfields: \`id\` of type ID!, \`name\` of type String!, and \`description\` of type String!.

```js

const typeDefs = gql\`

type Query {
  "Get space cats array for homepage grid"
  spaceCats: [SpaceCat]
}

"A space cat"
type SpaceCat {
  id: ID!
  "the space cat name"
  name: String!
  "the age"
  age: Int
  "missions"
  missions: [Mission]
}

# a list of missions
type Mission {
  id: ID!
  name: String!
  description: String!
}
;
```

## apollo server

- Receive an incoming GraphQL query from our client
- Validate that query against our newly created schema
- Populate the queried schema fields with mocked data
- Return the populated fields as a response

[lesson page](https://odyssey.apollographql.com/lift-off-part1/apollo-server)

```js

const mocks = {
// define your mock properties here
SpaceCat: () \=> ({
id: () \=> "spacecat\_01",
title: () \=> "spacecat pioneer",
}),

}
```

tags: #graphql  #techtalk