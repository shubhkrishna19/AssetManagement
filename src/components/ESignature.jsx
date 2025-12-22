import React, { useRef, useState, useEffect } from 'react';

const ESignature = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signature, setSignature] = useState(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.offsetWidth;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            ctx.lineCap = 'round';
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#000000';
        }
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCoordinates(nativeEvent);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.closePath();
        setIsDrawing(false);
    };

    const getCoordinates = (event) => {
        if (event.touches && event.touches[0]) {
            const rect = canvasRef.current.getBoundingClientRect();
            return {
                offsetX: event.touches[0].clientX - rect.left,
                offsetY: event.touches[0].clientY - rect.top
            };
        }
        return { offsetX: event.offsetX, offsetY: event.offsetY };
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature(null);
    };

    const saveSignature = () => {
        const dataUrl = canvasRef.current.toDataURL();
        setSignature(dataUrl);
        alert("✅ Signature Captured! (Saved as Data URL)");
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>E-Signature Pad</h2>
                    <p style={styles.subtitle}>Digital acknowledgment for asset custody.</p>
                </div>
            </div>

            <div style={styles.padWrapper} className="glass-card">
                <canvas
                    ref={canvasRef}
                    style={styles.canvas}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
                <div style={styles.toolbar}>
                    <button style={styles.secondaryBtn} onClick={clearCanvas}>Clear</button>
                    <button style={styles.primaryBtn} onClick={saveSignature}>Accept & Sign</button>
                </div>
            </div>

            {signature && (
                <div style={styles.previewContainer}>
                    <h3>Stored Signature:</h3>
                    <img src={signature} alt="User Signature" style={styles.previewImg} />
                    <p style={{ fontSize: '12px', color: 'var(--textSecondary)' }}>
                        Ready to be attached to Asset Checkout Record #1042
                    </p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { padding: '24px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' },
    header: { marginBottom: '32px' },
    title: { fontSize: '28px', fontWeight: '800', marginBottom: '8px' },
    subtitle: { color: 'var(--textSecondary)', fontSize: '14px' },

    padWrapper: {
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)'
    },
    canvas: { width: '100%', height: '300px', cursor: 'crosshair', touchAction: 'none' },

    toolbar: {
        padding: '20px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'center',
        gap: '20px'
    },

    primaryBtn: { padding: '12px 30px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
    secondaryBtn: { padding: '12px 30px', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },

    previewContainer: { marginTop: '40px', padding: '20px', background: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border)' },
    previewImg: { maxWidth: '300px', border: '1px dashed var(--textSecondary)', margin: '15px 0' }
};

export default ESignature;
