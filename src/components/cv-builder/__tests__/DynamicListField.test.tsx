import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DynamicListField from '@/components/cv-builder/common/DynamicListField';

jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

jest.mock('lucide-react', () => ({
  Plus: () => <span data-testid="plus-icon" />,
  Trash2: () => <span data-testid="trash-icon" />,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

interface TestItem {
  id: string;
  label: string;
}

const defaultItems: TestItem[] = [
  { id: 'item-1', label: 'First' },
  { id: 'item-2', label: 'Second' },
];

const defaultRenderItem = (item: TestItem) => <span>{item.label}</span>;

describe('DynamicListField', () => {
  it('renders title and add button', () => {
    render(
      <DynamicListField<TestItem>
        items={defaultItems}
        onAdd={jest.fn()}
        onRemove={jest.fn()}
        renderItem={defaultRenderItem}
        addLabel="Add Item"
        title="Test Section"
      />,
    );
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('calls onAdd when add button is clicked', () => {
    const onAdd = jest.fn();
    render(
      <DynamicListField<TestItem>
        items={defaultItems}
        onAdd={onAdd}
        onRemove={jest.fn()}
        renderItem={defaultRenderItem}
        addLabel="Add Item"
        title="Test Section"
      />,
    );
    fireEvent.click(screen.getByText('Add Item'));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('calls onRemove with correct item id when remove button is clicked', () => {
    const onRemove = jest.fn();
    render(
      <DynamicListField<TestItem>
        items={defaultItems}
        onAdd={jest.fn()}
        onRemove={onRemove}
        renderItem={defaultRenderItem}
        addLabel="Add Item"
        title="Test Section"
      />,
    );
    const removeButtons = screen.getAllByRole('button', { name: 'Remove' });
    fireEvent.click(removeButtons[0]);
    expect(onRemove).toHaveBeenCalledWith('item-1');
    fireEvent.click(removeButtons[1]);
    expect(onRemove).toHaveBeenCalledWith('item-2');
  });

  it('renders items via renderItem callback', () => {
    render(
      <DynamicListField<TestItem>
        items={defaultItems}
        onAdd={jest.fn()}
        onRemove={jest.fn()}
        renderItem={defaultRenderItem}
        addLabel="Add Item"
        title="Test Section"
      />,
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('hides add button when items.length >= maxItems', () => {
    const items: TestItem[] = [
      { id: 'a', label: 'A' },
      { id: 'b', label: 'B' },
    ];
    render(
      <DynamicListField<TestItem>
        items={items}
        onAdd={jest.fn()}
        onRemove={jest.fn()}
        renderItem={defaultRenderItem}
        addLabel="Add Item"
        title="Test Section"
        maxItems={2}
      />,
    );
    expect(screen.queryByText('Add Item')).not.toBeInTheDocument();
  });

  it('shows empty state message when no items', () => {
    render(
      <DynamicListField<TestItem>
        items={[]}
        onAdd={jest.fn()}
        onRemove={jest.fn()}
        renderItem={defaultRenderItem}
        addLabel="Add Item"
        title="Test Section"
      />,
    );
    expect(
      screen.getByText('Add Item düyməsinə basaraq əlavə edin'),
    ).toBeInTheDocument();
  });

  it('shows add button when items.length is less than maxItems', () => {
    const items: TestItem[] = [{ id: 'a', label: 'A' }];
    render(
      <DynamicListField<TestItem>
        items={items}
        onAdd={jest.fn()}
        onRemove={jest.fn()}
        renderItem={defaultRenderItem}
        addLabel="Add Item"
        title="Test Section"
        maxItems={5}
      />,
    );
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });
});
