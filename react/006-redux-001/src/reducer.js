import { List, Map } from 'immutable';

const dummyTodos = List([
  Map({ id: 0, isDone: false,  text: 'Surya Namaskar A - Sun Salutation A' }),
  Map({ id: 1, isDone: false, text: 'Tadasana - Mountain' }),
  Map({ id: 2, isDone: false, text: 'Adho Mukha Shvanasana - Downward Facing Dog' }),
  Map({ id: 3, isDone: false, text: 'Trikonasana - Triangle' }),
  Map({ id: 4, isDone: false, text: 'Savasana - Final Relaxation' }),
]);

// const init = List([]);

export default function reducer(todos=dummyTodos, action) {
  switch(action.type) {
    case 'ADD_TODO':
      return todos.push(Map(action.payload));
    case 'TOGGLE_TODO':
      return todos.map(t => {
        if(t.get('id') === action.payload) {
          return t.update('isDone', isDone => !isDone);
        } else {
          return t;
        }
      });
    default:
      return todos;
  }
}
