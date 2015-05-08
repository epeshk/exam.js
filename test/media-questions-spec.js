var assert = require('assert'),
  exam = require('../src/exam.js');

describe('Media question tests', function() {
  describe('common media type question', function() {
    it('should return proper html for IMAGE question', function(){
      var result = exam.parse('ТЕСТЫ\r\rРИСУНОК\r\rq?\r+https://www.google.ru/images/srpr/logo11w.png\r\rКОНЕЦ ТЕСТОВ');
      console.log(result.html);
      assert.equal(result.html === '<div id="exam-js-0" class="exam-js-question"><div><br/>q?</div><div><img src="https://www.google.ru/images/srpr/logo11w.png" class="exam-js-img"/></div></div>', true);
    });
  });
})
