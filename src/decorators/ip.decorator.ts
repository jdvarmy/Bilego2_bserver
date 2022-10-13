import { createParamDecorator } from '@nestjs/common';

import * as requestIp from 'request-ip';

export const IpDecorator = createParamDecorator((data, req) => {
  if (req.clientIp) return req.clientIp;
  return requestIp.getClientIp(req);
});
