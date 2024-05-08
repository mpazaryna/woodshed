import * as React from "react";
import { Admin, Resource, ListGuesser } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { UserList } from "./users";
import { PostList } from "./posts";
import Dashboard from "./Dashboard";
import authProvider from "./authProvider";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");
const App = () => (
  <Admin
    dashboard={Dashboard}
    authProvider={authProvider}
    dataProvider={dataProvider}
  >
    <Resource name="users" list={UserList} />
    <Resource name="posts" list={PostList} />
  </Admin>
);
export default App;
