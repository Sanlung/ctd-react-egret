import React from "react";
import Airtable from "airtable";
import TodoList from "./TodoList";
import AddTodoForm from "./AddTodoForm";
// import useSemiPersistentState from "./persistState";

const base = new Airtable({apiKey: "keyXJP6yokGZuPWld"}).base(
  "appBckffqPRHb3f2J"
);

const todoListReducer = (state, action) => {
  switch (action.type) {
    case "TODOLIST_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "TODOLIST_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "HTTP_REQUEST_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
        errMsg: action.payload,
      };
    default:
      throw new Error();
  }
};

const App = () => {
  const [todoList, dispatchTodoList] = React.useReducer(todoListReducer, {
    data: [],
    isLoading: false,
    isError: false,
    errMsg: {},
  });

  const fetchTodoList = () => {
    dispatchTodoList({type: "TODOLIST_FETCH_INIT"});
    base("Todo-List")
      .select({
        view: "Grid view",
      })
      .firstPage((err, records) => {
        if (err) {
          dispatchTodoList({
            type: "HTTP_REQUEST_FAILURE",
            payload: err,
          });
          return;
        }
        dispatchTodoList({
          type: "TODOLIST_FETCH_SUCCESS",
          payload: records,
        });
      });
  };
  React.useEffect(() => {
    fetchTodoList();
  }, []);

  const addTodo = (newTodo) => {
    base("Todo-List").create(
      {
        Title: newTodo,
      },
      (err, newRecord) => {
        if (err) {
          dispatchTodoList({
            type: "HTTP_REQUEST_FAILURE",
            payload: err,
          });
          return;
        }
        fetchTodoList();
        console.log(`Successfully added: ${newRecord}`);
      }
    );
  };

  const removeTodo = (id) => {
    base("Todo-List").destroy([id], (err, deletedRecord) => {
      if (err) {
        dispatchTodoList({
          type: "HTTP_REQUEST_FAILURE",
          payload: err,
        });
        return;
      }
      fetchTodoList();
      console.log(`Successfully deleted: ${deletedRecord}`);
    });
  };

  return (
    <div>
      <h1>Todo List</h1>
      <AddTodoForm onAddTodo={addTodo} />
      {todoList.isError && (
        <p>
          <strong>THAT DID NOT WORK:</strong>&nbsp;
          {todoList.errMsg.error}--{todoList.errMsg.message}
        </p>
      )}
      {todoList.isLoading ? (
        <p>Loading ...</p>
      ) : (
        <TodoList todoList={todoList.data} onRemoveTodo={removeTodo} />
      )}
    </div>
  );
};

export default App;
