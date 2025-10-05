import React, { useState, useEffect, useRef } from 'react';
import { Code, Eye, Save, Trash2, FolderOpen, ChevronDown, ChevronUp, Search, X, Download, Upload, FileText, AlertCircle, XCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';
import './App.css';
import { copyElementAsSVG, copyElementAsPNG } from './utils/figmaExport';
import { templates, type Template } from './utils/templates';

interface SavedComponent {
  id: number;
  name: string;
  code: string;
  createdAt: string;
  category?: string;
  tags?: string[];
  description?: string;
  propsData?: any;
  simulationData?: string;
}

interface ErrorMessage {
  type: 'compile' | 'runtime';
  message: string;
  timestamp: number;
}

function generateUUID(): number {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
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
  
  const [renderingComponent, setRenderingComponent] = useState<SavedComponent | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const [searchText, setSearchText] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [templateFilterCategory, setTemplateFilterCategory] = useState<string>('');

  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);

  // エラーコンソール用
  const [errors, setErrors] = useState<ErrorMessage[]>([]);
  const [showErrorConsole, setShowErrorConsole] = useState<boolean>(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // iframe からのエラーメッセージを受信
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'compile-error') {
        addError('compile', event.data.message);
      } else if (event.data.type === 'runtime-error') {
        addError('runtime', `${event.data.message} (行: ${event.data.line})`);
      } else if (event.data.type === 'empty-render') {
        addError('runtime', event.data.message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const saveToLocalStorage = (components: SavedComponent[]) => {
    localStorage.setItem('componentBridge_components', JSON.stringify(components));
  };

  const addError = (type: 'compile' | 'runtime', message: string) => {
    const newError: ErrorMessage = {
      type,
      message,
      timestamp: Date.now(),
    };
    setErrors(prev => [...prev, newError]);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const filteredComponents = savedComponents.filter((component) => {
    const matchesSearch = searchText === '' || 
      component.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = filterCategory === '' || component.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveOrUpdate = () => {
    if (!componentName.trim()) {
      alert('コンポーネント名を入力してください');
      return;
    }
    if (!code.trim()) {
      alert('コードを入力してください');
      return;
    }

    if (selectedComponent) {
      const updated = savedComponents.map(comp => 
        comp.id === selectedComponent.id
          ? {
              ...comp,
              name: componentName,
              code: code,
              category: componentCategory || undefined,
              tags: componentTags ? componentTags.split(',').map(t => t.trim()).filter(t => t) : undefined,
              description: componentDescription || undefined,
              simulationData: simulationData || undefined,
            }
          : comp
      );
      setSavedComponents(updated);
      saveToLocalStorage(updated);
      setSelectedComponent(null);
      alert('更新しました！');
    } else {
      const newComponent: SavedComponent = {
        id: Date.now(),
        name: componentName,
        code: code,
        createdAt: new Date().toISOString(),
        category: componentCategory || undefined,
        tags: componentTags ? componentTags.split(',').map(t => t.trim()).filter(t => t) : undefined,
        description: componentDescription || undefined,
        simulationData: simulationData || undefined,
      };

      const updated = [...savedComponents, newComponent];
      setSavedComponents(updated);
      saveToLocalStorage(updated);
      alert('保存しました！');
    }
    
    setComponentName('');
    setComponentCategory('');
    setComponentTags('');
    setComponentDescription('');
    setCode('');
    setSimulationData('{}');
  };

  const handleLoad = (component: SavedComponent) => {
    setSelectedComponent(component);
    setComponentName(component.name);
    setCode(component.code);
    setComponentCategory(component.category || '');
    setComponentTags(component.tags?.join(', ') || '');
    setComponentDescription(component.description || '');
    setSimulationData(component.simulationData || '{}');
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

  const clearFilters = () => {
    setSearchText('');
    setFilterCategory('');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(savedComponents, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `component-bridge-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        if (Array.isArray(imported)) {
          const confirmed = confirm(`${imported.length}件のコンポーネントをインポートしますか?\n既存のデータに追加されます。`);
          if (confirmed) {
            const baseTime = Date.now();
            const withNewIds = imported.map((comp, idx) => ({
              ...comp,
              id: baseTime + (idx + 1) * 10000 + Math.floor(Math.random() * 1000),
              createdAt: new Date().toISOString(),
            }));
            const updated = [...savedComponents, ...withNewIds];
            setSavedComponents(updated);
            saveToLocalStorage(updated);
            alert('インポートしました!');
          }
        } else {
          alert('無効なファイル形式です');
        }
      } catch (error) {
        alert('ファイルの読み込みに失敗しました');
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInsertTemplate = (template: Template) => {
    setCode(template.code);
    setComponentName(template.name);
    setComponentCategory(template.category);
    setComponentDescription(template.description);
    
    if (template.sampleData) {
      setSimulationData(template.sampleData);
    }
    
    setShowTemplateModal(false);
    setTemplateFilterCategory('');
  };

  const handleCopyToFigma = async (component: SavedComponent, format: 'svg' | 'png') => {
    try {
      setCopyStatus('loading');

      let propsData = {};
      try {
        if (simulationData.trim()) {
          propsData = JSON.parse(simulationData);
        }
      } catch (e) {
        propsData = {};
      }
      
      setRenderingComponent(null);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      setRenderingComponent({ ...component, propsData });
      
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
              .empty-render-warning {
                padding: 20px;
                background: #fef3c7;
                border: 2px dashed #f59e0b;
                border-radius: 8px;
                color: #92400e;
                text-align: center;
                font-size: 14px;
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              const { useState, useEffect } = React;
              
              window.onerror = function(message, source, lineno, colno, error) {
                window.parent.postMessage({
                  type: 'runtime-error',
                  message: message,
                  line: lineno
                }, '*');
                return true;
              };

              try {
                ${code}
                
                const root = ReactDOM.createRoot(document.getElementById('root'));
                const componentMatch = \`${code}\`.match(/(?:const|function|class)\\s+(\\w+)/);
                const ComponentName = componentMatch ? componentMatch[1] : null;
                
                const simulationProps = ${JSON.stringify(propsData)};
                
                if (ComponentName && window[ComponentName]) {
                  // コンポーネントをレンダリング
                  root.render(React.createElement(window[ComponentName], simulationProps));
                  
                  // レンダリング後に空かどうかチェック
                  setTimeout(() => {
                    const rootElement = document.getElementById('root');
                    const isEmpty = !rootElement || 
                                  rootElement.children.length === 0 || 
                                  (rootElement.children.length === 1 && !rootElement.children[0].textContent.trim() && rootElement.children[0].children.length === 0);
                    
                    if (isEmpty) {
                      window.parent.postMessage({
                        type: 'empty-render',
                        message: 'コンポーネントは正常に実行されましたが、何もレンダリングされていません'
                      }, '*');
                      
                      root.render(
                        React.createElement('div', { className: 'empty-render-warning' }, 
                          React.createElement('div', { style: { fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' } }, '⚠️ レンダリング結果が空です'),
                          React.createElement('div', null, 'コンポーネントが null、undefined、または空の要素を返しています。'),
                          React.createElement('div', { style: { marginTop: '8px', fontSize: '13px' } }, 'return文の内容を確認してください。')
                        )
                      );
                    }
                  }, 100);
                } else {
                  throw new Error('コンポーネントが見つかりません: ' + (ComponentName || '(名前不明)'));
                }
              } catch (error) {
                window.parent.postMessage({
                  type: 'compile-error',
                  message: error.message
                }, '*');
                
                const root = ReactDOM.createRoot(document.getElementById('root'));
                root.render(React.createElement('div', { 
                  style: { 
                    padding: '20px', 
                    color: '#dc2626', 
                    background: '#fee2e2',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '13px'
                  } 
                }, 'エラー: ' + error.message));
              }
            </script>
          </body>
        </html>
      `;
    } catch (e) {
      return '';
    }
  };

  const generatePreviewForComponent = (component: SavedComponent, propsData = {}): string => {
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

  const previewHtml = generatePreview();

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">ComponentBridge</h1>
          <span className="app-version">Phase 6</span>
        </div>
        <div className="header-right">
          <button 
            onClick={handleExport}
            className="header-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Download size={16} />
            エクスポート
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="header-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Upload size={16} />
            インポート
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
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
              style={{
                background: selectedComponent ? '#10b981' : '#3b82f6',
                color: 'white',
              }}
            >
              ＋
            </button>
          </div>

          <div style={{
            padding: '12px',
            borderBottom: '1px solid #e5e7eb',
            background: '#fafafa',
          }}>
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
              placeholder="コンポーネント名(例: MyButton)"
              className="component-name-input"
              style={{ flex: 1 }}
            />
            
            {selectedComponent && (
              <button 
                onClick={handleNew}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 16px',
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.15s',
                }}
              >
                ＋ 新規作成
              </button>
            )}
            
            <button 
              onClick={() => setShowTemplateModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.15s',
              }}
            >
              <FileText size={16} />
              テンプレート
            </button>
            
            <button 
              onClick={handleSaveOrUpdate}
              className="btn-save"
            >
              <Save size={16} />
              {selectedComponent ? '更新' : '保存'}
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
                タグ(カンマ区切り)
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
          
          {/* Monaco Editor */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => {
                setCode(value || '');
                clearErrors();
              }}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>

          {/* エラーコンソール */}
          <div className="error-console-section">
            <div className="error-console-header">
              <button 
                className="error-toggle-btn"
                onClick={() => setShowErrorConsole(!showErrorConsole)}
              >
                <AlertCircle size={14} />
                エラーコンソール
                {errors.length > 0 && (
                  <span className="error-badge">{errors.length}</span>
                )}
                {showErrorConsole ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </button>
              {errors.length > 0 && (
                <button 
                  className="btn-clear-errors"
                  onClick={clearErrors}
                  title="エラーをクリア"
                >
                  <XCircle size={14} />
                  クリア
                </button>
              )}
            </div>
            
            {showErrorConsole && (
              <div className="error-console-content">
                {errors.length === 0 ? (
                  <div className="error-empty">
                    エラーはありません
                  </div>
                ) : (
                  <div className="error-list">
                    {errors.map((error, index) => (
                      <div 
                        key={index}
                        className={`error-item error-${error.type}`}
                      >
                        <div className="error-type-badge">
                          {error.type === 'compile' ? 'コンパイル' : 'ランタイム'}
                        </div>
                        <div className="error-message">{error.message}</div>
                        <div className="error-time">
                          {new Date(error.timestamp).toLocaleTimeString('ja-JP')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
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

          {previewHtml && (
            <div style={{ 
              padding: '12px 16px', 
              borderTop: '1px solid #e5e7eb', 
              background: '#fafafa',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <button
                onClick={() => {
                  const tempComponent: SavedComponent = {
                    id: generateUUID(),
                    name: componentName || 'Untitled',
                    code: code,
                    createdAt: new Date().toISOString(),
                    category: componentCategory || undefined,
                    tags: componentTags ? componentTags.split(',').map(t => t.trim()).filter(t => t) : undefined,
                    description: componentDescription || undefined,
                    simulationData: simulationData || undefined,
                  };
                  handleCopyToFigma(tempComponent, 'svg');
                }}
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
                onClick={() => {
                  const tempComponent: SavedComponent = {
                    id: generateUUID(),
                    name: componentName || 'Untitled',
                    code: code,
                    createdAt: new Date().toISOString(),
                    category: componentCategory || undefined,
                    tags: componentTags ? componentTags.split(',').map(t => t.trim()).filter(t => t) : undefined,
                    description: componentDescription || undefined,
                    simulationData: simulationData || undefined,
                  };
                  handleCopyToFigma(tempComponent, 'png');
                }}
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

      {showTemplateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '90%',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                テンプレートを選択
              </h2>
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setTemplateFilterCategory('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <select
                value={templateFilterCategory}
                onChange={(e) => setTemplateFilterCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  background: 'white',
                }}
              >
                <option value="">全カテゴリ</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {templates
                .filter(template => templateFilterCategory === '' || template.category === templateFilterCategory)
                .map((template, index) => (
                  <div
                    key={`${template.category}-${template.name}-${index}`}  
                    onClick={() => handleInsertTemplate(template)}
                    style={{
                      padding: '16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.backgroundColor = '#eff6ff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{
                      fontSize: '12px',
                      color: '#3b82f6',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}>
                      {template.category}
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}>
                      {template.name}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      lineHeight: '1.5',
                    }}>
                      {template.description}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px',
        width: '800px',
        background: 'white',
        padding: '60px'
      }}>
        {renderingComponent && (
          <div>
            <iframe
              srcDoc={generatePreviewForComponent(
                renderingComponent,
                renderingComponent.propsData || {}
              )}
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