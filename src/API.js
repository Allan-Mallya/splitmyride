//API interface
const API = access_token => {

  const baseApiUrl = 'http://localhost:8000';

  const defaultoptions = {
    headers: {
      'Content-Type' : 'application/json',
      Authorization: 'Bearer ' + access_token
    },
  };

  return {

    //get requests
    get({ endpoint, options = {} }){
      return fetch(
        baseApiUrl + '/' + endpoint,
        Object.assign({},defaultoptions,options),
        ).then(data=> data.json());
        },
    
      //post requests
      post({ endpoint,options = {}, body = '' }){
        return fetch(
          baseApiUrl + '/' + endpoint,
          Object.assign({ 
            method: 'POST',
            body: JSON.stringify(body) 
          },defaultoptions,options),
          ).then(data=> data.json());
        },
      };
    };

export default API;