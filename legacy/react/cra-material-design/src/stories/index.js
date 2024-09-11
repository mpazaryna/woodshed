import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Welcome from './Welcome';
import Button from './Button';
import Card from './Card';
import Table from './Table';
import Form from './Form';
import List from './List';
import Flex from './Flexbox';


storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .add('test', () => (
    <Button />
  ));  
  
storiesOf('Card', module)
  .add('test', () => (
    <Card />
  ));  
  
storiesOf('Form', module)
  .add('test', () => (
    <Form />
  ));  

storiesOf('List', module)
  .add('test', () => (
    <List />
  ));  
  
storiesOf('Flex', module)
  .add('test', () => (
    <Flex />
  ));  

storiesOf('Table', module)
  .add('test', () => (
    <Table />
  ));  
      