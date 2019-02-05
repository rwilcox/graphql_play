// originally from: https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/

const _ = require('lodash')

const getContent = function(url, headers={}) {
  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url

    let options = {}
    if ( !_.isEmpty(headers) ) {
        options.headers = headers
    }
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.get(url, options, (response) => {
      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
         reject(new Error('Failed to load page, status code: ' + response.statusCode));
       }
      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on(  'end', () => resolve( {body: body.join(''), headers: response.headers, status: response.statusCode } )  );
    });
    // handle connection errors of the request
    request.on('error', (err) => reject(err))
    })
};


const postContent = function( url, data, headers={} ) {
  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url

    headers['Content-Length'] = Buffer.byteLength(data)
    headers['']

    const options = {
        method: 'POST',
        headers: headers,
    }
    const lib = url.startsWith('https') ? require('https') : require('http');
    const request = lib.request(url, options, (response) => {
      // handle http errors

      // temporary data holder
      const body = [];
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => body.push(chunk));
      // we are done, resolve promise with those joined chunks
      response.on(  'end', () => {
        if (response.statusCode < 200 || response.statusCode > 299) {
            reject(new Error('Failed to load page, status code: ' + response.statusCode + '. Body so far was ' + body));
            return
        }
          resolve({body: body.join(''), headers: response.headers, status: response.statusCode} )
        }  );
    });
    // handle connection errors of the request
    request.on('error', (err) => reject({ error: err, body: body }))
    request.write(data)
    request.end()
    })

};

module.exports = {getContent, postContent}