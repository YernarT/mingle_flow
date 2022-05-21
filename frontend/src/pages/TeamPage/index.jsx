import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store';

import { reqGetTeamTask, reqGetTeamMembers } from '@/services/api/user-api';
import { useSetState, useRequest, useCreation } from 'ahooks';
import { useAuth } from '@/hooks';

import {
	// message as antdMessage,
	Button,
	Avatar,
	Typography,
	Card,
	Empty,
	Skeleton,
} from 'antd';
import {
	PlusOutlined,
	DollarCircleOutlined,
	SendOutlined,
} from '@ant-design/icons';
import { AddTeamMemberModal, AddTaskModal } from '@/components';
import {
	TeamPageStyled,
	MembersStyled,
	TeamMemberStyled,
	TasksStyled,
	TaskItemStyled,
} from './style';

const { Title, Text } = Typography;

export default function TeamPage() {
	const user = useRecoilValue(userAtom);
	const history = useHistory();

	// 授权校验
	useAuth(user.token);

	const [state, setState] = useSetState({
		team: history.location.state.team,

		members: [],
		tasks: [],

		addTeamMemberModalVisibile: false,
		addTaskModalVisibile: false,
	});

	// 当前用户是否是群主 (Team creator)
	let thisMyTeam = useCreation(
		() => user.id === state.team.creator,
		[user.id, state.team],
	);

	// 获取 Tasks
	const { loading: loadingGetTasks } = useRequest(
		() => reqGetTeamTask(state.team.id),
		{
			onSuccess({ tasks }) {
				setState({ tasks });
			},
		},
	);

	// 获取 Members
	const { loading: loadingGetMembers } = useRequest(
		() => reqGetTeamMembers(state.team.id),
		{
			onSuccess({ members }) {
				setState({ members });
			},
		},
	);

	return (
		<TeamPageStyled>
			<Card title={state.team.name} className="team-basic-info">
				<Text>{state.team.description}</Text>
			</Card>

			<div className="box">
				<Card
					className="tasks"
					title={
						<div className="head">
							<Title level={5}>Тапсырмалар</Title>

							{thisMyTeam && (
								<Button
									onClick={() => setState({ addTaskModalVisibile: true })}>
									<PlusOutlined />
								</Button>
							)}
						</div>
					}>
					<Skeleton active loading={loadingGetTasks}>
						<TasksStyled>
							{state.tasks.map(task => (
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

							{state.tasks.length === 0 && <Empty description="Жоқ" />}
						</TasksStyled>
					</Skeleton>

					<AddTaskModal
						visible={state.addTaskModalVisibile}
						onCancel={() => setState({ addTaskModalVisibile: false })}
						team={state.team}
						afterAddTask={task => {
							setState(prevState => ({
								tasks: [...prevState.tasks, task],
							}));
						}}
					/>
				</Card>

				<Card
					className="members"
					title={
						<div className="head">
							<Title level={5}>Мүшелер</Title>

							{thisMyTeam && (
								<Button
									onClick={() =>
										setState({ addTeamMemberModalVisibile: true })
									}>
									<PlusOutlined />
								</Button>
							)}
						</div>
					}>
					<Skeleton active loading={loadingGetMembers}>
						<MembersStyled hasMember={Boolean(state.members.length)}>
							{state.members.map(member => (
								<TeamMemberStyled key={member.id}>
									<Avatar className="avatar" src={member.avatar} />

									<Text className="username">{member.username}</Text>
								</TeamMemberStyled>
							))}

							{state.members.length === 0 && <Empty description="Жоқ" />}
						</MembersStyled>
					</Skeleton>

					<AddTeamMemberModal
						visible={state.addTeamMemberModalVisibile}
						onCancel={() => {
							setState({ addTeamMemberModalVisibile: false });
						}}
						team={state.team}
						afterAddTeamMember={members => {
							setState(prevState => ({
								members: [...prevState.members, ...members],
							}));
						}}
					/>
				</Card>
			</div>
		</TeamPageStyled>
	);
}
