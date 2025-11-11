export interface Vocabulary {
    id: number;
    en: string;
    ja: string;
}

export interface Geography {
    id: number;
    iso: string;  // ISO country code (e.g., "ad", "ae")
    ja: string;
    flag: string;
    pos: string;
    url: string;
    emoji: string;
    capital: string;
    note: string;
}
