import { Audio } from '../../domain/audio/Audio'
import { config } from '../config'

/**
 * 音声データをDifyのエンドポイントに送信し、
 * その後、ファイルIDを使ってワークフローを実行する例
 */
export class AudioSenderGateway {
  constructor() { }

  /**
   * 1) /files/upload に対して音声をアップロード
   * 2) レスポンスから file_id を取得
   * 3) /workflows/run に対して file_id を使い、ワークフローを実行
   * 4) 結果(テキストなど)を返す
   */
  public async send(audio: Audio): Promise<string> {
    const API_KEY = import.meta.env.VITE_WHISPER_API_KEY || ''
    if (!API_KEY) {
      throw new Error('APIキーが設定されていません')
    }

    // -------------------
    // (1) ファイルアップロード
    // -------------------
    const file = new File([audio.rawData], 'recorded-audio.wav', {
      type: 'audio/wav',
    })
    const formData = new FormData()
    // DifyのAPIが要求するデータをセット
    formData.append('file', file)
    // 例: 必須ならユーザー情報などを入れる
    formData.append('user', 'abc-123')

    // アップロード先URL (configに /files/upload を含める)
    const difyBaseURL = config.DIFY_BASE_URL
    const uploadRes = await fetch(`${difyBaseURL}/files/upload`, {
      method: 'POST',
      // multipart/form-dataで送るので、Content-Typeはブラウザに任せる
      headers: {
        // ここでは 'Content-Type' は付与しない（FormDataが自動で設定する）
        Authorization: `Bearer ${API_KEY}`,
      },
      body: formData,
    })

    if (!uploadRes.ok) {
      throw new Error(`Failed to upload audio: ${uploadRes.statusText}`)
    }

    // JSONをパースしてファイルIDを取得
    // Pythonの例でいう response.json()["id"] に相当
    const uploadJson = await uploadRes.json()
    const fileId = uploadJson.id
    if (!fileId) {
      throw new Error('Upload succeeded, but no file ID returned')
    }

    // -------------------
    // (2) ワークフロー実行
    // -------------------
    // 今回はPython例を参考に "workflows/run" へPOSTする前提
    // Difyのワークフロー実行用のペイロードを構築
    const runPayload = {
      inputs: {
        audio: {
          type: 'audio',
          transfer_method: 'local_file',
          upload_file_id: fileId,
        },
      },
      response_mode: 'blocking',
      user: 'abc-123',
    }

    const runRes = await fetch(`${difyBaseURL}/workflows/run`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(runPayload),
    })

    if (!runRes.ok) {
      throw new Error(`Failed to run workflow: ${runRes.statusText}`)
    }

    const runJson = await runRes.json()
    // Python例では runJson["data"]["outputs"]["text"] を取得
    // レスポンスの構造はDify側の設定次第
    const text = runJson?.data?.outputs?.text ?? ''

    return text
  }
}
