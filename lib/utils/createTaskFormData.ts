export function createTaskFormData(task: Task): FormData {
    const formData = new FormData();
    if(task.id) formData.append('id', task.id)
    formData.append('title', task.title);
    formData.append('description', task.description);
    formData.append('status', task.status);
    formData.append('createdAt', task.createdAt.slice(0, 10));
    if (task.image) formData.append('image', task.image);
    return formData;
}