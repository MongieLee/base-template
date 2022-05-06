/**
 * 获取当前时间文本
 * @returns {string}
 */
function timeFix() {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好';
}

function downloadFile(url, fileName) {
  const a = document.createElement('a');
  a.href = url;
  fileName && (a.download = '新闻列表.xlsx');
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export { timeFix, downloadFile };