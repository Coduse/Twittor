var url = self.location.href;

var raizArchivos = "/Twittor/";

//Verifica raiz de archivos
if (url.includes('localhost')) {
    raizArchivos = '/webApp_MercaDo/ClasesFernando_PWA/06-twittor/';
}

//Importacion de funciones
importScripts(raizArchivos +'js/js-utils.js');

// const CACHE_NAME = 'cache-1';
const CACHE_STATIC_NAME  = 'static-v3';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

const CACHE_DYNAMIC_LIMIT = 50;

const APP_SHELL = [
//    '/',
    raizArchivos + 'index.html',
    raizArchivos + 'css/style.css',
    raizArchivos + 'img/favicon.ico',
    raizArchivos + 'img/avatars/hulk.jpg',
    raizArchivos + 'img/avatars/ironman.jpg',
    raizArchivos + 'img/avatars/spiderman.jpg',
    raizArchivos + 'img/avatars/thor.jpg',
    raizArchivos + 'img/avatars/wolverine.jpg',
    raizArchivos + 'js/app.js',
    raizArchivos + 'js/js-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/webApp_MercaDo/ClasesFernando_PWA/06-twittor/css/animate.css',
    '/webApp_MercaDo/ClasesFernando_PWA/06-twittor/js/libs/jquery.js'
];

self.addEventListener('install', e => {


    const cacheStatic = caches.open( CACHE_STATIC_NAME )
        .then( cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open( CACHE_INMUTABLE_NAME )
        .then( cache => cache.addAll(APP_SHELL_INMUTABLE));


    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]) );
});

self.addEventListener('activate', e => {
    
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== CACHE_STATIC_NAME && key.includes('static')) {
                return caches.delete(key);
            } 
        });    
    });
    e.waitUntil( respuesta );    
});

self.addEventListener('fetch', e =>{
    // 2- Cache with Network Fallback
    
     const respuesta = caches.match( e.request ).then( res => {

         if ( res ) {
             return res;
         } else {
         // No existe el archivo
//             console.log('No existe', e.request.url );
             return fetch(e.request).then(newRes => {
                 return actualizaCacheDinamico(CACHE_DYNAMIC_NAME, e.request, newRes);

             });
         }
    });


/*
             return fetch( e.request ).then( newResp => {

                 caches.open( CACHE_DYNAMIC_NAME )
                     .then( cache => {
                         cache.put( e.request, newResp );
                         limpiarCache( CACHE_DYNAMIC_NAME, 50 );
                     });

                 return newResp.clone();
             }).catch(err => {
                 if(e.request.headers.get('accept').includes('text/html')) {
                    return caches.match('/webApp_MercaDo/ClasesFernando_PWA/05-navegacion-offline/pages/offline.html'); 
                 }
*/
     e.respondWith( respuesta );
});
