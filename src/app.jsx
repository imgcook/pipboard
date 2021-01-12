import React from 'react';

import BaseLayout from 'src/layout/BaseLayout';
import WebcamImageClassification from 'src/pages/TeachableMachine/WebcamImageClassification';

export default function Router() {

  return (
    <BaseLayout>
      <WebcamImageClassification />
    </BaseLayout>
  );
}
