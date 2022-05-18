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
 * Team related ↓
 */

// Get Teams
export const reqGetTeams = () => apiServerInstance.get('/team/');

// Create Team
export const reqCreateTeam = data => apiServerInstance.post('/team/', data);

// Get Team Members
export const reqGetTeamMembers = teamId =>
	apiServerInstance.get(`/team_member/?team_id=${teamId}`);

// Add Team Member
export const reqAddTeamMember = data =>
	apiServerInstance.post('/team_member/', data);

/**
 * Task related ↓
 */

// Get Tasks
export const reqGetTasks = () => apiServerInstance.get('/task/');

// Get Team Task
export const reqGetTeamTask = teamId =>
	apiServerInstance.get(`/task/?team_id=${teamId}`);

// Add Task
export const reqAddTask = data => apiServerInstance.post('/task/', data);

// sss
// sss
// sss
// sss

// Add TaskSubmission
export const reqAddTaskSubmission = data =>
	apiServerInstance.post('/upload_file/', data, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});

// Get All Submission
export const reqGetAllSubmission = taskId =>
	apiServerInstance.get(`/get_submissions/?task_id=${taskId}`);

// Mark done submission
export const reqMarkDoneSubmission = data =>
	apiServerInstance.post('/mark_done/', data);
