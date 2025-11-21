import { useStockStore } from '../stores/stockStore';

const chapters = [
    {
        title: '📖 第1章:後稀缺時代的黎明',
        content: [
            {
                subtitle: '導論:經濟新曙光',
                text: '數百年來,經濟學的核心問題一直圍繞著「稀缺性」——如何在有限資源與無限需求之間做出選擇。',
            },
            {
                subtitle: '',
                text: '然而,隨著 AI 和自動化技術的突破,我們正站在後稀缺時代的門檻上。當機器能夠完成大部分人類勞動時,經濟的根本邏輯將發生轉變。',
            },
        ],
    },
    {
        title: '📖 第2章:能源・材料・計算——新的三大稀缺',
        content: [
            {
                subtitle: '從勞動到資源',
                text: '在後稀缺框架下,限制經濟增長的不再是人力,而是能源、材料與計算三者的耦合瓶頸。',
            },
            {
                subtitle: '',
                text: 'AI 和機器人可以無限複製勞動,但物理定律限制了能量轉換效率、材料稀缺性,以及計算能力的上限。這三者將成為新經濟的基石。',
            },
        ],
    },
    {
        title: '📖 第3章:分配、所有權與激勵',
        content: [
            {
                subtitle: '重新思考經濟制度',
                text: '當可複製的智能使勞動不再稀缺,經濟的瓶頸轉向能源、材料與計算。',
            },
            {
                subtitle: '',
                text: '在這個新世界中,如何分配資源?如何定義所有權?如何維持人類的創新激勵?這些問題需要全新的經濟理論和社會制度。',
            },
        ],
    },
];

export function LearnView() {
    const { chapterIndex, setChapterIndex } = useStockStore();

    const currentChapter = chapters[chapterIndex];

    const handleNext = () => {
        setChapterIndex((chapterIndex + 1) % chapters.length);
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
            <button
                onClick={handleNext}
                style={{
                    padding: '0.75rem 1.5rem',
                    marginBottom: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #667eea',
                    backgroundColor: '#2d3561',
                    color: '#f0f0f0',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3d4571';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2d3561';
                }}
            >
                Next Chapter →
            </button>

            <div
                style={{
                    backgroundColor: '#1a1a2e',
                    padding: '2rem',
                    borderRadius: '12px',
                    minHeight: '500px',
                }}
            >
                <h2
                    style={{
                        margin: '0 0 2rem 0',
                        color: '#f0f0f0',
                        fontSize: '1.8rem',
                        borderBottom: '2px solid #667eea',
                        paddingBottom: '1rem',
                    }}
                >
                    {currentChapter.title}
                </h2>

                {currentChapter.content.map((section, index) => (
                    <div key={index} style={{ marginBottom: '2rem' }}>
                        {section.subtitle && (
                            <h3
                                style={{
                                    margin: '0 0 1rem 0',
                                    color: '#a0aec0',
                                    fontSize: '1.3rem',
                                    fontWeight: '600',
                                }}
                            >
                                {section.subtitle}
                            </h3>
                        )}
                        <p
                            style={{
                                margin: '0',
                                color: '#d0d0d0',
                                fontSize: '1.1rem',
                                lineHeight: '1.8',
                            }}
                        >
                            {section.text}
                        </p>
                    </div>
                ))}

                {/* Chapter indicator */}
                <div
                    style={{
                        marginTop: '3rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #2d3561',
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center',
                    }}
                >
                    {chapters.map((_, index) => (
                        <div
                            key={index}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: index === chapterIndex ? '#667eea' : '#2d3561',
                                transition: 'all 0.3s',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
