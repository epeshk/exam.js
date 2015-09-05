'use strict';
var assert = require('assert'),
    exam = require('../../dist/exam.js');

describe('Media question tests', function() {
  describe('common media type question', function() {
    it('should parse VDIEO questions', function(){
      var result = exam.parse('ТЕСТЫ\r\rВИДЕО\r\rTest question?\r+a1\r+a2\r\rКОНЕЦ ТЕСТОВ');
      assert.equal(result.html,'<form id="exam-js-0" class="exam-js-question"><div><br/>Test question?</div><div><div class="exam-js-media-question"><div><input id="exam-js-1" type="checkbox" name="exam-js-group-0" class="exam-js-input" data-answer="a1" data-answer-type="video"/> 1 </div><div><video controls width="400" height="300" src="a1" preload="none" class="exam-js-video-answer"/></div></div><div class="exam-js-media-question"><div><input id="exam-js-2" type="checkbox" name="exam-js-group-0" class="exam-js-input" data-answer="a2" data-answer-type="video"/> 2 </div><div><video controls width="400" height="300" src="a2" preload="none" class="exam-js-video-answer"/></div></div></div></form>', true);
    });

    it('should parse AUDIO questions', function(){
      var result = exam.parse('ТЕСТЫ\r\rАУДИО\r\rTest question?\r+a1\r+a2\r\rКОНЕЦ ТЕСТОВ');
      assert.equal(result.html,'<form id="exam-js-3" class="exam-js-question"><div><br/>Test question?</div><div><div class="exam-js-media-question"><div><input id="exam-js-4" type="checkbox" name="exam-js-group-1" class="exam-js-input" data-answer="a1" data-answer-type="audio"/> 1 </div><div><audio controls src="a1" preload="none"/></div></div><div class="exam-js-media-question"><div><input id="exam-js-5" type="checkbox" name="exam-js-group-1" class="exam-js-input" data-answer="a2" data-answer-type="audio"/> 2 </div><div><audio controls src="a2" preload="none"/></div></div></div></form>', true);
    });

    it('should parse IMG questions', function(){
      var result = exam.parse('ТЕСТЫ\r\rРИСУНОК\r\rTest question?\r+a1\r+a2\r\rКОНЕЦ ТЕСТОВ');
      assert.equal(result.html,'<form id="exam-js-6" class="exam-js-question"><div><br/>Test question?</div><div><div class="exam-js-img-question"><div><input id="exam-js-7" type="checkbox" name="exam-js-group-2" class="exam-js-input" data-answer="a1" data-answer-type="image"/> 1 </div><div><img src="a1" class="exam-js-img"/></div></div><div class="exam-js-img-question"><div><input id="exam-js-8" type="checkbox" name="exam-js-group-2" class="exam-js-input" data-answer="a2" data-answer-type="image"/> 2 </div><div><img src="a2" class="exam-js-img"/></div></div></div></form>', true);
    });
  });
});
