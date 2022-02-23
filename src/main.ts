import app from './app/index'
import CONFIG from './config/default'

app.listen(CONFIG.APP_PORT, () => {
  console.log(`server is running on http://localhost:${CONFIG.APP_PORT}`);
});
