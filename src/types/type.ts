export interface Flag {
    id: string;
    code: string;  // ISO country code (e.g., "ad", "ae")
    ja: string;    // Japanese name (e.g., "アンドラ")
    svg: string;   // SVG path
}

export interface Vocabulary {
    id: string;
    en: string;
    ja: string;
}