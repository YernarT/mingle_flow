import _ from "lodash";

/**
 * 检查变量是否是 JavaScript 中的基本类型
 * 字符串、数字、布尔、null、undefined
 * @param {any} value
 * @returns {boolean}
 */
function isPrimitive(value: any): boolean {
  return (
    (typeof value !== "object" && typeof value !== "function") || value === null
  );
}

/**
 * @param {object} object
 * @param {'camel' | 'snake'} case_
 * @returns { object }
 */
export function convertKeysCase(
  object: object,
  case_: "camel" | "snake"
): object {
  if (isPrimitive(object)) return object;

  if (Array.isArray(object)) {
    return object.map((item: object) => convertKeysCase(item, case_));
  }

  const newObj = {};

  _.forEach(object, (value, key) => {
    if (_.isObject(value)) {
      // @ts-ignore
      newObj[_[`${case_}Case`](key)] = convertKeysCase(value, case_);
    } else {
      // @ts-ignore
      newObj[_[`${case_}Case`](key)] = value;
    }
  });

  return newObj;
}
