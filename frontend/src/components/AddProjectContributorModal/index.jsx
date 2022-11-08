import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userAtom } from '@/store';

import { useSetState, useRequest } from 'ahooks';
import {
	reqGetAllUsers,
	reqAddProjectContributors,
} from '@/services/api/user-api';

import { Modal, Select, message as antdMessage, Button } from 'antd';

const { Option } = Select;

export default function AddProjectContributorModal({
	visible,
	onCancel,
	afterAdd,
	project,
}) {
	const history = useHistory();
	const setUser = useSetRecoilState(userAtom);
	const [state, setState] = useSetState({
		allUsers: [],
		selectedUsers: [],
	});

	// 获取所有用户 的请求
	const { loading: loadingGetAllUser } = useRequest(reqGetAllUsers, {
		onSuccess({ users }) {
			setState({
				allUsers: users,
			});
		},
	});

	// 添加Contributor 的请求
	const { runAsync, loading: loadingAddProjectContributors } = useRequest(
		data => reqAddProjectContributors(data),
		{
			manual: true,
		},
	);

	// 处理表单
	const handleAddContributors = () => {
		if (!state.selectedUsers.length) {
			antdMessage.warning('Пайдаланушыны таңдау керек');
			return;
		}

		runAsync({
			project_id: project.id,
			contributors: state.selectedUsers,
		})
			.then(({ contributors }) => {
				antdMessage.success('Сәтті қосылды');
				onCancel();
				afterAdd(contributors);
			})
			.catch(({ message, needExecuteLogout, initialUser }) => {
				antdMessage.error(message);
				if (needExecuteLogout) {
					setUser(initialUser);
					history.push('/login');
				}
			});
	};

	return (
		<Modal
			open={visible}
			onCancel={onCancel}
			title="Команда мүшесін қосу"
			footer={null}>
			<Select
				style={{ width: '100%' }}
				loading={loadingGetAllUser}
				mode="multiple"
				allowClear
				onChange={value => {
					setState({ selectedUsers: value });
				}}
				placeholder="Мүшелерді талдаңыз">
				{state.allUsers
					.filter(
						_user =>
							!project.contributors.find(
								contributor => contributor.id === _user.id,
							),
					)
					.map(_user => (
						<Option value={_user.id} key={_user.id}>
							{_user.username}
						</Option>
					))}
			</Select>

			<Button
				type="primary"
				block
				loading={loadingAddProjectContributors}
				style={{ marginTop: 24 }}
				onClick={handleAddContributors}>
				Қосу
			</Button>
		</Modal>
	);
}
