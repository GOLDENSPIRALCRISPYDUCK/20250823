import React, {useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsItems } from './Introduction';

// 第一篇新闻详情（完整内容）
const firstNewsDetail = {
    title: "全球眼底疾病报告：当AI成为光明的守护者，千万视力如何被拯救？",
    content: [
        {
            type: 'section',
            title: '一、触目惊心的数据：你的眼睛正在"求救"',
            content: [
                '"眼睛是心灵的窗户"，但全球约25亿人正因视力问题而蒙上阴霾。2024年《五百万体检人群健康蓝皮书》揭露：',
                {
                    type: 'list',
                    items: [
                        '77.4%的受检者存在眼底异常，40岁以上人群异常率超90%',
                        '1.1%的体检者面临致盲风险，糖尿病视网膜病变、青光眼等"无声杀手"悄然蔓延',
                        '更惊人的是，30%的眼疾患者因延误治疗而永久失明'
                    ]
                },
                '正如希波克拉底所言："预防胜于治疗"，而AI技术的崛起，正让这句古训照进现实。'
            ]
        },
        {
            type: 'image',
            src: '/pictures/1.jpg'
        },
        {
            type: 'section',
            title: '二、AI之眼：从"看不见"到"早发现"的科技革命',
            content: [
                {
                    type: 'subsection',
                    title: '1. 筛查效率飞跃：30分钟→30秒',
                    content: '传统眼底检查依赖专业设备和医生经验，耗时且成本高。如今，AI系统通过分析眼底照片，30秒内即可识别糖尿病视网膜病变、黄斑变性等疾病，准确率超95%。例如，i-ROP系统对早产儿视网膜病变的检测准确率达100%，每年为5万婴儿抢回光明。'
                },
                {
                    type: 'subsection',
                    title: '2. 拯救"无症状患者"：一张照片改写命运',
                    content: '北京张女士在体检中通过AI筛查发现无症状视网膜脱离，及时手术避免失明。类似案例在2024年累计发现2.3万例重大阳性，AI成为"无症状危机"的第一道防线。'
                },
                {
                    type: 'subsection',
                    title: '3. 从筛查到预测：AI的"跨界"洞察',
                    content: 'AI不仅能看眼病，还能通过视网膜血管评估心脑血管疾病、老年痴呆风险。例如，40岁后心脑血管风险骤增，AI预警助力早干预。正如达芬奇所说："观察是一切智慧的源泉"，AI正将观察升华为生命的预言。'
                }
            ]
        },
        {
            type: 'section',
            title: '三、全球行动：科技普惠如何照亮"黑暗角落"？',
            content: [
                {
                    type: 'subsection',
                    title: '1. 基层医疗的"破局者"',
                    content: '中国仅6万名眼科医生，却需应对超7亿屈光不正患者。AI技术下沉至社区医院和体检中心，让偏远地区患者也能享受精准筛查，如平安健康与致远慧图的合作已惠及超500万人次。'
                },
                {
                    type: 'subsection',
                    title: '2. 国际协作：技术无国界',
                    content: '美国NIH开发的P-GAN系统将视网膜成像速度提升100倍，助力全球黄斑变性早期诊断；奥比斯国际组织将AI筛查技术推广至低收入国家，填补医疗资源鸿沟。'
                },
                {
                    type: 'subsection',
                    title: '3. 未来已来：从"治已病"到"防未病"',
                    content: '2024年，基因编辑疗法CRISPR成功治疗遗传性失明，AI驱动的个性化矫正方案让近视防控更精准。科技正编织一张从预防到治疗的全周期护眼网。'
                }
            ]
        },
        {
            type: 'section',
            title: '四、你的行动：守护光明，从今天开始',
            content: [
                '"明眸善睐"不应是奢侈品。专家建议：',
                {
                    type: 'list',
                    items: [
                        '20岁以上：每2年一次眼底检查',
                        '40岁以上：每年一次筛查，同步关注心脑健康',
                        '高度近视、糖尿病患者：每半年一次AI评估'
                    ]
                },
                '"眼底一张照，健康早知道"——这不仅是一句口号，更是AI时代对生命的温柔承诺。'
            ]
        },
        {
            type: 'section',
            title: '结语',
            content: [
                '"黑夜给了我黑色的眼睛，我却用它寻找光明。"AI技术的星光，正照亮千万人的视界。愿每一双眼睛，都能在科技的守护下，见证更清晰的世界。 🌟👁️',
                {
                    type: 'source',
                    content: '数据来源：2024年《五百万体检人群健康蓝皮书》、全球眼科医疗技术突破报告等'
                }
            ]
        }
    ],
    date: "2025-05-21",
    time: "16:09:20"
};

// 第二篇新闻详情（完整内容）
const secondNewsDetail = {
    title: "AI眼底疾病诊断领域应用前景“光明”",
    content: [
        {
            type: 'section',
            title: '一、眼底：人体健康的“晴雨表”',
            content: [
                '"眼睛是心灵的窗户，更是健康的镜子。"人类80%的外界信息通过眼睛获取，而眼底作为眼球内的“精密地图”，布满血管与神经。全球眼科数据显示：',
                {
                    type: 'list',
                    items: [
                        '全球约17亿人受眼科疾病困扰',
                        '中国眼底疾病患者超4亿，且每年新增超1000万例',
                        '60%的糖尿病患者未定期检查眼底，导致失明风险增加25倍'
                    ]
                },
                '常见的黄斑变性、糖尿病视网膜病变、青光眼等，初期往往无症状，却可能悄然夺走视力。'
            ]
        },
        {
            type: 'image',
            src: '/pictures/2.jpg'
        },
        {
            type: 'section',
            title: '二、AI破局：从“人工”到“智能”的诊断革命',
            content: [
                {
                    type: 'subsection',
                    title: '1. 五年跨越：从首款软件到全病种覆盖',
                    content: [
                        '近年来，我国企业积极投入AI医学影像软件在眼底疾病领域应用的研究，应用于眼底疾病的人工智能（AI）医学影像软件的研究和产品主要集中在糖尿病视网膜病变和青光眼方面。',
                        {
                            type: 'list',
                            items: [
                                '截至2024年6月，已有多款三类医疗器械上市的AI医学影像软件可检测糖尿病视网膜病变',
                                '鹰瞳科技的Airdco-AIFUNDUS产品于2020年8月上市，是国内第一家荣获NMPA眼科人工智能三类辅助诊断医疗器械注册的企业，拉开了我国眼科疾病领域智能化医疗技术应用的序幕'
                            ]
                        },
                        '随着技术迭代，AI从单病种检测发展至多病种联合诊断，覆盖糖尿病视网膜病变、青光眼、黄斑变性等常见致盲性眼病。'
                    ]
                },
                {
                    type: 'subsection',
                    title: '2. 双病攻坚：AI在糖网与青光眼的“精准狙击”',
                    content: [
                        '糖尿病视网膜病变是糖尿病全身小血管病变在视网膜上的体现，长期高血糖导致血管损伤，引发视网膜出血、渗出、肿胀，严重时致盲。其分为非增殖性与增殖性，早期无症状易漏诊。',
                        'AI通过深度学习神经网络模型，精准定位出血点、黄斑水肿、微动脉瘤等病灶，辅助医生对病程分级，并提供预后建议。北京协和医院数据显示，AI使DR分级准确率从72%提升至95%。',
                        {
                            type: 'list',
                            items: [
                                '检测精度：可识别0.1mm级微动脉瘤',
                                '效率提升：单张图像分析耗时<1秒，较人工阅片提速90%'
                            ]
                        },
                        '青光眼发病与眼内压、近视、高血压等相关，眼底照相是基层筛查核心手段。AI结合眼底图像分析：',
                        {
                            type: 'list',
                            items: [
                                '① 结构分析：自动计算杯盘比，检测神经纤维层缺损',
                                '② 功能预测：通过视野数据建模，提前3年预警发病风险',
                                '③ 基层应用：使青光眼筛查阳性率提升3倍，漏诊率下降65%'
                            ]
                        }
                    ]
                }
            ]
        },
        {
            type: 'section',
            title: '三、技术跃迁：从“眼科”到“全身”的健康洞察',
            content: [
                {
                    type: 'subsection',
                    title: '1. 多病种突破：从7种到55种疾病的跨越',
                    content: [
                        'AI技术从单一眼科疾病拓展至多系统健康评估：',
                        {
                            type: 'list',
                            items: [
                                '眼底疾病：覆盖糖尿病视网膜病变、青光眼、黄斑变性等14种',
                                '全身疾病：识别高血压、糖尿病、阿尔茨海默病等41种风险',
                                '中山大学研发的AI系统可同步筛查糖尿病+青光眼，准确率超92%'
                            ]
                        },
                        '鹰瞳科技AI系统已实现55种疾病诊断，包括慢性肾病、心血管风险等跨界领域。'
                    ]
                },
                {
                    type: 'subsection',
                    title: '2. 跨界创新：眼底图像里的“生命密码”',
                    content: [
                        '视网膜作为脑部神经延伸，其血管变化可反映全身健康：',
                        {
                            type: 'list',
                            items: [
                                '心血管疾病：AI对冠心病预测准确率达83%（基于视网膜血管密度分析）',
                                '神经系统疾病：阿尔茨海默病患者视网膜神经纤维层厚度年减1.2μm，AI可提前5年预警',
                                '血液系统疾病：通过视网膜血管形态筛查贫血、白血病，特异性达89%'
                            ]
                        },
                        '北京大学联合鹰瞳科技开发的AI模型，经万人验证，对阿尔茨海默病高危人群识别准确率达87%。'
                    ]
                }
            ]
        },
        {
            type: 'section',
            title: '四、未来图景：AI如何重构医疗生态？',
            content: [
                {
                    type: 'subsection',
                    title: '1. 基层医疗的“新基建”',
                    content: [
                        '中国60%眼科医生集中在三甲医院，AI推动基层筛查能力跃升：',
                        {
                            type: 'list',
                            items: [
                                '平安健康AI系统覆盖2800家基层机构，筛查超1200万人次',
                                '基层漏诊率从45%降至18%，医疗成本节约超3亿元',
                                '远程诊断模式：基层拍照→云端AI分析→10分钟内返回报告'
                            ]
                        },
                        'AI同步承担基层医生培训功能，通过10万+临床案例分析，助力提升诊断技能。'
                    ]
                },
                {
                    type: 'subsection',
                    title: '2. 全周期管理：从“治已病”到“防未病”',
                    content: [
                        'AI生成“眼底健康年龄”，25岁以上人群平均老化3.2岁，提示早期干预必要性。',
                        {
                            type: 'list',
                            items: [
                                '近视防控：基因+影像分析预测近视进展，提前介入成功率提升70%',
                                '老年健康：AI年度筛查可使青光眼早期检出率提升4倍',
                                '个性化方案：结合生活习惯、遗传数据，生成饮食/运动/随访建议'
                            ]
                        },
                        '全周期管理模式：从儿童屈光发育监测到老年慢性病预警，覆盖生命全阶段。'
                    ]
                }
            ]
        },
        {
            type: 'section',
            title: '五、专家建议：如何拥抱AI眼底健康管理？',
            content: [
                '中华医学会眼科分会《AI眼底筛查临床指南》核心建议：',
                {
                    type: 'list',
                    items: [
                        '健康人群：25岁起每3年一次AI眼底筛查（含全身风险评估）',
                        '糖尿病/高血压患者：每6个月一次眼底AI检测+心血管风险预警',
                        '高度近视/家族眼病史：每年一次视网膜AI断层扫描',
                        '建议将AI眼底筛查纳入常规体检套餐，医保覆盖基层筛查项目'
                    ]
                },
                '专家警示："60%的糖尿病视网膜病变患者因未定期筛查致盲，AI是防控关键防线。"——李明教授'
            ]
        },
        {
            type: 'section',
            title: '结语',
            content: [
                'AI以科技之眼透视健康密码，让眼底筛查从“奢侈品”变为“健康刚需”。从单病诊断到全身守护，AI正在构建“预防-筛查-诊断-管理”全链条生态，让每个人都能拥有清晰视界，拥抱健康未来。',
                {
                    type: 'source',
                    content: '内容采编自中国医药报、世界卫生组织《2024全球眼健康报告》、国家卫健委AI医疗临床数据'
                }
            ]
        }
    ],
    date: "2025-06-05",
    time: "09:30:00"
};

// 修复后的渲染内容函数
const renderContent = (content) => {
    // 处理字符串内容
    if (typeof content === 'string') {
        return <p className="mb-4 leading-relaxed text-gray-700">{content}</p>;
    }

    // 处理列表内容
    if (content.type === 'list') {
        return (
            <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
                {content.items.map((item, index) => (
                    <li key={index} className="leading-relaxed">{item}</li>
                ))}
            </ul>
        );
    }

    // 处理嵌套列表内容（多层级列表）
    if (content.type === 'nestedList') {
        return (
            <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
                {content.items.map((item, index) => (
                    <li key={index} className="leading-relaxed">
                        {typeof item === 'string' ? item : renderContent(item)}
                    </li>
                ))}
            </ul>
        );
    }

    // 处理章节内容
    if (content.type === 'section') {
        return (
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{content.title}</h2>
                {content.content.map((item, index) => (
                    <div key={index}>{renderContent(item)}</div>
                ))}
            </div>
        );
    }

    // 处理子章节内容
    if (content.type === 'subsection') {
        return (
            <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-700 mb-3">{content.title}</h3>
                {Array.isArray(content.content) ? (
                    content.content.map((item, index) => (
                        <div key={index}>{renderContent(item)}</div>
                    ))
                ) : (
                    renderContent(content.content)
                )}
            </div>
        );
    }

    // 处理图片内容
    if (content.type === 'image') {
        return (
            <div className="my-8">
                <img
                    src={content.src}
                    alt={content.alt}
                    className="w-full rounded-lg shadow-md object-cover"
                />
                <p className="text-center text-sm text-gray-500 mt-2">{content.alt}</p>
            </div>
        );
    }

    // 处理来源内容
    if (content.type === 'source') {
        return (
            <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500">
                {content.content}
            </div>
        );
    }

    // 未知类型的内容（添加日志以便调试）
    console.warn('Unsupported content type:', content);
    return null;
};


const NewsDetail = () => {
    const { id } = useParams();
    const newsItem = newsItems.find(item => item.id === id);

    // 添加滚动到顶部逻辑（保持不变）
    useEffect(() => {
        window.scrollTo({
        top: 0,
        behavior: 'smooth'
        });
        }, [id]);

    if (!newsItem) {
        return (
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">新闻未找到</h1>
                <p className="text-gray-600">您访问的新闻不存在或已被删除。</p>
                <Link to="/introduction" className="inline-block mt-4 text-blue-600 hover:text-blue-800">
                    返回新闻列表
                </Link>
            </div>
        );
    }

    let newsContent;
    switch (newsItem.id) {
        case 'global-eye-report':
            newsContent = firstNewsDetail;
            break;
        case 'ai-ophthalmic-diagnosis':
            newsContent = secondNewsDetail;
            break;
        default:
            newsContent = newsItem;
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl">
            <div className="mb-8">
                <Link to="/introduction" className="text-blue-600 hover:text-blue-800 mb-4 inline-block flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    返回新闻列表
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{newsContent.title}</h1>
                <div className="text-gray-500 mb-6">
                    {newsContent.date} {newsContent.time}
                </div>
                <div className="border-t border-gray-200 pt-4"></div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 border border-gray-100">
                <article className="prose max-w-none">
                    {Array.isArray(newsContent.content) ? (
                        newsContent.content.map((section, index) => (
                            <div key={index}>{renderContent(section)}</div>
                        ))
                    ) : (
                        <div dangerouslySetInnerHTML={{ __html: newsContent.content }} />
                    )}
                </article>
            </div>
        </div>
    );
};

export default NewsDetail;