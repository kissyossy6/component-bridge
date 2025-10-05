import { elementToSVG, inlineResources } from 'dom-to-svg';
import html2canvas from 'html2canvas';

/**
 * SVG形式でコピー
 */
export async function copyElementAsSVG(element: HTMLElement): Promise<boolean> {
  if (!element) {
    throw new Error('要素が見つかりません');
  }

  try {
    console.log('🔄 SVG変換開始...');
    
    const svgDocument = elementToSVG(element);
    await inlineResources(svgDocument.documentElement);
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgDocument);
    
    await navigator.clipboard.writeText(svgString);
    
    console.log('✅ SVGコピー完了');
    return true;
  } catch (error) {
    console.error('❌ SVGエラー:', error);
    throw error;
  }
}

/**
 * PNG形式でコピー（html2canvas使用）
 */
export async function copyElementAsPNG(element: HTMLElement): Promise<boolean> {
  if (!element) {
    throw new Error('要素が見つかりません');
  }

  try {
    console.log('🔄 PNG変換開始...');
    
    const canvas = await html2canvas(element, {
      backgroundColor: null,  // 透過背景
      scale: 3,  // 高解像度
      logging: false,
      useCORS: true,  // 追加: 外部リソース対応
    });
    
    console.log('✅ PNG変換完了');

    // CanvasをBlobに変換
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
    
    console.log(`✅ サイズ: ${(blob.size / 1024).toFixed(1)} KB`);

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);

    console.log('✅ PNGコピー完了');
    return true;
  } catch (error) {
    console.error('❌ PNGエラー:', error);
    throw error;
  }
}