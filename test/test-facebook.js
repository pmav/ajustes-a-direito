var config = require('../config/config.js');
var fb = require('fb');

fb.setAccessToken(config.facebook.accessToken);

var body = 'A\n\nB\n&nbsp;\nC';

fb.api(config.facebook.pageId + '/feed', 'post', { message: body }, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  var tokens = res.id.split(/_/g);
  console.log('https://www.facebook.com/AjustesDireitos/posts/' + tokens[1]);
});
