## 全体アーキテクチャ (DDD観点)

DDDをフロントエンド（特にReact）に適用する場合、以下のようにざっくり4つのレイヤーに分割して考えるのが一案です。

1. **Domain**  
   - ビジネスルールやエンティティの定義を置く場所。  
   - 今回のケースでは「録音データ」「録音状態管理」など、音声録音にまつわるコアロジックを定義する。
   - Value Object、Entity、Domain Serviceなどを作る場合はここにまとめる。

2. **Application (UseCase)**  
   - Domainを活用しつつ、アプリケーションとしての操作やユースケースをまとめる。  
   - 例: 「音声を録音し始める」「録音を停止する」「録音データを変換してサーバーへ送る」などの操作を一元的に定義する。
   - DomainとPresentationを繋ぐ役割を担う（Domainの知識をUIに漏らさないようにする）。

3. **Infrastructure**  
   - 外部とのやりとりの具体的な実装、例えばAPIコール部分や、ブラウザ機能を直接操作する部分を配置。  
   - Reactなら`fetch`や`axios`を使ってサーバー通信するコンポーネント、Web Audio APIの低レベルな操作などはここに配置し、DomainやApplicationからは抽象化して呼び出す形を取る。

4. **Presentation**  
   - ReactコンポーネントやAnt DesignなどのUIロジックを配置。
   - アプリの見た目やユーザーとのインタラクション担当。  
   - ApplicationレイヤーのUseCaseを呼び出すことでフローを実装する。

---

## テスト駆動開発 (TDD) の配置

- **Unit Test**  
  - Domainのエンティティや値オブジェクトをテストする(Unit Test)。  
  - Applicationのユースケース（メソッド）ごとのテスト。  
- **Integration Test / Component Test**  
  - 実際のコンポーネント（Presentation）からApplicationレイヤーを呼び出して、想定通り動作するかをReact Testing Libraryなどで検証。
- （必要に応じて**E2Eテスト**をCypressなどで行う場合もあるが、モック段階では必須ではない。）

---

## ディレクトリツリー例

プロジェクト名を仮に`voice-chat-app`とした場合の例です。  
初期段階では以下のようにざっくりと整理しておき、必要に応じてサブディレクトリを切っていきます。

```
voice-chat-app
├── package.json
├── tsconfig.json
├── yarn.lock (またはpackage-lock.json)
├── .eslintrc.js (または.json)
├── .prettierrc   (コードフォーマット用)
├── public
│   └── index.html
├── src
│   ├── domain
│   │   ├── audio
│   │   │   ├── Audio.ts
│   │   │   ├── AudioRecorder.ts
│   │   │   └── ... (Value Object, Entity など)
│   │   └── ... (他にドメインが増えたら増やす)
│   ├── application
│   │   ├── audio
│   │   │   ├── RecordAudioUseCase.ts
│   │   │   ├── StopRecordingUseCase.ts
│   │   │   ├── SendAudioUseCase.ts
│   │   │   └── ... (ユースケースをまとめる)
│   │   └── ... (他にユースケースが増えたら増やす)
│   ├── infrastructure
│   │   ├── audio
│   │   │   ├── AudioRecorderGateway.ts
│   │   │   ├── AudioSenderGateway.ts
│   │   │   └── ... (ブラウザAPI/外部API通信などの具体実装)
│   │   └── ... (他のインフラ要素が増えたら増やす)
│   ├── presentation
│   │   ├── components
│   │   │   ├── AudioRecorderButton.tsx
│   │   │   ├── AudioPlayer.tsx
│   │   │   └── ... (UI部品をまとめる)
│   │   ├── pages
│   │   │   ├── HomePage.tsx
│   │   │   └── ...
│   │   ├── App.tsx
│   │   └── index.tsx (Reactエントリポイント)
│   └── tests
│       ├── domain
│       │   └── audio
│       │       ├── Audio.test.ts
│       │       └── AudioRecorder.test.ts
│       ├── application
│       │   └── audio
│       │       ├── RecordAudioUseCase.test.ts
│       │       ├── StopRecordingUseCase.test.ts
│       │       └── SendAudioUseCase.test.ts
│       ├── infrastructure
│       │   └── audio
│       │       ├── AudioRecorderGateway.test.ts
│       │       └── AudioSenderGateway.test.ts
│       └── presentation
│           └── components
│               ├── AudioRecorderButton.test.tsx
│               └── ...
└── ...
```

### それぞれのディレクトリの役割

- **src/domain**  
  - フロントエンドでも取り扱う核心ロジック(録音データ・録音状態・変換方法など)。  
  - できるだけ外部ライブラリに依存しない形で書いておく。  
- **src/application**  
  - ユースケースの集まり。  
  - 「録音開始」「録音停止」「サーバーへ送る」など、複数のドメイン要素を組み合わせた操作の流れを定義する。  
- **src/infrastructure**  
  - ブラウザ機能（`navigator.mediaDevices.getUserMedia`や`MediaRecorder`）のラッパや、HTTP通信処理等。  
  - たとえば`AudioRecorderGateway`は、実際にMediaRecorder APIを呼び出してPCMデータを取得し、その生データ or Blobを返す。  
  - `AudioSenderGateway`は、そのBlobデータをAPIサーバーへ送信するなど。  
- **src/presentation**  
  - UI。Reactコンポーネント＆Ant Designのコンポーネントを活用して表示周りを作る。  
  - コンポーネントからApplicationのユースケースを呼び出し、処理結果を画面に反映。  
- **src/tests**  
  - テストコード用ディレクトリ。  
  - レイヤーごとにフォルダを分けて、対象となるクラスや関数と同階層のフォルダ構造を持たせると管理しやすい。

---

## Ant Design導入メモ

- `npm install antd` (もしくは`yarn add antd`)  
- `import 'antd/dist/reset.css';`などでCSSを導入して、グローバルに適用する。  
- ボタンやモーダルなどを使ってUIを作りやすくする。

---

## モック段階の進め方

1. **Domain**  
   - 「録音データを表す型 (Audio.ts)」を用意する。  
   - 「録音状態管理やバッファ管理クラス (AudioRecorder.ts)」を定義。  
   - ユニットテストをDomainから書き始める。

2. **Application**  
   - 「録音開始 (RecordAudioUseCase)」「録音停止 (StopRecordingUseCase)」「ファイル送信 (SendAudioUseCase)」などのユースケースを仮で定義する。  
   - モックなので実際の処理は簡単にしつつ、テストだけ先に書いて TDD で進める。

3. **Infrastructure**  
   - 実際にブラウザAPIを叩いて録音データを取得する`AudioRecorderGateway`（仮実装）を用意。  
   - ファイル送信を行う`AudioSenderGateway`（モック実装）も用意しておき、UseCaseが呼べる形にする。

4. **Presentation**  
   - Ant DesignのButtonやIconを利用して「録音開始」「停止」「送信」ボタンを配置したページを作る。  
   - ApplicationレイヤーのUseCaseを呼び出すだけのフローをまず組み、「とりあえず録音→ファイルを生成→送信」の一連をテストできるようにする。

5. **テストの流れ**  
   - Domainのユニットテスト → Applicationのユニットテスト → Infrastructureとの連携テスト → Presentationのコンポーネントテスト、とスコープを広げていく。

---

## 今後の拡張イメージ

- 音声認識や会話AIとの連携は**Infrastructure**レイヤー（API呼び出し）を拡張し、**Application**レイヤーに「AIに問い合わせる」ユースケースを追加する形で対応する。  
- ストリーミング対応を加える場合は、`AudioRecorderGateway`内でWebSocketやストリーミングAPIを扱い、DomainやApplicationへ逐次データを渡す仕掛けに作り変えていく。  
- ユーザー管理や状態管理が必要な場合は、React Query / Redux Toolkit / Recoil などをプレゼンテーション層寄りで利用するか、DDDのレイヤー構造に合わせてカスタムHookで実装する等、アプローチを追加していく。
