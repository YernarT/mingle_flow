import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store';

import { reqGetProjects, reqGetTasks } from '@/services/api/user-api';
import { useSetState, useRequest } from 'ahooks';
import { useAuth } from '@/hooks';

import {
	message as antdMessage,
	Button,
	Avatar,
	Typography,
	Card,
	Space,
	Empty,
	Skeleton,
} from 'antd';
import {
	PlusOutlined,
	TeamOutlined,
	DollarCircleOutlined,
	SendOutlined,
} from '@ant-design/icons';
import { CreateProjectModal } from '@/components';
import {
	UserProfileStyled,
	ProjectsStyled,
	ProjectItemStyled,
	TasksStyled,
	TaskItemStyled,
} from './style';

const { Title, Text } = Typography;

export default function UserProfilePage() {
	const user = useRecoilValue(userAtom);
	const history = useHistory();

	// 授权校验
	useAuth(user.token);

	const [state, setState] = useSetState({
		projects: [],
		tasks: [],

		createProjectModalVisible: false,
	});

	// 获取 Projects
	const { loading: loadingGetProjects } = useRequest(reqGetProjects, {
		onSuccess({ projects }) {
			setState({ projects });
		},
	});

	// 获取 Tasks
	const { loading: loadingGetTasks } = useRequest(reqGetTasks, {
		onSuccess({ tasks }) {
			setState({ tasks });
		},
	});

	// 创建Project 的回调
	const afterCreateProject = project => {
		antdMessage.success('Сәтті құрылды');

		setState(prevState => ({
			projects: [...prevState.projects, project],
			createProjectModalVisible: false,
		}));
	};

	// 处理 添加Task
	const handleAddTask = () => {
		// 没有 project
		let myProject = state.projects.find(project => project.creator === user.id);

		if (myProject) {
			history.push('/project', { project: myProject });
			return;
		}

		antdMessage.warning('Сізде жоба жоқ');
	};

	return (
		<UserProfileStyled>
			<section className="user-info">
				<Avatar src={user.avatar} className="avatar" />

				<Space direction="vertical" className="info">
					<Title level={3}>{user.username}</Title>
				</Space>

				<Button
					className="edit-profile"
					onClick={() => history.push('/user-edit')}>
					Профильді өңдеу
				</Button>
			</section>

			<section className="project-section">
				<div className="header">
					<Title level={2} className="title">
						Жоба
					</Title>
					<Button onClick={() => setState({ createProjectModalVisible: true })}>
						<PlusOutlined />
					</Button>
				</div>

				<div className="projects">
					<Card className="my-projects" title="Менің жобаларым">
						<Skeleton active loading={loadingGetProjects}>
							<ProjectsStyled
								hasProject={Boolean(
									state.projects.filter(project => project.creator === user.id)
										.length,
								)}>
								{state.projects
									.filter(project => project.creator === user.id)
									.map(project => (
										<ProjectItemStyled
											key={project.id}
											onClick={() => history.push('/project', { project })}>
											<TeamOutlined className="project-icon" />

											<Text className="project-name">{project.name}</Text>
										</ProjectItemStyled>
									))}

								{state.projects.filter(project => project.creator === user.id)
									.length === 0 && <Empty description="Жоқ" />}
							</ProjectsStyled>
						</Skeleton>
					</Card>

					<Card className="joined-projects" title="Мен қатысқан жобалар">
						<Skeleton active loading={loadingGetProjects}>
							<ProjectsStyled
								hasProject={Boolean(
									state.projects.filter(
										project =>
											project.creator !== user.id &&
											project.contributors.find(
												contributor => contributor.id === user.id,
											),
									).length,
								)}>
								{state.projects
									.filter(
										project =>
											project.creator !== user.id &&
											project.contributors.find(
												contributor => contributor.id === user.id,
											),
									)
									.map(project => (
										<ProjectItemStyled
											key={project.id}
											onClick={() => history.push('/project', { project })}>
											<TeamOutlined className="project-icon" />
											<Text className="project-name">{project.name}</Text>
										</ProjectItemStyled>
									))}

								{state.projects.filter(
									project =>
										project.creator !== user.id &&
										project.contributors.find(
											contributor => contributor.id === user.id,
										),
								).length === 0 && <Empty description="Жоқ" />}
							</ProjectsStyled>
						</Skeleton>
					</Card>
				</div>

				{/* 创建 Project 模态框 */}
				<CreateProjectModal
					visible={state.createProjectModalVisible}
					onCancel={() => setState({ createProjectModalVisible: false })}
					afterCreate={afterCreateProject}
				/>
			</section>

			<section className="task-section">
				<div className="header">
					<Title level={2} className="title">
						Тапсырма
					</Title>
					<Button onClick={handleAddTask}>
						<PlusOutlined />
					</Button>
				</div>

				<div className="tasks">
					<Card className="my-tasks" title="Мен құрған тапсырмалар">
						<Skeleton active loading={loadingGetTasks}>
							<TasksStyled>
								{state.tasks
									.filter(task => task.creator === user.id)
									.map(task => (
										<TaskItemStyled key={task.id}>
											<Card title={task.name}>
												<Text strong>
													<DollarCircleOutlined /> {task.funds} ₸
												</Text>

												<Button
													icon={<SendOutlined />}
													onClick={() => {
														history.push('/task', { task });
													}}
												/>
											</Card>
										</TaskItemStyled>
									))}

								{state.tasks.filter(task => task.creator === user.id).length ===
									0 && <Empty description="Жоқ" />}
							</TasksStyled>
						</Skeleton>
					</Card>

					<Card className="todo-tasks" title="Маған меншіктелген тапсырмалар">
						<Skeleton active loading={loadingGetTasks}>
							<TasksStyled>
								{state.tasks
									.filter(task => task.creator !== user.id)
									.map(task => (
										<TaskItemStyled key={task.id}>
											<Card title={task.name}>
												<Text strong>
													<DollarCircleOutlined /> {task.funds} ₸
												</Text>

												<Button
													icon={<SendOutlined />}
													onClick={() => {
														history.push('/task', { task });
													}}
												/>
											</Card>
										</TaskItemStyled>
									))}

								{state.tasks.filter(task => task.creator !== user.id).length ===
									0 && <Empty description="Жоқ" />}
							</TasksStyled>
						</Skeleton>
					</Card>
				</div>
			</section>
		</UserProfileStyled>
	);
}
