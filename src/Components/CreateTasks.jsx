import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import tost from "react-hot-toast";

const CreateTasks = ({ tasks, setTasks }) => {
  
  const [task, setTask] = useState({
    id: "",
    name: "",
    status: "todo",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (task?.name.length < 3)
      return tost.error("Task Must Have A Three Characters");
    setTasks((prev) => {
      const list = [...(prev || []), task];
      localStorage.setItem("Task",JSON.stringify(list));

      return list;
    });

    tost.success("Task Added");

    setTask({
      id: "",
      name: "",
      status: "todo",
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="border-2 border-slate-400 bg-slate-200 rounded-md mr-4 h-12"
        onChange={(e) =>
          setTask({ ...(task || []), id: uuidv4(), name: e.target.value })
        }
        value={task?.name}
      />
      <button className="h-12 bg-yellow-500 px-4 text-white rounded-md">
        Create Task
      </button>
    </form>
  );
};

export default CreateTasks;
