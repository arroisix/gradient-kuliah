import { pageRouterCustomErrorHandler } from '@highlight-run/next/ssr';
import { HIGHLIGHT_PROJECT_ID } from 'commons/constants';

export default pageRouterCustomErrorHandler({
    projectId: HIGHLIGHT_PROJECT_ID
    // ...otherHighlightOptions
});
