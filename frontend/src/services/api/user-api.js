import { apiServerInstance } from '../ajax';

/**
 * User related ↓
 */

// Edit Profile
export const reqEditProfile = data => apiServerInstance.put('/user/', data);

// Upload Avatar
export const reqUploadAvatar = avatar =>
	apiServerInstance.post('/user/upload_avatar/', avatar, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

// Get All users
export const reqGetAllUsers = () => apiServerInstance.get('/user/');

/**
 * Project related ↓
 */

// Get Projects
export const reqGetProjects = () => apiServerInstance.get('/project/');

// Create Project
export const reqCreateProject = data => apiServerInstance.post('/project/', data);

// Get Project Contributors
export const reqGetProjectContributors = projectId =>
	apiServerInstance.get(`/contributor/?project_id=${projectId}`);

// Add Project Contributors
export const reqAddProjectContributors = data =>
	apiServerInstance.post('/contributor/', data);

/**
 * Task related ↓
 */

// Get All Tasks
export const reqGetTasks = () => apiServerInstance.get('/task/');

// Get Project Tasks
export const reqGetProjectTasks = projectId =>
	apiServerInstance.get(`/task/?project_id=${projectId}`);

// Add Task
export const reqAddTask = data => apiServerInstance.post('/task/', data);

// Get All Submission
export const reqGetAllSubmission = taskId =>
	apiServerInstance.get(`/task/submission/?task_id=${taskId}`);

// Add TaskSubmission
export const reqAddTaskSubmission = data =>
	apiServerInstance.post('/task/submission/', data, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

// Mark done submission
export const reqMarkDoneSubmission = data =>
	apiServerInstance.put('/task/submission/', data);

// Get report
export const reqGetReport = () => apiServerInstance.get('/task/report/');
