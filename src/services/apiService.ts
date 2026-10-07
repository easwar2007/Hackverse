import type { CatalogueItem, SubjectDomain, MockQuestion, LanguageCode } from '../types';

/**
 * Client API Service
 * Interacts directly with the backend API endpoints (/api/ingest and /api/chat)
 * Eliminates all client-side API key requirements.
 */

export interface IngestResponse {
  success: boolean;
  item: CatalogueItem;
  mockQuestions: MockQuestion[];
}

export interface ChatResponse {
  success: boolean;
  text: string;
  modeTag: string;
}

/**
 * Ingest Syllabus notes / PPT via backend
 */
export async function ingestSyllabusBackend(
  fileName: string,
  rawContent: string,
  domain: SubjectDomain
): Promise<IngestResponse> {
  try {
    const response = await fetch('/api/ingest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName,
        rawContent,
        domain
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with code ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error('Backend ingest error:', err);
    throw new Error(err.message || 'Failed to ingest syllabus through backend');
  }
}

/**
 * Query Socratic Academic Tutor via backend
 */
export async function askSocraticTutorBackend(
  query: string,
  courseContext: string,
  language: LanguageCode
): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        courseContext,
        language
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with code ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error('Backend chat error:', err);
    throw new Error(err.message || 'Failed to get tutor reply through backend');
  }
}
