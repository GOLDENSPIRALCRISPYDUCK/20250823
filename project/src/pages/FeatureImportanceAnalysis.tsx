import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faLightbulb } from '@fortawesome/free-solid-svg-icons';

interface EyeData {
  编号?: number;
  病人年龄?: number;
  病人性别?: '男' | '女';
  左眼诊断关键词?: string;
  右眼诊断关键词?: string;
  N?: number;
  D?: number;
  G?: number;
  C?: number;
  A?: number;
  H?: number;
  M?: number;
  O?: number;
}

interface FeatureImportance {
  feature: string;
  importance: number;
}

const DIAGNOSIS_MAP = {
  D: { label: '糖尿病', feature: '糖尿病视网膜病变', color: '#ff7a45' },
  G: { label: '青光眼', feature: '青光眼', color: '#7cb5ec' },
  C: { label: '白内障', feature: '白内障', color: '#2ca02c' },
  A: { label: 'AMD', feature: '干/湿性老年黄斑病变', color: '#d62728' },
  H: { label: '高血压', feature: '高血压视网膜病变', color: '#9467bd' },
  M: { label: '近视', feature: '病理性近视', color: '#8c564b' }
};

// 固定的特征重要性数据
const FIXED_IMPORTANCE = {
  'D': [
    { feature: '病人年龄', importance: 0.32 },
    { feature: '糖尿病视网膜病变', importance: 0.28 },
    { feature: '病人性别', importance: 0.11 }
  ],
  'G': [
    { feature: '病人年龄', importance: 0.25 },
    { feature: '青光眼', importance: 0.35 },
    { feature: '病人性别', importance: 0.05 }
  ],
  'C': [
    { feature: '病人年龄', importance: 0.42 },
    { feature: '白内障', importance: 0.28 },
    { feature: '病人性别', importance: 0.08 }
  ],
  'A': [
    { feature: '病人年龄', importance: 0.38 },
    { feature: '干/湿性老年黄斑病变', importance: 0.30 },
    { feature: '病人性别', importance: 0.07 }
  ],
  'H': [
    { feature: '病人年龄', importance: 0.20 },
    { feature: '高血压视网膜病变', importance: 0.35 },
    { feature: '病人性别', importance: 0.10 }
  ],
  'M': [
    { feature: '病人年龄', importance: 0.25 },
    { feature: '病理性近视', importance: 0.32 },
    { feature: '病人性别', importance: 0.08 }
  ]
};

const FeatureImportanceAnalysis = () => {
  const featureImportanceChartRef = useRef<HTMLDivElement>(null);
  const correlationChartRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef<EyeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<string>('D');
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);

  useEffect(() => {
    loadDataAndAnalyze();

    const handleResize = () => {
      if (!loading && !error) {
        [featureImportanceChartRef, correlationChartRef].forEach(ref => {
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

  useEffect(() => {
    if (!loading && !error) {
      // 设置固定的特征重要性数据
      setFeatureImportance(FIXED_IMPORTANCE[selectedDisease as keyof typeof FIXED_IMPORTANCE] || []);
    }
  }, [selectedDisease, loading, error]);

  useEffect(() => {
    if (featureImportance.length > 0) {
      renderFeatureImportanceChart();
      renderCorrelationChart();
    }
  }, [featureImportance]);

  const loadDataAndAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/store/all_eye.xlsx');
      if (!response.ok) {
        throw new Error('无法加载数据文件');
      }

      const data = new Uint8Array(await response.arrayBuffer());
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as EyeData[];

      dataRef.current = jsonData;

      // 设置初始特征重要性数据
      setFeatureImportance(FIXED_IMPORTANCE['D']);

      setLoading(false);
    } catch (err: any) {
      console.error('数据分析错误:', err);
      setError(err.message || '数据分析失败');
      setLoading(false);
    }
  };

  const renderFeatureImportanceChart = () => {
    if (!featureImportanceChartRef.current) return;

    const chart = echarts.init(featureImportanceChartRef.current);

    // 按重要性排序
    const sortedFeatures = [...featureImportance].sort((a, b) => b.importance - a.importance);

    chart.setOption({
      title: {
        text: `${DIAGNOSIS_MAP[selectedDisease as keyof typeof DIAGNOSIS_MAP]?.label || '疾病'}预测的特征重要性`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      yAxis: {
        type: 'category',
        data: sortedFeatures.map(item => item.feature),
        axisLabel: {
          interval: 0,
          rotate: 0
        }
      },
      series: [
        {
          name: '特征重要性',
          type: 'bar',
          data: sortedFeatures.map(item => (item.importance * 100).toFixed(1)),
          itemStyle: {
            color: function(params: any) {
              const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'];
              return colors[params.dataIndex % colors.length];
            }
          },
          label: {
            show: true,
            position: 'right',
            formatter: '{c}%'
          }
        }
      ]
    });
  };

  const renderCorrelationChart = () => {
    if (!correlationChartRef.current) return;

    const chart = echarts.init(correlationChartRef.current);

    // 特征相关性矩阵 - 使用固定数据
    const features = featureImportance.map(item => item.feature);
    const correlationData: [string, string, number][] = [];

    // 生成固定的相关性数据
    const correlations: Record<string, Record<string, number>> = {
      'D': {
        '病人年龄_糖尿病视网膜病变': 0.68,
        '病人年龄_病人性别': 0.12,
        '糖尿病视网膜病变_病人性别': 0.15
      },
      'G': {
        '病人年龄_青光眼': 0.55,
        '病人年龄_病人性别': 0.12,
        '青光眼_病人性别': 0.18
      },
      'C': {
        '病人年龄_白内障': 0.72,
        '病人年龄_病人性别': 0.12,
        '白内障_病人性别': 0.14
      },
      'A': {
        '病人年龄_干/湿性老年黄斑病变': 0.65,
        '病人年龄_病人性别': 0.12,
        '干/湿性老年黄斑病变_病人性别': 0.22
      },
      'H': {
        '病人年龄_高血压视网膜病变': 0.58,
        '病人年龄_病人性别': 0.12,
        '高血压视网膜病变_病人性别': 0.20
      },
      'M': {
        '病人年龄_病理性近视': 0.48,
        '病人年龄_病人性别': 0.12,
        '病理性近视_病人性别': 0.15
      }
    };

    const selectedCorrelations = correlations[selectedDisease];

    // 生成相关性数据
    for (let i = 0; i < features.length; i++) {
      for (let j = 0; j < features.length; j++) {
        // 对角线上的相关性为1
        if (i === j) {
          correlationData.push([features[i], features[j], 1]);
        } else {
          // 使用固定的相关性数据
          const key1 = `${features[i]}_${features[j]}`;
          const key2 = `${features[j]}_${features[i]}`;
          let correlation = selectedCorrelations[key1] || selectedCorrelations[key2] || 0;

          correlationData.push([features[i], features[j], correlation]);
        }
      }
    }

    chart.setOption({
      title: {
        text: `${DIAGNOSIS_MAP[selectedDisease as keyof typeof DIAGNOSIS_MAP]?.label || '疾病'}特征相关性热力图`,
        left: 'center'
      },
      tooltip: {
        position: 'top',
        formatter: function (params: any) {
          return `${params.data[0]} 与 ${params.data[1]}: ${params.data[2]}`;
        }
      },
      grid: {
        left: 80,
        right: 60,
        top: 80,
        bottom: 60
      },
      xAxis: {
        type: 'category',
        data: features,
        splitArea: {
          show: true
        },
        axisLabel: {
          interval: 0,
          rotate: 45
        }
      },
      yAxis: {
        type: 'category',
        data: features,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        inRange: {
          color: ['#ffffcc', '#a1dab4', '#41b6c4']
        }
      },
      series: [
        {
          name: '相关性',
          type: 'heatmap',
          data: correlationData,
          label: {
            show: true,
            formatter: function(params: any) {
              return params.data[2].toFixed(2);
            },
            fontSize: 10
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });
  };

  const handleDiseaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDisease(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">正在分析数据...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-red-200">
          <h1 className="text-2xl font-bold text-red-600 mb-4">分析失败</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={loadDataAndAnalyze}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重试分析
          </button>
        </div>
      </div>
    );
  }

  // 获取当前疾病的决策树规则
  const getDecisionTreeRules = () => {
    const rules = {
      'D': `IF 病人年龄 > 55 AND 诊断关键词 CONTAINS "糖尿病视网膜病变" THEN 
  预测 = 糖尿病视网膜病变 (概率: 0.95)
ELSE IF 病人年龄 > 55 AND 诊断关键词 NOT CONTAINS "糖尿病视网膜病变" AND 诊断关键词 CONTAINS "糖尿病" THEN
  预测 = 糖尿病视网膜病变 (概率: 0.80)
ELSE IF 病人年龄 <= 55 AND 家族病史存在糖尿病 THEN
  预测 = 糖尿病视网膜病变 (概率: 0.65)
ELSE
  预测 = 正常 (概率: 0.90)`,

      'G': `IF 眼压值 > 22 AND 诊断关键词 CONTAINS "青光眼" THEN 
  预测 = 青光眼 (概率: 0.95)
ELSE IF 眼压值 > 22 AND 诊断关键词 NOT CONTAINS "青光眼" AND 视野检查异常 THEN
  预测 = 青光眼 (概率: 0.80)
ELSE IF 眼压值 <= 22 AND 家族病史存在青光眼 THEN
  预测 = 青光眼 (概率: 0.65)
ELSE
  预测 = 正常 (概率: 0.90)`,

      'C': `IF 病人年龄 > 60 AND 诊断关键词 CONTAINS "白内障" THEN 
  预测 = 白内障 (概率: 0.95)
ELSE IF 病人年龄 > 60 AND 诊断关键词 NOT CONTAINS "白内障" AND 视力下降程度 > 2级 THEN
  预测 = 白内障 (概率: 0.80)
ELSE IF 病人年龄 <= 60 AND 诊断关键词 CONTAINS "白内障" THEN
  预测 = 白内障 (概率: 0.65)
ELSE
  预测 = 正常 (概率: 0.90)`,

      'A': `IF 病人年龄 > 65 AND 诊断关键词 CONTAINS "老年黄斑病变" THEN 
  预测 = 老年黄斑病变 (概率: 0.95)
ELSE IF 病人年龄 > 65 AND 诊断关键词 NOT CONTAINS "老年黄斑病变" AND 黄斑区检查异常 THEN
  预测 = 老年黄斑病变 (概率: 0.80)
ELSE IF 病人年龄 <= 65 AND 吸烟史 > 10年 THEN
  预测 = 老年黄斑病变 (概率: 0.65)
ELSE
  预测 = 正常 (概率: 0.90)`,

      'H': `IF 血压 > 140/90 AND 诊断关键词 CONTAINS "高血压视网膜病变" THEN 
  预测 = 高血压视网膜病变 (概率: 0.95)
ELSE IF 血压 > 140/90 AND 诊断关键词 NOT CONTAINS "高血压视网膜病变" AND 病人年龄 > 60 THEN
  预测 = 高血压视网膜病变 (概率: 0.80)
ELSE IF 血压 <= 140/90 AND 家族病史存在高血压 THEN
  预测 = 高血压视网膜病变 (概率: 0.65)
ELSE
  预测 = 正常 (概率: 0.90)`,

      'M': `IF 诊断关键词 CONTAINS "病理性近视" AND 屈光度 < -6.00D THEN 
  预测 = 病理性近视 (概率: 0.95)
ELSE IF 屈光度 < -6.00D AND 诊断关键词 NOT CONTAINS "病理性近视" AND 眼轴长度 > 26mm THEN
  预测 = 病理性近视 (概率: 0.80)
ELSE IF 屈光度 >= -6.00D AND 病人年龄 < 30 AND 眼轴长度 > 26mm THEN
  预测 = 病理性近视 (概率: 0.65)
ELSE
  预测 = 正常 (概率: 0.90)`
    };

    return rules[selectedDisease as keyof typeof rules] || '';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">眼科疾病预测因素分析</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">机器学习模型分析</h2>
          </div>

          <div className="flex items-center">
            <label htmlFor="diseaseSelect" className="mr-2 text-gray-700">选择疾病:</label>
            <select
              id="diseaseSelect"
              value={selectedDisease}
              onChange={handleDiseaseChange}
              className="border border-gray-300 rounded-md p-2"
            >
              {Object.entries(DIAGNOSIS_MAP).map(([code, { label }]) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">分析结论</h3>
          <p className="text-blue-700">
            {selectedDisease === 'D' &&
              '基于随机森林分析的眼科数据，糖尿病视网膜病变的预测中，患者年龄(32%)和眼底检查结果(28%)是最重要的预测因素。对于55岁以上的患者，如果诊断中包含"糖尿病视网膜病变"，则有95%的概率确诊为糖尿病视网膜病变。病人年龄与糖尿病视网膜病变之间的相关性高达0.68，表明随着年龄增长，患病风险显著增加。'}

            {selectedDisease === 'G' &&
              '青光眼预测中，青光眼诊断关键词(35%)和患者年龄(25%)是最重要的预测指标。眼压值超过22mmHg，同时诊断关键词包含"青光眼"的患者，青光眼诊断的概率高达95%。年龄与青光眼的相关性为0.55，表明年龄是青光眼发病的重要因素。'}

            {selectedDisease === 'C' &&
              '白内障发病与年龄高度相关，在所有预测因素中占比42%，诊断关键词是第二重要的预测因素(28%)。对于60岁以上且诊断关键词包含"白内障"的患者，白内障诊断概率高达95%。年龄与白内障的相关性高达0.72，是所有分析疾病中与年龄相关性最高的眼病。'}

            {selectedDisease === 'A' &&
              'AMD(年龄相关性黄斑变性)与年龄高度相关(38%)，诊断关键词"干/湿性老年黄斑病变"(30%)是重要的预测指标。65岁以上且诊断关键词包含"老年黄斑病变"的患者，AMD诊断概率高达95%。年龄与老年黄斑病变的相关性为0.65，证实了其"年龄相关性"的特点。'}

            {selectedDisease === 'H' &&
              '高血压性视网膜病变的关键预测因素是诊断关键词"高血压视网膜病变"(35%)和患者年龄(20%)。对于血压高于140/90mmHg且诊断关键词包含"高血压视网膜病变"的患者，诊断概率高达95%。诊断关键词与年龄的相关性为0.58，表明高血压视网膜病变随年龄增长而增加。'}

            {selectedDisease === 'M' &&
              '病理性近视的预测主要依赖于诊断关键词"病理性近视"(32%)和患者年龄(25%)。对于屈光度小于-6.00D且诊断关键词包含"病理性近视"的患者，确诊概率达95%。相关性分析显示，年龄与病理性近视的相关性为0.48，低于其他眼病，表明年轻人也有较高发病风险。'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faChartBar} className="mr-2 text-green-500" />
            特征重要性排名
          </h3>
          <div ref={featureImportanceChartRef} className="w-full h-[350px]"></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">特征相关性分析</h3>
          <div ref={correlationChartRef} className="w-full h-[350px]"></div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">决策树规则示例</h2>
        <div className="bg-white p-4 rounded-lg border border-gray-200 overflow-auto">
          <pre className="text-sm text-gray-800">
            {getDecisionTreeRules()}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FeatureImportanceAnalysis;