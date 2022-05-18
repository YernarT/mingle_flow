/**
 * 检查两个对象所有key值是否相等
 * 主要用于检查 localStorage 的内容是否过期或不正确
 * localStorage 数据格式必须为 对象
 */

/**
 * @template T
 * @param {T} dataToBeDetected 待检测的数据
 * @param {T} defaultCorrectData 正确的默认数据
 * @returns {[boolean, T]} 是否正确, 数据
 */
export default function getLatestState(dataToBeDetected, defaultCorrectData) {
	let fromStorageKeys = Object.keys(dataToBeDetected);
	let defaultKeys = Object.keys(defaultCorrectData);

	if (fromStorageKeys.length !== defaultKeys.length) {
		return [false, defaultCorrectData];
	}

	for (let key of fromStorageKeys) {
		if (!defaultKeys.includes(key)) {
			return [false, defaultCorrectData];
		}
	}

	return [true, dataToBeDetected];
}
