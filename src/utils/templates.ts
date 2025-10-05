export interface Template {
  name: string;
  code: string;
  category: string;
  description: string;
  framework: 'react' | 'vue' | 'html';
  sampleData?: string;
}

export const templates: Template[] = [
  // ========== React Button ==========
  {
    name: 'Primary Button',
    category: 'Button',
    framework: 'react',
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

  // ========== Vue Button ==========
  {
    name: 'Primary Button (Vue)',
    category: 'Button',
    framework: 'vue',
    description: 'プライマリアクション用のボタン',
    sampleData: '{"text": "送信"}',
    code: `window.MyComponent = {
  props: ['text'],
  template: \`
    <div style="display: inline-block; padding: 10px 20px; background-color: #1e40af; color: white; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
      {{ text || 'ボタン' }}
    </div>
  \`
}`,
  },

  // ========== HTML Button ==========
  {
    name: 'Primary Button (HTML)',
    category: 'Button',
    framework: 'html',
    description: 'プライマリアクション用のボタン',
    code: `<div style="display: inline-block; padding: 10px 20px; background-color: #1e40af; color: white; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer;">
  送信
</div>`,
  },

  // ========== React Card ==========
  {
    name: 'Profile Card',
    category: 'Card',
    framework: 'react',
    description: 'ユーザープロフィール用カード',
    sampleData: '{"name": "山田太郎", "role": "エンジニア", "avatar": "👨‍💻"}',
    code: `const ProfileCard = ({ name, role, avatar }) => {
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
      }}>
        {role || '役職'}
      </p>
    </div>
  );
};`,
  },

  // ========== Vue Card ==========
  {
    name: 'Profile Card (Vue)',
    category: 'Card',
    framework: 'vue',
    description: 'ユーザープロフィール用カード',
    sampleData: '{"name": "山田太郎", "role": "エンジニア", "avatar": "👨‍💻"}',
    code: `window.MyComponent = {
  props: ['name', 'role', 'avatar'],
  template: \`
    <div style="max-width: 320px; padding: 24px; background-color: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;">
      <div style="width: 80px; height: 80px; background-color: #3b82f6; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
        {{ avatar || '👤' }}
      </div>
      <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #111827;">
        {{ name || '名前' }}
      </h3>
      <p style="font-size: 14px; color: #6b7280;">
        {{ role || '役職' }}
      </p>
    </div>
  \`
}`,
  },

  // ========== HTML Card ==========
  {
    name: 'Profile Card (HTML)',
    category: 'Card',
    framework: 'html',
    description: 'ユーザープロフィール用カード',
    code: `<div style="max-width: 320px; padding: 24px; background-color: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;">
  <div style="width: 80px; height: 80px; background-color: #3b82f6; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
    👨‍💻
  </div>
  <h3 style="font-size: 20px; font-weight: bold; margin-bottom: 8px; color: #111827;">
    山田太郎
  </h3>
  <p style="font-size: 14px; color: #6b7280;">
    エンジニア
  </p>
</div>`,
  },

  // ========== React Form ==========
  {
    name: 'Login Form',
    category: 'Form',
    framework: 'react',
    description: 'ログインフォーム',
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

  // ========== HTML Form ==========
  {
    name: 'Login Form (HTML)',
    category: 'Form',
    framework: 'html',
    description: 'ログインフォーム',
    code: `<div style="max-width: 400px; padding: 32px; background-color: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 24px; color: #111827;">
    ログイン
  </h2>
  <input
    type="email"
    placeholder="メールアドレス"
    style="width: 100%; padding: 12px; margin-bottom: 16px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;"
  />
  <input
    type="password"
    placeholder="パスワード"
    style="width: 100%; padding: 12px; margin-bottom: 24px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;"
  />
  <button style="width: 100%; padding: 12px; background-color: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer;">
    ログイン
  </button>
</div>`,
  },

  // ========== React Navigation ==========
  {
    name: 'Tab Navigation',
    category: 'Navigation',
    framework: 'react',
    description: 'タブナビゲーション',
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

  // ========== HTML Navigation ==========
  {
    name: 'Tab Navigation (HTML)',
    category: 'Navigation',
    framework: 'html',
    description: 'タブナビゲーション（静的）',
    code: `<div style="border-bottom: 2px solid #e5e7eb; display: flex; gap: 32px;">
  <button style="padding: 12px 0; background-color: transparent; border: none; border-bottom: 2px solid #3b82f6; color: #3b82f6; font-weight: 600; font-size: 14px; cursor: pointer; margin-bottom: -2px;">
    概要
  </button>
  <button style="padding: 12px 0; background-color: transparent; border: none; border-bottom: 2px solid transparent; color: #6b7280; font-weight: 400; font-size: 14px; cursor: pointer; margin-bottom: -2px;">
    詳細
  </button>
  <button style="padding: 12px 0; background-color: transparent; border: none; border-bottom: 2px solid transparent; color: #6b7280; font-weight: 400; font-size: 14px; cursor: pointer; margin-bottom: -2px;">
    レビュー
  </button>
</div>`,
  },
];