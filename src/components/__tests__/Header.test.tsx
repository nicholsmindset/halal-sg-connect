import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import Header from '../Header'

describe('Header', () => {
  it('renders header component', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('contains site branding', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header.textContent).toBeTruthy()
  })

  it('renders login button when not authenticated', () => {
    render(<Header />)
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('renders sign up button', () => {
    render(<Header />)
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
  })
})
