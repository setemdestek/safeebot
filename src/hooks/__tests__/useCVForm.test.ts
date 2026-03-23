import { renderHook, act } from '@testing-library/react';
import { cvFormReducer, initialFormData, useCVFormReducer, STORAGE_KEY } from '../useCVForm';
import type { CVFormData, CVFormAction } from '@/types/cv';

// ─── Reducer unit tests ───

describe('cvFormReducer', () => {
  it('returns correct initial state defaults', () => {
    expect(initialFormData.cvLanguage).toBe('az');
    expect(initialFormData.templateId).toBe('');
    expect(initialFormData.photo).toBeNull();
    expect(initialFormData.workExperience).toEqual([]);
    expect(initialFormData.education).toEqual([]);
    expect(initialFormData.skills).toEqual([]);
    expect(initialFormData.languages).toEqual([]);
    expect(initialFormData.courses).toEqual([]);
    expect(initialFormData.certificates).toEqual([]);
    expect(initialFormData.interests).toEqual([]);
    expect(initialFormData.references).toEqual([]);
    expect(initialFormData.personalInfo.gender).toBe('male');
    expect(initialFormData.personalInfo.maritalStatus).toBe('single');
  });

  it('SET_LANGUAGE updates cvLanguage', () => {
    const action: CVFormAction = { type: 'SET_LANGUAGE', payload: 'en' };
    const nextState = cvFormReducer(initialFormData, action);
    expect(nextState.cvLanguage).toBe('en');
    // Other fields unchanged
    expect(nextState.templateId).toBe(initialFormData.templateId);
  });

  it('SET_TEMPLATE updates templateId', () => {
    const action: CVFormAction = { type: 'SET_TEMPLATE', payload: 'template-42' };
    const nextState = cvFormReducer(initialFormData, action);
    expect(nextState.templateId).toBe('template-42');
    expect(nextState.cvLanguage).toBe(initialFormData.cvLanguage);
  });

  describe('ADD_WORK_EXPERIENCE', () => {
    it('creates a new work experience entry with a unique id', () => {
      const action: CVFormAction = { type: 'ADD_WORK_EXPERIENCE' };
      const nextState = cvFormReducer(initialFormData, action);
      expect(nextState.workExperience).toHaveLength(1);
      const entry = nextState.workExperience[0];
      expect(entry.id).toBeTruthy();
      expect(typeof entry.id).toBe('string');
      expect(entry.company).toBe('');
      expect(entry.position).toBe('');
      expect(entry.currentlyWorking).toBe(false);
    });

    it('generates unique ids for multiple entries', () => {
      let state = cvFormReducer(initialFormData, { type: 'ADD_WORK_EXPERIENCE' });
      state = cvFormReducer(state, { type: 'ADD_WORK_EXPERIENCE' });
      expect(state.workExperience).toHaveLength(2);
      expect(state.workExperience[0].id).not.toBe(state.workExperience[1].id);
    });
  });

  describe('UPDATE_WORK_EXPERIENCE', () => {
    it('modifies the correct entry by id', () => {
      let state = cvFormReducer(initialFormData, { type: 'ADD_WORK_EXPERIENCE' });
      state = cvFormReducer(state, { type: 'ADD_WORK_EXPERIENCE' });
      const targetId = state.workExperience[0].id;
      const otherId = state.workExperience[1].id;

      const updateAction: CVFormAction = {
        type: 'UPDATE_WORK_EXPERIENCE',
        payload: { id: targetId, data: { company: 'Acme Corp', position: 'Engineer' } },
      };
      state = cvFormReducer(state, updateAction);

      expect(state.workExperience[0].company).toBe('Acme Corp');
      expect(state.workExperience[0].position).toBe('Engineer');
      // Second entry should be untouched
      expect(state.workExperience[1].id).toBe(otherId);
      expect(state.workExperience[1].company).toBe('');
    });
  });

  describe('REMOVE_WORK_EXPERIENCE', () => {
    it('removes the correct entry by id', () => {
      let state = cvFormReducer(initialFormData, { type: 'ADD_WORK_EXPERIENCE' });
      state = cvFormReducer(state, { type: 'ADD_WORK_EXPERIENCE' });
      const idToRemove = state.workExperience[0].id;
      const idToKeep = state.workExperience[1].id;

      state = cvFormReducer(state, { type: 'REMOVE_WORK_EXPERIENCE', payload: idToRemove });

      expect(state.workExperience).toHaveLength(1);
      expect(state.workExperience[0].id).toBe(idToKeep);
    });

    it('does nothing if id does not exist', () => {
      let state = cvFormReducer(initialFormData, { type: 'ADD_WORK_EXPERIENCE' });
      state = cvFormReducer(state, { type: 'REMOVE_WORK_EXPERIENCE', payload: 'nonexistent-id' });
      expect(state.workExperience).toHaveLength(1);
    });
  });

  describe('LOAD_STATE', () => {
    it('restores state from payload but always sets photo to null', () => {
      const restoredData: CVFormData = {
        ...initialFormData,
        cvLanguage: 'ru',
        templateId: 'template-loaded',
        photo: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        personalInfo: { ...initialFormData.personalInfo, firstName: 'John', lastName: 'Doe' },
        workExperience: [
          { id: 'we-1', company: 'BigCo', position: 'Dev', startDate: '2020-01', currentlyWorking: true, description: '' },
        ],
      };

      const action: CVFormAction = { type: 'LOAD_STATE', payload: restoredData };
      const nextState = cvFormReducer(initialFormData, action);

      expect(nextState.cvLanguage).toBe('ru');
      expect(nextState.templateId).toBe('template-loaded');
      expect(nextState.photo).toBeNull(); // photo must always be null after LOAD_STATE
      expect(nextState.personalInfo.firstName).toBe('John');
      expect(nextState.personalInfo.lastName).toBe('Doe');
      expect(nextState.workExperience).toHaveLength(1);
      expect(nextState.workExperience[0].company).toBe('BigCo');
    });
  });

  describe('RESET', () => {
    it('returns to the initial state regardless of prior modifications', () => {
      let state = cvFormReducer(initialFormData, { type: 'SET_LANGUAGE', payload: 'ru' });
      state = cvFormReducer(state, { type: 'SET_TEMPLATE', payload: 'some-template' });
      state = cvFormReducer(state, { type: 'ADD_WORK_EXPERIENCE' });
      state = cvFormReducer(state, { type: 'ADD_SKILL' });

      expect(state.cvLanguage).toBe('ru');
      expect(state.workExperience).toHaveLength(1);

      const resetState = cvFormReducer(state, { type: 'RESET' });

      expect(resetState).toEqual(initialFormData);
      expect(resetState.cvLanguage).toBe('az');
      expect(resetState.workExperience).toHaveLength(0);
      expect(resetState.skills).toHaveLength(0);
    });
  });
});

// ─── Hook integration tests ───

describe('useCVFormReducer hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initialises with correct default state', () => {
    const { result } = renderHook(() => useCVFormReducer());
    expect(result.current.state).toEqual(initialFormData);
  });

  it('dispatches SET_LANGUAGE and updates state', () => {
    const { result } = renderHook(() => useCVFormReducer());
    act(() => {
      result.current.dispatch({ type: 'SET_LANGUAGE', payload: 'en' });
    });
    expect(result.current.state.cvLanguage).toBe('en');
  });

  it('dispatches SET_TEMPLATE and updates state', () => {
    const { result } = renderHook(() => useCVFormReducer());
    act(() => {
      result.current.dispatch({ type: 'SET_TEMPLATE', payload: 'my-template' });
    });
    expect(result.current.state.templateId).toBe('my-template');
  });

  it('dispatches ADD_WORK_EXPERIENCE and creates entry with id', () => {
    const { result } = renderHook(() => useCVFormReducer());
    act(() => {
      result.current.dispatch({ type: 'ADD_WORK_EXPERIENCE' });
    });
    expect(result.current.state.workExperience).toHaveLength(1);
    expect(result.current.state.workExperience[0].id).toBeTruthy();
  });

  it('getSavedDraft returns null when localStorage is empty', () => {
    const { result } = renderHook(() => useCVFormReducer());
    expect(result.current.getSavedDraft()).toBeNull();
  });

  it('getSavedDraft returns parsed state with photo null', () => {
    const draft = { ...initialFormData, cvLanguage: 'en', photo: null };
    // Store without photo field (as the hook would serialize it)
    const { photo: _photo, ...serializable } = draft;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));

    const { result } = renderHook(() => useCVFormReducer());
    const saved = result.current.getSavedDraft();
    expect(saved).not.toBeNull();
    expect(saved!.cvLanguage).toBe('en');
    expect(saved!.photo).toBeNull();
  });

  it('clearDraft removes item from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialFormData));
    const { result } = renderHook(() => useCVFormReducer());
    act(() => {
      result.current.clearDraft();
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('dispatches RESET and returns state to initial', () => {
    const { result } = renderHook(() => useCVFormReducer());
    act(() => {
      result.current.dispatch({ type: 'SET_LANGUAGE', payload: 'ru' });
      result.current.dispatch({ type: 'ADD_WORK_EXPERIENCE' });
    });
    expect(result.current.state.cvLanguage).toBe('ru');
    act(() => {
      result.current.dispatch({ type: 'RESET' });
    });
    expect(result.current.state).toEqual(initialFormData);
  });
});
