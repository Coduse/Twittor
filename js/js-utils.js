/*jslint es6:true*/

function actualizaCacheDinamico(dynamicCache, req, res) {
    if (res.ok) {
        return caches.open(dynamicCache).then(cache => {
            cache.put(req, res);
            return res;
        });
    } else {
        return res;
    }
}