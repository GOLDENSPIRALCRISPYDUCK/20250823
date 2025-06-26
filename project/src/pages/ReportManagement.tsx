import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faFileAlt, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

type ReportType = 'single' | 'batch';
type DiagnosisResult = 'normal' | 'abnormal';

interface Report {
    id: string;
    type: ReportType;
    date: string;
    title: string;
    imageCount: number;
    result: DiagnosisResult;
    details: {
        leftEye?: AnalysisDetail[];
        rightEye?: AnalysisDetail[];
    };
    diagnosis?: string[];
}

interface AnalysisDetail {
    imageUrl: string;
}

const ReportManagement: React.FC = () => {
    const [reports] = useState<Report[]>([
        {
            id: '2',
            type: 'single',
            date: '2025/06/01 10:15',
            title: '左右眼分析',
            imageCount: 2,
            result: 'abnormal',
            details: {
                leftEye: [
                    { imageUrl: 'store/2_left.jpg' }
                ],
                rightEye: [
                    { imageUrl: 'store/2_right.jpg' }
                ]
            },
            diagnosis: ['糖尿病', '高血压', '其他']
        },
        {
            id: '1',
            type: 'single',
            date: '2025/05/31 16:45',
            title: '左右眼分析',
            imageCount: 2,
            result: 'abnormal',
            details: {
                leftEye: [
                    { imageUrl: 'store/1_left.jpg' }
                ],
                rightEye: [
                    { imageUrl: 'store/1_right.jpg' }
                ]
            },
            diagnosis: ['青光眼', 'AMD']
        },
        {
            id: '0',
            type: 'single',
            date: '2025/05/30 14:30',
            title: '左右眼分析',
            imageCount: 2,
            result: 'normal',
            details: {
                leftEye: [
                    { imageUrl: 'store/0_left.jpg' }
                ],
                rightEye: [
                    { imageUrl: 'store/0_right.jpg' }
                ]
            }
        },
        {
            id: '3',
            type: 'batch',
            date: '2025/05/25 09:45',
            title: '批量眼底影像分析',
            imageCount: 100,
            result: 'abnormal',
            details: {
                leftEye: [
                    { imageUrl: 'store/0_left.jpg' },
                    { imageUrl: 'store/1_left.jpg' },
                    { imageUrl: 'store/2_left.jpg' },
                    { imageUrl: 'store/3_left.jpg' },
                    { imageUrl: 'store/4_left.jpg' },
                    { imageUrl: 'store/5_left.jpg' },
                    { imageUrl: 'store/6_left.jpg' },
                    { imageUrl: 'store/7_left.jpg' },
                    { imageUrl: 'store/8_left.jpg' },
                    { imageUrl: 'store/9_left.jpg' },
                ],
                rightEye: [
                    { imageUrl: 'store/0_right.jpg' },
                    { imageUrl: 'store/1_right.jpg' },
                    { imageUrl: 'store/2_right.jpg' },
                    { imageUrl: 'store/3_right.jpg' },
                    { imageUrl: 'store/4_right.jpg' },
                    { imageUrl: 'store/5_right.jpg' },
                    { imageUrl: 'store/6_right.jpg' },
                    { imageUrl: 'store/7_right.jpg' },
                    { imageUrl: 'store/8_right.jpg' },
                    { imageUrl: 'store/9_right.jpg' },
                ]
            }
        }
    ]);

    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [imageIndex, setImageIndex] = useState(0);

    const filteredReports = reports.filter(report =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.date.includes(searchQuery)
    );

    const getReportTypeText = (type: ReportType) => {
        return type === 'single' ? '单片分析' : '批量分析';
    };

    const getResultStyle = (result: DiagnosisResult) => {
        const styles = {
            normal: 'bg-green-100 text-green-800',
            abnormal: 'bg-red-100 text-red-800'
        };
        return styles[result];
    };

    const getResultText = (result: DiagnosisResult) => {
        const texts = {
            normal: '正常',
            abnormal: '异常'
        };
        return texts[result];
    };

    const openReport = (report: Report) => {
        if (report.type === 'batch') {
            window.open(`store/0-批量.pdf`, '_blank');
        } else {
            window.open(`store/${report.id}_report.pdf`, '_blank');
        }
    };

    const handlePrevImage = () => {
        if (imageIndex > 0) {
            setImageIndex(imageIndex - 1);
        }
    };

    const handleNextImage = () => {
        const imageCount = selectedReport?.details.leftEye?.length || 0;
        if (imageIndex < imageCount - 1) {
            setImageIndex(imageIndex + 1);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">报告管理</h1>
            <p className="text-gray-600 mb-6">查看历史诊断记录和生成的报告</p>

            {/* 搜索框 */}
            <div className="relative mb-6 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="搜索记录..."
                    className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* 报告列表 */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredReports.map((report) => (
                    <div key={report.id} className="p-6 border-b hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="mb-4 md:mb-0">
                                <div className="flex items-center">
                                    <span className="font-medium text-gray-900 mr-2">
                                        {getReportTypeText(report.type)}·{report.title}
                                    </span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getResultStyle(report.result)}`}>
                                        {getResultText(report.result)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">{report.date}</p>
                                {report.diagnosis && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        病症: {report.diagnosis.join('、')}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="text-sm">
                                    <span className="font-medium">图像数量:</span> {report.imageCount}
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            setSelectedReport(report);
                                            setImageIndex(0);
                                        }}
                                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        <FontAwesomeIcon icon={faEye} className="mr-1"/>
                                        查看详情
                                    </button>
                                    <button
                                        onClick={() => openReport(report)}
                                        className="flex items-center text-sm text-green-600 hover:text-green-800"
                                    >
                                        <FontAwesomeIcon icon={faFileAlt} className="mr-1"/>
                                        查看报告
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 报告详情模态框 */}
            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold">
                                    {getReportTypeText(selectedReport.type)}报告 - {selectedReport.title}
                                </h2>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="font-medium mb-2">基本信息</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="text-gray-500">分析日期:</span> {selectedReport.date}</p>
                                        <p><span className="text-gray-500">分析类型:</span> {getReportTypeText(selectedReport.type)}</p>
                                        <p><span className="text-gray-500">图像数量:</span> {selectedReport.imageCount}</p>
                                        <p>
                                            <span className="text-gray-500">诊断结果:</span>
                                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getResultStyle(selectedReport.result)}`}>
                                                {getResultText(selectedReport.result)}
                                            </span>
                                        </p>
                                        {selectedReport.diagnosis && (
                                            <p>
                                                <span className="text-gray-500">病症:</span>{' '}
                                                {selectedReport.diagnosis.join('、')}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">详细分析</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="border rounded-lg p-3">
                                            <h4 className="font-medium text-sm mb-2">左眼分析</h4>
                                            {selectedReport.details.leftEye && (
                                                <>
                                                    <img
                                                        src={selectedReport.details.leftEye[imageIndex].imageUrl}
                                                        alt="左眼图像"
                                                        className="w-full h-64 object-contain mb-2"
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <div className="border rounded-lg p-3">
                                            <h4 className="font-medium text-sm mb-2">右眼分析</h4>
                                            {selectedReport.details.rightEye && (
                                                <>
                                                    <img
                                                        src={selectedReport.details.rightEye[imageIndex].imageUrl}
                                                        alt="右眼图像"
                                                        className="w-full h-64 object-contain mb-2"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* 仅批量分析显示切换按钮 */}
                                    {selectedReport.type === 'batch' && (
                                        <div className="flex justify-center mt-4">
                                            <button
                                                onClick={handlePrevImage}
                                                className="px-4 py-2 mr-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                                disabled={imageIndex === 0}
                                            >
                                                <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                                                上一组
                                            </button>
                                            <button
                                                onClick={handleNextImage}
                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                                disabled={imageIndex === (selectedReport.details.leftEye?.length || 0) - 1}
                                            >
                                                下一组
                                                <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t">
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    关闭
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportManagement;