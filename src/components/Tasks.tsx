import { useTasks } from '@/hooks/useTasks'
import React from 'react'

function Tasks() {

  const test = useTasks({})

  console.log(test)
  return (
    <div>Tasks</div>
  )
}

export default Tasks
