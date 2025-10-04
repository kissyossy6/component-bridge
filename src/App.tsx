import React, { useState, useEffect, useRef } from 'react';
import { Code, Eye, Save, Trash2, FolderOpen, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import './App.css';
import { copyElementAsSVG, copyElementAsPNG } from './utils/figmaExport';

interface SavedComponent {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  category?: string;
  tags?: string[];
  description?: string;
}

function App() {
  const [code, setCode] = useState<string>('');
  const [componentName, setComponentName] = useState<string>('');
  const [componentCategory, setComponentCategory] = useState<string>('');
  const [componentTags, setComponentTags] = useState<string>('');
  const [componentDescription, setComponentDescription] = useState<string>('');
  const [savedComponents, setSavedComponents] = useState<SavedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<SavedComponent | null>(null);
  const [simulationData, setSimulationData] = useState<string>('{}');
  const [showDataInput, setShowDataInput] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string>('');
  
  // Phase 2: 非表示レンダリング用
  const [renderingComponent, setRenderingComponent] = useState<SavedComponent | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // Phase 4: 検索・フィルター用
  const [searchText, setSearchText] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  // カテゴリの選択肢
  const categories = ['Button', 'Card', 'Form', 'Layout', 'Navigation', 'Other'];

  useEffect(() => {
    const saved = localStorage.getItem('componentBridge_components');
    if (saved) {
      try {
        setSavedComponents(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load components:', e);
      }
    }
  }, []);

  const saveToLocalStorage = (components: SavedComponent[]) => {
    localStorage.setItem('componentBridge_components', JSON.stringify(components));
  };

  // Phase 4: フィルタリングロジック
  const filteredComponents = savedComponents.filter((component) => {
    // テキスト検索
    const matchesSearch = searchText === '' || 
      component.name.toLowerCase().includes(searchText.toLowerCase()) ||
      component.description?.toLowerCase().includes(searchText.toLowerCase());
    
    // カテゴリフィルター
    const matchesCategory = filterCategory === '' || component.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSave = () => {
    if (!componentName.trim()) {
      alert('コンポーネント名を入力してください');
      return;
    }
    if (!code.trim()) {
      alert('コードを入力してください');
      return;
    }

    const newComponent: SavedComponent = {
      id: Date.now(),
      name: componentName,
      code: code,
      createdAt: new Date().toISOString(),
      category: componentCategory || undefined,
      tags: componentTags ? componentTags.split(',').map(t => t.trim()).filter(t => t) : undefined,
      description: componentDescription || undefined,
    };

    const updated = [...savedComponents, newComponent];
    setSavedComponents(updated);
    saveToLocalStorage(updated);
    
    alert('保存しました！');
    setComponentName('');
    setComponentCategory('');
    setComponentTags('');
    setComponentDescription('');
  };

  const handleLoad = (component: SavedComponent) => {
    setSelectedComponent(component);
    setComponentName(component.name);
    setCode(component.code);
    setComponentCategory(component.category || '');
    setComponentTags(component.tags?.join(', ') || '');
    setComponentDescription(component.description || '');
  };

  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    
    const updated = savedComponents.filter(c => c.id !== id);
    setSavedComponents(updated);
    saveToLocalStorage(updated);
    
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
      setComponentName('');
      setCode('');
      setComponentCategory('');
      setComponentTags('');
      setComponentDescription('');
    }
  };

  const handleNew = () => {
    setSelectedComponent(null);
    setComponentName('');
    setCode('');
    setSimulationData('{}');
    setComponentCategory('');
    setComponentTags('');
    setComponentDescription('');
  };

  // Phase 4: フィルターをクリア
  const clearFilters = () => {
    setSearchText('');
    setFilterCategory('');
  };

  // Phase 2: Figmaコピー機能
  const handleCopyToFigma = async (component: SavedComponent, format: 'svg' | 'png') => {
    try {
      setCopyStatus('loading');
      console.log('Figmaコピー開始:', component.name, format);
      
      setRenderingComponent(null);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setRenderingComponent(component);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const hiddenIframe = document.querySelector('iframe[title="Hidden Render"]') as HTMLIFrameElement;
      
      if (!hiddenIframe || !hiddenIframe.contentDocument) {
        console.error('iframeが見つかりません');
        setCopyStatus('idle');
        return;
      }

      const iframeBody = hiddenIframe.contentDocument.body;
      const rootDiv = iframeBody.querySelector('#root');

      if (!rootDiv || !rootDiv.firstElementChild) {
        console.error('コンテンツが見つかりません');
        setCopyStatus('idle');
        return;
      }

      if (format === 'svg') {
        await copyElementAsSVG(rootDiv.firstElementChild as HTMLElement);
      } else {
        await copyElementAsPNG(rootDiv.firstElementChild as HTMLElement);
      }
      
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
      
    } catch (error) {
      console.error('コピーエラー:', error);
      setCopyStatus('idle');
    } finally {
      setTimeout(() => {
        setRenderingComponent(null);
      }, 100);
    }
  };

  const validateSimulationData = (data: string): boolean => {
    if (!data.trim()) {
      setDataError('');
      return true;
    }
    
    try {
      JSON.parse(data);
      setDataError('');
      return true;
    } catch (e) {
      setDataError('無効なJSON形式です');
      return false;
    }
  };

  const handleDataChange = (value: string) => {
    setSimulationData(value);
    validateSimulationData(value);
  };

  const insertSampleData = () => {
    const sample = {
      title: "サンプルタイトル",
      description: "これはサンプルの説明文です",
      count: 42,
      isActive: true
    };
    const formatted = JSON.stringify(sample, null, 2);
    setSimulationData(formatted);
    setDataError('');
  };

  const generatePreview = (): string => {
    if (!code.trim()) return '';
    
    let propsData = {};
    try {
      if (simulationData.trim()) {
        propsData = JSON.parse(simulationData);
      }
    } catch (e) {
      propsData = {};
    }
    
    try {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
            <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js"></script>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: system-ui, -apple-system, sans-serif;
              }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              const { useState, useEffect } = React;
              
              ${code}
              
              const root = ReactDOM.createRoot(document.getElementById('root'));
              const componentMatch = \`${code}\`.match(/(?:const|function|class)\\s+(\\w+)/);
              const ComponentName = componentMatch ? componentMatch[1] : null;
              
              const simulationProps = ${JSON.stringify(propsData)};
              
              if (ComponentName && window[ComponentName]) {
                root.render(React.createElement(window[ComponentName], simulationProps));
              } else {
                root.render(React.createElement('div', null, 'コンポーネントが見つかりません'));
              }
            </script>
          </body>
        </html>
      `;
    } catch (e) {
      return '';
    }
  };

  const generatePreviewForComponent = (component: SavedComponent): string => {
    try {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
            <script crossorigin src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js"></script>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: system-ui, -apple-system, sans-serif;
              }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              const { useState, useEffect } = React;
              
              ${component.code}
              
              const root = ReactDOM.createRoot(document.getElementById('root'));
              const componentMatch = \`${component.code}\`.match(/(?:const|function|class)\\s+(\\w+)/);
              const ComponentName = componentMatch ? componentMatch[1] : null;
              
              if (ComponentName && window[ComponentName]) {
                root.render(React.createElement(window[ComponentName], {}));
              } else {
                root.render(React.createElement('div', null, 'コンポーネントが見つかりません'));
              }
            </script>
          </body>
        </html>
      `;
    } catch (e) {
      return '';
    }
  };

  const previewHtml = generatePreview();

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">ComponentBridge</h1>
          <span className="app-version">Phase 4</span>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar-left">
          <div className="sidebar-header">
            <div className="sidebar-title">
              <FolderOpen size={16} />
              <span>保存済み</span>
            </div>
            <button 
              onClick={handleNew}
              className="btn-new"
              title="新規作成"
            >
              ＋
            </button>
          </div>

          {/* Phase 4: 検索・フィルターUI */}
          <div style={{
            padding: '12px',
            borderBottom: '1px solid #e5e7eb',
            background: '#fafafa',
          }}>
            {/* 検索ボックス */}
            <div style={{ position: 'relative', marginBottom: '8px' }}>
              <Search size={14} style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
              }} />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="検索..."
                style={{
                  width: '100%',
                  padding: '6px 8px 6px 28px',
                  fontSize: '13px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                }}
              />
              {searchText && (
                <button
                  onClick={() => setSearchText('')}
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px',
                    color: '#9ca3af',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* カテゴリフィルター */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: '13px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                background: 'white',
              }}
            >
              <option value="">全カテゴリ</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* フィルタークリア */}
            {(searchText || filterCategory) && (
              <button
                onClick={clearFilters}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  color: '#6b7280',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                フィルタークリア
              </button>
            )}

            {/* 検索結果件数 */}
            <div style={{
              marginTop: '8px',
              fontSize: '11px',
              color: '#6b7280',
              textAlign: 'center',
            }}>
              {filteredComponents.length} 件 / {savedComponents.length} 件
            </div>
          </div>
          
          <div className="component-list">
            {filteredComponents.length === 0 ? (
              <div className="empty-state">
                {savedComponents.length === 0 ? (
                  <>コンポーネントを<br/>作成してみましょう</>
                ) : (
                  <>該当する<br/>コンポーネントが<br/>ありません</>
                )}
              </div>
            ) : (
              filteredComponents.map((component) => (
                <div
                  key={component.id}
                  className={`component-item ${selectedComponent?.id === component.id ? 'active' : ''}`}
                  onClick={() => handleLoad(component)}
                >
                  <div className="component-info">
                    <div className="component-name">{component.name}</div>
                    {component.category && (
                      <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                        {component.category}
                      </div>
                    )}
                    <div className="component-date">
                      {new Date(component.createdAt).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(component.id);
                    }}
                    className="btn-delete"
                    title="削除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="main-editor">
          <div className="editor-header">
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="コンポーネント名（例: MyButton）"
              className="component-name-input"
              style={{ flex: 1 }}
            />
            <button 
              onClick={handleSave}
              className="btn-save"
            >
              <Save size={16} />
              保存
            </button>
          </div>

          <div style={{
            padding: '12px 16px',
            background: '#fafafa',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <div style={{ flex: '0 0 150px' }}>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                カテゴリ
              </label>
              <select
                value={componentCategory}
                onChange={(e) => setComponentCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '13px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  background: 'white',
                }}
              >
                <option value="">選択なし</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                タグ（カンマ区切り）
              </label>
              <input
                type="text"
                value={componentTags}
                onChange={(e) => setComponentTags(e.target.value)}
                placeholder="例: primary, large, rounded"
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '13px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ flex: '1 1 100%' }}>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>
                説明
              </label>
              <input
                type="text"
                value={componentDescription}
                onChange={(e) => setComponentDescription(e.target.value)}
                placeholder="このコンポーネントの説明を入力"
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '13px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                }}
              />
            </div>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Reactコンポーネントを書いてください&#10;// propsを受け取ることができます&#10;&#10;const UserCard = ({ title, description }) => {&#10;  return (&#10;    <div style={{padding: '20px', border: '1px solid #ccc', borderRadius: '8px'}}>&#10;      <h2>{title}</h2>&#10;      <p>{description}</p>&#10;    </div>&#10;  );&#10;};"
            className="code-editor"
            spellCheck={false}
          />
        </main>

        <aside className="sidebar-right">
          <div className="preview-header">
            <Eye size={16} />
            <span>プレビュー</span>
          </div>
          
          <div className="preview-container">
            {previewHtml ? (
              <iframe
                srcDoc={previewHtml}
                className="preview-iframe"
                sandbox="allow-scripts allow-same-origin"
                title="Component Preview"
              />
            ) : (
              <div className="preview-empty">
                コードを入力すると<br/>プレビューが表示されます
              </div>
            )}
          </div>

          {previewHtml && selectedComponent && (
            <div style={{ 
              padding: '12px 16px', 
              borderTop: '1px solid #e5e7eb', 
              background: '#fafafa',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <button
                onClick={() => handleCopyToFigma(selectedComponent, 'svg')}
                disabled={copyStatus === 'loading'}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  background: copyStatus === 'success' ? '#10b981' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: copyStatus === 'loading' ? 'wait' : 'pointer',
                  fontWeight: '500',
                  opacity: copyStatus === 'loading' ? 0.6 : 1,
                }}
              >
                {copyStatus === 'loading' ? '変換中...' : copyStatus === 'success' ? '✓ コピー完了' : 'SVGでコピー'}
              </button>
              
              <button
                onClick={() => handleCopyToFigma(selectedComponent, 'png')}
                disabled={copyStatus === 'loading'}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  background: copyStatus === 'success' ? '#10b981' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: copyStatus === 'loading' ? 'wait' : 'pointer',
                  fontWeight: '500',
                  opacity: copyStatus === 'loading' ? 0.6 : 1,
                }}
              >
                {copyStatus === 'loading' ? '変換中...' : copyStatus === 'success' ? '✓ コピー完了' : 'PNGでコピー'}
              </button>
              
              <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                {copyStatus === 'success' ? 'Figmaでペーストしてください' : 'プレビューをFigmaにコピー'}
              </span>
            </div>
          )}

          <div className="data-input-section">
            <div className="data-input-header">
              <button 
                className="data-toggle-btn"
                onClick={() => setShowDataInput(!showDataInput)}
              >
                データ入力
                {showDataInput ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
              <button 
                className="btn-sample"
                onClick={insertSampleData}
                title="サンプルデータを挿入"
              >
                サンプル
              </button>
            </div>
            
            {showDataInput && (
              <>
                <textarea
                  value={simulationData}
                  onChange={(e) => handleDataChange(e.target.value)}
                  placeholder='{"title": "タイトル", "description": "説明文"}'
                  className="data-input-area"
                  spellCheck={false}
                />
                {dataError && (
                  <div className="data-error">
                    {dataError}
                  </div>
                )}
                <div className="data-hint">
                  JSON形式でpropsを指定できます
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      <div style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px',
        width: '800px',
        background: 'white',
        padding: '20px'
      }}>
        {renderingComponent && (
          <div>
            <iframe
              srcDoc={generatePreviewForComponent(renderingComponent)}
              style={{ width: '100%', height: '600px', border: 'none' }}
              sandbox="allow-scripts allow-same-origin"
              title="Hidden Render"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;