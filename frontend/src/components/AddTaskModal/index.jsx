import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userAtom } from '@/store';

import { useSetState, useRequest } from 'ahooks';
import { reqGetProjectContributors, reqAddTask } from '@/services/api/user-api';

import {
	Modal,
	Form,
	Input,
	DatePicker,
	Select,
	message as antdMessage,
	InputNumber,
	Button,
} from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function AddTaskModal({ visible, onCancel, afterAdd, project }) {
	const history = useHistory();
	const setUser = useSetRecoilState(userAtom);
	const [state, setState] = useSetState({
		contributors: [],
		selectedContributors: [],
	});

	// 添加Contributor 的请求
	const { loading: loadingGetProjectContributors } = useRequest(
		() => reqGetProjectContributors(project.id),
		{
			onSuccess({ contributors }) {
				setState({
					contributors,
				});
			},
		},
	);

	// 添加Task 的请求
	const { runAsync, loading: loadingAddTask } = useRequest(
		data => reqAddTask(data),
		{
			manual: true,
		},
	);

	// 处理表单
	const handleSubmit = values => {
		let data = {
			name: values.name,
			description: values.description || '',
			start_time: values['time-range'][0].format('YYYY-MM-DD HH:mm:ss'),
			end_time: values['time-range'][1].format('YYYY-MM-DD HH:mm:ss'),
			funds: values.funds,
			project: project.id,
			responsibles: values.responsibles,
		};

		runAsync(data)
			.then(({ message, task }) => {
				antdMessage.success(message);
				onCancel();
				afterAdd(task);
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
			title="Тапсырма жариялау"
			footer={null}>
			<Form
				onFinish={handleSubmit}
				autoComplete="off"
				layout="vertical"
				initialValues={{ funds: 40000 }}>
				<Form.Item
					label="Тапсырма атауы"
					name="name"
					rules={[
						{ required: true, message: 'Тапсырма атауын енгізіңіз' },
						{ min: 4, message: 'Минимум ұзындық (4) шегінен аз' },
						{ max: 40, message: 'Максималды ұзындық (40) шегінен асды' },
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					label="Тапсырма сипаттамасы"
					name="description"
					rules={[
						{ max: 254, message: 'Максималды ұзындық (254) шегінен асды' },
					]}>
					<Input.TextArea
						maxLength={254}
						showCount
						placeholder="Міндетті емес.."
					/>
				</Form.Item>

				<Form.Item
					name="time-range"
					label="Тапсырма мерзімі"
					rules={[
						{ type: 'array' },
						{
							required: true,
							message: '',
						},
					]}>
					<RangePicker
						showTime
						format="YYYY-MM-DD HH:mm:ss"
						inputReadOnly
						placeholder={['Бастау уақыт', 'Аяқтау уақыт']}
						style={{ width: '100%' }}
					/>
				</Form.Item>

				<Form.Item
					name="funds"
					label="Қаржы"
					rules={[
						{
							required: true,
							message: 'Қаржы суммасын енгізіңіз',
							// 补充， 翻译
						},
					]}>
					<InputNumber step={1000} style={{ width: '100%' }} />
				</Form.Item>

				<Form.Item name="responsibles" label="Жауапты мүшелер">
					<Select
						loading={loadingGetProjectContributors}
						mode="multiple"
						allowClear
						// onChange={value => {
						// 	setState({ selectedUsers: value });
						// }}
						placeholder="Мүшелерді талдаңыз">
						{state.contributors
							.filter(contributor => contributor.user.id !== project.creator)
							.map(contributor => (
								<Option value={contributor.id} key={contributor.id}>
									{contributor.user.username}
								</Option>
							))}
					</Select>
				</Form.Item>

				<Button
					type="primary"
					htmlType="submit"
					block
					loading={loadingAddTask}
					style={{ marginTop: 24 }}>
					Жариялау
				</Button>
			</Form>
		</Modal>
	);
}
