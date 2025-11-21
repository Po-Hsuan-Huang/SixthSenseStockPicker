import { useState } from 'react';
import { useStockStore } from '../stores/stockStore';
import chapter1Text from '../book_chapter/chapter1.txt?raw';
import chapter2Text from '../book_chapter/chapter2.txt?raw';
import chapter3Text from '../book_chapter/chapter3.txt?raw';

const chapterTexts = [chapter1Text, chapter2Text, chapter3Text];

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
    const [isReading, setIsReading] = useState(false);

    const currentChapter = chapters[chapterIndex];
    const currentText = chapterTexts[chapterIndex];

    const handleNext = () => {
        setChapterIndex((chapterIndex + 1) % chapters.length);
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto', position: 'relative', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <button
                    onClick={() => setIsReading(true)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        border: '1px solid #4ade80',
                        backgroundColor: 'rgba(74, 222, 128, 0.1)',
                        color: '#4ade80',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        transition: 'all 0.2s',
                        fontWeight: '600',
                        backdropFilter: 'blur(5px)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(74, 222, 128, 0.1)';
                    }}
                >
                    📖 Read Full Chapter
                </button>

                <button
                    onClick={handleNext}
                    style={{
                        padding: '0.75rem 1.5rem',
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
            </div>

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

            {/* Reading Overlay */}
            {isReading && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(5px)',
                        zIndex: 100,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onClick={() => setIsReading(false)}
                >
                    <div
                        style={{
                            width: '90%',
                            maxWidth: '800px',
                            height: '80vh',
                            backgroundColor: 'rgba(26, 26, 46, 0.95)',
                            borderRadius: '16px',
                            padding: '2rem',
                            position: 'relative',
                            border: '1px solid rgba(102, 126, 234, 0.3)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                            <h2 style={{ margin: 0, color: '#f0f0f0', fontSize: '1.5rem' }}>{currentChapter.title}</h2>
                            <button
                                onClick={() => setIsReading(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#a0aec0',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    padding: '0.5rem',
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                paddingRight: '1rem',
                                color: '#e0e0e0',
                                fontSize: '1.1rem',
                                lineHeight: '1.8',
                                whiteSpace: 'pre-wrap', // Preserve newlines
                                fontFamily: 'serif', // Better for reading
                            }}
                        >
                            {currentText}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
