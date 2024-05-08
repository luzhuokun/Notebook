// kmp算法
// 核心：通过构建一个包含局部匹配信息的next数组，尽量减少模式串与主串的匹配次数，最终达到快速匹配的目的
// PMT（partial match table）部分匹配表，前缀集合和后缀集合的交集中，最长的元素长度
// 求next数组，这是每一位PMT值往右移一位的值，首位为-1，为了方便计算
// 时间复杂度O（n+m）

const search = (str, pattern) => {
  const next = getNext(pattern);
  let i = 0;
  let j = 0;
  while (i < str.length && j < pattern.length) {
    if (j === -1 || str[i] === pattern[j]) {
      i++;
      j++;
    } else {
      j = next[j];
    }
  }
  if (j === pattern.length) {
    return i - j;
  }
  return -1;
};

const getNext = (pattern) => {
  const next = Array.from({ length: pattern.length }).fill(0);
  next[0] = -1;
  let i = 0;
  let j = -1;
  while (i < pattern.length) {
    if (j === -1) {
      i++;
      j++;
    } else if (pattern[i] === pattern[j]) {
      i++;
      j++;
      next[i] = j;
    } else {
      j = next[j];
    }
  }
  return next;
};

console.log(search("ABCABCAABCABCD", "ABCABCD"));
