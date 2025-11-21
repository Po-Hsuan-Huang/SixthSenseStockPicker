import { useRef, useEffect } from 'react';
import { useStockStore } from '../stores/stockStore';

export function ClassicView() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { stocks } = useStockStore();

    useEffect(() => {
        if (!canvasRef.current || stocks.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const width = canvas.width;
        const height = canvas.height;
        const padding = 60;

        // Clear canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);

        // Find data ranges
        const margins = stocks.map(s => s.operating_margin);
        const growths = stocks.map(s => s.revenue_growth);
        const minMargin = Math.min(...margins, -20);
        const maxMargin = Math.max(...margins, 75);
        const minGrowth = Math.min(...growths, -20);
        const maxGrowth = Math.max(...growths, 145);

        // Scale functions
        const scaleX = (value: number) =>
            padding + ((value - minMargin) / (maxMargin - minMargin)) * (width - 2 * padding);
        const scaleY = (value: number) =>
            height - padding - ((value - minGrowth) / (maxGrowth - minGrowth)) * (height - 2 * padding);

        // Draw grid
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const x = padding + (i / 10) * (width - 2 * padding);
            const y = padding + (i / 10) * (height - 2 * padding);

            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();

            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw Rule of 40 line (margin + growth = 40)
        // growth = 40 - margin => y = 40 - x
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(scaleX(minMargin), scaleY(40 - minMargin));
        ctx.lineTo(scaleX(maxMargin), scaleY(40 - maxMargin));
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw stocks as bubbles
        stocks.forEach(stock => {
            const x = scaleX(stock.operating_margin);
            const y = scaleY(stock.revenue_growth);
            const radius = Math.sqrt(stock.market_cap / 1e11) * 5; // Scale bubble size

            // Draw bubble
            ctx.fillStyle = stock.color;
            ctx.globalAlpha = stock.opacity;
            ctx.beginPath();
            ctx.arc(x, y, Math.max(radius, 3), 0, 2 * Math.PI);
            ctx.fill();

            // Draw border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;

            // Draw ticker label
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(stock.ticker, x, y - radius - 5);
        });

        // Draw axes labels
        ctx.fillStyle = '#f0f0f0';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Operating Margin (%)', width / 2, height - 10);

        ctx.save();
        ctx.rotate(-Math.PI / 2);
        ctx.fillText('Revenue Growth (%)', -height / 2, 20);
        ctx.restore();

        // Draw title
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('Rule of 40 Analysis', width / 2, 30);

    }, [stocks]);

    if (stocks.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a0aec0' }}>
                Loading...
            </div>
        );
    }

    return (
        <div style={{ padding: '1rem' }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '700px',
                    borderRadius: '12px',
                    backgroundColor: '#1a1a2e',
                }}
            />

            <div
                style={{
                    marginTop: '1rem',
                    backgroundColor: '#1a1a2e',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    color: '#a0aec0',
                }}
            >
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#f0f0f0' }}>📊 About Rule of 40</h4>
                <p style={{ margin: '0.5rem 0' }}>
                    The <strong style={{ color: '#667eea' }}>Rule of 40</strong> states that a healthy SaaS/growth company should have:
                </p>
                <p style={{ margin: '0.5rem 0', fontFamily: 'monospace', color: '#f0f0f0' }}>
                    Operating Margin (%) + Revenue Growth (%) ≥ 40
                </p>
                <p style={{ margin: '0.5rem 0' }}>
                    Stocks above/left of the <span style={{ color: '#ff4444' }}>red dashed line</span> meet this criterion and are considered strong investments.
                </p>
            </div>
        </div>
    );
}
