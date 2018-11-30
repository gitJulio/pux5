var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

//Importacion de las controles
var indexRouter = require('./routes/index');
var vehiculosRouter = require('./routes/vehiculos-routes');
var gruposRouter = require('./routes/grupos-routes');
var productosRouter = require('./routes/productos-routes');
var filtrosRouter = require('./routes/filtros-routes');
var tokenRoutes = require('./routes/token-routes');
var autoComplete = require('./routes/auto-complete-routes');
var aportacionesRouter = require('./routes/aportaciones-routes');
var fs = require('fs');
var sizeOf = require('image-size');

var app = express();

//Definicion de la session
app.use(session({
  secret: 'app nodejs'
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Definicion de las rutas
app.use('/api/', indexRouter);
app.use('/', indexRouter);
app.use('/api/vehiculos', vehiculosRouter);
app.use('/api/grupos', gruposRouter);
app.use('/api/productos', productosRouter);
app.use('/api/filtros', filtrosRouter);
app.use('/api/token', tokenRoutes);
app.use('/api/autocomplete', autoComplete);
app.use('/api/aportaciones', aportacionesRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  // next(createError(404));
  var f = new Date();
  let aa = f.getFullYear()
  let anio = `© ${aa}`
  res.render('error', {
    copyr: anio,
    title: "ALLAS REPUESTOS",
    message: "La pagina solicitada no existe"
  });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
