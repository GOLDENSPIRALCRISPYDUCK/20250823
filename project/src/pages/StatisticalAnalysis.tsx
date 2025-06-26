import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faExclamationTriangle, faUser, faVenusMars, faStethoscope, faUsers } from '@fortawesome/free-solid-svg-icons';

interface EyeData {
  编号?: number;
  病人年龄?: number;
  病人性别?: '男' | '女';
  N?: number;
  D?: number;
  G?: number;
  C?: number;
  A?: number;
  H?: number;
  M?: number;
  O?: number;
}

const DIAGNOSIS_MAP = {
  N: { label: '正常', color: '#4096ff' },
  D: { label: '糖尿病', color: '#ff7a45' },
  G: { label: '青光眼', color: '#7cb5ec' },
  C: { label: '白内障', color: '#2ca02c' },
  A: { label: 'AMD', color: '#d62728' },
  H: { label: '高血压', color: '#9467bd' },
  M: { label: '近视', color: '#8c564b' },
  O: { label: '其他', color: '#EE82EE' }
};

// 定义黄紫相间的颜色数组，用于年龄分布图表
const YELLOW_PURPLE_COLORS = [
  '#1E90FF',
  '#6A5ACD',
  '#228B22',
  '#FFD700',
  '#CD5C5C',
  '#DDA0DD'
];

const StatisticalAnalysis = () => {
  const genderChartRef = useRef<HTMLDivElement>(null);
  const ageChartRef = useRef<HTMLDivElement>(null);
  const diagnosisChartRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<EyeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/store/all_eye.xlsx');
      if (!response.ok) {
        throw new Error('无法加载数据文件 (HTTP ' + response.status + ')');
      }

      const data = new Uint8Array(await response.arrayBuffer());
      const workbook = XLSX.read(data, { type: 'array' });

      if (workbook.SheetNames.length === 0) {
        throw new Error('Excel文件中没有工作表');
      }

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as EyeData[];

      if (jsonData.length === 0) {
        throw new Error('Excel文件中没有有效数据');
      }

      // 验证必要字段
      const requiredFields = ['病人年龄', '病人性别'];
      const missingFields = requiredFields.filter(
        field => !jsonData[0].hasOwnProperty(field)
      );

      if (missingFields.length > 0) {
        throw new Error(`缺少必要字段: ${missingFields.join(', ')}`);
      }

      dataRef.current = jsonData;
      setLoading(false);
      initCharts();
    } catch (err: any) {
      console.error('数据加载错误:', err);
      setError(err.message || '数据加载失败，请稍后重试');
      setLoading(false);
    }
  };

  const processData = (data: EyeData[]) => {
    const validData = data.filter(item =>
      item.病人年龄 !== undefined &&
      item.病人性别 !== undefined &&
      Object.keys(DIAGNOSIS_MAP).some(key => item[key as keyof EyeData] === 1)
    );

    // 性别统计
    const genderStats = validData.reduce<{ [key: string]: number }>(
      (acc, item) => {
        acc[item.病人性别!] = (acc[item.病人性别!] || 0) + 1;
        return acc;
      },
      { 男: 0, 女: 0 }
    );

    // 年龄分组
    const ageMin = Math.min(...validData.map(item => item.病人年龄!));
    const ageMax = Math.max(...validData.map(item => item.病人年龄!));
    const ageGroups = Array.from({ length: 5 }, (_, i) => {
      const start = i * 20;
      const end = (i + 1) * 20 - 1;
      return {
        label: `${start}-${end}岁`,
        start,
        end,
        count: 0
      };
    }).map(group => {
      if (group.end >= ageMax) group.end = ageMax;
      return group;
    });

    validData.forEach(item => {
      const group = ageGroups.find(g => g.start <= item.病人年龄! && item.病人年龄! <= g.end);
      if (group) group.count++;
    });

    // 病症统计
    const diagnosisStats = Object.keys(DIAGNOSIS_MAP).reduce<{ [key: string]: number }>((acc, key) => {
      acc[key] = validData.filter(item => item[key as keyof EyeData] === 1).length;
      return acc;
    }, {} as { [key: string]: number });

    return {
      genderStats,
      ageGroups,
      diagnosisStats,
      totalCount: validData.length,
      averageAge: Math.round(validData.reduce((sum, item) => sum + (item.病人年龄 || 0), 0) / validData.length)
    };
  };

  const initCharts = () => {
    try {
      const { genderStats, ageGroups, diagnosisStats } = processData(dataRef.current);

      // 性别分布图表 - 蓝色(男)和淡红色(女)
      if (genderChartRef.current) {
        const genderChart = echarts.init(genderChartRef.current);
        genderChart.setOption({
          title: { text: '性别分布', left: 'center' },
          tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
          series: [{
            name: '性别',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
              { value: genderStats['男'], name: '男' },
              { value: genderStats['女'], name: '女' }
            ],
            itemStyle: {
              color: (params: any) => {
                // 蓝色(男)和淡红色(女)
                const colors = ['#1E90FF', '#CD5C5C'];
                return colors[params.dataIndex];
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        });
      }

      // 年龄分布图表 - 黄紫相间
      if (ageChartRef.current) {
        const ageChart = echarts.init(ageChartRef.current);
        ageChart.setOption({
          title: { text: '年龄分布', left: 'center' },
          tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
          grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis: {
            type: 'category',
            data: ageGroups.map(g => g.label),
            axisTick: { alignWithLabel: true }
          },
          yAxis: { type: 'value' },
          series: [{
            name: '人数',
            type: 'bar',
            data: ageGroups.map(g => g.count),
            label: { show: true, position: 'top' },
            itemStyle: {
              color: (params: any) => {
                // 黄紫相间的颜色
                return YELLOW_PURPLE_COLORS[params.dataIndex % YELLOW_PURPLE_COLORS.length];
              }
            }
          }]
        });
      }

      // 病症分布图表
      if (diagnosisChartRef.current) {
        const diagnosisChart = echarts.init(diagnosisChartRef.current);
        const diagnosisData = Object.entries(diagnosisStats).map(([key, value]) => ({
          value,
          name: DIAGNOSIS_MAP[key as keyof typeof DIAGNOSIS_MAP].label,
          itemStyle: { color: DIAGNOSIS_MAP[key as keyof typeof DIAGNOSIS_MAP].color }
        }));

        diagnosisChart.setOption({
          title: { text: '病症分布', left: 'center' },
          tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
          series: [{
            name: '病症',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '50%'],
            data: diagnosisData,
            roseType: 'radius',
            label: { formatter: '{b}: {d}%' },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }]
        });
      }
    } catch (err: any) {
      setError('图表渲染失败: ' + err.message);
      console.error('图表初始化错误:', err);
    }
  };

  useEffect(() => {
    initData();

    const handleResize = () => {
      if (!loading && !error) {
        [genderChartRef, ageChartRef, diagnosisChartRef].forEach(ref => {
          if (ref.current) {
            const chart = echarts.getInstanceByDom(ref.current);
            chart?.resize();
          }
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">正在加载数据...</p>
      </div>
    );
  }

  if (error) {
    const { genderStats, ageGroups, diagnosisStats, totalCount, averageAge } = processData(dataRef.current);

    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-red-200">
          <div className="text-red-500 mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">数据加载失败</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            请检查文件路径是否正确或文件格式是否有效
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={initData}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              重试加载
            </button>
            <button
              onClick={() => {
                // 这里可以添加下载示例文件的逻辑
                console.log('下载示例文件');
              }}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
              下载示例文件
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { totalCount, averageAge } = processData(dataRef.current);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">眼科诊断数据统计</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <FontAwesomeIcon icon={faUser} className="text-blue-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">总样本量</p>
              <p className="text-2xl font-bold text-gray-800">{totalCount} 条</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <FontAwesomeIcon icon={faVenusMars} className="text-green-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">平均年龄</p>
              <p className="text-2xl font-bold text-gray-800">{averageAge} 岁</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <FontAwesomeIcon icon={faStethoscope} className="text-purple-500" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">病症种类</p>
              <p className="text-2xl font-bold text-gray-800">{Object.keys(DIAGNOSIS_MAP).length} 种</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faVenusMars} className="mr-2 text-green-500" />
            性别分布
          </h3>
          <div ref={genderChartRef} className="w-full h-[350px]"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faUsers} className="mr-2 text-blue-500" />
            年龄分布
          </h3>
          <div ref={ageChartRef} className="w-full h-[350px]"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <FontAwesomeIcon icon={faStethoscope} className="mr-2 text-purple-500" />
          病症分布
        </h3>
        <div ref={diagnosisChartRef} className="w-full h-[400px]"></div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">病症代码说明</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(DIAGNOSIS_MAP).map(([code, { label, color }]) => (
            <div key={code} className="flex items-center">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }}></span>
              <span className="text-gray-700">{code}: {label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticalAnalysis;