import { type ReactNode } from 'react'
import { Box, VStack } from '@chakra-ui/react'
import { AppHeader } from './index'
import '../App.css'

interface QuizLayoutProps {
    isFlipped: boolean
    onToggleFlip: () => void
    onNextPage: () => void
    scrollHandlers: {
        onWheel: (event: React.WheelEvent) => void
        onTouchStart: (event: React.TouchEvent) => void
        onTouchMove: (event: React.TouchEvent) => void
        onTouchEnd: (event: React.TouchEvent) => void
    }
    children: ReactNode
}

export function QuizLayout({
    isFlipped,
    onToggleFlip,
    onNextPage,
    scrollHandlers,
    children
}: QuizLayoutProps) {
    return (
        <Box className="app-container">
            <VStack height="100%">
                {/* ヘッダー部分 */}
                <AppHeader
                    isFlipped={isFlipped}
                    onToggleFlip={onToggleFlip}
                    onNextPage={onNextPage}
                />

                {/* テーブル部分 */}
                <Box
                    className="table-container"
                    onWheel={scrollHandlers.onWheel}
                    onTouchStart={scrollHandlers.onTouchStart}
                    onTouchMove={scrollHandlers.onTouchMove}
                    onTouchEnd={scrollHandlers.onTouchEnd}
                >
                    {children}
                </Box>
            </VStack>
        </Box>
    )
}