import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/store';

import { reqGetTeams, reqGetTasks } from '@/services/api/user-api';
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
import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { CreateTeamModal } from '@/components';
import {
	UserProfileStyled,
	TeamsStyled,
	TeamItemStyled,
	TasksStyled,
	TaskItemStyled,
} from './style';

const { Title, Text } = Typography;

export default function UserProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const history = useHistory();

	// 授权校验
	useAuth(user.token);

	const [state, setState] = useSetState({
		teams: [],
		tasks: [],

		createTeamModalVisible: false,
	});

	// 获取 Teams
	const { loading: loadingGetTeams } = useRequest(reqGetTeams, {
		onSuccess({ teams }) {
			setState({ teams });
		},
	});

	// 获取 Tasks
	const { loading: loadingGetTasks } = useRequest(reqGetTasks, {
		onSuccess({ tasks }) {
			setState({ tasks });
		},
	});

	// 创建Team 的回调
	const afterCreateTeam = team => {
		antdMessage.success('Команданы сәтті құрыңыз');

		setState(prevState => ({
			teams: [...prevState.teams, team],
			createTeamModalVisible: false,
		}));
	};

	// 处理 添加Task
	const handleAddTask = () => {
		// 没有 team
		let meTeam = state.teams.find(team => team.creator === user.id);

		if (meTeam) {
			history.push('/team', { team: meTeam });
			return;
		}

		antdMessage.warning('Сізде команда жоқ');
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

			<section className="team-section">
				<div className="header">
					<Title level={2} className="title">
						Команда
					</Title>
					<Button onClick={() => setState({ createTeamModalVisible: true })}>
						<PlusOutlined />
					</Button>
				</div>

				<div className="teams">
					<Card className="my-teams" title="Менің командаларым">
						<Skeleton active loading={loadingGetTeams}>
							<TeamsStyled
								hasTeam={Boolean(
									state.teams.filter(team => team.creator === user.id).length,
								)}>
								{state.teams
									.filter(team => team.creator === user.id)
									.map(team => (
										<TeamItemStyled
											key={team.id}
											onClick={() => history.push('/team', { team })}>
											<TeamOutlined className="team-icon" />

											<Text className="team-name">{team.name}</Text>
										</TeamItemStyled>
									))}

								{state.teams.filter(team => team.creator === user.id).length ===
									0 && <Empty description="Жоқ" />}
							</TeamsStyled>
						</Skeleton>
					</Card>

					<Card className="joined-teams" title="Қосылған командаларым">
						<Skeleton active loading={loadingGetTeams}>
							<TeamsStyled
								hasTeam={Boolean(
									state.teams.filter(
										team =>
											team.creator !== user.id &&
											team.members.find(member => member.id === user.id),
									).length,
								)}>
								{state.teams
									.filter(
										team =>
											team.creator !== user.id &&
											team.members.find(member => member.id === user.id),
									)
									.map(team => (
										<TeamItemStyled
											key={team.id}
											onClick={() => history.push('/team', { team })}>
											<TeamOutlined className="team-icon" />
											<Text className="team-name">{team.name}</Text>
										</TeamItemStyled>
									))}

								{state.teams.filter(
									team =>
										team.creator !== user.id &&
										team.members.find(member => member.id === user.id),
								).length === 0 && <Empty description="Жоқ" />}
							</TeamsStyled>
						</Skeleton>
					</Card>
				</div>

				{/* 创建 Team 模态框 */}
				<CreateTeamModal
					visible={state.createTeamModalVisible}
					onCancel={() => setState({ createTeamModalVisible: false })}
					afterCreateTeam={afterCreateTeam}
				/>
			</section>

			<section className="task-section">
				<div className="header">
					<Title level={2} className="title">
						Тапсырмалар
					</Title>
					<Button onClick={handleAddTask}>
						<PlusOutlined />
					</Button>
				</div>

				<div className="tasks">
					<Card className="my-tasks" title="Мен құрған тапсырмалар">
						<Skeleton active loading={loadingGetTasks}>
							<TasksStyled
								hasTask={Boolean(
									state.tasks.filter(task => task.creator === user.id).length,
								)}>
								{state.tasks
									.filter(task => task.creator === user.id)
									.map(task => (
										<TaskItemStyled
											key={task.id}
											onClick={() => history.push('/task', { task: task })}>
											<Title level={3} className="task-name">
												{task.title}
											</Title>
										</TaskItemStyled>
									))}

								{state.tasks.filter(task => task.creator === user.id).length ===
									0 && <Empty description="Жоқ" />}
							</TasksStyled>
						</Skeleton>
					</Card>

					<Card className="todo-tasks" title="Маған меншіктелген тапсырмалар">
						<Skeleton active loading={loadingGetTasks}>
							<TasksStyled
								hasTask={Boolean(
									state.tasks.filter(task => task.creator !== user.id).length,
								)}>
								{state.tasks
									.filter(task => task.creator !== user.id)
									.map(task => (
										<TaskItemStyled
											key={task.id}
											onClick={() => history.push('/task', { task: task })}>
											<Title level={3} className="task-name">
												{task.title}
											</Title>
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
