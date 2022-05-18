import React from 'react';

import { useRequest } from 'ahooks';
import { reqCreateTeam } from '@/services/api/user-api';

import { Modal, Form, Input, message as antdMessage, Button } from 'antd';

export default function CreateTeamModal({
	visible,
	onCancel,
	afterCreateTeam,
}) {
	// 添加Team 的请求
	const { runAsync, loading } = useRequest(data => reqCreateTeam(data), {
		manual: true,
	});

	// 处理表单
	const handleSubmit = values => {
		runAsync(values)
			.then(({ team }) => {
				afterCreateTeam(team);
			})
			.catch(({ message }) => {
				antdMessage.error(message);
			});
	};

	return (
		<Modal
			visible={visible}
			onCancel={onCancel}
			title="Команда құру"
			footer={null}>
			<Form onFinish={handleSubmit} autoComplete="off" layout="vertical">
				<Form.Item
					label="Команда аты"
					name="name"
					rules={[
						{ required: true, message: 'Команда атын енгізіңіз' },
						{ min: 4, message: 'Минимум ұзындық (4) шегінен аз' },
						{ max: 40, message: 'Максималды ұзындық (40) шегінен асды' },
					]}>
					<Input />
				</Form.Item>
				<Form.Item
					label="Cипаттама"
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

				<Button
					type="primary"
					htmlType="submit"
					block
					loading={loading}
					style={{ marginTop: 24 }}>
					Құру
				</Button>
			</Form>
		</Modal>
	);
}
