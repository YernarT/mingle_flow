import styled, { css } from 'styled-components';
import { Layout } from 'antd';

import { commonLayoutStyle } from '@/assets/style';

const { Header } = Layout;

const mobileHeaderStyle = css`
	.mobile-header,
	.mobile-header-trigger {
		display: none;

		@media screen and (max-width: 575px) {
			display: flex;
		}
	}

	.mobile-header-trigger {
		margin-left: auto;

		justify-content: center;
		align-items: center;
	}

	.mobile-header {
		transform: scaleY(0);
		transform-origin: 0 0;
		transition: transform 0.3s ease;

		position: absolute;
		top: 100%;
		left: 0;
		z-index: 1000;

		${commonLayoutStyle}
		max-width: 100%;
		height: calc(100vh - 76px - 10vh);
		padding-top: 20px !important;

		border-radius: 4px;
		border: 1.5px solid rgba(255, 255, 255, 0.18);
		border-top: none;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		background-image: linear-gradient(to top, #0250c5 0%, #d43f8d 100%);
		box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
		backdrop-filter: blur(20px);

		display: flex;
		flex-direction: column;

		.mobile-header-menu {
			border: none;
			background: transparent;

			.ant-menu-item {
				color: #1890ff;
				text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.85);
				font-size: 16px;
			}
		}

		.ant-space {
			width: 100%;

			.ant-space-item {
				flex-grow: 1;
			}
		}
	}

	.mobile-header--collapse {
		transform: scaleY(1);
	}
`;

export const HeaderStyledBox = styled(Header)`
	${commonLayoutStyle}
	${mobileHeaderStyle}

	flex: 0 0 76px;
	height: 76px;
	padding-top: 10px !important;
	padding-bottom: 10px !important;
	margin-top: 0 !important;
	margin-bottom: 0 !important;

	border-radius: 4px;
	border: 1.5px solid rgba(255, 255, 255, 0.18);
	border-bottom: 1px solid rgba(0, 0, 0, 0.25);
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
	background: rgba(229, 194, 194, 0.2);
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	backdrop-filter: blur(20px);

	position: relative;
	z-index: 1000;
	display: flex;
	align-items: center;
	user-select: none;

	.logo {
		margin-right: 24px;

		display: flex;
		justify-content: center;
		align-items: center;

		img {
			width: max-content;
			height: 56px;

			object-fit: cover;
		}
	}

	.header-menu {
		min-width: 200px;
		border-bottom: none;
		background: transparent;

		@media screen and (max-width: 575px) {
			display: none;
		}
	}

	.actions {
		margin-left: auto;

		@media screen and (max-width: 575px) {
			display: none;
		}
	}
`;
