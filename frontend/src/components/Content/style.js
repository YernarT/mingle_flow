import styled from 'styled-components';
import { Layout } from 'antd';

import { commonLayoutStyle } from '@/assets/style';

const { Content } = Layout;

export const ContentStyledBox = styled(Content)`
	${commonLayoutStyle}
	padding-top: 20px !important;
	height: calc(100% - 76px);
	overflow: hidden auto;

	background: rgb(78, 70, 223);
	background: linear-gradient(
		0deg,
		rgba(78, 70, 223, 1) 0%,
		rgba(24, 144, 255, 1) 31%,
		rgba(34, 202, 237, 1) 100%
	);
`;
