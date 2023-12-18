export default function generateUUID() {
  // @ts-ignore 兼容性处理
  const crypto = window.crypto || window.msCrypto;

  if (crypto) {
    // 使用crypto API生成随机数
    const array = new Uint16Array(8);
    crypto.getRandomValues(array);

    function toHex(value: any, length: number) {
      const hex = value.toString(16);
      return "0".repeat(length - hex.length) + hex;
    }

    // 格式化UUID
    return (
      toHex(array[0], 4) +
      "-" +
      toHex(array[1], 4) +
      "-" +
      toHex(array[2], 4) +
      "-" +
      toHex(array[3], 4) +
      "-" +
      toHex(array[4], 4) +
      toHex(array[5], 4) +
      toHex(array[6], 4) +
      toHex(array[7], 4)
    );
  } else {
    // 浏览器不支持crypto API，使用备用方法
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
