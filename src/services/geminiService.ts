import type { CatalogueItem, SubjectDomain, MockQuestion, LanguageCode } from '../types';
import { ingestSyllabusBackend, askSocraticTutorBackend } from './apiService';

/**
 * Backward compatibility wrapper routing all requests through the backend service.
 * No client API keys required.
 */

export async function deconstructSyllabusWithAI(
  fileName: string,
  rawContent: string,
  domain: string
): Promise<{ item: CatalogueItem; mockQuestions: MockQuestion[] }> {
  const result = await ingestSyllabusBackend(fileName, rawContent, domain as SubjectDomain);
  return {
    item: result.item,
    mockQuestions: result.mockQuestions
  };
}

export async function askSocraticTutorWithAI(
  query: string,
  courseContext: string,
  language: LanguageCode
): Promise<{ text: string; modeTag: string }> {
  const result = await askSocraticTutorBackend(query, courseContext, language);
  return {
    text: result.text,
    modeTag: result.modeTag
  };
}
