import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAtom } from '@/store';

import { reqEditProfile, reqUploadAvatar } from '@/services/api/user-api';
import { useSetState, useRequest } from 'ahooks';
import { useAuth } from '@/hooks';

import {
	message as antdMessage,
	Button,
	Avatar,
	Typography,
	Form,
	Input,
} from 'antd';
import { EditProfileStyled } from './style';

const { Title } = Typography;

export default function EditProfilePage() {
	const history = useHistory();
	const [user, setUser] = useRecoilState(userAtom);

	// 授权校验
	useAuth(user.token);

	const [state, setState] = useSetState({
		baseInfo: {
			username: user.username,
		},
		avatar: user.avatar,
	});

	// 修改基础信息的请求
	const { runAsync: runReqEditProfile, loading: loadingReqEditProfile } =
		useRequest(data => reqEditProfile(data), {
			manual: true,
		});

	// 提交表单
	const onFinish = values => {
		runReqEditProfile(values)
			.then(({ message, username }) => {
				antdMessage.success(message);

				setState({
					baseInfo: {
						username,
					},
				});
				setUser(prevState => ({ ...prevState, username }));
			})
			.catch(({ message, needExecuteLogout, initialUser }) => {
				antdMessage.error(message);

				if (needExecuteLogout) {
					setUser(initialUser);
					history.push('/login');
				}
			});
	};

	// 上传头像的请求
	const { runAsync: runReqUploadAvatar } = useRequest(
		avatar => reqUploadAvatar(avatar),
		{
			manual: true,
		},
	);

	// 头像节点
	const avatarInputRef = useRef();
	// 修改头像
	const handleChangeAvatar = () => {
		// 获取头像文件
		let newAvatar = avatarInputRef.current.files[0];

		let data = new FormData();
		data.append('avatar', newAvatar);

		if (newAvatar) {
			runReqUploadAvatar(data)
				.then(({ avatar }) => {
					antdMessage.success('Аватар жүктелды');

					setState({ avatar });
					setUser(prevState => ({ ...prevState, avatar }));
				})
				.catch(({ message, needExecuteLogout, initialUser }) => {
					antdMessage.error(message);

					if (needExecuteLogout) {
						setUser(initialUser);
						history.push('/login');
					}
				});
		}
	};

	return (
		<EditProfileStyled>
			<Title className="title" level={2}>
				Профильді өңдеу
			</Title>

			<div className="form-wrap">
				<Form
					initialValues={state.baseInfo}
					onFinish={onFinish}
					autoComplete="off"
					className="edit-form"
					layout="vertical">
					<Form.Item
						label="Пайдаланушы аты"
						name="username"
						rules={[
							{
								required: true,
								message: 'Пайдаланушы атыңызды енгізіңіз',
							},
							{ max: 24, message: 'Максималды ұзындық (24) шегінен асды' },
						]}>
						<Input maxLength={24} />
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							block
							className="submit-btn"
							loading={loadingReqEditProfile}>
							Жаңарту
						</Button>
					</Form.Item>
				</Form>

				<div className="avatar-form">
					<div className="avatar-wrap">
						<Avatar src={state.avatar} />

						<div
							className="mask"
							onClick={() => {
								avatarInputRef.current.click();
							}}>
							Click to upload avatar
						</div>

						<input
							ref={avatarInputRef}
							onChange={handleChangeAvatar}
							className="avatar-input"
							type="file"
							accept="image/*"
						/>
					</div>
				</div>
			</div>
		</EditProfileStyled>
	);
}
