import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store';

import {
	reqGetProjectTasks,
	reqGetProjectContributors,
} from '@/services/api/user-api';
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
import {
	AddProjectContributorModal,
	AddTaskModal,
	ShowReportModal,
} from '@/components';
import {
	ProjectPageStyled,
	ContributorsStyled,
	ProjectContributorStyled,
	TasksStyled,
	TaskItemStyled,
} from './style';

const { Title, Text } = Typography;

export default function ProjectPage() {
	const user = useRecoilValue(userAtom);
	const history = useHistory();

	// 授权校验
	useAuth(user.token);

	const [state, setState] = useSetState({
		project: history.location.state.project,

		contributors: [],
		tasks: [],

		addProjectContributorModalVisibile: false,
		addTaskModalVisibile: false,
		showReportVisible: false,
	});

	// 当前用户是否是项目所有者 (Project creator)
	let thisMyProject = useCreation(
		() => user.id === state.project.creator,
		[user.id, state.project],
	);

	// 获取 Tasks
	const { loading: loadingGetTasks } = useRequest(
		() => reqGetProjectTasks(state.project.id),
		{
			onSuccess({ tasks }) {
				setState({ tasks });
			},
		},
	);

	// 获取 Contributors
	const { loading: loadingGetContributors } = useRequest(
		() => reqGetProjectContributors(state.project.id),
		{
			onSuccess({ contributors }) {
				setState({ contributors });
			},
		},
	);

	return (
		<ProjectPageStyled>
			<Card title={state.project.name} className="project-basic-info">
				<Text>{state.project.description || 'Сипаттама жоқ'}</Text>

				<div
					style={{
						marginTop: '20px',
						display: 'flex',
						justifyContent: 'flex-end',
					}}>
					<Button
						type="primary"
						onClick={() => {
							setState({ showReportVisible: true });
						}}>
						Отчет
					</Button>

					<ShowReportModal
						visible={state.showReportVisible}
						onCancel={() => {
							setState({ showReportVisible: false });
						}}
					/>
				</div>
			</Card>

			<div className="box">
				<Card
					className="tasks"
					title={
						<div className="head">
							<Title level={5}>Тапсырмалар</Title>

							{thisMyProject && (
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
						project={state.project}
						afterAdd={task => {
							setState(prevState => ({
								tasks: [...prevState.tasks, task],
							}));
						}}
					/>
				</Card>

				<Card
					className="contributors"
					title={
						<div className="head">
							<Title level={5}>Мүшелер</Title>

							{thisMyProject && (
								<Button
									onClick={() =>
										setState({ addProjectContributorModalVisibile: true })
									}>
									<PlusOutlined />
								</Button>
							)}
						</div>
					}>
					<Skeleton active loading={loadingGetContributors}>
						<ContributorsStyled
							hasContributor={Boolean(state.contributors.length)}>
							{state.contributors.map(contributor => (
								<ProjectContributorStyled key={contributor.id}>
									<Avatar className="avatar" src={contributor.user.avatar} />

									<Text className="username">{contributor.user.username}</Text>
								</ProjectContributorStyled>
							))}

							{state.contributors.length === 0 && <Empty description="Жоқ" />}
						</ContributorsStyled>
					</Skeleton>

					<AddProjectContributorModal
						visible={state.addProjectContributorModalVisibile}
						onCancel={() => {
							setState({ addProjectContributorModalVisibile: false });
						}}
						project={state.project}
						afterAdd={contributors => {
							setState(prevState => ({
								contributors: [...prevState.contributors, ...contributors],
							}));
						}}
					/>
				</Card>
			</div>
		</ProjectPageStyled>
	);
}
