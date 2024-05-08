%% 
- metadata:
	- tag: #react
	- date:  2021-03-16
	- related: [[notes/README]]
%% 
# Destructuring Props

[Literature notes](https://www.freecodecamp.org/news/the-basics-of-destructuring-props-in-react-a196696f5477/)

```js
const Listing = ({listing: {title,type,location:{city,state,country}}})
```

The downside to destructuring in class components is that you’ll end up destructuring the same props each time you use it in a method. Although this can be repetitive, I’d argue that a positive is it clearly outlines which props are being used in each method.

