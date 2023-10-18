// types.ts

export type TUserDB = {
    id: string,
    name: string,
    email: string,
    password: string
  }
  
  export type Task = {
    id: string;
    title: string;
    description: string;
    created_at: string;
    status: number;
  }
  
  interface UserTask {
    user_id: string;
    task_id: string;
  }
  