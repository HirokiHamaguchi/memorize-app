/**
 * 音声読み上げ用のユーティリティ関数
 */

export interface SpeakOptions {
    rate?: number
    volume?: number
    pitch?: number
}

/**
 * テキストを指定した言語で読み上げる
 * @param text 読み上げるテキスト
 * @param lang 言語コード (例: 'en-US', 'ja-JP')
 * @param options 読み上げオプション
 * @returns Promise<void>
 */
export function speak(text: string, lang: string, options: SpeakOptions = {}): Promise<void> {
    return new Promise((resolve) => {
        const utter = new SpeechSynthesisUtterance(text)
        utter.lang = lang
        utter.rate = options.rate ?? 1.0
        utter.volume = options.volume ?? 1.0
        utter.pitch = options.pitch ?? 1.0
        utter.onend = () => resolve()
        speechSynthesis.speak(utter)
    })
}

/**
 * 音声読み上げを停止する
 */
export function stopSpeech(): void {
    speechSynthesis.cancel()
}

/**
 * 指定した時間待機する
 * @param ms ミリ秒
 * @returns Promise<void>
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}