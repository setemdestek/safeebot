import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, buttonVariants } from '../button';

describe('Button', () => {
    it('renders correctly with default props', () => {
        render(<Button>Click me</Button>);
        const btn = screen.getByRole('button', { name: 'Click me' });
        expect(btn).toBeInTheDocument();
        // The default variant and size should be applied (from variants cva)
        expect(btn).toHaveClass('h-10 px-5 py-2'); // default size
        expect(btn).toHaveClass('bg-[hsl(var(--primary))]'); // default variant
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Clickable</Button>);
        const btn = screen.getByRole('button', { name: 'Clickable' });
        fireEvent.click(btn);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled Button</Button>);
        const btn = screen.getByRole('button', { name: 'Disabled Button' });
        expect(btn).toBeDisabled();
        expect(btn).toHaveClass('disabled:opacity-50');
    });

    it('applies custom variant classes', () => {
        render(<Button variant="destructive">Destructive</Button>);
        const btn = screen.getByRole('button', { name: 'Destructive' });
        expect(btn).toHaveClass('bg-[hsl(var(--destructive))]');
    });

    it('applies custom size classes', () => {
        render(<Button size="sm">Small</Button>);
        const btn = screen.getByRole('button', { name: 'Small' });
        expect(btn).toHaveClass('h-9 rounded-md px-3 text-xs');
    });

    it('renders as a child element using asChild prop', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        const linkElem = screen.getByRole('link', { name: 'Link Button' });
        expect(linkElem).toBeInTheDocument();
        expect(linkElem.tagName).toBe('A');
        expect(linkElem).toHaveAttribute('href', '/test');
        expect(linkElem).toHaveClass(buttonVariants({ variant: 'default', size: 'default' }));
    });
});
