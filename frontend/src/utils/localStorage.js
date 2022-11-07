/**
 * 高度自定义的 `localStorage` 工具函数
 * Highly customizable `localStorage` utility functions
 *
 *
 * 主要用于
 *     1. `recoil atom` 的初始化定义
 * 	   2. `axios` 请求拦截器
 * 	   3. 其他各种的 初始化任务
 *
 * 备注:
 *     写入数据前, 会先调用一次 `serializer`
 *     读取数据后, 会先调用一次 `deserializer`
 *     内置了版本检测, 需要在每次 `deploy` 至服务器时 手动修改版本号
 *
 */

 export const localStorage = {
	get(key, defaultValue, deserializer) {
		let data = window.localStorage.getItem(key);

		// key 存在
		// key exists
		if (data) {
			// 检测版本号
			if (this._checkDataVersion(data)) {
				// 移除版本号信息
				// remove version information
				data = data.replace(this._VERSION_MARK_RegExp, '');

				let deserializedData;
				// 执行反序列化
				try {
					deserializedData = deserializer?.(data) ?? JSON.parse(data);
				} catch (error) {
					// deserialization exception
					console.error(`localStorage.get 反序列化异常: \n${error}`);
					deserializedData = defaultValue;
				}

				return deserializedData;
			}
		}

		return defaultValue;
	},

	set(key, value, serializer) {
		// 执行序列化
		let serializedValue = serializer?.(value) ?? JSON.stringify(value);
		// 记录版本号
		// Record version
		let serializedData = `${this._DATA_PREFIX}=${this._DATA_VERSION};${serializedValue}`;

		window.localStorage.setItem(key, serializedData);
	},

	_DATA_PREFIX: 'pms',
	_DATA_VERSION: '1.0.0',

	get _VERSION_MARK_RegExp() {
		return new RegExp(`^${this._DATA_PREFIX}=${this._DATA_VERSION};`);
	},

	_checkDataVersion(data) {
		return this._VERSION_MARK_RegExp.test(data);
	},
};
