import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class WatsonWorkService {

  private authenticated = false;

  private token: string;

  constructor(private http: Http) {
  }

  authenticateAsApp(client: string, secret: string, callback: any) {
    var auth = btoa(client + ':' + secret);

    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Authorization', 'Basic ' + auth);

    var body = 'grant_type=client_credentials';

    console.log(`Getting token using ${auth}`);

    this.http.post('https://api.watsonwork.ibm.com/oauth/token',
      body,
      { headers: headers }
    ).toPromise().then(res => {
      if(res.status !== 200) {
        callback({error : res.statusText});
      } else {
        // Save the fresh token
        var token = res.json().access_token;
        this.token = token;
        this.authenticated = true;
        callback(null, {});
      }
    });
  }

  isAuthenticated(): Boolean {
    return this.authenticated;
  }

  query(graphql: string, callback: any) {
    console.log(`${graphql}`);

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('jwt', this.token);

    this.http.post('https://api.watsonwork.ibm.com/graphql',
      JSON.stringify({query : graphql}),
      { headers: headers }
    ).toPromise().then(res => {
      if(res.status !== 200) {
        callback(res.json());
      } else {
        let debug = JSON.stringify(res.json());
        console.log(`response ${debug}`);

        callback(null, res.json());
      }
    });
  }
}
