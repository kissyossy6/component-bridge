import { elementToSVG, inlineResources } from 'dom-to-svg';
import { toPng } from 'html-to-image';

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
 * PNG形式でコピー
 */
export async function copyElementAsPNG(element: HTMLElement): Promise<boolean> {
  if (!element) {
    throw new Error('要素が見つかりません');
  }

  try {
    console.log('🔄 PNG変換開始...');
    
    const pngDataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 4,
      backgroundColor: '#ffffff',
    });
    
    console.log('✅ PNG変換完了');

    const response = await fetch(pngDataUrl);
    const blob = await response.blob();
    
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