# Container Components

(React.js Conf 2015 - Making your app fast with high-performance component)[https://www.youtube.com/watch?v=KYzlpRvWZ6c]
(Container Components)[https://medium.com/@learnreact/container-components-c0e67432e005#.n99vcxarm]
(Presentational and Container Components)[https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.4mfj6mo5w]  

A container does data fetching and then renders its corresponding sub-component.   

Separation of concerns
- Data fetching
- Props rendering  

“Corresponding” meaning a component that shares the same name:  
- StockWidgetContainer => StockWidget
- TagCloudContainer => TagCloud
- PartyPooperListContainer => PartyPooperList

Why?
- Reusability
- Data structure
- The component is opinionated about data structure
- Pulls out data-fetching into a container component

We’ve separated our data-fetching and rendering concerns.
We’ve made our CommentList component reusable.
We’ve given CommentList the ability to set PropTypes and fail loudly.

Props and state

Pure components just have a render method and they are deterministic, meaning  
that they only rely on props or state.

Why?

re-rendering is the most expensive, so in the case of a pure component  
we can check to see if the props have changed and only then, re-render the
component

via the use of React.addons.PureRenderMixin you can completely shield the
component from insulate the component from the parent changes

Shift to an idea of immutability allows for the ability to know when  
things have changed.

We get referential equality.  Our data can be compared very quickly.  

React components and their children are like trees
When you make a change to a component
You find the difference between the two trees and produce the update trees

Be careful of the deeply nested, trickle down pattern on your children components
Remember, children are unpredictable.

At FB, there is a formal policy that any components that need data fetching  
are wrapped in a container.  

Containers vs Components  
just does fetching and renders it sub-component
sub-component is data agonostic
the container is a data layer, you insulate your pure component
the container doesn't have any props, so it can be moved around
not an opinionated nesting structure
we should be able to compose without concern of where the data comes from

This is what we are doing now with the pyxie file list component, so multiple
apps can use it.  it should go into the internal component library
it also facilitates the testing, so that we can render the component with stub data  
components are the fundamental building blocks of the application, adding containers  
takes that idea to the next level

the idea here is to think about isolation and the ability to render smoothly

* Basic Concepts for optimization
- Purity
-- to prevent needless re-render
- Data comparability
-- Use highly comparable data
- Loose coupling
-- Use for both maintainability and performance
- Children
-- are expensive
-- should exercise independence
