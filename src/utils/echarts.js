import * as echarts from "echarts";

/**
 * 生成echarts对象实例
 * @param dom dom实例
 * @param options echarts配置对象
 * @returns {EChartsType}
 */
function initialEchartInstance(dom, options = {}) {
  if (!(dom instanceof HTMLElement)) {
    throw new Error("请传入Dom对象");
  }
  if (options && typeof options !== "object") {
    throw new Error("请传入合法的options对象");
  }
  const mapContainer = echarts.init(dom);
  mapContainer.setOption(options);
  return mapContainer;
}

export { initialEchartInstance };
