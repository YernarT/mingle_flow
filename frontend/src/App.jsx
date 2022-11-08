import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAtom } from '@/store';

import { useEventListener, useCreation } from 'ahooks';
import { localStorage } from '@/utils';
import styled from 'styled-components';

import { ConfigProvider as AntdConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import { CommonLoading, Header, Content } from '@/components';

const CommonLayout = styled.div`
	height: 100vh;
	background-image: linear-gradient(to top, #0250c5 0%, #d43f8d 100%);
	overflow: hidden;

	position: relative;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export default function App() {
	const user = useRecoilValue(userAtom);

	// Refresh the page to save the data in Recoil to LocalStorage
	useEventListener('beforeunload', () => {
		localStorage.set('user', user);
	});

	const routes = useCreation(
		() => [
			{
				key: '/',
				path: '/',
				exact: true,
				component: lazy(() => import('@/pages/LandingPage')),
			},
			{
				key: '/login',
				path: '/login',
				exact: true,
				component: lazy(() => import('@/pages/LoginPage')),
			},
			{
				key: '/register',
				path: '/register',
				exact: true,
				component: lazy(() => import('@/pages/RegisterPage')),
			},
			{
				key: '/user',
				path: '/user',
				exact: true,
				component: lazy(() => import('@/pages/UserProfilePage')),
			},
			{
				key: '/user-edit',
				path: '/user-edit',
				exact: true,
				component: lazy(() => import('@/pages/EditProfilePage')),
			},
			{
				key: '/team',
				path: '/team',
				exact: true,
				component: lazy(() => import('@/pages/TeamPage')),
			},
			{
				key: '/task',
				path: '/task',
				exact: true,
				component: lazy(() => import('@/pages/TaskPage')),
			},
		],
		[],
	);

	return (
		<AntdConfigProvider locale={enUS}>
			<BrowserRouter>
				<CommonLayout>
					<Header />
					<Content>
						<Switch>
							<Suspense fallback={<CommonLoading />}>
								{routes.map(routeConfig => (
									<Route key={routeConfig.key} {...routeConfig} />
								))}
							</Suspense>
						</Switch>
					</Content>
				</CommonLayout>
			</BrowserRouter>
		</AntdConfigProvider>
	);
}
