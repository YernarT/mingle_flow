import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userAtom } from '@/store';

import { useSetState, useRequest } from 'ahooks';
import { reqGetAllUsers, reqAddTeamMember } from '@/services/api/user-api';

import { Modal, Select, message as antdMessage, Button } from 'antd';

const { Option } = Select;

export default function AddTeamMemberModal({
	visible,
	onCancel,
	afterAddTeamMember,
	team,
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

	// 添加TeamMember 的请求
	const { runAsync, loading: loadingAddTeamMember } = useRequest(
		data => reqAddTeamMember(data),
		{
			manual: true,
		},
	);

	// 处理表单
	const handleAddMember = () => {
		if (!state.selectedUsers.length) {
			antdMessage.warning('Пайдаланушыны таңдау керек');
			return;
		}

		runAsync({
			team_id: team.id,
			members: state.selectedUsers,
		})
			.then(({ members }) => {
				antdMessage.success('Сәтті қосылды');
				onCancel();
				afterAddTeamMember(members);
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
			visible={visible}
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
					.filter(_user => !team.members.find(member => member.id === _user.id))
					.map(_user => (
						<Option value={_user.id} key={_user.id}>
							{_user.username}
						</Option>
					))}
			</Select>

			<Button
				type="primary"
				block
				loading={loadingAddTeamMember}
				style={{ marginTop: 24 }}
				onClick={handleAddMember}>
				Қосу
			</Button>
		</Modal>
	);
}
