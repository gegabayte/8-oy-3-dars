import "./App.css";
import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FaTrash } from "react-icons/fa";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from "@react-spring/web";
import { RiPencilFill } from "react-icons/ri";
interface FadeProps {
  children: React.ReactElement;
  in?: boolean;
  onClick?: any;
  onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
  onExited?: (node: HTMLElement, isAppearing: boolean) => void;
  ownerState?: any;
}

const Fade = React.forwardRef<HTMLDivElement, FadeProps>(function Fade(
  props,
  ref
) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null as any, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null as any, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

const style = {
  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 500, bgcolor: "background.paper", border: "2px solid transparent", borderRadius: "10px", boxShadow: 24, p: 4,
};
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}
function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = (event: React.MouseEvent) => {
    event.preventDefault();
    if (newTodo !== "") {
      const newId = crypto.randomUUID();
      const newTodoItem: TodoItem = {
        id: newId,
        text: newTodo,
        completed: false,
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
    }
  };

  const removeTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const toggleComplete = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };
  return (
    <>
      <div className="w-[700px] mx-auto mt-40">
        <div className="header">
          <h2 className="flex justify-center mb-8 text-[36px]">TODO LIST</h2>
          <button onClick={handleOpen} className="bg-sky-600	 text-white   cursor-pointer py-[10px] px-[20px] text[16px] mt-12 rounded-lg">
            Add Task
          </button>
        </div>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              TransitionComponent: Fade,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography id="spring-modal-title" variant="h5" component="h2">
                You can add information to the todo app
              </Typography>
              <Typography id="spring-modal-description" sx={{ mt: 2 }}>
                <form className="flex justify-between items-center">
                  <input className="px-12 py-4 w-[300px]" type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
                  <button onClick={addTodo} className="bg-sky-600	 text-white   cursor-pointer py-[10px] px-[20px] text[16px] rounded-lg">Add Todo</button>
                </form>
              </Typography>
            </Box>
          </Fade>
        </Modal>

        {
          todos.length > 0 && <div className="todoCardsContainer">
            {todos.map((todo) => (
              <div key={todo.id} className="todoCard">
                <div className="todoTitlee">
                  <input className="checkbox"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  <p
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.text}
                  </p>
                </div>
                <div className="changeIcon">
                  <FaTrash className="change" onClick={() => removeTodo(todo.id)} />
                  <RiPencilFill className="change" />
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    </>
  );
}

export default App;
