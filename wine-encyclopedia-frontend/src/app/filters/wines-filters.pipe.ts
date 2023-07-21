// winesFilter-filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { WineTastingSheet } from '../_models/wine-tasting-sheet.model';

@Pipe({name: 'winesFilter'})
export class WinesFilterFilterPipe implements PipeTransform {
  /**
   * WinesFilter in, WinesFilter out that contain all the terms in the filterText
   *
   * @param {Bookmark[]} winesFilter
   * @param {string} filterText
   * @returns {Bookmark[]}
   */
//  transform(winesFilter: WineTastingSheet[], filterText: string): WineTastingSheet[] {
//    if (!winesFilter) {
//      return [];
//    }
//    if (!filterText) {
//      return winesFilter;
//    }
//
//    return winesFilter.filter(bookmark => {
//      return this.bookmarkContainsFilterText(bookmark, filterText);
//    });
//  }

transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
  
    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
      });
    });
   }

  private bookmarkContainsFilterText(bookmark: WineTastingSheet, filterText: string): boolean {
    filterText = filterText.toLocaleLowerCase();
    const filterTerms = filterText.split(' ');
    for (const filterTerm of filterTerms) {
      const hasFilterTerm = this.bookmarkContainsFilterTerm(bookmark, filterTerm);
      if (hasFilterTerm === false) {
        return false;
      }
    }

    return true;
  }

  private tagsHaveFilterText(tags: string[], filterText: string): boolean {
    for (const tag of tags) {
      if (tag.includes(filterText)) {
        return true;
      }
    }

    return false;
  }

  private bookmarkContainsFilterTerm(bookmark: WineTastingSheet, filterTerm: string) {
    return bookmark.wineName.toLocaleLowerCase().includes(filterTerm)
      || bookmark.winery.toLocaleLowerCase().includes(filterTerm)
      || bookmark.wineType.toLocaleLowerCase().includes(filterTerm);
  }
}