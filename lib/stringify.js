var yaml = require('js-yaml');

function stringify(obj, options) {
  if (!obj) throw new TypeError('obj is required!');

  const { _content: content = '' } = obj;
  delete obj._content;

  if (!Object.keys(obj).length) return content;

  const { mode, prefixSeparator } = options;
  const separator = options.separator || (mode === 'json' ? ';;;' : '---');
  let result = '';

  if (prefixSeparator) result += `${separator}\n`;

  if (mode === 'json') {
    result += stringifyJSON(obj);
  } else {
    result += stringifyYAML(obj, options);
  }

  result += `${separator}\n${content}`;

  return result;
}

function stringifyYAML(obj, options) {
  let keys;
  if (options.order) {
    keys = Object.keys(obj).sort((a, b) => {
      const indexA = options.order.indexOf(a);
      const indexB = options.order.indexOf(b);

      if (indexA === -1 && indexB === -1) return 0; // 如果两个键都不在 order 中，保持原有顺序
      if (indexA === -1) return 1; // 如果 a 不在 order 中，将 a 排在后面
      if (indexB === -1) return -1; // 如果 b 不在 order 中，将 b 排在后面

      return indexA - indexB;
    });
  } else {
    keys = Object.keys(obj);
  }
  let key, value;

  let result = '';

  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    value = obj[key];

    if (value === null) {
      result += `${key}:\n`;
    } else if (value instanceof Date) {
      result += `${key}: ${formatDate(value)}\n`;
    } else {
      result += yaml.dump({ [key]: value });
    }
  }

  return result;
}

function stringifyJSON(obj) {
  return JSON.stringify(obj, null, '  ')
    // Remove indention
    .replace(/\r?\n {2}/g, () => '\n')
    // Remove prefixing and trailing braces
    .replace(/^{\r?\n|}$/g, '');
}

function doubleDigit(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return `${date.getFullYear()}-${doubleDigit(date.getMonth() + 1)}-${doubleDigit(date.getDate())} ${doubleDigit(date.getHours())}:${doubleDigit(date.getMinutes())}:${doubleDigit(date.getSeconds())}`;
}

module.exports = stringify;