import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/store';

import { useSetState, useRequest } from 'ahooks';
import {
	reqGetAllSubmission,
	reqMarkDoneSubmission,
} from '@/services/api/user-api';
import { useAuth } from '@/hooks';

import {
	message as antdMessage,
	Button,
	Avatar,
	Typography,
	Space,
	Empty,
	Card,
} from 'antd';
import { AddSubmissionModal } from '@/components';
import { TaskPageStyled, SubmissionList } from './style';

const { Title, Paragraph, Text } = Typography;

export default function TaskPage() {
	const [user, setUser] = useRecoilState(userAtom);
	const history = useHistory();

	// 授权校验
	useAuth(user.token);

	const [state, setState] = useSetState({
		task: history.location.state.task,
		submissions: [],

		addSubmissionModalVisible: false,
	});

	// 获取所有 Submission
	// useRequest(() => reqGetAllSubmission(state.task.id), {
	// 	onSuccess(submissions) {
	// 		setState({ submissions });
	// 	},
	// });

	// MarkDone 请求
	// const { runAsync, loading } = useRequest(
	// 	data => reqMarkDoneSubmission(data),
	// 	{
	// 		manual: true,
	// 	},
	// );

	// 处理 mark done
	// const handleMarkDone = submission => {
	// 	runAsync({ status_id: submission.id }).then(() => {
	// 		setState(prevState => ({
	// 			submissions: prevState.submissions.filter(
	// 				_submission => _submission.id !== submission.id,
	// 			),
	// 		}));
	// 	});
	// };

	return (
		<>
			<TaskPageStyled>
				<Title level={2} className="title">
					{state.task.title}
				</Title>

				<Card className="task-data">
					<Space className="header">
						<Space direction="vertical" size="small">
							<Text>Start time: 2022-04-27</Text>
							<Text>End time: 2022-05-02</Text>
						</Space>

						<Text>Created by {state.task.creator.username}</Text>
					</Space>

					<Paragraph>{state.task.description}</Paragraph>

					{state.task.creator.id !== user.id && (
						<Button
							block
							type="primary"
							onClick={() => setState({ addSubmissionModalVisible: true })}>
							Add Submission
						</Button>
					)}
				</Card>

				<Card>
					{state.task.creator.id === user.id && (
						<SubmissionList>
							{state.submissions
								.filter(submission => !submission.finished)
								.map(submission => (
									<li className="submission-wrap" key={submission.id}>
										<Card>
											<div className="submission">
												<Avatar
													src={submission.user.avatar}
													className="avatar"
												/>
												<Title level={5} className="username">
													{submission.user.username}
												</Title>

												<div className="more">
													<a href={submission.file_path}>File</a>

													<Button
														// loading={loading}
														onClick={() => {
															// handleMarkDone(submission);
														}}>
														Mark done
													</Button>
												</div>
											</div>
										</Card>
									</li>
								))}

							{state.submissions.filter(submission => !submission.finished)
								.length === 0 && <Empty description="No submissions yet" />}
						</SubmissionList>
					)}
				</Card>
			</TaskPageStyled>

			{state.task.creator.id !== user.id && (
				<AddSubmissionModal
					visible={state.addSubmissionModalVisible}
					onCancel={() => setState({ addSubmissionModalVisible: false })}
					task={state.task}
					afterAddSubmission={() => {
						setState({ addSubmissionModalVisible: false });
						antdMessage.success('Uploaded successfully');
						history.goBack();
					}}
				/>
			)}
		</>
	);
}
