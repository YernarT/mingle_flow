import React from 'react';

import { useRequest, useMemoizedFn } from 'ahooks';
import { reqGetReport } from '@/services/api/user-api';

import { Modal, Typography, List, Row, Col, Divider } from 'antd';

const { Title, Text } = Typography;

export default function ShowReportModal({ visible, onCancel }) {
	// 获取报告
	const { data, loading } = useRequest(reqGetReport, {});

	// YYYY-MM-DD hh:mm:ss
	const formatDate = useMemoizedFn(dateString => {
		let date = new Date(dateString);
		let year = date.getFullYear();
		let month = date.getMonth();
		let day = date.getDay();
		let hour = date.getHours();
		let minute = date.getMinutes();

		return `${year}-${month}-${day} ${hour}:${minute}`;
	});

	return (
		<Modal visible={visible} onCancel={onCancel} title="Отчет" footer={null}>
			<List
				itemLayout="horizontal"
				dataSource={data?.tasks ?? []}
				renderItem={item => (
					<List.Item>
						<Row>
							<Col span={24}>
								<Title level={4}>{item.name}</Title>
							</Col>
							<Col span={12}>
								<Text>Бастау уақыт: {formatDate(item.start_time)}</Text>
							</Col>
							<Col span={12}>
								<Text>Аяқтау уақыт: {formatDate(item.end_time)}</Text>
							</Col>
							<Col span={24}>
								<Text>Қаржы: {item.funds} ₸</Text>
							</Col>
						</Row>
					</List.Item>
				)}
			/>

			<Divider />

			<Row>
				<Col span={24}>
					<Title level={4}>
						Жалпы сумма:{' '}
						{data?.tasks.reduce((total, currVal) => total + currVal.funds, 0)} ₸
					</Title>
				</Col>
				<Col span={12}>
					<Text>
						Жалпы жұмыс басталған уақыты:
						{formatDate(data?.tasks[0].start_time)}
					</Text>
				</Col>
				<Col span={12}>
					<Text>
						Жалпы жұмыс аяталған уақыты:
						{formatDate(data?.tasks[data?.tasks.length - 1].end_time)}
					</Text>
				</Col>
			</Row>
		</Modal>
	);
}
