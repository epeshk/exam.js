var assert = require('assert'),
    exam = require('../dist/exam.js');

describe('Media question tests', function() {
  describe('common media type question', function() {
      it('should parse IMAGE questions', function(){
        var result = exam.parse('ТЕСТЫ\r\rВИДЕО\r\rTest question?\r+a1\r+a2\r\rКОНЕЦ ТЕСТОВ');
        //assert.equal(result.html,'<form id="exam-js-0" class="exam-js-question"><div><br/>Test question?</div><div><div class="exam-js-question"><div><input id="exam-js-1" type="checkbox" name="exam-js-group-0" class="exam-js-input" data-answer="a1"/> 1 </div><div><video controls width="400" height="300" src="a1" preload="none" class="exam-js-video-answer"/></div></div><div class="exam-js-question"><div><input id="exam-js-2" type="checkbox" name="exam-js-group-0" class="exam-js-input" data-answer="a2"/> 2 </div><div><video controls width="400" height="300" src="a2" preload="none" class="exam-js-video-answer"/></div></div></div></form>', true);
      });
  });
})
