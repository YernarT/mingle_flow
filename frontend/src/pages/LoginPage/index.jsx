import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userAtom } from '@/store';

import { useRequest } from 'ahooks';
import { reqLogin } from '@/services/api/auth-api';
import { localStorage } from '@/utils';

import { Form, Input, Button, Card, message as antdMessage } from 'antd';
import { LoginPageStyledBox } from './style';

export default function LoginPage() {
	const setUser = useSetRecoilState(userAtom);
	const history = useHistory();

	const { runAsync: runReqLogin, loading: loadingReqLogin } = useRequest(
		data => reqLogin(data),
		{
			manual: true,
		},
	);

	const onFinish = values => {
		runReqLogin(values)
			.then(
				({
					message,
					access_token: token,
					user: { id, username, avatar, create_time: createTime },
				}) => {
					antdMessage.success(message);

					let userData = {
						id,
						username,
						avatar,
						createTime,
						token,
					};

					localStorage.set('user', userData);
					setUser(userData);
					history.push('/user-edit');
				},
			)
			.catch(({ message, needExecuteLogout, initialUser }) => {
				antdMessage.error(message);

				if (needExecuteLogout) {
					setUser(initialUser);
					history.push('/login');
				}
			});
	};

	return (
		<LoginPageStyledBox>
			<Card
				className="form-wrap"
				title="Кіру формасы"
				actions={[
					<Link to="/register" key="/register">
						Тіркелу
					</Link>,
				]}>
				<Form layout="vertical" onFinish={onFinish} autoComplete="off">
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

					<Form.Item
						label="Құпия сөз"
						name="password"
						rules={[
							{
								required: true,
								message: 'Құпия сөзіңізді енгізіңіз',
							},
							{ max: 254, message: 'Максималды ұзындық (254) шегінен асды' },
						]}>
						<Input.Password maxLength={254} />
					</Form.Item>

					<Form.Item>
						<Button
							type="primary"
							htmlType="submit"
							loading={loadingReqLogin}
							block>
							Жіберу
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</LoginPageStyledBox>
	);
}
