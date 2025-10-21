import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders footer component', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('contains site branding', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer.textContent).toContain('Halal SG Connect');
  });

  it('displays copyright information', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(currentYear.toString()))
    ).toBeInTheDocument();
  });
});
