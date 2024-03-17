# ソーシャルログイン　LINE編

<details open="open">
<summary>目次</summary>


- [ログインの流れ](#ログインの流れ)
  - [①LINEログイン画面にアクセス](#①LINEログイン画面にアクセス)
  - [②アプリにstateとcodeを返却](#②アプリにstateとcodeを返却)
  - [③アクセスToken発行を依頼](#③アクセスToken発行を依頼)



- [参考](#参考)

</details>

# ログインの流れ

### ①LINEログイン画面にアクセス

- 下記のコードのようにアクセス

```tsx
export const Login = () => {
    
    const loginClick = () => {
        const lineId = import.meta.env.VITE_LINE_CHANNEL_ID
        const redirecturl = import.meta.env.VITE_REDIRECT_URL
        const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${lineId}&redirect_uri=${redirecturl}&state=12345abcde&scope=openid&nonce=09876xyz`
        window.location.href = url;
    }
    
    return <>
        <button
            onClick={loginClick}
        >
           LINEでログイン
        </button>
    </>
}    
```

### ②アプリにstateとcodeを返却

### ③アクセスToken発行を依頼

- こんなとこ飛べるのかな？

# 参考
- [参考Quitta](https://qiita.com/raisack8/items/9336e815dacfa6a37a9e#0-%E3%83%81%E3%83%A3%E3%83%8D%E3%83%ABid%E5%8F%96%E5%BE%97%E6%96%B9%E6%B3%95)
- [LINE DEVELOPERS 公式ドキュメント](https://developers.line.biz/ja/reference/line-login/)
- [LINEボタンのルール](https://developers.line.biz/ja/docs/line-login/login-button/)
- 
