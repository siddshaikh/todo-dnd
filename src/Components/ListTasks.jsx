import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDrag, useDrop } from "react-dnd";

const ListTasks = ({ tasks, setTasks }) => {
  const [todos, setTodos] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [closed, setClosed] = useState([]);

  useEffect(() => {
    if (tasks) {
      const ftodos = tasks.filter((task) => task.status === "todo");
      const finProgress = tasks.filter((task) => task.status === "inProgress");
      const fclosed = tasks.filter((task) => task.status === "closed");
      setTodos(ftodos);
      setInProgress(finProgress);
      setClosed(fclosed);
    }
  }, [tasks]);
  

  const status = ["todo", "inProgress", "closed"];
  return (
    <div className="flex gap-16">
      {status.map((status, index) => (
        <Section
          key={index}
          status={status}
          todos={todos}
          tasks={tasks}
          setTasks={setTasks}
          inProgress={inProgress}
          closed={closed}
        />
      ))}
    </div>
  );
};

export default ListTasks;

const Section = ({ status, tasks, setTasks, todos, inProgress, closed }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "Task",
    drop:(item)=>addItemToSection(item.id),
    collect: (moniter) => ({
      isOver: !!moniter.isOver(),
    }),
  }));
  let text = "Todo";
  let bg = "bg-slate-500";
  let tasksToMap = todos;
  if (status === "inProgress") {
    text = "Inprogress";
    bg = "bg-purple-500";
    tasksToMap = inProgress;
  }
  if (status === "closed") {
    text = "Closed";
    bg = "bg-green-500";
    tasksToMap = closed;
  }
  const addItemToSection = (id) =>{
    setTasks((prev)=>{
      const mTask = prev?.map((t)=>{
        if(t.id === id){
          return {...t , status : status}
        }
        return t
      })
      localStorage.setItem('Task',mTask)
      toast('Status Changed')
      return mTask
    })
  }
  return (
    <div 
    ref={drop}
    className={`w-64 ${isOver ? 'bg-slate-200' : ''} rounded-md`}>
      <Header text={text} bg={bg} count={tasksToMap.length} />
      {tasksToMap.length > 0 &&
        tasksToMap?.map((task) => (
          <Task key={task?.id} task={task} tasks={tasks} setTasks={setTasks} />
        ))}
    </div>
  );
};
const Header = ({ text, bg, count }) => {
  return (
    <div>
      <div
        className={`${bg} flex items-center h-12 pl-4 rounded-md text-sm uppercase text-white`}
      >
        {text}
        <div className="ml-2 bg-white text-black rounded-full h-5 w-5 flex item-center justify-center ">
          {count}
        </div>
      </div>
    </div>
  );
};

const Task = ({ task, tasks, setTasks }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "Task",
    item:{id:task?.id},
    collect: (moniter) => ({
      isDragging: !!moniter.isDragging(),
    }),
  }));
  const handleRemove = (id) => {
    const fTasks = tasks?.filter((t) => t.id !== id);
    localStorage.setItem("Task", JSON.stringify(fTasks));
    setTasks(fTasks);
    toast("Task removed");
  };
  return (
    <div
      ref={drag}
      className={`relative p-4 mt-8 shadow-md cursor-grab rounded-md ${isDragging ? "opacity-25" : "opacity-100"}`}
    >
      <p>{task.name}</p>
      <button
        className="absolute  bottom-1 right-1 text-slate-400"
        onClick={() => handleRemove(task?.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
};
