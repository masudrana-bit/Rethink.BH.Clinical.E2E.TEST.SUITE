import { FIRST_OPTION } from '../helpers/primeng';
import { uniqueName } from '../helpers/data-factory';
import { CustomProgramInput } from '../pages/plan/CustomProgramForm';
import { LibraryProgramInput } from '../pages/settings/ProgramEditorDialog';

export const LIBRARY_PROGRAMS = {
  current: 'Following One-Step Instructions',
  future: 'Matching Identical Pictures',
  search: 'Matching',
  crossTab: 'Identifying Objects',
};

export function customProgramInput(label = 'Custom Program', overrides: Partial<CustomProgramInput> = {}): CustomProgramInput {
  return {
    category: 'Skills',
    domain: FIRST_OPTION,
    area: FIRST_OPTION,
    title: uniqueName(label),
    goal: 'Client will respond to the instruction independently in 80% of opportunities across 3 sessions.',
    status: 'current',
    objectives: ['Responds within 5 seconds', 'Responds across 2 settings'],
    targets: ['Touch nose', 'Clap hands', 'Stand up'],
    lesson: {
      exercise: 'Present the SD, wait 5 seconds, prompt per hierarchy.',
      generalization: 'Run with 2 different staff and in 2 rooms.',
      errorCorrection: 'Model the correct response, re-present the SD.',
      supplies: 'Token board, reinforcers',
      troubleshooting: 'If 3 errors in a row, drop to the previous prompt level.',
    },
    ...overrides,
  };
}

export function libraryProgramInput(label = 'Library Program', overrides: Partial<LibraryProgramInput> = {}): LibraryProgramInput {
  return {
    category: 'Skills',
    domain: FIRST_OPTION,
    area: FIRST_OPTION,
    title: uniqueName(label),
    goal: 'Learner will complete the skill independently in 80% of opportunities.',
    objectives: ['Completes with gestural prompt', 'Completes independently'],
    targets: ['Step one', 'Step two', 'Step three'],
    keywords: 'e2e, automation',
    materialUrl: { title: 'E2E lesson guide', url: 'https://example.com/e2e-lesson-guide.pdf' },
    ...overrides,
  };
}
