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

		width: 100%;
		height: calc(100vh - 76px);
		${commonLayoutStyle}
		padding-top: 20px !important;

		background: #fff;

		display: flex;
		flex-direction: column;
	}

	.mobile-header--collapse {
		transform: scaleY(1);
	}
`;

export const HeaderStyledBox = styled(Header)`
	${commonLayoutStyle}
	${mobileHeaderStyle}

	height: 76px;
	padding-top: 10px !important;
	padding-bottom: 10px !important;
	background: inherit;
	box-shadow: 0 3px 6px #1890ff;

	position: relative;

	display: flex;
	align-items: center;

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
