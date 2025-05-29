# Claude Max OAuth認証情報の取得と設定方法

## 認証情報の取得方法

### 方法1: ブラウザの開発者ツールから取得

1. **Claudeにログイン**
   - https://claude.ai にアクセス
   - Claude Maxアカウントでログイン

2. **開発者ツールを開く**
   - Chrome/Edge: F12 または 右クリック → 検証
   - Safari: 環境設定 → 詳細 → メニューバーに"開発"メニューを表示 → 開発 → Webインスペクタを表示

3. **認証情報を確認**
   - Application/Storage → Local Storage → claude.ai
   - 以下のキーを探す：
     - `accessToken`
     - `refreshToken`
     - `expiresAt`

### 方法2: Claude Codeから取得（推奨）

1. **新しいターミナルで実行**
   ```bash
   claude /status
   ```

2. **認証状態を確認**
   - ログインしている場合、認証情報が内部に保存されている

3. **macOSの場合、Keychainから取得**
   ```bash
   security find-generic-password -s "claude-code" -w
   ```

## GitHub Secretsの設定

### 1. コマンドラインから設定

```bash
# アクセストークンを設定
gh secret set CLAUDE_ACCESS_TOKEN --body "YOUR_ACCESS_TOKEN" --repo kurumaruebi/barcode-inventory

# リフレッシュトークンを設定
gh secret set CLAUDE_REFRESH_TOKEN --body "YOUR_REFRESH_TOKEN" --repo kurumaruebi/barcode-inventory

# 有効期限を設定（Unix timestamp）
gh secret set CLAUDE_EXPIRES_AT --body "YOUR_EXPIRES_AT" --repo kurumaruebi/barcode-inventory
```

### 2. GitHub Webサイトから設定

1. https://github.com/kurumaruebi/barcode-inventory/settings/secrets/actions
2. "New repository secret" をクリック
3. 以下を追加：
   - Name: `CLAUDE_ACCESS_TOKEN`
   - Value: [取得したアクセストークン]
   - Name: `CLAUDE_REFRESH_TOKEN`
   - Value: [取得したリフレッシュトークン]
   - Name: `CLAUDE_EXPIRES_AT`
   - Value: [取得した有効期限]

## 注意事項

- トークンは定期的に更新が必要
- セキュリティ上、トークンを他人と共有しない
- Claude Maxの利用規約に従って使用する

## テスト方法

設定完了後、GitHubのIssueで以下のようにコメント：

```
@claude バーコードスキャン機能を改善してください
```

正常に動作すれば、Claudeが自動的にコードを修正します。