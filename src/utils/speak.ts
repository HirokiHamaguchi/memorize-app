/**
 * 音声読み上げ用のユーティリティ関数
 */

export interface SpeakOptions {
    rate?: number
    volume?: number
    pitch?: number
}

// 現在アクティブなSpeechSynthesisUtteranceを追跡
let activeSpeech: SpeechSynthesisUtterance | null = null
let activeSpeechResolve: (() => void) | null = null

/**
 * テキストを指定した言語で読み上げる
 * @param text 読み上げるテキスト
 * @param lang 言語コード (例: 'en-US', 'ja-JP')
 * @param options 読み上げオプション
 * @returns Promise<void>
 */
export function speak(text: string, lang: string, options: SpeakOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
        // 既存の音声を停止
        if (activeSpeech && speechSynthesis.speaking) {
            speechSynthesis.cancel()
            if (activeSpeechResolve) {
                activeSpeechResolve()
                activeSpeechResolve = null
            }
        }

        const utter = new SpeechSynthesisUtterance(text)
        utter.lang = lang
        utter.rate = options.rate ?? 1.0
        utter.volume = options.volume ?? 1.0
        utter.pitch = options.pitch ?? 1.0

        // グローバル変数に保存
        activeSpeech = utter
        activeSpeechResolve = resolve

        utter.onend = () => {
            activeSpeech = null
            activeSpeechResolve = null
            resolve()
        }

        utter.onerror = (event) => {
            activeSpeech = null
            activeSpeechResolve = null
            reject(event.error || new Error('Speech synthesis error'))
        }

        speechSynthesis.speak(utter)
    })
}

/**
 * 音声読み上げを停止する
 */
export function stopSpeech(): void {
    speechSynthesis.cancel()

    // アクティブな音声のPromiseを解決
    if (activeSpeechResolve) {
        activeSpeechResolve()
        activeSpeechResolve = null
    }

    activeSpeech = null
}

/**
 * 指定した時間待機する
 * @param ms ミリ秒
 * @returns Promise<void>
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 音声が現在再生中かどうかを確認する
 * @returns boolean
 */
export function isSpeaking(): boolean {
    return speechSynthesis.speaking || activeSpeech !== null
}

/**
 * ページ遷移時などのクリーンアップ処理
 * すべての音声を停止し、状態をリセットする
 */
export function cleanupSpeech(): void {
    stopSpeech()
}

// ページのbeforeunloadイベントでクリーンアップを実行
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanupSpeech)

    // ページの可視性が変更された時（タブ切り替えなど）にも停止
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cleanupSpeech()
        }
    })
}