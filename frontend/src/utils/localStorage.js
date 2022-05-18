/**
 * 封装操作本地数据的对象
 *
 * @TODO
 * 添加 serializer, deserializer 相关配置项
 */

export default {
	/**
	 * 获取本地数据
	 * @param {string} key 唯一key
	 * @param {object | undefined} defaultValue 默认数据
	 * @returns {object} 返回本地数据
	 */
	get(key, defaultValue) {
		return JSON.parse(
			window.localStorage.getItem(key) || JSON.stringify(defaultValue),
		);
	},

	/**
	 * 设置本地数据
	 * @param {string} key 唯一key
	 * @param {object} value 数据
	 * @returns {undefined}
	 */
	set(key, value) {
		window.localStorage.setItem(key, JSON.stringify(value));
	},
};
