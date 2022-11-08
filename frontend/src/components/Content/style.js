import styled from 'styled-components';
import { Layout } from 'antd';

import { commonLayoutStyle } from '@/assets/style';

const { Content } = Layout;

export const ContentStyledBox = styled(Content)`
	${commonLayoutStyle}
	padding-top: 20px !important;
	margin-top: 0 !important;
	margin-bottom: 0 !important;

	flex: 0 0 calc(100% - 76px - 10%);
	height: calc(100% - 76px - 10%);
	overflow: hidden auto;

	border-radius: 4px;
	border: 1.5px solid rgba(255, 255, 255, 0.18);
	border-top: none;
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	background: rgba(229, 194, 194, 0.2);
	box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
	backdrop-filter: blur(20px);

	* {
		.ant-typography {
			color: rgba(255, 255, 255, 0.85) !important;
		}
	}
`;
