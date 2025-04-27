import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Page {
  id: number;
  slug: string;
  title: string;
  content: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private apiUrl = `${environment.apiUrl}/pages`;
  
  // Cache for pages to reduce API calls
  private pagesCache: { [key: string]: Page } = {};

  constructor(private http: HttpClient) { }

  /**
   * Get a page by its slug
   */
  getPageBySlug(slug: string): Observable<Page | null> {
    // Check if page is in cache
    if (this.pagesCache[slug]) {
      return of(this.pagesCache[slug]);
    }

    return this.http.get<Page>(`${this.apiUrl}/slug/${slug}`).pipe(
      map(page => {
        // Store in cache
        this.pagesCache[slug] = page;
        return page;
      }),
      catchError(error => {
        console.error(`Error fetching page with slug ${slug}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Get all pages
   */
  getAllPages(): Observable<Page[]> {
    return this.http.get<Page[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching pages:', error);
        return of([]);
      })
    );
  }

  /**
   * Create a new page
   */
  createPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Observable<Page | null> {
    return this.http.post<Page>(this.apiUrl, page).pipe(
      map(newPage => {
        // Update cache
        this.pagesCache[newPage.slug] = newPage;
        return newPage;
      }),
      catchError(error => {
        console.error('Error creating page:', error);
        return of(null);
      })
    );
  }

  /**
   * Update a page
   */
  updatePage(id: number, page: Partial<Omit<Page, 'id' | 'slug' | 'createdAt' | 'updatedAt'>>): Observable<boolean> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, page).pipe(
      map(() => {
        // Clear cache for this page
        const slug = Object.keys(this.pagesCache).find(key => this.pagesCache[key].id === id);
        if (slug) {
          delete this.pagesCache[slug];
        }
        return true;
      }),
      catchError(error => {
        console.error(`Error updating page with id ${id}:`, error);
        return of(false);
      })
    );
  }

  /**
   * Delete a page
   */
  deletePage(id: number): Observable<boolean> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      map(() => {
        // Clear cache for this page
        const slug = Object.keys(this.pagesCache).find(key => this.pagesCache[key].id === id);
        if (slug) {
          delete this.pagesCache[slug];
        }
        return true;
      }),
      catchError(error => {
        console.error(`Error deleting page with id ${id}:`, error);
        return of(false);
      })
    );
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.pagesCache = {};
  }
}
