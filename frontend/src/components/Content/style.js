import styled from 'styled-components';
import { Layout } from 'antd';

import { commonLayoutStyle } from '@/assets/style';

const { Content } = Layout;

export const ContentStyledBox = styled(Content)`
	${commonLayoutStyle}
	padding-top: 20px !important;
	height: calc(100% - 76px);
	overflow: hidden auto;
`;
