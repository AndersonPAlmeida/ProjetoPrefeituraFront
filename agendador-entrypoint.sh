#!/usr/bin/env bash
set -e

echo "module.exports = {" > /app/config/env.js
echo "  port: process.env.PORT || 3002," >> /app/config/env.js
echo "  apiHost: '$AGENDADOR_apiHost'," >> /app/config/env.js
echo "  apiPort: $AGENDADOR_apiPort," >> /app/config/env.js
echo "  apiVer: 'v1'," >> /app/config/env.js
echo "  webpackHost: '$AGENDADOR_apiHost'," >> /app/config/env.js
echo "  webpackPort: $AGENDADOR_webpackPort," >> /app/config/env.js
echo "};" >> /app/config/env.js

if [ "$1" = 'PRODUCTION' ]; then
    /usr/local/bin/npm run build
    /usr/local/bin/npm start
fi

if [ "$1" = 'DEVELOPMENT' ]; then
/usr/local/bin/npm run dev
fi

exec "$@"
