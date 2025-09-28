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
  const [currentPage, setCurrentPage] = useState(0)
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

  const getCurrentWords = () => {
    if (shuffledVocabulary.length === 0) return [] // シャッフル中は空配列を返す
    const startIndex = currentPage * wordsPerPage
    const endIndex = Math.min(startIndex + wordsPerPage, shuffledVocabulary.length)
    return shuffledVocabulary.slice(startIndex, endIndex)
  }

  const currentWords = getCurrentWords()

  const revealJapaneseWord = (index: number) => {
    setRevealedWords(prev => {
      const next = new Set(prev)
      next.add(index)
      return next
    })
  }

  const allRevealed = currentWords.every((_, index) => revealedWords.has(index))

  const nextPage = () => {
    if (shuffledVocabulary.length === 0) return
    setCurrentPage((prev) => (prev + 1) % Math.ceil(shuffledVocabulary.length / wordsPerPage))
    setRevealedWords(new Set())
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
            colorScheme="green"
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
            color="blue.600"
          >
            英単語暗記アプリ
          </Text>


          <Button
            colorScheme="blue"
            size="md"
            onClick={nextPage}
            opacity={allRevealed ? 1 : 0.5}
            transition="all 0.2s"
            _hover={allRevealed ? { transform: "scale(1.05)" } : {}}
          >
            次へ
          </Button>
        </Flex>

        <Box className="table-container">
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
              const revealed = revealedWords.has(index)
              return (
                <Flex key={`${currentPage}-${index}`}
                  className="table-row"
                  flexDirection={isFlipped ? "row-reverse" : "row"}
                >
                  <Box
                    className="english-cell"
                    fontSize={word.en.length > 20 ? "md" : "xl"}
                  >
                    {word.en}
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
