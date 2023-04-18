// Get data from the cache.
export async function getCachedData( cacheName, url ) {
    const cacheStorage   = await caches.open( cacheName );
    const cachedResponse = await cacheStorage.match( url );
 
    if ( ! cachedResponse || ! cachedResponse.ok ) {
       return false;
    }
 
    return await cachedResponse.json();
}

// Try to get data from the cache, but fall back to fetching it live.
export async function getData() {
    const cacheVersion = 1;
    const cacheName    = `myapp-${ cacheVersion }`;
    const url          = 'http://localhost:4200';
    let cachedData     = await getCachedData( cacheName, url );
 
    if ( cachedData ) {
       console.log( 'Retrieved cached data' );
       return cachedData;
    }
 
    console.log( 'Fetching fresh data' );
 
    const cacheStorage = await caches.open( cacheName );
    await cacheStorage.add( url );
    cachedData = await getCachedData( cacheName, url );
    await deleteOldCaches( cacheName );
 
    return cachedData;
}

// Delete any old caches to respect user's disk space.
export async function deleteOldCaches( currentCache ) {
    const keys = await caches.keys();
 
    for ( const key of keys ) {
       const isOurCache = 'myapp-' === key.substr( 0, 6 );
 
       if ( currentCache === key || ! isOurCache ) {
          continue;
       }
 
       caches.delete( key );
    }
}

export async function getCache(){
    const keys = await caches.keys();
    for ( const key of keys ) {
        console.log(key);
    }
}