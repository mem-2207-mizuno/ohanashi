import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AudioRecorderButton } from '../../../presentation/components/AudioRecorderButton'
import '@testing-library/jest-dom'

describe('AudioRecorderButton', () => {
  it('初期表示で「録音開始」というボタンが存在する', () => {
    render(<AudioRecorderButton />)
    const button = screen.getByRole('button', { name: '録音開始' })
    expect(button).toBeInTheDocument()
  })

  it('録音開始ボタンをクリックすると「停止」に切り替わる', () => {
    render(<AudioRecorderButton />)
    const button = screen.getByRole('button', { name: '録音開始' })

    fireEvent.click(button)

    // クリック後にボタンのラベルが「停止」に変化したことを確認
    expect(button.textContent).toBe('停止')
  })
})