import {useQuery} from "@tanstack/react-query";
import {
  Session,
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";
import {useCallback, useEffect, useState} from "react";

type UseTasksProps = {
  fieldId?: string;
};

export const useTasks = ({fieldId}: UseTasksProps) => {
  const supabase = useSupabaseClient();
  const session = useSession();
  const user = useUser();

  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [fieldTasks, setFieldTasks] = useState<any[]>([]);

  useEffect(() => {
    getTasks();
    if (fieldId) getFieldTasks();
  }, []);

  async function getTasks() {
    try {
      setLoading(true);

      let {data, error, status} = await supabase.from("tasks").select(`*`);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setTasks(data);
      }
    } catch (error) {
      console.error("Error loading task data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function getFieldTasks() {
    try {
      setLoading(true);

      let {data, error, status} = await supabase
        .from("tasks")
        .select(`*`)
        .eq("field_id", fieldId);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setFieldTasks(data);
      }
    } catch (error) {
      console.error("Error loading field task data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  type UpdateTaskT = {
    taskId: string | null;
    title: string | null;
    description: string | null;
  };

  const updateTask = useCallback(
    async ({taskId, title, description}: UpdateTaskT) => {
      try {
        setLoading(true);

        const updates = {
          id: taskId,
          title,
          description,
          updated_at: new Date().toISOString(),
        };

        let {error} = await supabase.from("tasks").upsert(updates);
        if (error) throw error;
        console.log("Task updated!");
      } catch (error) {
        console.error("Error updating the task!");
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [supabase]
  );

  return {
    loading,
    tasks,
    fieldTasks,
    profileId: user?.id,
    updateTask,
  };
};
