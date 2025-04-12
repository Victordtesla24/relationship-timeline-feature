[{
	"resource": "/Users/Shared/cursor/relationship-timeline-feature/src/components/timeline/MediaUploader.tsx",
	"owner": "typescript",
	"code": "2339",
	"severity": 8,
	"message": "Property 'useRef' does not exist on type 'typeof import(\"/Users/Shared/cursor/relationship-timeline-feature/node_modules/@types/react/index.d.ts\")'.",
	"source": "ts",
	"startLineNumber": 31,
	"startColumn": 30,
	"endLineNumber": 31,
	"endColumn": 36,
	"modelVersionId": 3
}]

vicd@Vics-MacBook-Air relationship-timeline-feature % npx tsc
.next/types/app/api/auth/[...nextauth]/route.ts:314:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

314   children?: React.ReactNode
                       ~~~~~~~~~

.next/types/app/api/dev/test-user/route.ts:314:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

314   children?: React.ReactNode
                       ~~~~~~~~~

.next/types/app/api/events/[id]/route.ts:314:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

314   children?: React.ReactNode
                       ~~~~~~~~~

.next/types/app/api/events/route.ts:314:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

314   children?: React.ReactNode
                       ~~~~~~~~~

.next/types/app/api/export/route.ts:314:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

314   children?: React.ReactNode
                       ~~~~~~~~~

.next/types/app/dashboard/page.ts:54:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

54   children?: React.ReactNode
                      ~~~~~~~~~

.next/types/app/dev-timeline/page.ts:54:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

54   children?: React.ReactNode
                      ~~~~~~~~~

.next/types/app/export/page.ts:54:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

54   children?: React.ReactNode
                      ~~~~~~~~~

.next/types/app/layout.ts:54:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

54   children?: React.ReactNode
                      ~~~~~~~~~

.next/types/app/login/page.ts:54:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

54   children?: React.ReactNode
                      ~~~~~~~~~

.next/types/app/page.ts:54:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

54   children?: React.ReactNode
                      ~~~~~~~~~

.next/types/app/timeline/page.ts:54:20 - error TS2694: Namespace 'React' has no exported member 'ReactNode'.

54   children?: React.ReactNode
                      ~~~~~~~~~

src/components/auth/AuthProvider.tsx:4:10 - error TS2305: Module '"react"' has no exported member 'ReactNode'.

4 import { ReactNode } from 'react';
           ~~~~~~~~~

src/components/auth/AuthProvider.tsx:10:25 - error TS2323: Cannot redeclare exported variable 'default'.

10 export default function AuthProvider({ children }: AuthProviderProps) {
                           ~~~~~~~~~~~~

src/components/auth/LoginForm.tsx:3:10 - error TS2305: Module '"react"' has no exported member 'useState'.

3 import { useState } from 'react';
           ~~~~~~~~

src/components/auth/RegisterForm.tsx:3:10 - error TS2305: Module '"react"' has no exported member 'useState'.

3 import { useState } from 'react';
           ~~~~~~~~

src/components/dashboard/DashboardHeader.tsx:6:10 - error TS2305: Module '"react"' has no exported member 'useState'.

6 import { useState } from 'react';
           ~~~~~~~~

src/components/dashboard/RecentActivity.tsx:3:10 - error TS2305: Module '"react"' has no exported member 'useState'.

3 import { useState, useEffect } from 'react';
           ~~~~~~~~

src/components/dashboard/RecentActivity.tsx:3:20 - error TS2305: Module '"react"' has no exported member 'useEffect'.

3 import { useState, useEffect } from 'react';
                     ~~~~~~~~~

src/components/dashboard/TimelineSummary.tsx:4:10 - error TS2305: Module '"react"' has no exported member 'useState'.

4 import { useState, useEffect } from 'react';
           ~~~~~~~~

src/components/dashboard/TimelineSummary.tsx:4:20 - error TS2305: Module '"react"' has no exported member 'useEffect'.

4 import { useState, useEffect } from 'react';
                     ~~~~~~~~~

src/components/export/ExportTimeline.tsx:4:10 - error TS2305: Module '"react"' has no exported member 'useState'.

4 import { useState } from 'react';
           ~~~~~~~~

src/components/timeline/MediaUploader.tsx:31:30 - error TS2339: Property 'useRef' does not exist on type 'typeof import("/Users/Shared/cursor/relationship-timeline-feature/node_modules/@types/react/index.d.ts")'.

31   const fileInputRef = React.useRef<HTMLInputElement>(null);
                                ~~~~~~

src/components/timeline/TimelineControls.tsx:3:10 - error TS2305: Module '"react"' has no exported member 'useState'.

3 import { useState } from 'react';
           ~~~~~~~~

src/components/ui/Button.tsx:3:17 - error TS2305: Module '"react"' has no exported member 'forwardRef'.

3 import React, { forwardRef } from 'react';
                  ~~~~~~~~~~

src/components/ui/Button.tsx:6:37 - error TS2694: Namespace 'React' has no exported member 'ButtonHTMLAttributes'.

6 interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
                                      ~~~~~~~~~~~~~~~~~~~~

src/components/ui/Button.tsx:74:16 - error TS2300: Duplicate identifier 'Button'.

74 export default Button;
                  ~~~~~~

  next.d.ts:113:18
    113   export default Button;
                         ~~~~~~
    'Button' was also declared here.

src/components/ui/Toaster.tsx:3:10 - error TS2305: Module '"react"' has no exported member 'useState'.

3 import { useState, useEffect } from 'react';
           ~~~~~~~~

src/components/ui/Toaster.tsx:3:20 - error TS2305: Module '"react"' has no exported member 'useEffect'.

3 import { useState, useEffect } from 'react';
                     ~~~~~~~~~

src/components/ui/Toaster.tsx:98:10 - error TS2451: Cannot redeclare block-scoped variable 'toaster'.

98 export { toaster, Toaster };
            ~~~~~~~

  next.d.ts:108:16
    108   export const toaster: any;
                       ~~~~~~~
    'toaster' was also declared here.

tests/features/timeline.test.tsx:65:64 - error TS2694: Namespace 'React' has no exported member 'ReactElement'.

65     const { container } = render(await TimelinePage() as React.ReactElement);
                                                                  ~~~~~~~~~~~~

tests/features/timeline.test.tsx:85:63 - error TS2694: Namespace 'React' has no exported member 'ReactElement'.

85     const { rerender } = render(await TimelinePage() as React.ReactElement);
                                                                 ~~~~~~~~~~~~

tests/features/timeline.test.tsx:97:44 - error TS2694: Namespace 'React' has no exported member 'ReactElement'.

97     rerender(await TimelinePage() as React.ReactElement);
                                              ~~~~~~~~~~~~

tests/features/timeline.test.tsx:123:42 - error TS2694: Namespace 'React' has no exported member 'ReactElement'.

123     render(await TimelinePage() as React.ReactElement);
                                             ~~~~~~~~~~~~


Found 34 errors in 24 files.

Errors  Files
     1  .next/types/app/api/auth/[...nextauth]/route.ts:314
     1  .next/types/app/api/dev/test-user/route.ts:314
     1  .next/types/app/api/events/[id]/route.ts:314
     1  .next/types/app/api/events/route.ts:314
     1  .next/types/app/api/export/route.ts:314
     1  .next/types/app/dashboard/page.ts:54
     1  .next/types/app/dev-timeline/page.ts:54
     1  .next/types/app/export/page.ts:54
     1  .next/types/app/layout.ts:54
     1  .next/types/app/login/page.ts:54
     1  .next/types/app/page.ts:54
     1  .next/types/app/timeline/page.ts:54
     2  src/components/auth/AuthProvider.tsx:4
     1  src/components/auth/LoginForm.tsx:3
     1  src/components/auth/RegisterForm.tsx:3
     1  src/components/dashboard/DashboardHeader.tsx:6
     2  src/components/dashboard/RecentActivity.tsx:3
     2  src/components/dashboard/TimelineSummary.tsx:4
     1  src/components/export/ExportTimeline.tsx:4
     1  src/components/timeline/MediaUploader.tsx:31
     1  src/components/timeline/TimelineControls.tsx:3
     3  src/components/ui/Button.tsx:3
     3  src/components/ui/Toaster.tsx:3
     4  tests/features/timeline.test.tsx:65
vicd@Vics-MacBook-Air relationship-timeline-feature % 