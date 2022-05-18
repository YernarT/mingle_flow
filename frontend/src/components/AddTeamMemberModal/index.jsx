import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/store';

import { useSetState, useRequest } from 'ahooks';
import { reqGetAllUsers, reqAddTeamMember } from '@/services/api/user-api';

import {
	Modal,
	Select,
	message as antdMessage,
	Button,
	Typography,
} from 'antd';

const { Option } = Select;
const { Text } = Typography;

export default function AddTeamMemberModal({
	visible,
	onCancel,
	afterAddTeamMember,
	team,
}) {
	const history = useHistory();
	const [user, setUser] = useRecoilState(userAtom);
	const [state, setState] = useSetState({
		allUsers: [],
		notInTeamUsers: [],
		// notInTeamUsers Index
		selectedUserIdx: -1,
	});

	// 获取所有用户 的请求
	const { loading: loadingGetAllUser } = useRequest(reqGetAllUsers, {
		onSuccess(users) {
			setState({
				allUsers: users,
				notInTeamUsers: users.filter(
					user => !user.enrolled_groups.includes(team.id),
				),
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
		if (state.selectedUserIdx === -1) {
			antdMessage.warning('User needs to be selected');
			return;
		}

		runAsync({
			group_id: team.id,
			username: state.notInTeamUsers[state.selectedUserIdx].username,
		})
			.then(newMember => {
				antdMessage.success('Added successfully');
				onCancel();
				afterAddTeamMember(newMember);
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
			title="Add team member"
			footer={null}>
			<Text>User</Text>
			<Select
				style={{ width: '100%', marginTop: '5px' }}
				loading={loadingGetAllUser}
				onSelect={idx => {
					setState({ selectedUserIdx: idx });
				}}>
				{state.notInTeamUsers.map((_user, idx) => (
					<Option value={idx} key={_user.id}>
						{_user.username} ({_user.level})
					</Option>
				))}
			</Select>

			<Button
				type="primary"
				block
				loading={loadingAddTeamMember}
				style={{ marginTop: 24 }}
				onClick={handleAddMember}>
				Add
			</Button>
		</Modal>
	);
}
