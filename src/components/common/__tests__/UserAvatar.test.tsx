import React from 'react';
import { render, screen } from '@testing-library/react';
import { UserAvatar } from '../UserAvatar';

// Mock Radix Avatar to render the image directly since it relies on onLoad events
jest.mock('@radix-ui/react-avatar', () => ({
    Root: ({ children, className }: any) => <div className={className} data-testid="avatar-root">{children}</div>,
    Image: ({ src, alt, className }: any) => <img src={src} alt={alt} className={className} />,
    Fallback: ({ children, className }: any) => <div className={className} data-testid="avatar-fallback">{children}</div>,
}));

describe('UserAvatar', () => {
    it('renders with default seed when no id is provided', () => {
        render(<UserAvatar alt="Default Avatar" />);
        const img = screen.getByRole('img', { name: 'Default Avatar' });
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', expect.stringContaining('safebot-default-user'));
    });

    it('renders with provided id as seed', () => {
        const testId = 'test-user-123';
        const { container } = render(<UserAvatar id={testId} alt="Test Avatar" />);
        const img = container.querySelector('img');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', expect.stringContaining(testId));
    });

    it('applies custom className', () => {
        const { container } = render(<UserAvatar className="test-class-name" alt="Test Avatar" />);
        // The root element is usually a span
        const avatarSpan = container.firstChild as HTMLElement;
        expect(avatarSpan).toHaveClass('test-class-name');
    });
});
