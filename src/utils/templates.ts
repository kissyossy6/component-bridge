export interface Template {
  name: string;
  code: string;
  category: string;
  description: string;
  sampleData?: string;
}

export const templates: Template[] = [
  // ========== Button ==========
  {
    name: 'Primary Button',
    category: 'Button',
    description: 'プライマリアクション用のボタン',
    sampleData: '{"text": "送信"}',
    code: `const PrimaryButton = ({ text }) => {
  return (
    <div style={{
      display: 'inline-block',
      padding: '10px 20px',
      backgroundColor: '#1e40af',
      color: 'white',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    }}>
      {text || 'ボタン'}
    </div>
  );
};`,
  },
  {
    name: 'Secondary Button',
    category: 'Button',
    description: 'セカンダリアクション用のボタン',
    sampleData: '{"text": "キャンセル"}',
    code: `const SecondaryButton = ({ text }) => {
  return (
    <div style={{
      display: 'inline-block',
      padding: '10px 20px',
      backgroundColor: '#f3f4f6',
      color: '#374151',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
    }}>
      {text || 'ボタン'}
    </div>
  );
};`,
  },
  {
    name: 'Toggle Button',
    category: 'Button',
    description: 'トグルスイッチ（インタラクティブ）',
    sampleData: '{"label": "通知"}',
    code: `const Toggle = ({ label }) => {
  const [isOn, setIsOn] = React.useState(false);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '14px', color: '#374151' }}>{label || 'トグル'}</span>
      <div
        onClick={() => setIsOn(!isOn)}
        style={{
          width: '48px',
          height: '24px',
          backgroundColor: isOn ? '#3b82f6' : '#d1d5db',
          borderRadius: '12px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: 'white',
          borderRadius: '50%',
          position: 'absolute',
          top: '2px',
          left: isOn ? '26px' : '2px',
          transition: 'left 0.2s',
        }} />
      </div>
    </div>
  );
};`,
  },

  // ========== Card ==========
  {
    name: 'Profile Card',
    category: 'Card',
    description: 'ユーザープロフィール用カード',
    sampleData: '{"name": "山田太郎", "role": "フロントエンドエンジニア", "avatar": "👨‍💻", "bio": "Reactとデザインが好きです"}',
    code: `const ProfileCard = ({ name, role, avatar, bio }) => {
  return (
    <div style={{
      maxWidth: '320px',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center',
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        backgroundColor: '#3b82f6',
        borderRadius: '50%',
        margin: '0 auto 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
      }}>
        {avatar || '👤'}
      </div>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#111827',
      }}>
        {name || '名前'}
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: bio ? '12px' : '0',
      }}>
        {role || '役職'}
      </p>
      {bio && (
        <p style={{
          fontSize: '13px',
          color: '#9ca3af',
          lineHeight: '1.5',
        }}>
          {bio}
        </p>
      )}
    </div>
  );
};`,
  },
  {
    name: 'Product Card',
    category: 'Card',
    description: 'EC用の商品カード',
    sampleData: '{"name": "ワイヤレスイヤホン", "price": 12800, "image": "🎧", "description": "高音質Bluetooth5.0対応", "inStock": true}',
    code: `const ProductCard = ({ name, price, image, description, inStock = true }) => {
  return (
    <div style={{
      width: '280px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    }}>
      <div style={{
        width: '100%',
        height: '180px',
        backgroundColor: '#e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
      }}>
        {image || '📦'}
      </div>
      <div style={{ padding: '16px' }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#111827',
        }}>
          {name || '商品名'}
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#6b7280',
          marginBottom: '12px',
        }}>
          {description || '商品の説明'}
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#3b82f6',
          }}>
            ¥{price ? price.toLocaleString() : '0'}
          </div>
          {inStock ? (
            <span style={{
              padding: '4px 8px',
              backgroundColor: '#dcfce7',
              color: '#166534',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
            }}>
              在庫あり
            </span>
          ) : (
            <span style={{
              padding: '4px 8px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '600',
            }}>
              売切
            </span>
          )}
        </div>
      </div>
    </div>
  );
};`,
  },
  {
    name: 'Article Card',
    category: 'Card',
    description: 'ブログ記事用カード',
    sampleData: '{"title": "Reactの基礎を学ぶ", "excerpt": "Reactの基本的な概念とコンポーネントの作り方について解説します", "date": "2024-01-15", "category": "技術"}',
    code: `const ArticleCard = ({ title, excerpt, date, category }) => {
  return (
    <div style={{
      maxWidth: '400px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '20px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      {category && (
        <span style={{
          display: 'inline-block',
          padding: '4px 12px',
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '12px',
        }}>
          {category}
        </span>
      )}
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '12px',
        color: '#111827',
        lineHeight: '1.4',
      }}>
        {title || 'タイトル'}
      </h3>
      <p style={{
        fontSize: '14px',
        color: '#6b7280',
        marginBottom: '16px',
        lineHeight: '1.6',
      }}>
        {excerpt || '記事の要約が入ります'}
      </p>
      <div style={{
        fontSize: '12px',
        color: '#9ca3af',
      }}>
        {date || '2024-01-01'}
      </div>
    </div>
  );
};`,
  },

  // ========== Form ==========
  {
    name: 'Login Form',
    category: 'Form',
    description: 'ログインフォーム',
    sampleData: '{}',
    code: `const LoginForm = () => {
  return (
    <div style={{
      maxWidth: '400px',
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: '#111827',
      }}>
        ログイン
      </h2>
      <input
        type="email"
        placeholder="メールアドレス"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '16px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />
      <input
        type="password"
        placeholder="パスワード"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '24px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />
      <button style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
      }}>
        ログイン
      </button>
    </div>
  );
};`,
  },
  {
    name: 'Contact Form',
    category: 'Form',
    description: 'お問い合わせフォーム',
    sampleData: '{}',
    code: `const ContactForm = () => {
  return (
    <div style={{
      maxWidth: '500px',
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '24px',
        color: '#111827',
      }}>
        お問い合わせ
      </h2>
      <input
        type="text"
        placeholder="お名前"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '16px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />
      <input
        type="email"
        placeholder="メールアドレス"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '16px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
        }}
      />
      <textarea
        placeholder="お問い合わせ内容"
        rows={5}
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '24px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          fontSize: '14px',
          resize: 'vertical',
        }}
      />
      <button style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
      }}>
        送信
      </button>
    </div>
  );
};`,
  },

  // ========== Layout ==========
  {
    name: 'Header',
    category: 'Layout',
    description: 'サイトヘッダー',
    sampleData: '{"siteName": "MyApp", "links": ["ホーム", "機能", "料金", "お問い合わせ"]}',
    code: `const Header = ({ siteName, links = [] }) => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
        {siteName || 'Logo'}
      </div>
      <nav style={{ display: 'flex', gap: '24px' }}>
        {links.length > 0 ? (
          links.map((link, i) => (
            <a key={i} style={{ color: '#374151', textDecoration: 'none', fontSize: '14px' }}>
              {link}
            </a>
          ))
        ) : (
          <>
            <a style={{ color: '#374151', textDecoration: 'none', fontSize: '14px' }}>リンク1</a>
            <a style={{ color: '#374151', textDecoration: 'none', fontSize: '14px' }}>リンク2</a>
          </>
        )}
      </nav>
    </header>
  );
};`,
  },
  {
    name: 'Footer',
    category: 'Layout',
    description: 'サイトフッター',
    sampleData: '{"siteName": "MyApp", "copyright": "© 2024 MyApp. All rights reserved."}',
    code: `const Footer = ({ siteName, copyright }) => {
  return (
    <footer style={{
      padding: '48px 32px',
      backgroundColor: '#1f2937',
      color: 'white',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '32px',
      }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            {siteName || 'Logo'}
          </div>
          <p style={{ fontSize: '14px', color: '#9ca3af' }}>
            サービスの説明文がここに入ります
          </p>
        </div>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>プロダクト</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'none' }}>機能</a>
            <a style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'none' }}>料金</a>
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>会社</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'none' }}>会社概要</a>
            <a style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'none' }}>お問い合わせ</a>
          </div>
        </div>
      </div>
      <div style={{
        maxWidth: '1200px',
        margin: '32px auto 0',
        paddingTop: '24px',
        borderTop: '1px solid #374151',
        fontSize: '14px',
        color: '#9ca3af',
        textAlign: 'center',
      }}>
        {copyright || '© 2024 Company. All rights reserved.'}
      </div>
    </footer>
  );
};`,
  },
  {
    name: 'Two Column Layout',
    category: 'Layout',
    description: '2カラムレイアウト',
    sampleData: '{"leftContent": "サイドバーコンテンツ", "rightContent": "メインコンテンツ"}',
    code: `const TwoColumnLayout = ({ leftContent, rightContent }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '250px 1fr',
      gap: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
    }}>
      <aside style={{
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        height: 'fit-content',
      }}>
        {leftContent || 'サイドバー'}
      </aside>
      <main style={{
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
      }}>
        {rightContent || 'メインコンテンツ'}
      </main>
    </div>
  );
};`,
  },

  // ========== Navigation ==========
  {
    name: 'Tab Navigation',
    category: 'Navigation',
    description: 'タブナビゲーション（インタラクティブ）',
    sampleData: '{"tabs": ["概要", "詳細", "レビュー"]}',
    code: `const TabNavigation = ({ tabs = [] }) => {
  const tabList = tabs.length > 0 ? tabs : ['タブ1', 'タブ2', 'タブ3'];
  const [activeTab, setActiveTab] = React.useState(tabList[0]);
  
  return (
    <div style={{
      borderBottom: '2px solid #e5e7eb',
      display: 'flex',
      gap: '32px',
    }}>
      {tabList.map((tab, i) => (
        <button
          key={i}
          onClick={() => setActiveTab(tab)}
          style={{
            padding: '12px 0',
            backgroundColor: 'transparent',
            border: 'none',
            borderBottom: tab === activeTab ? '2px solid #3b82f6' : '2px solid transparent',
            color: tab === activeTab ? '#3b82f6' : '#6b7280',
            fontWeight: tab === activeTab ? '600' : '400',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '-2px',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};`,
  },
  {
    name: 'Breadcrumb',
    category: 'Navigation',
    description: 'パンくずリスト',
    sampleData: '{"items": ["ホーム", "カテゴリ", "商品詳細"]}',
    code: `const Breadcrumb = ({ items = [] }) => {
  const breadcrumbs = items.length > 0 ? items : ['ホーム', 'ページ'];
  
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
    }}>
      {breadcrumbs.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            color: i === breadcrumbs.length - 1 ? '#111827' : '#6b7280',
            fontWeight: i === breadcrumbs.length - 1 ? '600' : '400',
          }}>
            {item}
          </span>
          {i < breadcrumbs.length - 1 && (
            <span style={{ color: '#d1d5db' }}>›</span>
          )}
        </div>
      ))}
    </nav>
  );
};`,
  },
  {
    name: 'Pagination',
    category: 'Navigation',
    description: 'ページネーション（インタラクティブ）',
    sampleData: '{"totalPages": 10}',
    code: `const Pagination = ({ totalPages = 5 }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <button 
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        style={{
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          backgroundColor: 'white',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        ‹
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          style={{
            padding: '8px 12px',
            border: '1px solid ' + (page === currentPage ? '#3b82f6' : '#d1d5db'),
            borderRadius: '6px',
            backgroundColor: page === currentPage ? '#3b82f6' : 'white',
            color: page === currentPage ? 'white' : '#374151',
            fontWeight: page === currentPage ? '600' : '400',
            cursor: 'pointer',
          }}
        >
          {page}
        </button>
      ))}
      <button 
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        style={{
          padding: '8px 12px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          backgroundColor: 'white',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
      >
        ›
      </button>
    </div>
  );
};`,
  },

  // ========== Other ==========
  {
    name: 'Alert',
    category: 'Other',
    description: 'アラート・通知',
    sampleData: '{"type": "success", "message": "保存に成功しました"}',
    code: `const Alert = ({ type = 'info', message }) => {
  const colors = {
    success: { bg: '#dcfce7', border: '#86efac', text: '#166534' },
    error: { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' },
    warning: { bg: '#fef3c7', border: '#fcd34d', text: '#854d0e' },
    info: { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' },
  };
  
  const color = colors[type] || colors.info;
  
  return (
    <div style={{
      padding: '16px',
      backgroundColor: color.bg,
      border: '1px solid ' + color.border,
      borderRadius: '8px',
      color: color.text,
      fontSize: '14px',
      fontWeight: '500',
    }}>
      {message || 'アラートメッセージ'}
    </div>
  );
};`,
  },
  {
    name: 'Badge',
    category: 'Other',
    description: 'バッジ・タグ',
    sampleData: '{"label": "新着", "color": "blue"}',
    code: `const Badge = ({ label, color = 'blue' }) => {
  const colors = {
    blue: { bg: '#dbeafe', text: '#1e40af' },
    green: { bg: '#dcfce7', text: '#166534' },
    red: { bg: '#fee2e2', text: '#991b1b' },
    yellow: { bg: '#fef3c7', text: '#854d0e' },
    gray: { bg: '#f3f4f6', text: '#374151' },
  };
  
  const selectedColor = colors[color] || colors.blue;
  
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      backgroundColor: selectedColor.bg,
      color: selectedColor.text,
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: '600',
    }}>
      {label || 'バッジ'}
    </span>
  );
};`,
  },
  {
    name: 'Loading Spinner',
    category: 'Other',
    description: 'ローディングスピナー（静止版）',
    sampleData: '{"size": 40}',
    code: `const LoadingSpinner = ({ size = 32 }) => {
  return (
    <div style={{
      display: 'inline-block',
      width: size + 'px',
      height: size + 'px',
      border: '3px solid #e5e7eb',
      borderTop: '3px solid #3b82f6',
      borderRadius: '50%',
    }} />
  );
};`,
  },
  {
    name: 'Avatar',
    category: 'Other',
    description: 'アバター画像',
    sampleData: '{"initials": "YT", "size": 48, "color": "#3b82f6"}',
    code: `const Avatar = ({ initials, size = 40, color = '#3b82f6' }) => {
  const sizeStr = size + 'px';
  const fontSize = (size * 0.4) + 'px';
  
  return (
    <div style={{
      width: sizeStr,
      height: sizeStr,
      borderRadius: '50%',
      backgroundColor: color,
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: fontSize,
      fontWeight: '600',
    }}>
      {initials || 'A'}
    </div>
  );
};`,
  },
];