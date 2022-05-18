import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/store';

import { useRequest, useSetState } from 'ahooks';
import { reqAddTaskSubmission } from '@/services/api/user-api';

import { Modal, Form, Upload, message as antdMessage, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

export default function AddSubmissionModal({
	visible,
	onCancel,
	afterAddSubmission,
	task,
}) {
	const history = useHistory();
	const [user, setUser] = useRecoilState(userAtom);
	const [state, setState] = useSetState({
		file: null,
	});

	// 添加Submission 的请求
	const { runAsync, loading: loadingAddSubmission } = useRequest(
		data => reqAddTaskSubmission(data),
		{
			manual: true,
		},
	);

	// 处理表单
	const handleSubmit = values => {
		if (!state.file) {
			antdMessage.warning('A file must be selected');
			return;
		}

		let formData = new FormData();
		formData.append('file', state.file);
		formData.append('task_id', task.id);

		runAsync(formData)
			.then(() => {
				antdMessage.success('Uploaded successfully');
				setState({ file: null });
				onCancel();
				afterAddSubmission();
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
			title="Add Submission"
			footer={null}>
			<Form onFinish={handleSubmit} autoComplete="off" layout="vertical">
				<Form.Item>
					<Form.Item name="file" noStyle>
						<Upload.Dragger
							name="file"
							accept="image/*, .pdf, .doc, .docx, .excel"
							maxCount={1}
							beforeUpload={file => {
								setState({ file });
								return false;
							}}
							onRemove={file => {
								setState({ file: null });
							}}>
							<p className="ant-upload-drag-icon">
								<InboxOutlined />
							</p>
							<p className="ant-upload-text">Submission file</p>
						</Upload.Dragger>
					</Form.Item>
				</Form.Item>

				<Button
					type="primary"
					htmlType="submit"
					block
					loading={loadingAddSubmission}>
					Upload
				</Button>
			</Form>
		</Modal>
	);
}
