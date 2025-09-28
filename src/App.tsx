// src/App.tsx
import { useState, useEffect } from 'react'
import {
  Box,
  Text,
  Button,
  VStack,
  Flex,
} from '@chakra-ui/react'
import type { Vocabulary } from './types/vocabulary'
import './App.css'

import vocabularyData from '../data/vocabulary.json'

// Fisher-Yatesシャッフルアルゴリズム
const shuffleArray = (array: Vocabulary[]): Vocabulary[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled
}


function App() {
  const [revealedWords, setRevealedWords] = useState<Set<number>>(new Set())
  const [shuffledVocabulary, setShuffledVocabulary] = useState<Vocabulary[]>([])
  const [isFlipped, setIsFlipped] = useState(false)

  // 初回レンダリング時に単語をシャッフル
  useEffect(() => {
    setShuffledVocabulary(shuffleArray(vocabularyData))
  }, [])

  const getWordsPerPage = () => {
    const rowHeight = 38 // 1行の高さ(px)
    const availableHeight = window.innerHeight - 70
    return Math.max(3, Math.floor(availableHeight / rowHeight) - 1)
  }

  const [wordsPerPage, setWordsPerPage] = useState(getWordsPerPage())

  // 画面リサイズ時に再計算
  useEffect(() => {
    const handleResize = () => setWordsPerPage(getWordsPerPage())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // スクロールハンドラ
  const [wheelAmount, setWheelAmount] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const handleScroll = (e: React.WheelEvent) => {
    setWheelAmount(prev => Math.max(0, prev + e.deltaY * 0.9))
  }

  // タッチイベントハンドラ
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return

    const currentTouch = e.touches[0].clientY
    const diff = touchStart - currentTouch
    const scrollDelta = diff * 0.9

    if (Math.abs(scrollDelta) > 5) { // 最小スクロール量を設定
      setWheelAmount(prev => Math.max(0, prev + scrollDelta))
      setTouchStart(currentTouch)
    }
  }

  const handleTouchEnd = () => {
    setTouchStart(null)
  }

  const getCurrentWordsInfo = () => {
    if (shuffledVocabulary.length === 0) return { words: [], startIndex: 0 } // シャッフル中は空配列を返す

    const rowHeight = 38
    const startIndex = Math.max(0, Math.floor(wheelAmount / rowHeight))

    // 適切なクリッピング：配列の範囲内に収める
    const clampedStartIndex = Math.min(startIndex, Math.max(0, shuffledVocabulary.length - wordsPerPage))
    const endIndex = Math.min(clampedStartIndex + wordsPerPage, shuffledVocabulary.length)

    return {
      words: shuffledVocabulary.slice(clampedStartIndex, endIndex),
      startIndex: clampedStartIndex
    }
  }

  const { words: currentWords, startIndex: currentStartIndex } = getCurrentWordsInfo()

  const revealJapaneseWord = (relativeIndex: number) => {
    const absoluteIndex = currentStartIndex + relativeIndex
    setRevealedWords(prev => {
      const next = new Set(prev)
      next.add(absoluteIndex)
      return next
    })
  }

  const nextPage = () => {
    const rowHeight = 38
    const scrollIncrement = rowHeight * wordsPerPage
    setWheelAmount(prev => prev + scrollIncrement)
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <Box className="app-container">
      <VStack height="100%">
        {/* ヘッダー部分 */}
        <Flex
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={isFlipped ? "row-reverse" : "row"}
        >
          <Button
            backgroundColor="green.600"
            size="md"
            onClick={toggleFlip}
            transition="all 0.2s"
            _hover={{ transform: "scale(1.05)" }}
          >
            反転
          </Button>

          <Text
            fontSize="xl"
            fontWeight="bold"
          >
            英単語暗記アプリ
          </Text>

          <Button
            backgroundColor="blue.600"
            size="md"
            onClick={nextPage}
            transition="all 0.2s"
            _hover={{ transform: "scale(1.05)" }}
          >
            次へ
          </Button>
        </Flex>

        <Box
          className="table-container"
          onWheel={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Box className="vocabulary-box vocabulary-table">
            {/* ヘッダー */}
            <Flex className="table-header" flexDirection={isFlipped ? "row-reverse" : "row"}>
              <Box className="header-cell">
                英語
              </Box>
              <Box className="header-cell">
                日本語
              </Box>
            </Flex>

            {/* データ行 */}
            {currentWords.map((word, index) => {
              const absoluteIndex = currentStartIndex + index
              const revealed = revealedWords.has(absoluteIndex)
              return (
                <Flex key={`${word.id}-${absoluteIndex}`}
                  className="table-row"
                  flexDirection={isFlipped ? "row-reverse" : "row"}
                >
                  <Box
                    className="english-cell"
                    fontSize={word.en.length > 20 ? "md" : "xl"}
                  >
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => { window.open(`https://ejje.weblio.jp/content/${word.en}`, '_blank') }}
                    >
                      {word.en}
                    </span>
                  </Box>
                  <Box
                    className={`japanese-cell ${revealed ? 'revealed' : 'hidden'}`}
                    fontSize={revealed ? (word.ja.length > 10 ? "md" : "xl") : "md"}
                    onClick={() => revealJapaneseWord(index)}
                    cursor={revealed ? 'default' : 'pointer'}
                  >
                    {revealed ? word.ja : "答え"}
                  </Box>
                </Flex>
              )
            })}
          </Box>
        </Box>
      </VStack>
    </Box>
  )
}

export default App
