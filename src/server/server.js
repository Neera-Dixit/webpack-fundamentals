import express from 'express';
import path from 'path';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import es6Renderer from 'express-es6-template-engine';
import webpackConfig from '../../webpack.config';
import favicon from 'serve-favicon';

const expressApp = express();
const expressPORT = process.env.PORT || 3000;

expressApp.engine('html', es6Renderer);
expressApp.set('views', path.join(process.cwd(), 'dist'));
expressApp.set('view engine', 'html');

const faviconPath = path.join(process.cwd(),'assets', 'images', 'batman-10-24.ico');

console.log(faviconPath);

expressApp.use(favicon(faviconPath)); 

if (process.env.NODE_ENV === 'development') {
  const webpackdevConfig = webpackConfig('development');
  const compiler = webpack(webpackdevConfig);

  expressApp.use(devMiddleware(compiler, {
    publicPath: webpackdevConfig.output.publicPath,
    historyApiFallback: true,
  }));

  expressApp.use(hotMiddleware(compiler));
}

expressApp.use(express.static(path.join(process.cwd(), 'dist')));

expressApp.get('*', (req, res, next) => {
  if (req.accepts('html')) {
    const data = req.session ? req.session.context : {};
    return res.render('index', { locals: { data } });
  }
  return next();
});

expressApp.listen(expressPORT, (err) => {
  if (err) {
    console.error('Server ERROR : ', err);
  } else {
    console.log(`Express server listening at ${expressPORT}`);
  }
});
