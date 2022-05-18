import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userAtom } from '@/store';

import { useRequest } from 'ahooks';
import { reqRegister } from '@/services/api/auth-api';
import { localStorage } from '@/utils';

import { Form, Input, Button, Card, message as antdMessage } from 'antd';
import { RegisterPageStyledBox } from './style';

export default function RegisterPage() {
	const setUser = useSetRecoilState(userAtom);
	const history = useHistory();

	const { runAsync: runReqRegister, loading: loadingReqRegister } = useRequest(
		data => reqRegister(data),
		{
			manual: true,
		},
	);

	const onFinish = ({ username, password }) => {
		runReqRegister({ username, password })
			.then(
				({
					access_token: token,
					user: { id, username, avatar, create_time: createTime },
				}) => {
					antdMessage.success('Тіркеу сәтті өтті');

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
			.catch(({ message }) => {
				antdMessage.error(message);
			});
	};

	return (
		<RegisterPageStyledBox>
			<Card
				className="form-wrap"
				title="Тіркелу формасы"
				actions={[
					<Link to="/login" key="/login">
						Кіру
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
							{ min: 4, message: 'Минимум ұзындық (4) шегінен аз' },
						]}>
						<Input.Password maxLength={80} />
					</Form.Item>
					<Form.Item
						label="Құпия сөз қайталау"
						name="password_confirmation"
						rules={[
							{
								required: true,
								message: 'Құпия сөз қайталап енгізіңіз',
							},
							{ max: 254, message: 'Максималды ұзындық (254) шегінен асды' },
							{ min: 4, message: 'Минимум ұзындық (4) шегінен аз' },

							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue('password') === value) {
										return Promise.resolve();
									}

									return Promise.reject(
										new Error('Енгізген екі құпия сөз сәйкес келмейді'),
									);
								},
							}),
						]}
						dependencies={['password']}>
						<Input.Password maxLength={254} />
					</Form.Item>

					<Form.Item>
						<Button
							block
							type="primary"
							htmlType="submit"
							loading={loadingReqRegister}>
							Жіберу
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</RegisterPageStyledBox>
	);
}
