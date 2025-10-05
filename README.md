```markdown
# ComponentBridge

**Reactコンポーネントを管理し、実データでシミュレーション、Figmaへエクスポートできる個人用ツール**

![ComponentBridge Screenshot](https://via.placeholder.com/800x400/3b82f6/ffffff?text=ComponentBridge+Screenshot)

## 概要

ComponentBridgeは、Reactコンポーネントの作成・管理・シミュレーション・エクスポートを一元化するツールです。コードとデザインの往復作業を効率化し、実データでの見た目確認を簡単にします。

### 主な機能

- **コンポーネント管理**: 作成・保存・編集・削除
- **データシミュレーション**: JSON形式でpropsを指定してプレビュー
- **Figmaエクスポート**: SVG/PNG形式でコピー（制限あり）
- **テンプレート**: 18種類の実用的なコンポーネント
- **検索・フィルター**: 名前・カテゴリで絞り込み
- **エクスポート/インポート**: JSON形式でバックアップ・共有

![Feature Overview](https://via.placeholder.com/800x300/10b981/ffffff?text=Feature+Overview)

## クイックスタート

```bash
# リポジトリをクローン
git clone https://github.com/kissyossy6/component-bridge.git
cd component-bridge

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

## 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **データ永続化**: localStorage
- **UI**: Lucide React (アイコン)
- **エクスポート**: dom-to-svg, html-to-image

## 使い方

### 1. 新規コンポーネントの作成

![Component Creation](https://via.placeholder.com/600x400/6366f1/ffffff?text=Component+Creation)

1. **コードエディタ**に以下のようなReactコンポーネントを入力:

```jsx
const MyButton = ({ text, color }) => {
  return (
    <button style={{
      padding: '12px 24px',
      backgroundColor: color || '#3b82f6',
      color: 'white',
      borderRadius: '8px',
    }}>
      {text || 'ボタン'}
    </button>
  );
};
```

2. **データ入力**でpropsを指定:

```json
{
  "text": "クリック",
  "color": "#10b981"
}
```

3. プレビューで確認 → **保存**

### 2. Figmaへのエクスポート

![Figma Export](https://via.placeholder.com/600x300/8b5cf6/ffffff?text=Figma+Export)

1. コンポーネントを選択またはプレビュー表示
2. 「SVGでコピー」または「PNGでコピー」をクリック
3. Figmaで `Cmd+V` (Mac) / `Ctrl+V` (Windows) で貼り付け

### 3. テンプレートの活用

「テンプレート」ボタンから18種類のテンプレートを選択可能:
- Button (3種類)
- Card (3種類)
- Form (2種類)
- Layout (3種類)
- Navigation (3種類)
- Other (4種類)

## コンポーネント記法ガイドライン

SVG/PNG出力時の制限事項により、以下の記法を推奨します。

### 避けるべき記法

```jsx
// NG: CSSアニメーション
animation: 'spin 1s infinite'

// NG: 複雑なテンプレートリテラル
border: `2px solid ${disabled ? '#9ca3af' : '#3b82f6'}`

// NG: useState/useEffectを使った動的な値
const [rotation, setRotation] = useState(0);
```

### 推奨する記法

```jsx
// OK: 文字列結合
border: '2px solid ' + (disabled ? '#9ca3af' : '#3b82f6')

// OK: 事前に変数化
const borderColor = disabled ? '#9ca3af' : '#3b82f6';
border: '2px solid ' + borderColor

// OK: シンプルな条件分岐
backgroundColor: disabled ? '#9ca3af' : '#3b82f6'
```

### ベストプラクティス

1. **padding/marginを十分に確保** - 枠切れ防止
2. **固定サイズを明示的に指定** - width/heightを設定
3. **シンプルな構造** - ネスト3階層まで、50行以内
4. **静的なスタイル値を優先** - 動的計算は最小限に

詳細は [コンポーネント記法ガイドライン](docs/component-guidelines.md) を参照してください。

## 既知の制限事項

### Figmaエクスポート

- **SVG**: 一部のコンポーネントで枠が切れる場合あり（dom-to-svgの制限）
- **PNG**: 不安定（真っ白になることがある）
- **推奨**: SVG出力を優先、問題がある場合はコードを簡素化

### 対応フレームワーク

- 現在はReact JSXのみ対応
- Vue/Svelteは将来的に対応予定（Phase 6以降）

## プロジェクト構成

```
component-bridge/
├── src/
│   ├── App.tsx              # メインコンポーネント
│   ├── App.css              # スタイル
│   ├── utils/
│   │   ├── figmaExport.ts   # SVG/PNG変換
│   │   └── templates.ts     # テンプレートデータ
│   └── components/          # （未使用）
├── public/
└── docs/                    # ドキュメント
```

## ロードマップ

### Phase 5 (完了)
- 基本機能（CRUD）
- データシミュレーション
- Figmaエクスポート
- テンプレート機能
- 検索・フィルター
- エクスポート/インポート

### Phase 6 (予定)
- レスポンシブ表示切り替え
- Monaco Editorへのアップグレード
- コード整形機能
- Vue/Svelte対応

### Phase 7以降 (検討中)
- Figma Plugin開発
- AIによる最適化提案
- チーム機能
- バージョン管理

## コントリビューション

現在は個人開発プロジェクトですが、フィードバックやバグ報告は歓迎します。

## ライセンス

MIT License

## 作者

[@kissyossy6](https://github.com/kissyossy6)

---

**開発期間**: 2025年10月〜  
**現在のバージョン**: Phase 5 (Fixed)
```

このREADMEをプロジェクトルートに `README.md` として保存してください。

画像リンクは `https://via.placeholder.com` のプレースホルダーを使用しています。実際のスクリーンショットを撮影したら、以下のように置き換えてください:

```markdown
![ComponentBridge Screenshot](./docs/images/screenshot.png)
```

スクリーンショットは以下を撮影することをおすすめします:
1. メイン画面全体
2. コンポーネント作成フロー
3. Figmaエクスポート画面
4. テンプレート選択画面