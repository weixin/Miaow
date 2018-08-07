/*
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// trigger copying of related assets
require('file-loader?name=[name].[ext]!./index.html');

// libraries
import * as $ from 'jquery';
import Vue from 'vue';

import ElementVisibility from './lib/element-visibility';
import StickersClient from './client';

const MAX_DRAW_WIDTH = 300;
const MAX_DRAW_HEIGHT = 400;

class StickersPage {
  constructor() {
    this.setupCoreUi();
    this.setupSearchUi();
    StickersClient.init();
    StickersClient.on('load-progress', f => this.showLoadProgress(f));
    StickersClient.once('loaded', stickerIndex => {
      this.stickerIndex = stickerIndex;
      this.processStickerIndex();
      this.setupStickersUi();
      $(document.body).removeAttr('is-loading');
      setTimeout(() => $('.header-area__search-field').focus(), 0);
    });
  }

  processStickerIndex() {
    this.stickerIndex.libraries = this.stickerIndex.libraries
        .filter(lib => !!lib.sections.length);

    for (let library of this.stickerIndex.libraries) {
      for (let section of library.sections) {
        section.rows = [];
        let currentRow = null;

        let newRow = () => {
          currentRow = {items: []};
          section.rows.push(currentRow);
        };

        for (let item of section.items) {
          if (item.layout == 'row') {
            newRow();
            currentRow.items.push(item);
            newRow();
          } else {
            if (!currentRow) {
              newRow();
            }
            currentRow.items.push(item);
          }
        }
      }
    }
  }

  showLoadProgress(f) {
    $('.page-loading__progress').css('transform', `scaleX(${f})`);
  }

  setupCoreUi() {
    $(document.body).attr('ui-mode',
        (window.location.search.match(/uiMode=(\w+)/) || [])[1] || 'cover');
    $('.header-area__back-button').click(() => StickersClient.close());
    $(document).on('contextmenu', e => e.preventDefault());
    $(document).on('click', 'a[href]', ev => {
      let url = $(ev.target).attr('href');
      StickersClient.openUrl(url);
      ev.preventDefault();
    });
  }

  setupSearchUi() {
    let updateSearch = () => {
      this.vueGlobal.searchText = $searchField.val();
      // TODO: move this to a watcher in vueGlobal
      this.vueGlobal.$nextTick(() => {
        $(document.body).toggleClass('has-active-search', !!this.vueGlobal.searchText);
        ['.sticker-root-section', '.sticker-sub-section', '.sticker'].forEach(level => {
          let $allAtLevel = $(level); // select all at this level
          $allAtLevel.each((_, el) => {
            let hasAnyHighlights = !!$(el).find('.search-highlight').length;
            let hasDirectHighlights = !!$(el).find(`${level}__hilitext .search-highlight`).length;
            if (hasDirectHighlights) {
              $(el).attr('data-search-match', 'direct');
            } else if (hasAnyHighlights) {
              $(el).attr('data-search-match', 'indirect');
            } else {
              $(el).attr('data-search-match', 'none');
            }
          });
        });
        $(document.body).toggleClass('no-search-results',
            !$('.sticker-root-section[data-search-match!="none"]').length);
        this.loadVisibleStickers();
      });
    };

    let $searchField = $('.header-area__search-field');
    $searchField.on('input', () => {
      $(window).scrollTop(0);
      updateSearch();
    });
    $searchField.on('keydown', (ev) => {
      if (ev.keyCode == 27) {
        if ($searchField.val()) {
          ev.preventDefault();
          $searchField.val('');
          updateSearch();
        }
      }
    });
  }

  calcDrawSize(sticker) {
    // fit the sticker into a max width and height, keeping its aspect ratio
    let size = { width: sticker.width, height: sticker.height };
    if (size.width > MAX_DRAW_WIDTH) {
      size.height = size.height * MAX_DRAW_WIDTH / size.width;
      size.width = MAX_DRAW_WIDTH;
    }
    if (size.height > MAX_DRAW_HEIGHT) {
      size.width = size.width * MAX_DRAW_HEIGHT / size.height;
      size.height = MAX_DRAW_HEIGHT;
    }
    return size;
  }

  setupStickersUi() {
    var me = this;

    this.vueGlobal = new Vue({
      data: {
        searchText: ''
      },
    });

    Vue.prototype.$globals = this.vueGlobal;

    Vue.component('hilitext', {
      template: `<div v-html="highlight(text, $globals.searchText)"></div>`,
      props: ['text'],
      methods: {
        highlight: (text, query) => {
          if (!query) {
            return text;
          }

          return String(text || '').replace(
              new RegExp(query, 'ig'),
              matchedText => `<span class="search-highlight">${matchedText}</span>`);
        }
      }
    });

    Vue.component('sticker', {
      props: ['sticker', 'parentSection'],
      template: '#sticker-template',
      computed: {
        drawSize() {
          return me.calcDrawSize(this.sticker);
        }
      },
    });

    this.stickersVue = new Vue({
      el: '.stickers-area',
      data: {
        stickerIndex: this.stickerIndex,
      },
    });

    $(document).on('mousedown', '.sticker__thumb', ev => {
      let stickerId = $(ev.target).parents('.sticker').attr('data-sticker-id');
      let rect = $(ev.target).get(0).getBoundingClientRect();
      rect = {
        x: rect.left,
        y: rect.top,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      };
      StickersClient.startDragging(stickerId, rect);
    });

    this.setupStickerImageLoading();
  }

  setupStickerImageLoading() {
    this.loadVisibleStickers();
    $(window).on('DOMContentLoaded load resize', () => this.loadVisibleStickers());
    window.addEventListener('scroll', () => this.loadVisibleStickers(), true); // true == capture (all elements)
  }

  loadVisibleStickers() {
    this.fetchedImages = this.fetchedImages || new Set();
    $('.sticker').each((index, el) => {
      let stickerId = $(el).attr('data-sticker-id');
      if (this.fetchedImages.has(stickerId)) {
        return;
      }

      if (!ElementVisibility.isElementInViewport(el)) {
        return;
      }

      this.fetchedImages.add(stickerId);
      StickersClient.getStickerImageUrl(stickerId).then(url => {
        $(el).find('.sticker__thumb').css('background-image', `url(${url})`);
      });
    });
  }
}

$(window).on('load', () => {
  new StickersPage();
});