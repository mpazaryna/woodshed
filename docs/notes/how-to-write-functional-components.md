# How to do it

Literature notes
https://moox.io/blog/how-i-write-stateless-react-components

## tl;dr

```jsx
const Name = props => { 
  return <View style={props.style}>{props.children}></View>; 
};
```

if you use this style, you'll need to export it.

```jsx
export default Name
```


## it can be written as a function

```jsx
function Name(props){ 
 return <View style={props.style}>{props.children}></View>; 
}
```

Here no big changes, we use a named function instead of arrow function, that’s ok too. First win is that you can directly export the function

```jsx
export default function Name() {}
```

## Destructuring Props

tags: #react
