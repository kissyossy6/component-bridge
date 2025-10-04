import React, { useState, useEffect } from 'react';
import { Code, Eye, Save, Trash2, FolderOpen, ChevronDown, ChevronUp } from 'lucide-react';
import './App.css';

interface SavedComponent {
  id: number;
  name: string;
  code: string;
  createdAt: string;
}

function App() {
  const [code, setCode] = useState<string>('');
  const [componentName, setComponentName] = useState<string>('');
  const [savedComponents, setSavedComponents] = useState<SavedComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<SavedComponent | null>(null);
  const [simulationData, setSimulationData] = useState<string>('{}');
  const [showDataInput, setShowDataInput] = useState<boolean>(true);
  const [dataError, setDataError] = useState<string>('');

  // localStorageからコンポーネントを読み込み
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

  // localStorageに保存
  const saveToLocalStorage = (components: SavedComponent[]) => {
    localStorage.setItem('componentBridge_components', JSON.stringify(components));
  };

  // コンポーネントを保存
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
    };

    const updated = [...savedComponents, newComponent];
    setSavedComponents(updated);
    saveToLocalStorage(updated);
    
    alert('保存しました！');
    setComponentName('');
  };

  // コンポーネントを読み込み
  const handleLoad = (component: SavedComponent) => {
    setSelectedComponent(component);
    setComponentName(component.name);
    setCode(component.code);
  };

  // コンポーネントを削除
  const handleDelete = (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    
    const updated = savedComponents.filter(c => c.id !== id);
    setSavedComponents(updated);
    saveToLocalStorage(updated);
    
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
      setComponentName('');
      setCode('');
    }
  };

  // 新規作成
  const handleNew = () => {
    setSelectedComponent(null);
    setComponentName('');
    setCode('');
    setSimulationData('{}');
  };

  // データのバリデーション
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

  // データ入力の変更
  const handleDataChange = (value: string) => {
    setSimulationData(value);
    validateSimulationData(value);
  };

  // サンプルデータを挿入
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

  // プレビュー生成（データを含む）
  const generatePreview = (): string => {
    if (!code.trim()) return '';
    
    let propsData = {};
    try {
      if (simulationData.trim()) {
        propsData = JSON.parse(simulationData);
      }
    } catch (e) {
      // JSONエラーの場合は空のpropsを使用
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
              
              // シミュレーションデータ
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
      {/* ヘッダー */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">ComponentBridge</h1>
          <span className="app-version">Phase 1</span>
        </div>
        <div className="header-right">
          {/* Phase 2で追加予定 */}
          {/* <button className="header-btn">Figma連携</button>
          <button className="header-btn">⚙️</button> */}
        </div>
      </header>

      {/* メインコンテンツ（3カラム） */}
      <div className="main-content">
        
        {/* 左カラム：保存済みリスト */}
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
          
          <div className="component-list">
            {savedComponents.length === 0 ? (
              <div className="empty-state">
                コンポーネントを<br/>作成してみましょう
              </div>
            ) : (
              savedComponents.map((component) => (
                <div
                  key={component.id}
                  className={`component-item ${selectedComponent?.id === component.id ? 'active' : ''}`}
                  onClick={() => handleLoad(component)}
                >
                  <div className="component-info">
                    <div className="component-name">{component.name}</div>
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

        {/* 中央カラム：エディタ */}
        <main className="main-editor">
          <div className="editor-header">
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              placeholder="コンポーネント名（例: MyButton）"
              className="component-name-input"
            />
            <button 
              onClick={handleSave}
              className="btn-save"
            >
              <Save size={16} />
              保存
            </button>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Reactコンポーネントを書いてください&#10;// propsを受け取ることができます&#10;&#10;const UserCard = ({ title, description }) => {&#10;  return (&#10;    <div style={{padding: '20px', border: '1px solid #ccc', borderRadius: '8px'}}>&#10;      <h2>{title}</h2>&#10;      <p>{description}</p>&#10;    </div>&#10;  );&#10;};"
            className="code-editor"
            spellCheck={false}
          />
        </main>

        {/* 右カラム：プレビュー＋データ入力 */}
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
                sandbox="allow-scripts"
                title="Component Preview"
              />
            ) : (
              <div className="preview-empty">
                コードを入力すると<br/>プレビューが表示されます
              </div>
            )}
          </div>

          {/* データ入力エリア */}
          <div className="data-input-section">
            <div className="data-input-header">
              <button 
                className="data-toggle-btn"
                onClick={() => setShowDataInput(!showDataInput)}
              >
                📊 データ入力
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
                    ⚠️ {dataError}
                  </div>
                )}
                <div className="data-hint">
                  💡 JSON形式でpropsを指定できます
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;