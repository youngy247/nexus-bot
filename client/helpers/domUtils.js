import DOMPurify from 'dompurify';

 const customPolicy = {
      ALLOWED_TAGS: ['a', 'p', 'h2', 'ul', 'li', 'img',],
      ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'class'],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-]|$))/i,
      ADD_ATTR: [['target', '_blank']],
    };

export function sanitizeHTML(html) {
  
      return DOMPurify.sanitize(html, { ADD_TAGS: ['a'], ADD_ATTR: ['target'], ...customPolicy });
    }
