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

  // 初回レンダリング時に単語をシャッフル
  useEffect(() => {
    setShuffledVocabulary(shuffleArray(vocabularyData))
  }, [])

  const getWordsPerPage = () => {
    const headerRows = 3 // ヘッダー部分+tableの最初の行+余白が3行分
    const rowHeight = 56 // 1行の高さ(px)（例: Chakraのp={4} + fontSize）
    const windowHeight = window.innerHeight
    const availableHeight = windowHeight
    return Math.max(3, Math.floor(availableHeight / rowHeight) - headerRows)
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

  const toggleJapanese = (index: number) => {
    setRevealedWords(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const allRevealed = currentWords.every((_, index) => revealedWords.has(index))

  const nextPage = () => {
    if (shuffledVocabulary.length === 0) return
    setCurrentPage((prev) => (prev + 1) % Math.ceil(shuffledVocabulary.length / wordsPerPage))
    setRevealedWords(new Set())
  }

  return (
    <Box minHeight="100vh" p={4} bg="gray.50">
      <VStack height="100%">
        {/* ヘッダー部分：タイトルと次へボタン */}
        <Flex
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="blue.600"
          >
            英単語暗記アプリ
          </Text>


          {/* 次へボタン - 常に表示、allRevealed時に有効 */}
          <Button
            colorScheme="blue"
            size="md"
            onClick={nextPage}
            disabled={!allRevealed}
            opacity={allRevealed ? 1 : 0.5}
            transition="all 0.2s"
            _hover={allRevealed ? { transform: "scale(1.05)" } : {}}
          >
            次へ →
          </Button>
        </Flex>

        <Box width="100%" flex="1" overflowX="auto">
          <Box bg="white" borderRadius="md" shadow="sm" overflow="hidden">
            {/* ヘッダー */}
            <Flex bg="gray.100" fontWeight="bold" fontSize="lg">
              <Box flex="1" p={4} textAlign="center" borderRight="1px solid" borderColor="gray.200">
                英語
              </Box>
              <Box flex="1" p={4} textAlign="center">
                日本語
              </Box>
            </Flex>

            {/* データ行 */}
            {currentWords.map((word, index) => {
              const revealed = revealedWords.has(index)
              return (
                <Flex key={`${currentPage}-${index}`} borderBottom="1px solid" borderColor="gray.200">
                  <Box
                    flex="1"
                    p={4}
                    textAlign="center"
                    fontWeight="semibold"
                    fontSize="lg"
                    borderRight="1px solid"
                    borderColor="gray.200"
                  >
                    {word.english}
                  </Box>
                  <Box
                    flex="1"
                    p={4}
                    textAlign="center"
                    cursor="pointer"
                    onClick={() => toggleJapanese(index)}
                    bg={revealed ? "blue.50" : "gray.100"}
                    _hover={{ bg: revealed ? "blue.100" : "gray.200" }}
                    transition="all 0.2s"
                    fontSize="lg"
                  >
                    {revealed ? word.japanese : "答え"}
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
