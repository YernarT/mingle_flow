import styled from 'styled-components';
import { Layout } from 'antd';

import { commonLayoutStyle } from '@/assets/style';
import { backgroundImage } from '@/assets/img';

const { Content } = Layout;

export const ContentStyledBox = styled(Content)`
	${commonLayoutStyle}
	padding-top: 20px !important;
	height: calc(100% - 76px);
	overflow: hidden auto;

	background: #f4f4f4;
	background-image: url(${backgroundImage});
	background-repeat: no-repeat;
	background-size: 100% 100%;
	background-clip: cover;

	* {
		.ant-typography {
			color: rgba(255, 255, 255, 0.85) !important;
		}
	}
`;
