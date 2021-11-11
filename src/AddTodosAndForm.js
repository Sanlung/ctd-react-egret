import {Link} from "react-router-dom";
import AddTodoForm from "./AddTodoForm";
import TodoList from "./TodoList";
import styles from "./AddTodosAndForm.module.css";

const AddTodosAndForm = ({
  onAddTodo,
  onRemoveTodo,
  todoList,
  fetchStatus,
  children,
}) => (
  <div className={styles.listWrapper}>
    <div className={styles.homeButton}>
      <Link to='/'>&#127968;</Link>
    </div>
    <h2>{children}</h2>
    {fetchStatus.isError && (
      <p>
        <strong>SOMETHING WENT WRONG:</strong>&nbsp;
        {fetchStatus.errMsg}
        {/* <strong>SOMETHING WENT WRONG:</strong>&nbsp;
          {fetchStatus.errMsg.error}--{fetchStatus.errMsg.message} */}
      </p>
    )}
    {fetchStatus.isLoading ? (
      <p>Loading ...</p>
    ) : (
      <TodoList
        todoList={todoList}
        listName={children[1]}
        onRemoveTodo={onRemoveTodo}
      />
    )}
    <AddTodoForm listName={children[1]} onAddTodo={onAddTodo} />
  </div>
);

export default AddTodosAndForm;
