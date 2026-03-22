import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { CVFormProvider } from '@/components/cv-builder/CVBuilderContext';
import PhotoUpload from '@/components/cv-builder/form/PhotoUpload';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

const mockDispatch = jest.fn();
const mockState = {
  cvLanguage: 'az' as const,
  templateId: 'azure-professional',
  photo: null,
  personalInfo: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    city: '',
    gender: 'male' as const,
    maritalStatus: 'single' as const,
  },
  workExperience: [],
  education: [],
  skills: [],
  languages: [],
  courses: [],
  certificates: [],
  interests: [],
  references: [],
};

function renderWithContext(ui: React.ReactElement) {
  return render(
    <CVFormProvider value={{ state: mockState, dispatch: mockDispatch }}>
      {ui}
    </CVFormProvider>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('PhotoUpload', () => {
  it('renders drag-drop zone when no photo', () => {
    const { container } = renderWithContext(<PhotoUpload />);
    const dropZone = container.querySelector('[ondrop]');
    // The drag-drop area is a div with onDrop handler; check it is present
    // by verifying the input exists and no preview image
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
    const img = container.querySelector('img');
    expect(img).not.toBeInTheDocument();
  });

  it('dispatches SET_PHOTO for a valid JPEG file', () => {
    const { container } = renderWithContext(<PhotoUpload />);
    const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PHOTO', payload: file });
  });

  it('dispatches SET_PHOTO for a valid PNG file', () => {
    const { container } = renderWithContext(<PhotoUpload />);
    const file = new File(['test'], 'photo.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 2048 });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_PHOTO', payload: file });
  });

  it('shows error message when file is larger than 10MB', () => {
    const { getByRole } = renderWithContext(<PhotoUpload />);
    const { container } = renderWithContext(<PhotoUpload />);
    const bigFile = new File(['test'], 'big.jpg', { type: 'image/jpeg' });
    Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [bigFile] } });
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
    expect(alert?.textContent).toBe('form.photo.tooLarge');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('shows error message for non-image file type', () => {
    const { container } = renderWithContext(<PhotoUpload />);
    const textFile = new File(['hello'], 'doc.txt', { type: 'text/plain' });
    Object.defineProperty(textFile, 'size', { value: 512 });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [textFile] } });
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
    expect(alert?.textContent).toBe('form.photo.invalidType');
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('shows preview image after valid file upload', () => {
    const { container } = renderWithContext(<PhotoUpload />);
    const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 });
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });
    const img = container.querySelector('img[alt="Photo preview"]');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'blob:mock-url');
  });
});
