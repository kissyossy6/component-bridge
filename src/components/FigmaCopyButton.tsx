import { useState } from 'react';
import { copyElementAsSVG, copyElementAsPNG } from '../utils/figmaExport';

interface FigmaCopyButtonProps {
  targetRef: React.RefObject<HTMLElement | null>;
}

type Status = 'idle' | 'loading' | 'success' | 'error';
type Format = 'svg' | 'png';

export default function FigmaCopyButton({ targetRef }: FigmaCopyButtonProps) {
  const [svgStatus, setSvgStatus] = useState<Status>('idle');
  const [pngStatus, setPngStatus] = useState<Status>('idle');

  const handleCopy = async (format: Format) => {
    if (!targetRef?.current) {
      alert('コピー対象が見つかりません');
      return;
    }

    const setStatus = format === 'svg' ? setSvgStatus : setPngStatus;
    setStatus('loading');

    try {
      if (format === 'svg') {
        await copyElementAsSVG(targetRef.current);
      } else {
        await copyElementAsPNG(targetRef.current);
      }
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('コピーエラー:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const getButtonText = (status: Status, format: Format) => {
    const formatLabel = format === 'svg' ? 'SVG' : 'PNG';
    
    switch (status) {
      case 'loading': return '⏳ 変換中...';
      case 'success': return '✅ 完了！';
      case 'error': return '❌ エラー';
      default: return `📋 ${formatLabel}でコピー`;
    }
  };

  const getButtonClass = (status: Status) => {
    const baseClass = 'px-4 py-2 text-white rounded font-medium transition-colors disabled:cursor-not-allowed';
    
    switch (status) {
      case 'loading': return `${baseClass} bg-gray-400`;
      case 'success': return `${baseClass} bg-green-500`;
      case 'error': return `${baseClass} bg-red-500`;
      default: return `${baseClass} bg-blue-500 hover:bg-blue-600`;
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        onClick={() => handleCopy('svg')}
        disabled={svgStatus === 'loading'}
        className={getButtonClass(svgStatus)}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px',
          fontWeight: '500',
          cursor: svgStatus === 'loading' ? 'wait' : 'pointer',
        }}
      >
        {getButtonText(svgStatus, 'svg')}
      </button>

      <button
        onClick={() => handleCopy('png')}
        disabled={pngStatus === 'loading'}
        className={getButtonClass(pngStatus)}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px',
          fontWeight: '500',
          cursor: pngStatus === 'loading' ? 'wait' : 'pointer',
        }}
      >
        {getButtonText(pngStatus, 'png')}
      </button>

      <span style={{ fontSize: '12px', color: '#666' }}>
        SVG: ベクター | PNG: 高品質
      </span>
    </div>
  );
}