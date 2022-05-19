import styled from 'styled-components';

export const TaskPageStyled = styled.div`
	.title {
		text-align: center;
		width: 100%;
		display: block;

		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.task-data {
		margin-bottom: 24px;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			margin-bottom: 20px;

			@media screen and (max-width: 650px) {
				flex-direction: column;
				align-items: flex-start;
			}
		}
	}
`;

export const SubmissionList = styled.ul`
	padding: 0;
	margin: 0;

	display: flex;
	flex-direction: column;
	gap: 20px;

	.submission-wrap {
		list-style: none;

		.submission {
			display: flex;
			align-items: center;
			gap: 8px;

			.username,
			.avatar {
			}

			.username {
				margin-bottom: 0;
			}

			.more {
				display: flex;
				align-items: center;
				gap: 20px;

				margin-left: auto;
			}

			@media screen and (max-width: 900px) {
				flex-direction: column;

				.more {
					flex-direction: column;
					margin: auto;
					gap: 8px;
				}
			}
		}
	}
`;
