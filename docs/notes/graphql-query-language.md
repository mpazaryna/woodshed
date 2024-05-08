# GraphQL Query Language
[Lesson Link](https://egghead.io/courses/graphql-query-language)
[GraphQL Playground](https://pet-library.moonhighway.com/)
in browser ide to send 

in graphql there is only one endpoint
the query matches the shape of the response

```js
query {
	totalPets
}
```

Everything in the curly braces is called the selection set and each piece of data is called the field.

control space to get context sensitive help in the ide
graphql is a query language for the api

```js

# you can use an alias in the call which will rename the field in the 
# response, in this example photo is being aliased as petPhoto

query {
  totalPets(status:AVAILABLE)
  allPets {
    name
    weight
    category
    petPhoto: photo {
      full
      thumb
    }
  }
}
```

## query with params

![[query-with-vars.png]]

## fragment

wrapper around fields

tags: #graphql